def _get_token(client, seed_admin):
    resp = client.post("/api/auth/login", json={"userName": "admin", "password": "123456"})
    return resp.json()["data"]["token"]


def test_get_comments(client, seed_admin, db):
    from app.models.article import Article
    from app.models.comment import Comment
    a = Article(title="Test", author_id=seed_admin.id)
    db.add(a)
    db.flush()
    c1 = Comment(article_id=a.id, author="Alice", content="Great!")
    c2 = Comment(article_id=a.id, author="Bob", content="Nice!")
    db.add_all([c1, c2])
    db.commit()
    token = _get_token(client, seed_admin)
    resp = client.get(f"/api/comment/list?articleId={a.id}", headers={"Authorization": token})
    body = resp.json()
    assert body["code"] == 200
    assert len(body["data"]) == 2


def test_add_comment(client, seed_admin, db):
    from app.models.article import Article
    a = Article(title="Test", author_id=seed_admin.id)
    db.add(a)
    db.commit()
    token = _get_token(client, seed_admin)
    resp = client.post("/api/comment", json={
        "articleId": a.id,
        "author": "Alice",
        "content": "Hello!",
    }, headers={"Authorization": token})
    assert resp.json()["code"] == 200


def test_wall_comments(client, db):
    from app.models.comment import Comment
    c = Comment(author="Wall User", content="Wall comment")
    db.add(c)
    db.commit()
    resp = client.get("/api/comment/wall")
    body = resp.json()
    assert body["code"] == 200
    assert len(body["data"]) >= 1


def test_delete_comment(client, seed_admin, db):
    from app.models.article import Article
    from app.models.comment import Comment
    a = Article(title="Test", author_id=seed_admin.id)
    db.add(a)
    db.flush()
    c = Comment(article_id=a.id, author="Alice", content="To delete")
    db.add(c)
    db.commit()
    token = _get_token(client, seed_admin)
    resp = client.delete(f"/api/comment/{c.id}", headers={"Authorization": token})
    assert resp.json()["code"] == 200
