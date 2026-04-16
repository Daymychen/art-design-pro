from pydantic import BaseModel


class ChangelogOut(BaseModel):
    version: str
    title: str = ""
    date: str = ""
    detail: list[str] | None = None
    requireReLogin: bool = False
    remark: str = ""
