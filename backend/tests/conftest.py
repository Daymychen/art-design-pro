import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.deps import get_db
from app.db.session import Base
from app.core.security import hash_password
from app.models.user import User
from app.models.role import Role

# 使用 SQLite 内存数据库测试
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestSession = sessionmaker(bind=engine, autocommit=False, autoflush=False)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    session = TestSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def seed_admin(db):
    role = Role(role_name="超级管理员", role_code="R_SUPER", description="拥有系统全部权限")
    db.add(role)
    db.flush()
    user = User(
        username="admin",
        password_hash=hash_password("123456"),
        nick_name="Admin",
        email="admin@company.com",
        avatar="/avatars/admin.webp",
    )
    user.roles.append(role)
    db.add(user)
    db.commit()
    return user
