from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

# 多对多关联表
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    nick_name = Column(String(50), default="")
    avatar = Column(String(500), default="")
    gender = Column(SmallInteger, default=1)  # 0=女, 1=男
    mobile = Column(String(20), default="")
    email = Column(String(100), default="")
    department = Column(String(50), default="")
    status = Column(String(10), default="1")  # 1=在线,2=离线,3=异常,4=注销
    created_by = Column(String(50), default="")
    updated_by = Column(String(50), default="")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    roles = relationship("Role", secondary=user_roles, lazy="selectin")
