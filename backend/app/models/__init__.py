# 导入所有模型，确保 Alembic 能检测到
from app.db.session import Base
from app.models.user import User, user_roles
from app.models.role import Role
from app.models.menu import Menu, MenuAuthItem, menu_roles
from app.models.article import Article
from app.models.comment import Comment
from app.models.changelog import Changelog

__all__ = ["Base", "User", "Role", "Menu", "MenuAuthItem", "Article", "Comment", "Changelog"]
