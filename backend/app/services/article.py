from sqlalchemy.orm import Session
from sqlalchemy import extract
from app.models.article import Article


def get_article_list(db: Session, current: int = 1, size: int = 10, **filters) -> dict:
    current = max(1, current)
    size = max(1, min(size, 100))
    query = db.query(Article)
    if filters.get("keyword"):
        query = query.filter(Article.title.like(f"%{filters['keyword']}%"))
    if filters.get("year"):
        query = query.filter(extract("year", Article.created_at) == int(filters["year"]))
    if filters.get("typeName"):
        query = query.filter(Article.type_name == filters["typeName"])

    total = query.count()
    articles = (
        query.order_by(Article.created_at.desc())
        .offset((current - 1) * size)
        .limit(size)
        .all()
    )

    records = []
    for a in articles:
        records.append({
            "id": a.id,
            "title": a.title,
            "brief": a.brief,
            "home_img": a.home_img,
            "type_name": a.type_name,
            "blog_class": a.blog_class,
            "count": a.view_count,
            "create_time": a.created_at.isoformat() if a.created_at else "",
        })
    return {"records": records, "current": current, "size": size, "total": total}


def get_article_detail(db: Session, article_id: int) -> dict | None:
    a = db.query(Article).filter(Article.id == article_id).first()
    if not a:
        return None
    # 增加浏览量
    a.view_count += 1
    db.commit()
    return {
        "id": a.id,
        "title": a.title,
        "brief": a.brief,
        "html_content": a.html_content,
        "home_img": a.home_img,
        "type_name": a.type_name,
        "blog_class": a.blog_class,
        "count": a.view_count,
        "create_time": a.created_at.isoformat() if a.created_at else "",
    }


def create_article(db: Session, data: dict, author_id: int) -> Article:
    article = Article(
        title=data["title"],
        brief=data.get("brief", ""),
        html_content=data.get("htmlContent", ""),
        home_img=data.get("homeImg", ""),
        type_name=data.get("typeName", ""),
        blog_class=data.get("blogClass", ""),
        author_id=author_id,
    )
    db.add(article)
    db.commit()
    return article


def update_article(db: Session, article_id: int, data: dict) -> bool:
    a = db.query(Article).filter(Article.id == article_id).first()
    if not a:
        return False
    field_map = {
        "title": "title",
        "brief": "brief",
        "htmlContent": "html_content",
        "homeImg": "home_img",
        "typeName": "type_name",
        "blogClass": "blog_class",
    }
    for key, val in data.items():
        if val is not None and key in field_map:
            setattr(a, field_map[key], val)
    db.commit()
    return True


def delete_article(db: Session, article_id: int) -> bool:
    a = db.query(Article).filter(Article.id == article_id).first()
    if not a:
        return False
    db.delete(a)
    db.commit()
    return True
