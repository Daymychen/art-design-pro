from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.user import router as user_router
from app.api.v1.role import router as role_router
from app.api.v1.menu import router as menu_router
from app.api.v1.article import router as article_router
from app.api.v1.comment import router as comment_router
from app.api.v1.changelog import router as changelog_router

router = APIRouter()
router.include_router(auth_router, tags=["auth"])
router.include_router(user_router, tags=["user"])
router.include_router(role_router, tags=["role"])
router.include_router(menu_router, tags=["menu"])
router.include_router(article_router, tags=["article"])
router.include_router(comment_router, tags=["comment"])
router.include_router(changelog_router, tags=["changelog"])
