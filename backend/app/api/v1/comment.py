from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.comment import Comment as CommentModel
from app.schemas.comment import CommentCreate
from app.schemas.common import ok, fail
from app.services.comment import get_comment_tree, get_wall_comments, create_comment, delete_comment

router = APIRouter()


@router.get("/api/comment/list")
def list_comments(
    articleId: int = Query(...),
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tree = get_comment_tree(db, articleId)
    return ok(tree)


@router.get("/api/comment/wall")
def wall_comments(db: Session = Depends(get_db)):
    """留言墙 - 不需要认证"""
    data = get_wall_comments(db)
    return ok(data)


@router.post("/api/comment")
def create(body: CommentCreate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    create_comment(db, body.model_dump())
    return ok(None, "评论发布成功")


@router.put("/api/comment/{comment_id}")
def update(comment_id: int, body: dict, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    c = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not c:
        return fail("评论不存在")
    c.content = body.get("content", c.content)
    db.commit()
    return ok(None, "更新成功")


@router.delete("/api/comment/{comment_id}")
def delete(comment_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not delete_comment(db, comment_id):
        return fail("评论不存在")
    return ok(None, "删除成功")
