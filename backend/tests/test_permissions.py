from app.core.permissions import ROLE_HIERARCHY, expand_roles


def test_expand_roles_super():
    """R_SUPER 展开后包含所有角色"""
    result = expand_roles(["R_SUPER"])
    assert result == {"R_SUPER", "R_ADMIN", "R_USER"}


def test_expand_roles_admin():
    """R_ADMIN 展开后包含 R_USER"""
    result = expand_roles(["R_ADMIN"])
    assert result == {"R_ADMIN", "R_USER"}


def test_expand_roles_user():
    """R_USER 无继承"""
    result = expand_roles(["R_USER"])
    assert result == {"R_USER"}


def test_expand_roles_multiple():
    """多角色去重展开"""
    result = expand_roles(["R_ADMIN", "R_USER"])
    assert result == {"R_ADMIN", "R_USER"}


def test_expand_roles_empty():
    """空列表返回空集合"""
    result = expand_roles([])
    assert result == set()


def test_expand_roles_unknown():
    """未知角色保留自身，不报错"""
    result = expand_roles(["R_UNKNOWN"])
    assert result == {"R_UNKNOWN"}


def test_role_hierarchy_structure():
    """继承链结构正确"""
    assert "R_SUPER" in ROLE_HIERARCHY
    assert "R_ADMIN" in ROLE_HIERARCHY
    assert "R_USER" in ROLE_HIERARCHY
    assert "R_ADMIN" in ROLE_HIERARCHY["R_SUPER"]
    assert "R_USER" in ROLE_HIERARCHY["R_SUPER"]
    assert "R_USER" in ROLE_HIERARCHY["R_ADMIN"]
    assert ROLE_HIERARCHY["R_USER"] == []
