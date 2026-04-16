def _get_token(client, seed_admin):
    resp = client.post("/api/auth/login", json={"userName": "admin", "password": "123456"})
    return resp.json()["data"]["token"]


def test_get_article_list(client, seed_admin, db):
    from app.models.article import Article
    a = Article(title="Test Article", brief="brief", type_name="Vue", blog_class="12", author_id=seed_admin.id)
    db.add(a)
    db.commit()
    token = _get_token(client, seed_admin)
    resp = client.get("/api/article/list?current=1&size=10", headers={"Authorization": token})
    body = resp.json()
    assert body["code"] == 200
    assert body["data"]["total"] >= 1


def test_get_article_detail(client, seed_admin, db):
    from app.models.article import Article
    a = Article(title="Detail Test", html_content="<h1>Hello</h1>", author_id=seed_admin.id)
    db.add(a)
    db.commit()
    token = _get_token(client, seed_admin)
    resp = client.get(f"/api/article/{a.id}", headers={"Authorization": token})
    body = resp.json()
    assert body["code"] == 200
    assert body["data"]["title"] == "Detail Test"
    assert "<h1>" in body["data"]["html_content"]


def test_create_article(client, seed_admin):
    token = _get_token(client, seed_admin)
    resp = client.post("/api/article", json={
        "title": "New Article",
        "brief": "Brief",
        "htmlContent": "<p>Content</p>",
        "typeName": "Vue",
        "blogClass": "12",
    }, headers={"Authorization": token})
    assert resp.json()["code"] == 200


def test_delete_article(client, seed_admin, db):
    from app.models.article import Article
    a = Article(title="To Delete", author_id=seed_admin.id)
    db.add(a)
    db.commit()
    token = _get_token(client, seed_admin)
    resp = client.delete(f"/api/article/{a.id}", headers={"Authorization": token})
    assert resp.json()["code"] == 200
