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


class MenuCreate(BaseModel):
    parentId: int | None = None
    path: str
    name: str
    component: str = ""
    meta: MenuMeta = MenuMeta()
    sortOrder: int = 0


class MenuUpdate(BaseModel):
    path: str | None = None
    name: str | None = None
    component: str | None = None
    meta: MenuMeta | None = None
    sortOrder: int | None = None
    parentId: int | None = None


class AuthItemCreate(BaseModel):
    menuId: int
    title: str
    authMark: str


class AuthItemUpdate(BaseModel):
    title: str | None = None
    authMark: str | None = None
