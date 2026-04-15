from sqlalchemy.orm import Session
from app.models.comment import Comment


def get_comment_tree(db: Session, article_id: int) -> list[dict]:
    """获取文章的嵌套评论树"""
    comments = db.query(Comment).filter(Comment.article_id == article_id).all()

    comment_map = {}
    for c in comments:
        comment_map[c.id] = {
            "id": c.id,
            "author": c.author,
            "content": c.content,
            "timestamp": c.created_at.strftime("%Y-%m-%d %H:%M") if c.created_at else "",
            "replies": [],
        }

    roots = []
    for c in comments:
        node = comment_map[c.id]
        if c.parent_id and c.parent_id in comment_map:
            comment_map[c.parent_id]["replies"].append(node)
        else:
            roots.append(node)
    return roots


def get_wall_comments(db: Session) -> list[dict]:
    """获取留言墙评论（无 article_id）"""
    comments = (
        db.query(Comment)
        .filter(Comment.article_id.is_(None))
        .order_by(Comment.id)
        .all()
    )
    data = []
    for c in comments:
        data.append({
            "id": c.id,
            "date": c.created_at.strftime("%Y-%-m-%-d") if c.created_at else "",
            "content": c.content,
            "collection": (c.id * 3) % 13,
            "comment": (c.id * 7) % 11,
            "userName": c.author,
        })
    return data


def create_comment(db: Session, data: dict) -> Comment:
    comment = Comment(
        article_id=data.get("articleId"),
        parent_id=data.get("parentId"),
        author=data["author"],
        content=data["content"],
    )
    db.add(comment)
    db.commit()
    return comment


def delete_comment(db: Session, comment_id: int) -> bool:
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        return False
    _delete_recursive(db, comment_id)
    db.delete(comment)
    db.commit()
    return True


def _delete_recursive(db: Session, parent_id: int):
    children = db.query(Comment).filter(Comment.parent_id == parent_id).all()
    for child in children:
        _delete_recursive(db, child.id)
        db.delete(child)
