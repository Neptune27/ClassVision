from pydantic import BaseModel
from typing import List, Dict
import uuid
from datetime import datetime

# Schema cơ bản cho FaceEmbedding
class FaceEmbeddingBase(BaseModel):
    user_id: str  # ID của người dùng đã xác nhận
    main_embedding: List[float]  # Vector embedding

class FaceEmbeddingCreate(FaceEmbeddingBase):
    pass  # Không cần trường bổ sung

class FaceEmbeddingResponse(FaceEmbeddingBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Schema cơ bản cho PendingFace
class PendingFaceBase(BaseModel):
    temp_user_id: str  # ID tạm thời
    embedding: List[float]  # Vector embedding của khuôn mặt chưa xác nhận
    bbox: Dict[str, float]  # Tọa độ bbox dưới dạng {x, y, width, height}
    status: str  # pending | confirmed

class PendingFaceCreate(PendingFaceBase):
    pass  # Không cần trường bổ sung

class PendingFaceResponse(PendingFaceBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True