from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.common import ok, fail
from app.schemas.menu import MenuCreate, MenuUpdate, AuthItemCreate
from app.services.menu import (
    build_menu_tree, create_menu, update_menu, delete_menu,
    create_auth_item, delete_auth_item,
)

router = APIRouter()


@router.get("/api/v3/system/menus")
def get_menus(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tree = build_menu_tree(db, current_user)
    return ok(tree)


@router.post("/api/v3/system/menus")
def add_menu(body: MenuCreate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    create_menu(db, body.model_dump())
    return ok(None, "菜单创建成功")


@router.put("/api/v3/system/menus/{menu_id}")
def edit_menu(menu_id: int, body: MenuUpdate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not update_menu(db, menu_id, body.model_dump(exclude_none=True)):
        return fail("菜单不存在")
    return ok(None, "菜单更新成功")


@router.delete("/api/v3/system/menus/{menu_id}")
def remove_menu(menu_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not delete_menu(db, menu_id):
        return fail("菜单不存在")
    return ok(None, "菜单删除成功")


@router.post("/api/v3/system/menus/auth")
def add_auth(body: AuthItemCreate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    create_auth_item(db, body.model_dump())
    return ok(None, "权限创建成功")


@router.delete("/api/v3/system/menus/auth/{auth_id}")
def remove_auth(auth_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not delete_auth_item(db, auth_id):
        return fail("权限不存在")
    return ok(None, "权限删除成功")
