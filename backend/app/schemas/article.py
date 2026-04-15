from pydantic import BaseModel


class ArticleListItem(BaseModel):
    id: int
    title: str
    brief: str = ""
    home_img: str = ""
    type_name: str = ""
    blog_class: str = ""
    count: int = 0
    create_time: str = ""


class ArticleDetail(BaseModel):
    id: int
    title: str
    brief: str = ""
    html_content: str = ""
    home_img: str = ""
    type_name: str = ""
    blog_class: str = ""
    count: int = 0
    create_time: str = ""


class ArticleCreate(BaseModel):
    title: str
    brief: str = ""
    htmlContent: str = ""
    homeImg: str = ""
    typeName: str = ""
    blogClass: str = ""


class ArticleUpdate(BaseModel):
    title: str | None = None
    brief: str | None = None
    htmlContent: str | None = None
    homeImg: str | None = None
    typeName: str | None = None
    blogClass: str | None = None
