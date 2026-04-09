from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.auth import LoginParams, UserInfoResponse, RefreshParams
from app.schemas.common import ok, fail
from app.services.auth import authenticate_user, generate_tokens, get_user_buttons
from app.core.security import decode_refresh_token
import jwt

router = APIRouter()


@router.post("/api/auth/login")
def login(params: LoginParams, db: Session = Depends(get_db)):
    user = authenticate_user(db, params.userName, params.password)
    if not user:
        return fail("用户名或密码错误")
    tokens = generate_tokens(user)
    return ok(tokens)


@router.post("/api/auth/refresh")
def refresh_token(params: RefreshParams, db: Session = Depends(get_db)):
    try:
        payload = decode_refresh_token(params.refreshToken)
    except jwt.InvalidTokenError:
        return fail("无效的刷新令牌", 401)
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        return fail("用户不存在", 401)
    tokens = generate_tokens(user)
    return ok(tokens)


@router.post("/api/auth/logout")
def logout():
    return ok(None, "已登出")


@router.get("/api/user/info")
def get_user_info(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roles = [r.role_code for r in current_user.roles]
    buttons = get_user_buttons(db, current_user)
    return ok(UserInfoResponse(
        userId=current_user.id,
        userName=current_user.username,
        email=current_user.email,
        avatar=current_user.avatar,
        roles=roles,
        buttons=buttons,
    ).model_dump())
