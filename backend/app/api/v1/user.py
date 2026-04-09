from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.common import ok, fail
from app.services.user import get_user_list, create_user, update_user, delete_user

router = APIRouter()


@router.get("/api/user/list")
def list_users(
    current: int = Query(1),
    size: int = Query(10),
    userName: str = Query(None),
    userGender: str = Query(None),
    userPhone: str = Query(None),
    userEmail: str = Query(None),
    status: str = Query(None),
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_user_list(
        db, current, size,
        userName=userName, userGender=userGender,
        userPhone=userPhone, userEmail=userEmail, status=status,
    )
    return ok(data)


@router.post("/api/user")
def create(body: UserCreate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == body.userName).first()
    if existing:
        return fail("用户名已存在")
    create_user(db, body.model_dump())
    return ok(None, "创建成功")


@router.put("/api/user/{user_id}")
def update(user_id: int, body: UserUpdate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = update_user(db, user_id, body.model_dump(exclude_none=True))
    if not result:
        return fail("用户不存在")
    return ok(None, "更新成功")


@router.delete("/api/user/{user_id}")
def delete(user_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not delete_user(db, user_id):
        return fail("用户不存在")
    return ok(None, "删除成功")
