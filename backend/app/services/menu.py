from sqlalchemy.orm import Session
from app.models.menu import Menu, MenuAuthItem, menu_roles
from app.models.role import Role
from app.models.user import User


def build_menu_tree(db: Session, user: User) -> list[dict]:
    """根据用户角色构建可见菜单树"""
    user_role_ids = {r.id for r in user.roles}

    # 获取所有顶级菜单
    all_menus = db.query(Menu).filter(Menu.parent_id.is_(None)).all()

    def menu_to_dict(menu: Menu) -> dict | None:
        # 检查角色权限：如果菜单绑定了角色，用户必须拥有其中之一
        menu_role_ids = {r.id for r in menu.roles}
        if menu_role_ids and not menu_role_ids.intersection(user_role_ids):
            return None

        meta = {
            "title": menu.title,
            "icon": menu.icon,
            "keepAlive": menu.keep_alive,
            "isHide": menu.is_hide,
            "isHideTab": menu.is_hide_tab,
        }
        if menu.is_full_page:
            meta["isFullPage"] = True
        if menu.active_path:
            meta["activePath"] = menu.active_path
        if menu.is_iframe:
            meta["isIframe"] = True
        if menu.link:
            meta["link"] = menu.link
        if menu.show_text_badge:
            meta["showTextBadge"] = menu.show_text_badge
        if menu.fixed_tab:
            meta["fixedTab"] = True

        # 角色列表
        if menu.roles:
            meta["roles"] = [r.role_code for r in menu.roles]

        # 按钮权限
        if menu.auth_list:
            meta["authList"] = [
                {"id": a.id, "title": a.title, "authMark": a.auth_mark} for a in menu.auth_list
            ]

        # 递归处理子菜单
        children = []
        for child in sorted(menu.children or [], key=lambda m: m.sort_order):
            child_dict = menu_to_dict(child)
            if child_dict:
                children.append(child_dict)

        result = {
            "id": menu.id,
            "path": menu.path,
            "name": menu.name,
            "component": menu.component,
            "meta": meta,
        }
        if children:
            result["children"] = children

        return result

    tree = []
    for menu in sorted(all_menus, key=lambda m: m.sort_order):
        item = menu_to_dict(menu)
        if item:
            tree.append(item)
    return tree


def create_menu(db: Session, data: dict) -> Menu:
    """创建菜单"""
    meta = data.get("meta", {})
    menu = Menu(
        parent_id=data.get("parentId"),
        path=data["path"],
        name=data["name"],
        component=data.get("component", ""),
        title=meta.get("title", ""),
        icon=meta.get("icon", ""),
        sort_order=data.get("sortOrder", 0),
        is_hide=meta.get("isHide", False),
        is_hide_tab=meta.get("isHideTab", False),
        keep_alive=meta.get("keepAlive", False),
        active_path=meta.get("activePath", ""),
        is_iframe=meta.get("isIframe", False),
        link=meta.get("link", ""),
        is_full_page=meta.get("isFullPage", False),
        show_text_badge=meta.get("showTextBadge", ""),
        fixed_tab=meta.get("fixedTab", False),
    )
    # 绑定角色
    role_codes = meta.get("roles", [])
    if role_codes:
        roles = db.query(Role).filter(Role.role_code.in_(role_codes)).all()
        menu.roles = roles
    # 权限列表
    auth_list = meta.get("authList", [])
    for auth in auth_list:
        menu.auth_list.append(MenuAuthItem(title=auth["title"], auth_mark=auth["authMark"]))

    db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu


def update_menu(db: Session, menu_id: int, data: dict) -> Menu | None:
    """更新菜单"""
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        return None

    if data.get("path") is not None:
        menu.path = data["path"]
    if data.get("name") is not None:
        menu.name = data["name"]
    if data.get("component") is not None:
        menu.component = data["component"]
    if data.get("sortOrder") is not None:
        menu.sort_order = data["sortOrder"]
    if data.get("parentId") is not None:
        menu.parent_id = data["parentId"]

    meta = data.get("meta")
    if meta:
        if "title" in meta:
            menu.title = meta["title"]
        if "icon" in meta:
            menu.icon = meta["icon"]
        if "isHide" in meta:
            menu.is_hide = meta["isHide"]
        if "isHideTab" in meta:
            menu.is_hide_tab = meta["isHideTab"]
        if "keepAlive" in meta:
            menu.keep_alive = meta["keepAlive"]
        if "activePath" in meta:
            menu.active_path = meta["activePath"]
        if "isIframe" in meta:
            menu.is_iframe = meta["isIframe"]
        if "link" in meta:
            menu.link = meta["link"]
        if "isFullPage" in meta:
            menu.is_full_page = meta["isFullPage"]
        if "showTextBadge" in meta:
            menu.show_text_badge = meta["showTextBadge"]
        if "fixedTab" in meta:
            menu.fixed_tab = meta["fixedTab"]
        # 更新角色绑定
        if "roles" in meta:
            roles = db.query(Role).filter(Role.role_code.in_(meta["roles"])).all()
            menu.roles = roles
        # 更新权限列表
        if "authList" in meta:
            menu.auth_list.clear()
            for auth in meta["authList"]:
                menu.auth_list.append(MenuAuthItem(title=auth["title"], auth_mark=auth["authMark"]))

    db.commit()
    db.refresh(menu)
    return menu


def delete_menu(db: Session, menu_id: int) -> bool:
    """删除菜单（及其子菜单）"""
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        return False
    db.delete(menu)
    db.commit()
    return True


def create_auth_item(db: Session, data: dict) -> MenuAuthItem:
    """创建权限按钮"""
    item = MenuAuthItem(
        menu_id=data["menuId"],
        title=data["title"],
        auth_mark=data["authMark"],
    )
    db.add(item)
    db.commit()
    return item


def delete_auth_item(db: Session, auth_id: int) -> bool:
    """删除权限按钮"""
    item = db.query(MenuAuthItem).filter(MenuAuthItem.id == auth_id).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
