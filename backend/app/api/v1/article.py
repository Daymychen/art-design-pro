from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticleUpdate
from app.schemas.common import ok, fail
from app.services.article import (
    get_article_list, get_article_detail, create_article, update_article, delete_article,
)

router = APIRouter()


@router.get("/api/article/list")
def list_articles(
    current: int = Query(1),
    size: int = Query(10),
    keyword: str = Query(None),
    year: str = Query(None),
    typeName: str = Query(None),
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_article_list(db, current, size, keyword=keyword, year=year, typeName=typeName)
    return ok(data)


@router.get("/api/article/{article_id}")
def detail(article_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = get_article_detail(db, article_id)
    if not data:
        return fail("文章不存在")
    return ok(data)


@router.post("/api/article")
def create(body: ArticleCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    create_article(db, body.model_dump(), current_user.id)
    return ok(None, "发布成功")


@router.put("/api/article/{article_id}")
def update(article_id: int, body: ArticleUpdate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not update_article(db, article_id, body.model_dump(exclude_none=True)):
        return fail("文章不存在")
    return ok(None, "更新成功")


@router.delete("/api/article/{article_id}")
def delete(article_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not delete_article(db, article_id):
        return fail("文章不存在")
    return ok(None, "删除成功")
