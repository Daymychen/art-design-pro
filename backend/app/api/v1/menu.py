from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.common import ok
from app.services.menu import build_menu_tree

router = APIRouter()


@router.get("/api/v3/system/menus")
def get_menus(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tree = build_menu_tree(db, current_user)
    return ok(tree)
