from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(50), nullable=False)
    role_code = Column(String(50), unique=True, nullable=False)
    description = Column(String(200), default="")
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
