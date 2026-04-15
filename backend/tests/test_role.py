def _get_token(client, seed_admin):
    resp = client.post("/api/auth/login", json={"userName": "admin", "password": "123456"})
    return resp.json()["data"]["token"]


def test_get_role_list(client, seed_admin):
    token = _get_token(client, seed_admin)
    resp = client.get("/api/role/list?current=1&size=10", headers={"Authorization": token})
    body = resp.json()
    assert body["code"] == 200
    assert body["data"]["total"] >= 1


def test_create_role(client, seed_admin):
    token = _get_token(client, seed_admin)
    resp = client.post("/api/role", json={
        "roleName": "测试角色",
        "roleCode": "R_TEST",
        "description": "测试角色描述",
        "enabled": True,
    }, headers={"Authorization": token})
    assert resp.json()["code"] == 200


def test_delete_role(client, seed_admin, db):
    token = _get_token(client, seed_admin)
    from app.models.role import Role
    r = Role(role_name="ToDelete", role_code="R_DEL", description="")
    db.add(r)
    db.commit()
    resp = client.delete(f"/api/role/{r.id}", headers={"Authorization": token})
    assert resp.json()["code"] == 200
