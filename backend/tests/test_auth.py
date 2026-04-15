def test_login_success(client, seed_admin):
    resp = client.post("/api/auth/login", json={"userName": "admin", "password": "123456"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["code"] == 200
    assert "token" in body["data"]
    assert "refreshToken" in body["data"]


def test_login_wrong_password(client, seed_admin):
    resp = client.post("/api/auth/login", json={"userName": "admin", "password": "wrong"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["code"] == 400


def test_get_user_info(client, seed_admin):
    login_resp = client.post("/api/auth/login", json={"userName": "admin", "password": "123456"})
    token = login_resp.json()["data"]["token"]

    resp = client.get("/api/user/info", headers={"Authorization": token})
    assert resp.status_code == 200
    body = resp.json()
    assert body["data"]["userName"] == "admin"
    assert "R_SUPER" in body["data"]["roles"]


def test_get_user_info_no_token(client):
    resp = client.get("/api/user/info")
    assert resp.status_code == 401
