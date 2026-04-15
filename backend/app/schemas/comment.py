from pydantic import BaseModel


class CommentOut(BaseModel):
    id: int
    author: str = ""
    content: str = ""
    timestamp: str = ""
    replies: list["CommentOut"] = []


class CommentCreate(BaseModel):
    articleId: int | None = None
    parentId: int | None = None
    author: str
    content: str
