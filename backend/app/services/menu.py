from sqlalchemy.orm import Session
from app.models.menu import Menu
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
                {"title": a.title, "authMark": a.auth_mark} for a in menu.auth_list
            ]

        # 递归处理子菜单
        children = []
        for child in sorted(menu.children or [], key=lambda m: m.sort_order):
            child_dict = menu_to_dict(child)
            if child_dict:
                children.append(child_dict)

        result = {
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
