import cv2
import numpy as np
from io import BytesIO
from PIL import Image
from PIL import Image, ImageEnhance
from abc import ABC, abstractmethod

class PreprocessingStrategy(ABC):
    @abstractmethod
    def process(self, image):
        pass

class OpenCVPreprocessing(PreprocessingStrategy):
    def process(self, image):
        print("Preprocess image")
        if image is None:
            print("Lỗi: Ảnh tải về không hợp lệ.")
            return []

        image = cv2.resize(image, (640, 480))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    
        # Enhance sharpness
        sharpness_factor = 2.0
        enhancer = ImageEnhance.Sharpness(pil_img)
        image_sharpened = enhancer.enhance(sharpness_factor)

        # Enhance brightness
        brightness_factor = 1.5
        enhancer = ImageEnhance.Brightness(image_sharpened)
        image_brightened = enhancer.enhance(brightness_factor)

        # Chuyển đổi từ PIL Image trở lại OpenCV (NumPy array)
        image= cv2.cvtColor(np.array(image_brightened), cv2.COLOR_RGB2BGR)
        return image