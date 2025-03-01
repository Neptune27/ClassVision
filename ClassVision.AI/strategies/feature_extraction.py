
from abc import ABC, abstractmethod
import traceback

class FeatureExtractionStrategy(ABC):
    @abstractmethod
    def extract(self, result):
        pass

class InsightFaceFeatureExtraction(FeatureExtractionStrategy):
    def extract(self, result):
        features = []
        try:
            for rt in result:
                bbox = rt['bbox'].astype(int) 
                score = int(rt['det_score'] * 100)  
                embed = rt['embedding']  
                keypoints = rt['kps']
                pose = rt["pose"]
                features.append((bbox, score, embed,pose,keypoints))

        except Exception as e:
            print("Lỗi extract features:")
            traceback.print_exc()  # In toàn bộ thông tin lỗi ra console
            return []
        return features

