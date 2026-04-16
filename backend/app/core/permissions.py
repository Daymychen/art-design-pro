"""
角色继承定义

继承链：R_SUPER > R_ADMIN > R_USER
高级角色自动拥有低级角色的所有权限
"""

ROLE_HIERARCHY: dict[str, list[str]] = {
    "R_SUPER": ["R_ADMIN", "R_USER"],
    "R_ADMIN": ["R_USER"],
    "R_USER": [],
}


def expand_roles(user_roles: list[str]) -> set[str]:
    """展开角色继承，返回用户实际拥有的所有角色"""
    expanded = set(user_roles)
    for role in user_roles:
        expanded.update(ROLE_HIERARCHY.get(role, []))
    return expanded
