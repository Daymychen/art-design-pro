from sqlalchemy import Column, Integer, String, JSON
from app.db.session import Base


class Changelog(Base):
    __tablename__ = "changelogs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    version = Column(String(20), nullable=False)
    title = Column(String(200), default="")
    date = Column(String(20), default="")
    detail = Column(JSON, nullable=True)
    require_re_login = Column(String(5), default="false")
    remark = Column(String(500), default="")
