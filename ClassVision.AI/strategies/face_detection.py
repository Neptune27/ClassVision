from abc import ABC, abstractmethod
from insightface.app import FaceAnalysis
import traceback

class FaceDetectionStrategy(ABC):
    @abstractmethod
    def detect(self, image):
        pass

class InsightFaceDetection(FaceDetectionStrategy):
    def __init__(self):
        self.folderModel = "insightface_models/"
        self.detector = FaceAnalysis(name='antelopev2',
                   root=self.folderModel,
                   providers=['CPUExecutionProvider'])
        self.detector.prepare(ctx_id=0, det_size=(640, 640), det_thresh=0.6)

    def detect(self, image):
        try:
            result = self.detector.get(image)
            return result
        except Exception as e:
            print("Lỗi phát hiện khuôn mặt:")
            traceback.print_exc()  # In toàn bộ thông tin lỗi ra console
            return []
