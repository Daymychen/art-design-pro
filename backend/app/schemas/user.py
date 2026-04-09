from pydantic import BaseModel


class UserListItem(BaseModel):
    id: int
    avatar: str = ""
    status: str = "1"
    userName: str
    userGender: str = ""
    nickName: str = ""
    userPhone: str = ""
    userEmail: str = ""
    userRoles: list[str] = []
    createBy: str = ""
    createTime: str = ""
    updateBy: str = ""
    updateTime: str = ""


class UserCreate(BaseModel):
    userName: str
    nickName: str = ""
    gender: str = "男"
    mobile: str = ""
    email: str = ""
    department: str = ""
    password: str = "123456"
    userRoles: list[str] = []


class UserUpdate(BaseModel):
    nickName: str | None = None
    gender: str | None = None
    mobile: str | None = None
    email: str | None = None
    department: str | None = None
    userRoles: list[str] | None = None
    status: str | None = None
