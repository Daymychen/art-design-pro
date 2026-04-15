import redis
from app.core.config import settings

# 同步 Redis 客户端（供 RQ worker 和验证码服务使用）
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
