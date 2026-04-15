from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from rq import Queue
from app.core.deps import get_db, get_current_user
from app.core.redis import redis_client
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import LoginParams, UserInfoResponse, RefreshParams
from app.schemas.register import SendVerifyCodeParams, RegisterParams, ForgotPasswordParams
from app.schemas.common import ok, fail
from app.services.auth import authenticate_user, generate_tokens, get_user_buttons
from app.services.user import create_user_by_email
from app.services.verify_code import generate_code, store_code, verify_code, check_cooldown, set_cooldown
from app.services.email import send_verify_code_email
from app.core.security import decode_refresh_token, hash_password
import jwt

router = APIRouter()

# RQ 队列
rq_queue = Queue(connection=redis_client)


@router.get("/api/auth/email-config")
def get_email_config():
    """返回允许的邮箱域名列表"""
    return ok({"allowed_domains": settings.allowed_email_domains_list})


@router.post("/api/auth/send-verify-code")
def send_verify_code(params: SendVerifyCodeParams, db: Session = Depends(get_db)):
    """发送验证码"""
    email = params.email.strip().lower()
    purpose = params.purpose

    # 校验 purpose
    if purpose not in ("register", "reset_password"):
        return fail("无效的用途参数")

    # 校验邮箱域名
    domain = email.split("@")[-1] if "@" in email else ""
    if domain not in settings.allowed_email_domains_list:
        return fail("不支持该邮箱域名")

    # 检查邮箱状态
    existing_user = db.query(User).filter(User.email == email).first()
    if purpose == "register" and existing_user:
        return fail("该邮箱已注册")
    if purpose == "reset_password" and not existing_user:
        return fail("该邮箱未注册")

    # 防刷检查
    if not check_cooldown(email):
        return fail("发送过于频繁，请稍后再试")

    # 生成验证码并存入 Redis
    code = generate_code()
    store_code(email, purpose, code)
    set_cooldown(email)

    # 通过 RQ 异步发送邮件
    rq_queue.enqueue(send_verify_code_email, email, code, purpose)

    return ok(None, "验证码已发送")


@router.post("/api/auth/register")
def register(params: RegisterParams, db: Session = Depends(get_db)):
    """邮箱注册"""
    email = params.email.strip().lower()

    # 校验邮箱域名
    domain = email.split("@")[-1] if "@" in email else ""
    if domain not in settings.allowed_email_domains_list:
        return fail("不支持该邮箱域名")

    # 检查邮箱是否已注册
    if db.query(User).filter(User.email == email).first():
        return fail("该邮箱已注册")

    # 校验验证码
    if not verify_code(email, "register", params.code):
        return fail("验证码错误或已过期")

    # 创建用户
    create_user_by_email(db, email, params.password)

    return ok(None, "注册成功")


@router.post("/api/auth/forgot-password")
def forgot_password(params: ForgotPasswordParams, db: Session = Depends(get_db)):
    """密码找回"""
    email = params.email.strip().lower()

    # 校验验证码
    if not verify_code(email, "reset_password", params.code):
        return fail("验证码错误或已过期")

    # 查找用户并更新密码
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return fail("该邮箱未注册")

    user.password_hash = hash_password(params.new_password)
    db.commit()

    return ok(None, "密码重置成功")


@router.post("/api/auth/login")
def login(params: LoginParams, db: Session = Depends(get_db)):
    user = authenticate_user(db, params.userName, params.password)
    if not user:
        return fail("用户名或密码错误")
    tokens = generate_tokens(user)
    return ok(tokens)


@router.post("/api/auth/refresh")
def refresh_token(params: RefreshParams, db: Session = Depends(get_db)):
    try:
        payload = decode_refresh_token(params.refreshToken)
    except jwt.InvalidTokenError:
        return fail("无效的刷新令牌", 401)
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        return fail("用户不存在", 401)
    tokens = generate_tokens(user)
    return ok(tokens)


@router.post("/api/auth/logout")
def logout():
    return ok(None, "已登出")


@router.get("/api/user/info")
def get_user_info(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roles = [r.role_code for r in current_user.roles]
    buttons = get_user_buttons(db, current_user)
    return ok(UserInfoResponse(
        userId=current_user.id,
        userName=current_user.username,
        email=current_user.email,
        avatar=current_user.avatar,
        roles=roles,
        buttons=buttons,
    ).model_dump())
