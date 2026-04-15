def _get_token(client, seed_admin):
    resp = client.post("/api/auth/login", json={"userName": "admin", "password": "123456"})
    return resp.json()["data"]["token"]


def test_get_user_list(client, seed_admin):
    token = _get_token(client, seed_admin)
    resp = client.get("/api/user/list?current=1&size=10", headers={"Authorization": token})
    body = resp.json()
    assert body["code"] == 200
    assert body["data"]["total"] >= 1
    assert len(body["data"]["records"]) >= 1


def test_create_user(client, seed_admin):
    token = _get_token(client, seed_admin)
    resp = client.post("/api/user", json={
        "userName": "testuser",
        "nickName": "Test",
        "gender": "男",
        "mobile": "13800000000",
        "email": "test@company.com",
        "department": "研发部",
        "password": "123456",
        "userRoles": ["R_SUPER"],
    }, headers={"Authorization": token})
    assert resp.json()["code"] == 200


def test_update_user(client, seed_admin):
    token = _get_token(client, seed_admin)
    resp = client.put(f"/api/user/{seed_admin.id}", json={
        "nickName": "Updated Name",
    }, headers={"Authorization": token})
    assert resp.json()["code"] == 200


def test_delete_user(client, seed_admin, db):
    token = _get_token(client, seed_admin)
    from app.core.security import hash_password
    from app.models.user import User
    u = User(username="todelete", password_hash=hash_password("123456"))
    db.add(u)
    db.commit()
    resp = client.delete(f"/api/user/{u.id}", headers={"Authorization": token})
    assert resp.json()["code"] == 200
