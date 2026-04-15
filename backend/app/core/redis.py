import redis
from app.core.config import settings

# 验证码服务用的 Redis 客户端（decode_responses=True 方便字符串操作）
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

# RQ 队列用的 Redis 连接（不能 decode_responses，RQ 需要原始 bytes）
rq_redis = redis.from_url(settings.REDIS_URL)
