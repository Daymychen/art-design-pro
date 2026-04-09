from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate
from app.schemas.common import ok, fail
from app.services.role import get_role_list, create_role, update_role, delete_role

router = APIRouter()


@router.get("/api/role/list")
def list_roles(
    current: int = Query(1),
    size: int = Query(10),
    roleName: str = Query(None),
    roleCode: str = Query(None),
    enabled: bool = Query(None),
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_role_list(db, current, size, roleName=roleName, roleCode=roleCode, enabled=enabled)
    return ok(data)


@router.post("/api/role")
def create(body: RoleCreate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Role).filter(Role.role_code == body.roleCode).first()
    if existing:
        return fail("角色编码已存在")
    create_role(db, body.model_dump())
    return ok(None, "创建成功")


@router.put("/api/role/{role_id}")
def update(role_id: int, body: RoleUpdate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not update_role(db, role_id, body.model_dump(exclude_none=True)):
        return fail("角色不存在")
    return ok(None, "更新成功")


@router.delete("/api/role/{role_id}")
def delete(role_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not delete_role(db, role_id):
        return fail("角色不存在")
    return ok(None, "删除成功")
