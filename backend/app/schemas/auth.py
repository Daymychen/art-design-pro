from pydantic import BaseModel


class LoginParams(BaseModel):
    userName: str
    password: str


class LoginResponse(BaseModel):
    token: str
    refreshToken: str


class UserInfoResponse(BaseModel):
    userId: int
    userName: str
    email: str
    avatar: str = ""
    roles: list[str] = []
    buttons: list[str] = []


class RefreshParams(BaseModel):
    refreshToken: str
