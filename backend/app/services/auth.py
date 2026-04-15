from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User
from app.models.menu import MenuAuthItem, Menu, menu_roles
from app.core.security import verify_password, create_access_token, create_refresh_token


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    """验证用户，支持用户名或邮箱登录"""
    if "@" in username:
        user = db.query(User).filter(User.email == username).first()
    else:
        user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def generate_tokens(user: User) -> dict:
    roles = [r.role_code for r in user.roles]
    payload = {"sub": str(user.id), "username": user.username, "roles": roles}
    return {
        "token": create_access_token(payload),
        "refreshToken": create_refresh_token(payload),
    }


def get_user_buttons(db: Session, user: User) -> list[str]:
    """从用户角色关联的菜单权限中聚合按钮标识"""
    role_ids = [r.id for r in user.roles]
    if not role_ids:
        return []
    stmt = (
        select(MenuAuthItem.auth_mark)
        .join(Menu, MenuAuthItem.menu_id == Menu.id)
        .join(menu_roles, Menu.id == menu_roles.c.menu_id)
        .where(menu_roles.c.role_id.in_(role_ids))
        .distinct()
    )
    result = db.execute(stmt).scalars().all()
    return list(result)
