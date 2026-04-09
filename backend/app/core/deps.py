from typing import Generator
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import decode_access_token
import jwt


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """从 Authorization header 中解析用户（前端不带 Bearer 前缀）"""
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="未提供认证令牌")
    try:
        payload = decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="令牌已过期")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="无效令牌")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="无效令牌")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    return user


def require_roles(allowed_roles: list[str]):
    """角色检查依赖工厂"""
    def checker(current_user: User = Depends(get_current_user)):
        user_roles = [r.role_code for r in current_user.roles]
        if not any(role in allowed_roles for role in user_roles):
            raise HTTPException(status_code=403, detail="权限不足")
        return current_user
    return checker
