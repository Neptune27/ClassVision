import cv2
import pandas as pd
import numpy as np
import traceback
from openpyxl import load_workbook
import json
from collections import Counter

class FaceRecognitionContext:
    def __init__(self, preprocessing, detection,extraction,annotation,recognition):
        self.preprocessing = preprocessing
        self.detection = detection
        self.extraction = extraction
        self.annotation = annotation
        self.recognition = recognition
        self.data_file = "face_features.xlsx"

    def detect_faces(self, image):
        try:
            # processed_image = self.preprocessing.process(image)
            processed_image = image
            faces = self.detection.detect(processed_image)
            
            features = self.extraction.extract(faces)
            for feature in features:
                try:
                    bbox = feature[0]
                    score = feature[1]
                    embed = feature[2]
                    pose = feature[3]
                    kps = feature[4]

                    processed_image = self.annotation.process(processed_image, bbox, score, pose, kps, True, True, False, False)
                except Exception as e:
                    print("Error processing feature:", e)
                    traceback.print_exc()
                    return []
                
            # processed_image = cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB)
            
        except Exception as e:
            print("Error at Detect faces in FaceRecognitionContext")
            traceback.print_exc()
        return processed_image
    
    # RECOGNIZE FACE

    def get_features(self, image):
        try:
            processed_image = image
            faces = self.detection.detect(processed_image)
            features = self.extraction.extract(faces)

            face_data = []
            for i, feature in enumerate(features, start=1):
                try:
                    bbox = tuple(map(int, feature[0]))  # Chuyển numpy.int thành int
                    score = float(feature[1])  # Chuyển numpy.float thành float
                    embed = feature[2].tolist() 
                    pose = tuple(map(float, feature[3]))  # Chuyển numpy.float thành float
                    kps = [{"x": float(kp[0]), "y": float(kp[1])} for kp in feature[4]]  # Chuyển keypoints

                    # Tạo JSON object
                    face_json = {
                        "ID": i,
                        "BBox": {"x": bbox[0], "y": bbox[1], "w": bbox[2], "h": bbox[3]},
                        "Score": score,
                        "Embed": embed,
                        "Pose": {"yaw": pose[0], "pitch": pose[1], "roll": pose[2]},
                        "Keypoints": kps  # Thêm keypoints vào JSON
                    }
                    face_data.append(face_json)

                except Exception as e:
                    # logging.error(f"Error processing feature {i}: {e}")
                    traceback.print_exc()
                    continue  # Bỏ qua lỗi nhưng vẫn tiếp tục xử lý các khuôn mặt khác

            # Chuyển danh sách thành JSON
            return json.dumps(face_data, indent=4)

        except Exception as e:
            # logging.error("Error at Detect faces in FaceRecognitionContext")
            traceback.print_exc()
            return json.dumps([])



    def get_info_face(self, image):
        try:
            processed_image = image
            faces = self.detection.detect(processed_image)
            features = self.extraction.extract(faces)

            data = []
            for i, feature in enumerate(features, start=1):
                try:
                    bbox = feature[0]  # (x, y, w, h)
                    score = feature[1]  # float
                    embed = feature[2]  # (512,) vector hoặc list
                    pose = feature[3]  # (yaw, pitch, roll)
                    kps = feature[4]  # [(x1, y1), (x2, y2), ...]

                    # Chuyển bbox và pose thành list để dễ lưu vào Excel
                    bbox_list = list(bbox) if isinstance(bbox, (tuple, list, np.ndarray)) else [bbox]
                    embed_str = ",".join(map(str, embed))  # Chuyển embed thành chuỗi
                    pose_list = list(pose) if isinstance(pose, (tuple, list, np.ndarray)) else [pose]
                    kps_list = [coord for point in kps for coord in point]  # Flatten keypoints

                    # Tạo một dòng dữ liệu: [ID, bbox, score, embed, pose, kps]
                    row = [i] + bbox_list + [score] + [embed_str] + pose_list + kps_list
                    data.append(row)

                except Exception as e:
                    print("Error processing feature:", e)
                    traceback.print_exc()
                    continue  # Bỏ qua lỗi nhưng vẫn tiếp tục vòng lặp

            # Tạo tên cột
            bbox_cols = ["BBox_x", "BBox_y", "BBox_w", "BBox_h"]
            
            pose_cols = ["Pose_yaw", "Pose_pitch", "Pose_roll"]
            kps_cols = [f"Kps_{j}" for j in range(len(kps) * 2)]  # x, y từng điểm

            column_names = ["ID"] + bbox_cols + ["Score", "Embed"] + pose_cols + kps_cols
            df = pd.DataFrame(data, columns=column_names)

            # Ghi vào file Excel (nếu tồn tại thì ghi tiếp)
            try:
                with pd.ExcelWriter(self.data_file, engine="openpyxl", mode="a", if_sheet_exists="overlay") as writer:
                    df.to_excel(writer, index=False, header=writer.book.active.max_row == 1)
            except FileNotFoundError:
                df.to_excel(self.data_file, index=False, engine="openpyxl")

            print(f"Saved {len(data)} face features to {self.data_file}")

            processed_image = cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB)

        except Exception as e:
            print("Error at Detect faces in FaceRecognitionContext")
            traceback.print_exc()

        return processed_image

    def load_embeddings_from_excel(self):
        try:
            # Đọc dữ liệu từ file Excel
            df = pd.read_excel(self.data_file, engine="openpyxl")

            embeddings_data = []
            for _, row in df.iterrows():
                try:
                    face_data = {
                        "ID": int(row["ID"]),
                        "BBox": (row["BBox_x"], row["BBox_y"], row["BBox_w"], row["BBox_h"]),
                        "Score": float(row["Score"]),
                        "Embed": np.array([float(x) for x in row["Embed"].split(",")]),  # Chuyển Embed từ chuỗi thành numpy array
                        "Pose": (row["Pose_yaw"], row["Pose_pitch"], row["Pose_roll"]),
                        "Kps": [(row[f"Kps_{i}"], row[f"Kps_{i+1}"]) for i in range(0, 10, 2)]  # Lấy 5 điểm keypoints
                    }
                    embeddings_data.append(face_data)
                except Exception as e:
                    print(f"Error processing row ID {row['ID']}: {e}")
                    continue  
            print(f"Loaded {len(embeddings_data)} face embeddings from {self.data_file}")
            return embeddings_data

        except FileNotFoundError:
            print(f"File {self.data_file} not found!")
            return []
        except Exception as e:
            print(f"Error loading embeddings: {e}")
            return []
        
    def recognize_face_xlxs(self,image):
        try:
            embeddings_data = self.load_embeddings_from_excel()
            if not embeddings_data:
                print("Không có dữ liệu embeddings để so sánh.")
                return None
            id_list = [entry["ID"] for entry in embeddings_data]
            embed_list = np.array([entry["Embed"] for entry in embeddings_data])
            print(id_list)
            processed_image = image
            detected_faces = self.detection.detect(image)
            
            extracted_features = self.extraction.extract(detected_faces)
            recognized_ids = []
            for feature in extracted_features:
                matched_id = self.recognition.recognize(feature, id_list, embed_list)
                recognized_ids.append(matched_id)
            print("Danh sách ID nhận diện:", recognized_ids)
            
            
        except Exception as e:
            print("Error at Detect faces in FaceRecognitionContext")
            traceback.print_exc()
            
        return processed_image
    

    def recognize_face_list_user(self, image, user_embeddings, list_user_ids_register):
        try:
            if not user_embeddings:
                print("Không có dữ liệu embeddings để so sánh.")
                return [], []

            result_faces = []
            removed_faces = []
            faces = []  # Chứa đầy đủ thông tin, bao gồm cả embedding

            # Tách ID và embedding từ dữ liệu
            id_list = [entry["ID"] for entry in user_embeddings]
            embed_list = np.array(
                [entry["Embed"] for entry in user_embeddings if entry["Embed"] is not None],
                dtype=np.float32
            )
            
            processed_image = self.preprocessing.process(image)
            detected_faces = self.detection.detect(processed_image)
            extracted_features = self.extraction.extract(detected_faces)

            for feature in extracted_features:
                bbox = tuple(map(int, feature[0]))  # (x, y, w, h)
                score_detect = float(feature[1])  # Độ tin cậy của nhận diện
                embed = feature[2]  # Vector đặc trưng của khuôn mặt

                matched_results = self.recognition.recognize(embed, id_list, embed_list)
                if matched_results:
                    best_match_id = matched_results[0]["ID"]
                    best_match_distance = matched_results[0]["Distance"]
                else:
                    best_match_id, best_match_distance = None, None

                face_data = {
                    "id_pending_face": None,
                    "id_user": best_match_id,
                    "BBox": {"x": bbox[0], "y": bbox[1], "w": bbox[2], "h": bbox[3]},
                    "Score_detect": score_detect,
                    "Score_recognition": best_match_distance,
                    "status": "recognized",
                    "embedding": embed  # Giữ trong danh sách nội bộ
                }
                faces.append(face_data)

            # Lọc ra ID có khoảng cách nhỏ nhất
            id_min_score = {}
            for face in faces:
                user_id = face["id_user"]
                if user_id:
                    if user_id not in id_min_score or face["Score_recognition"] < id_min_score[user_id]["Score_recognition"]:
                        id_min_score[user_id] = face

            for face in faces:
                user_id = face["id_user"]
                if user_id and id_min_score.get(user_id) is not face:
                    removed_faces.append({
                        "BBox": face["BBox"],
                        "Score_detect": face["Score_detect"],
                        "embedding": face["embedding"]  # Vẫn lưu embedding vào danh sách bị loại
                    })
                    face["id_user"] = None
                    face["status"] = "pending"

            # Tạo result_faces mà KHÔNG có embedding
            result_faces = [
                {key: face[key] for key in face if key != "embedding"} for face in faces
            ]
            result_faces = [face for face in result_faces if face["id_user"] is not None]

            return result_faces, removed_faces
        except Exception as e:
            print("Error at Detect faces in FaceRecognitionContext")
            traceback.print_exc()
            return [], []
