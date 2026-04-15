import random
import string
from app.core.redis import redis_client
from app.core.config import settings


def generate_code() -> str:
    """生成指定长度的数字验证码"""
    length = settings.VERIFY_CODE_LENGTH
    return "".join(random.choices(string.digits, k=length))


def store_code(email: str, purpose: str, code: str) -> None:
    """将验证码存入 Redis，设置过期时间"""
    key = f"verify:{purpose}:{email.lower()}"
    redis_client.setex(key, settings.VERIFY_CODE_EXPIRE_SECONDS, code)


def verify_code(email: str, purpose: str, code: str) -> bool:
    """校验验证码是否匹配"""
    key = f"verify:{purpose}:{email.lower()}"
    stored = redis_client.get(key)
    if stored is None or stored != code:
        return False
    # 验证通过后删除，防止重复使用
    redis_client.delete(key)
    return True


def check_cooldown(email: str) -> bool:
    """检查是否在冷却期内，返回 True 表示可以发送"""
    key = f"verify_limit:{email.lower()}"
    return redis_client.get(key) is None


def set_cooldown(email: str) -> None:
    """设置发送冷却"""
    key = f"verify_limit:{email.lower()}"
    redis_client.setex(key, settings.VERIFY_CODE_COOLDOWN_SECONDS, "1")
