from pydantic import BaseModel


class AuthItem(BaseModel):
    title: str
    authMark: str


class MenuMeta(BaseModel):
    title: str = ""
    icon: str = ""
    roles: list[str] = []
    authList: list[AuthItem] = []
    keepAlive: bool = False
    isHide: bool = False
    isHideTab: bool = False
    activePath: str = ""
    isIframe: bool = False
    link: str = ""
    isFullPage: bool = False
    showTextBadge: str = ""
    fixedTab: bool = False


class MenuOut(BaseModel):
    path: str
    name: str
    component: str = ""
    meta: MenuMeta
    children: list["MenuOut"] = []
