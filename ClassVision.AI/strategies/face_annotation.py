from abc import ABC, abstractmethod
from insightface.app import FaceAnalysis
import traceback
import cv2
import pandas as pd
import numpy as np

class FaceAnnotationStrategy(ABC):
    @abstractmethod
    def process(self):
        pass

class InsightFaceAnnotation(FaceAnnotationStrategy):
    def process(self,image, bbox=None,score = None,pose=None, kps=None, draw_bbox=True, draw_score=True, draw_pose = True, draw_kps=True):
        try:
            if draw_bbox and bbox is not None:
                image = self.bboxAnnotation(image, bbox)

            if draw_score and score is not None and bbox is not None:
                image = self.scoreAnnotation(image,bbox,score)

            if draw_pose and bbox is not None and pose is not None:
                image = self.check_pose_and_annotate(image,bbox,pose)

            if draw_kps and kps is not None:
                image = self.kpsAnnotation(image, kps)

            return image
        except Exception as e:
            print("Error in InsightFaceAnnotation.process()")
            traceback.print_exc()
            return None
    
    def bboxAnnotation(self, image, bbox):
        try: 
            x1, y1, x2, y2 = bbox.astype(int)  # Đảm bảo bbox là int
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)

            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        except Exception as e:
            print("Error FaceAnnotation: process BBox")
            traceback.print_exc()  # In toàn bộ thông tin lỗi ra console
            return []
        return image
    
    def scoreAnnotation(self, image, bbox, score):
        try:   
            x1, y1, x2, y2 = bbox.astype(int)  # Đảm bảo bbox là số nguyên

            # Tính vị trí để ghi điểm số (phía trên bbox một chút)
            text_x, text_y = x1, y1 + 10  
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.5
            font_color = (0, 255, 255)  # Màu vàng
            thickness = 1

            # Ghi điểm số lên ảnh
            cv2.putText(image, f"{int(score):02d}", (text_x, text_y), font, font_scale, font_color, thickness)

        except Exception as e:
            print("Error FaceAnnotation: Process Score")
            traceback.print_exc()
        
        return image


    def kpsAnnotation(self, image, kps):
        try: 
           for keypoints in kps:  # Duyệt qua danh sách key points của các khuôn mặt
                x, y = keypoints
                cv2.circle(image, (int(x), int(y)), 2, (0, 255, 0), -1)
                print(type(keypoints), keypoints)  # Kiểm tra kiểu dữ liệu

        except Exception as e:
            print("Error FaceAnnotation: Process KPS")
            traceback.print_exc()  # In toàn bộ thông tin lỗi ra console
            return []
        return image

    def poseAnnotation(self, image, bbox, pose):
        try:   
            x1, y1, x2, y2 = bbox.astype(int)  # Đảm bảo bbox là số nguyên
            yaw, pitch, roll = pose  # Tách giá trị pose
            
            # Tính vị trí để ghi text (trên bbox một chút)
            text_x, text_y = x1, y1 - 10  
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.5
            font_color = (0, 255, 0)  # Màu xanh lá cây
            thickness = 1

            # Ghi giá trị lên ảnh
            cv2.putText(image, f"Y:{yaw:.2f}", (text_x, text_y), font, font_scale, font_color, thickness)
            cv2.putText(image, f"P:{pitch:.2f}", (text_x, text_y - 15), font, font_scale, font_color, thickness)
            cv2.putText(image, f"R:{roll:.2f}", (text_x, text_y - 30), font, font_scale, font_color, thickness)

        except Exception as e:
            print("Error FaceAnnotation: Process Pose")
            traceback.print_exc()
        
        return image

    def check_pose_and_annotate(self,image, bbox, pose):
        try:
            yaw, pitch, roll = pose
            x1, y1, x2, y2 = bbox.astype(int)

            # Điều kiện lý tưởng để nhận diện khuôn mặt
            yaw_ok = abs(yaw) <= 15
            pitch_ok = abs(pitch) <= 10
            roll_ok = abs(roll) <= 10

            # Nếu thỏa mãn tất cả điều kiện, dùng màu xanh, ngược lại dùng màu đỏ
            if yaw_ok and pitch_ok and roll_ok:
                color = (255, 0, 0)  # Xanh nuoc
                status = "Good Pose"
            else:
                color = (0, 0, 255)  # Đỏ
                status = "Bad Pose"

            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.5
            thickness = 2

            # Vẽ chữ tại góc bbox
            text_x, text_y = x1, y1 - 10
            cv2.putText(image, status, (text_x, text_y), font, font_scale, color, thickness)

        except Exception as e:
            print("Error in check_pose_and_annotate")
            traceback.print_exc()

        return image