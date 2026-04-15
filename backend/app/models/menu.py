from sqlalchemy import Column, Integer, String, Boolean, Table, ForeignKey
from sqlalchemy.orm import relationship, backref
from app.db.session import Base

menu_roles = Table(
    "menu_roles",
    Base.metadata,
    Column("menu_id", Integer, ForeignKey("menus.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)


class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(Integer, ForeignKey("menus.id"), nullable=True)
    path = Column(String(200), nullable=False, default="")
    name = Column(String(100), default="")
    component = Column(String(200), default="")
    title = Column(String(100), default="")
    icon = Column(String(100), default="")
    sort_order = Column(Integer, default=0)
    is_hide = Column(Boolean, default=False)
    is_hide_tab = Column(Boolean, default=False)
    keep_alive = Column(Boolean, default=False)
    active_path = Column(String(200), default="")
    is_iframe = Column(Boolean, default=False)
    link = Column(String(500), default="")
    is_full_page = Column(Boolean, default=False)
    show_text_badge = Column(String(50), default="")
    fixed_tab = Column(Boolean, default=False)

    children = relationship("Menu", backref=backref("parent", remote_side=[id]), lazy="selectin")
    roles = relationship("Role", secondary=menu_roles, lazy="selectin")
    auth_list = relationship(
        "MenuAuthItem", back_populates="menu", lazy="selectin", cascade="all, delete-orphan"
    )


class MenuAuthItem(Base):
    __tablename__ = "menu_auth_list"

    id = Column(Integer, primary_key=True, autoincrement=True)
    menu_id = Column(Integer, ForeignKey("menus.id", ondelete="CASCADE"))
    title = Column(String(50), default="")
    auth_mark = Column(String(50), default="")

    menu = relationship("Menu", back_populates="auth_list")
