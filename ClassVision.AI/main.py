from fastapi import FastAPI, File, UploadFile, Depends
import numpy as np
import cv2
import os
import traceback
import json
from services.face_recognition_context import FaceRecognitionContext
from strategies.face_detection import InsightFaceDetection
from strategies.preprocessing import OpenCVPreprocessing
from strategies.feature_extraction import InsightFaceFeatureExtraction
from strategies.face_annotation import InsightFaceAnnotation
from strategies.face_recognition import FaceRecognitionByCosine
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from models import FaceEmbedding, PendingFace
from datetime import datetime
import uuid

app = FastAPI()

preprocessing = OpenCVPreprocessing()
detection = InsightFaceDetection()
extraction = InsightFaceFeatureExtraction()
annotation = InsightFaceAnnotation()
recognition = FaceRecognitionByCosine()

face_recognition = FaceRecognitionContext(preprocessing, detection,extraction, annotation, recognition )
SAVE_DIR = "saved_images"
os.makedirs(SAVE_DIR, exist_ok=True)

models.Base.metadata.create_all(bind=engine)

# Kết nối database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/detect_faces/")
async def detect_faces(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        processed_image = face_recognition.detect_faces(image)
        filename = f"face.jpg"
        save_path = os.path.join(SAVE_DIR, filename)

        # Lưu ảnh đã xử lý
        cv2.imwrite(save_path, processed_image)

        return {"features": save_path}
    except Exception as e:
        traceback.print_exc()
        return {"error": "Failed to process image"}
    
@app.post("/get_features/")
async def test_info_face(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        data = face_recognition.get_features(image)
        

        return {"data":data}
    except Exception as e:
        traceback.print_exc()
        return {"error": "Failed to process image"}

@app.post("/get_info_faces/")
async def test_info_face(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        processed_image = face_recognition.get_info_face(image)
        

        return {"features"}
    except Exception as e:
        traceback.print_exc()
        return {"error": "Failed to process image"}

@app.post("/recognize_face/")
async def recognize_faces(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        processed_image = face_recognition.recognize_face_xlxs(image)
        return {"features"}
    except Exception as e:
        traceback.print_exc()
        return {"error": "Failed to process image"}

# API CHINH

@app.post("/face_recognize")
async def check_user(user_ids: list[str], image: UploadFile = File(...), db: Session = Depends(get_db)):
    """ Kiểm tra và thêm khuôn mặt vào database """
    try:
        user_ids = process_user_ids(user_ids)
        if any(db.query(FaceEmbedding).filter(FaceEmbedding.id_user == uid).first() for uid in user_ids):
            return recognize_existing_users(user_ids, image, db)

        return await register_new_users(user_ids, image, db)
    except Exception as e:
        print("Error in API Face Recognize:")
        traceback.print_exc()
        return {"error": str(e)}

def recognize_existing_users(user_ids,image,db):
    try:
        user_data = get_user_embeddings_by_ids(user_ids,db)
        return {"user_data": user_data}
    except Exception as e:
            print("Error in Recognize Existing Users")
            traceback.print_exc()
            return {"error": str(e)}

async def register_new_users(user_ids,image,db):
    # Save New Faces to Face_Embeddings
    save_new_users(user_ids,db)

    image_data = await image.read()
    results = process_image_and_save_faces(image_data, db)

    return {"user_list": user_ids, "faces": results,"status":"Pending Faces","message":"Register New Users"}

def get_user_embeddings_by_ids(list_id, db):
    """ Truy vấn database để lấy embeddings của các user có ID trong list_id """
    try:
        embeddings_data = (
            db.query(FaceEmbedding)
            .filter(FaceEmbedding.id_user.in_(list_id))
            .all()
        )

        # Chuyển đổi dữ liệu từ database thành danh sách
        result = [
            {
                "ID": user.id_user,
                "Embed": np.frombuffer(user.embedding, dtype=np.float32) if user.embedding else None
            }
            for user in embeddings_data
        ]

        return result

    except Exception as e:
        print("Error in Get User with Embedding in Database")
        traceback.print_exc()
        return {"error": str(e)}


def process_user_ids(user_ids: list[str]) -> list[str]:
    """ Chuẩn hóa danh sách user_ids """
    if len(user_ids) == 1 and "," in user_ids[0]:
        return [uid.strip() for uid in user_ids[0].split(",")]
    return user_ids


def save_new_users(user_ids: list[str], db: Session):
    """ Kiểm tra và thêm các user mới vào FaceEmbedding """
    try:
        new_faces = [
            FaceEmbedding(id_user=uid, embedding=None, score_detect=None)
            for uid in user_ids
            if not db.query(FaceEmbedding).filter(FaceEmbedding.id_user == uid).first()
        ]
        if new_faces:
            db.bulk_save_objects(new_faces)
            db.commit()
    except Exception as e:
        print("Error in Save New Users in Register New Users")
        traceback.print_exc()
        return {"error": str(e)}

def process_image_and_save_faces(image_data: bytes, db: Session):
    """ Xử lý ảnh và lưu thông tin khuôn mặt vào PendingFace """
    try:
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Nhận diện khuôn mặt
        json_result = face_recognition.get_features(image)
        face_data = json.loads(json_result)

        new_faces = []
        results = []
        
        for face in face_data:
            id_pending_face = str(uuid.uuid4())
            bbox = json.dumps(face["BBox"])
            score = face["Score"]
            embedding = np.array(face["Embed"], dtype=np.float32)

            new_faces.append(
                PendingFace(
                    id=id_pending_face,
                    embedding=embedding,
                    bbox=bbox,
                    score_detect=score,
                    status="pending",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
            )

            results.append({
                "id_pending_face": id_pending_face,
                "BBox": bbox,
                "Score": score,
                "Status": "pending"
            })

        # Lưu vào database nếu có dữ liệu
        if new_faces:
            db.bulk_save_objects(new_faces)
            db.commit()

        return results
    except Exception as e:
        print("Error in Process Image and Save Face In Register New Users")
        traceback.print_exc()
        return {"error": str(e)}



