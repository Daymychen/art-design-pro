from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.role import Role
from app.models.menu import Menu, menu_roles
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


class RolePermissionParams(BaseModel):
    menuNames: list[str] = []


@router.get("/api/role/{role_id}/permissions")
def get_permissions(role_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """获取角色的菜单权限（返回菜单 name 列表）"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return fail("角色不存在")
    menus = db.query(Menu).join(menu_roles).filter(menu_roles.c.role_id == role_id).all()
    names = [m.name for m in menus]
    return ok(names)


@router.put("/api/role/{role_id}/permissions")
def save_permissions(
    role_id: int,
    body: RolePermissionParams,
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """保存角色的菜单权限"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return fail("角色不存在")
    # 根据 name 查找菜单
    menus = db.query(Menu).filter(Menu.name.in_(body.menuNames)).all() if body.menuNames else []
    # 清除旧关联，写入新关联
    db.execute(menu_roles.delete().where(menu_roles.c.role_id == role_id))
    for m in menus:
        db.execute(menu_roles.insert().values(menu_id=m.id, role_id=role_id))
    db.commit()
    return ok(None, "权限保存成功")
