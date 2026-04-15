from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.schemas.common import ok
from app.services.changelog import get_changelog_list

router = APIRouter()


@router.get("/api/changelog/list")
def list_changelogs(db: Session = Depends(get_db)):
    """更新日志不需要认证"""
    data = get_changelog_list(db)
    return ok(data)
