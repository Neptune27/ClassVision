import uvicorn
from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
import os
import traceback
from services.face_recognition_context import FaceRecognitionContext
from strategies.face_detection import InsightFaceDetection
from strategies.preprocessing import OpenCVPreprocessing
from strategies.feature_extraction import InsightFaceFeatureExtraction
from strategies.face_annotation import InsightFaceAnnotation
from strategies.face_recognition import FaceRecognitionByCosine

app = FastAPI()

preprocessing = OpenCVPreprocessing()
detection = InsightFaceDetection()
extraction = InsightFaceFeatureExtraction()
annotation = InsightFaceAnnotation()
recognition = FaceRecognitionByCosine()

face_recognition = FaceRecognitionContext(preprocessing, detection,extraction, annotation, recognition )
SAVE_DIR = "saved_images"
os.makedirs(SAVE_DIR, exist_ok=True)
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
        
        processed_image = face_recognition.recognize_face(image)
        

        return {"features"}
    except Exception as e:
        traceback.print_exc()
        return {"error": "Failed to process image"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)