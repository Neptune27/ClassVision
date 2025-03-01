import numpy as np
import pandas as pd
import traceback
from sklearn.metrics.pairwise import cosine_similarity
import faiss
from abc import ABC, abstractmethod

class RecognitionStrategy(ABC):
    @abstractmethod
    def recognize(self, feature, dataframe):
        pass

# class FaceRecognitionByCosine(RecognitionStrategy):
#     def __init__(self,   threshold=0.6):
        
#         self.threshold = threshold

#     def recognize(self, feature, id_list, embed_list):
#         try:
#             embedding = feature[2]

#             # Tính toán độ tương đồng cosine
#             similar = cosine_similarity(embed_list, embedding.reshape(1, -1))
#             similar_arr = similar.flatten()  # Chuyển về mảng 1D
#             print("Điểm tương đồng cosine:", similar_arr)
#             # Lọc những giá trị trên ngưỡng
#             valid_indices = np.where(similar_arr >= self.threshold)[0]
#             valid_ids = [id_list[i] for i in valid_indices]
#             print("Các ID vượt ngưỡng:", valid_ids)

#             if len(valid_indices) > 0:
#                 best_match_idx = valid_indices[np.argmax(similar_arr[valid_indices])]
#                 best_match_id = id_list[best_match_idx]
            
#                 print("ID phù hợp nhất:", best_match_id)
#                 return id_list[best_match_idx]  # Trả về ID thay vì index

#             return None  # Không tìm thấy ai

#         except Exception as e:
#             print("Lỗi trong recognize:")
#             traceback.print_exc()
#             return None  # Trả về None nếu có lỗi
        

#FAISS - 
class FaceRecognitionByCosine(RecognitionStrategy):
    def __init__(self,   top_k=1):
        self.top_k = top_k

    def recognize(self, feature, id_list, embed_list):
        try:
            embedding = np.array(feature[2], dtype=np.float32).reshape(1, -1)  # Đảm bảo feature là numpy array

            print("\n--- Nhận diện khuôn mặt bằng Approximate Nearest Neighbors (ANN) ---")
            # print("Embedding đầu vào:", embedding)

            # Chuyển embed_list thành dạng numpy float32
            embed_list = np.array(embed_list, dtype=np.float32)

            # Tạo FAISS Index (L2 - Euclidean distance)
            index = faiss.IndexFlatL2(embed_list.shape[1])  # Sử dụng khoảng cách Euclidean
            index.add(embed_list)  # Thêm tất cả embeddings vào index

            # Tìm kiếm top-k kết quả gần nhất
            distances, indices = index.search(embedding, self.top_k)

            print("Khoảng cách ANN:", distances)
            print("Chỉ mục ANN:", indices)

            # Lấy ID tương ứng với index
            best_match_ids = [id_list[idx] for idx in indices[0] if idx < len(id_list)]

            print("ID phù hợp nhất:", best_match_ids)
            return best_match_ids if best_match_ids else None

        except Exception as e:
            print("Lỗi trong recognize:")
            traceback.print_exc()
            return None