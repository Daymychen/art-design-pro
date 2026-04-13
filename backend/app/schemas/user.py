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
    userGender: str = "男"
    userPhone: str = ""
    userEmail: str = ""
    department: str = ""
    password: str = "123456"
    roles: list[str] = []


class UserUpdate(BaseModel):
    nickName: str | None = None
    userGender: str | None = None
    userPhone: str | None = None
    userEmail: str | None = None
    department: str | None = None
    roles: list[str] | None = None
    status: str | None = None
