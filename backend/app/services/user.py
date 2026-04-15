from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.core.security import hash_password


def get_user_list(db: Session, current: int = 1, size: int = 10, **filters) -> dict:
    current = max(1, current)
    size = max(1, min(size, 100))
    query = db.query(User)

    if filters.get("userName"):
        query = query.filter(User.username.like(f"%{filters['userName']}%"))
    if filters.get("userGender"):
        gender_val = 1 if filters["userGender"] == "男" else 0
        query = query.filter(User.gender == gender_val)
    if filters.get("userPhone"):
        query = query.filter(User.mobile.like(f"%{filters['userPhone']}%"))
    if filters.get("userEmail"):
        query = query.filter(User.email.like(f"%{filters['userEmail']}%"))
    if filters.get("status"):
        query = query.filter(User.status == filters["status"])

    total = query.count()
    users = query.order_by(User.id.desc()).offset((current - 1) * size).limit(size).all()

    records = []
    for u in users:
        records.append({
            "id": u.id,
            "avatar": u.avatar,
            "status": u.status,
            "userName": u.username,
            "userGender": "男" if u.gender == 1 else "女",
            "nickName": u.nick_name,
            "userPhone": u.mobile,
            "userEmail": u.email,
            "userRoles": [r.role_code for r in u.roles],
            "createBy": u.created_by,
            "createTime": u.created_at.strftime("%Y-%m-%d %H:%M:%S") if u.created_at else "",
            "updateBy": u.updated_by,
            "updateTime": u.updated_at.strftime("%Y-%m-%d %H:%M:%S") if u.updated_at else "",
        })

    return {"records": records, "current": current, "size": size, "total": total}


def create_user(db: Session, data: dict) -> User:
    gender_val = 1 if data.get("userGender", "男") == "男" else 0
    user = User(
        username=data["userName"],
        password_hash=hash_password(data.get("password", "123456")),
        nick_name=data.get("nickName", ""),
        gender=gender_val,
        mobile=data.get("userPhone", ""),
        email=data.get("userEmail", ""),
        department=data.get("department", ""),
    )
    if data.get("roles"):
        roles = db.query(Role).filter(Role.role_code.in_(data["roles"])).all()
        user.roles = roles
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: int, data: dict) -> User | None:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    if data.get("nickName") is not None:
        user.nick_name = data["nickName"]
    if data.get("userGender") is not None:
        user.gender = 1 if data["userGender"] == "男" else 0
    if data.get("userPhone") is not None:
        user.mobile = data["userPhone"]
    if data.get("userEmail") is not None:
        user.email = data["userEmail"]
    if data.get("department") is not None:
        user.department = data["department"]
    if data.get("status") is not None:
        user.status = data["status"]
    if data.get("roles") is not None:
        roles = db.query(Role).filter(Role.role_code.in_(data["roles"])).all()
        user.roles = roles
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True


def create_user_by_email(db: Session, email: str, password: str) -> User:
    """通过邮箱注册新用户，用户名取邮箱 @ 前部分，重复则追加数字"""
    base_username = email.split("@")[0]
    username = base_username

    # 处理用户名冲突
    counter = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{counter}"
        counter += 1

    # 查找默认角色 R_USER
    default_role = db.query(Role).filter(Role.role_code == "R_USER").first()

    user = User(
        username=username,
        password_hash=hash_password(password),
        nick_name=username,
        email=email.lower(),
        status="1",
        created_by="self_register",
    )
    if default_role:
        user.roles = [default_role]
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
