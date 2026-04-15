from pydantic import BaseModel


class SendVerifyCodeParams(BaseModel):
    email: str
    purpose: str  # "register" | "reset_password"


class RegisterParams(BaseModel):
    email: str
    code: str
    password: str


class ForgotPasswordParams(BaseModel):
    email: str
    code: str
    new_password: str
