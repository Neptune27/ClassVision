import uuid
from sqlalchemy import Column, ForeignKey, String, JSON, DateTime,Float
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from database import Base
from datetime import datetime


class FaceEmbedding(Base):
    __tablename__ = 'face_embeddings'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)  # ID duy nhất
    id_user = Column(String, unique=True , nullable=False)  # ID của user
    embedding = Column(Vector(512), nullable=True)  # Embedding, có thể cập nhật sau
    score_detect = Column(Float, nullable=True)  # Điểm confidence, có thể cập nhật sau
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False, onupdate=datetime.utcnow)


class PendingFace(Base):
    __tablename__ = 'pending_faces'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    embedding = Column(Vector(512))  # Lưu embedding dưới dạng JSON (mảng số)
    bbox = Column(JSON, nullable=False)  # Lưu bbox dưới dạng JSON [x, y, width, height]
    score_detect = Column(Float, nullable=False)  # Điểm confidence của phát hiện khuôn mặt
    status = Column(String, default="pending")  # Trạng thái: pending, confirmed, rejected
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False, onupdate=datetime.utcnow)