from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    MYSQL_HOST: str = "mysql"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "adp_user"
    MYSQL_PASSWORD: str = "adp_pass_2024"
    MYSQL_DATABASE: str = "art_design_pro"

    REDIS_URL: str = "redis://redis:6379/0"

    JWT_SECRET_KEY: str = "changeme"
    JWT_REFRESH_SECRET_KEY: str = "changeme"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # 邮箱注册 — 允许的域名（逗号分隔）
    ALLOWED_EMAIL_DOMAINS: str = "yourcompany.com"

    # SMTP 邮件发送
    SMTP_HOST: str = "smtp.yourcompany.com"
    SMTP_PORT: int = 465
    SMTP_USER: str = "noreply@yourcompany.com"
    SMTP_PASSWORD: str = ""
    SMTP_USE_SSL: bool = True

    # 验证码配置
    VERIFY_CODE_EXPIRE_SECONDS: int = 600
    VERIFY_CODE_LENGTH: int = 6
    VERIFY_CODE_COOLDOWN_SECONDS: int = 60

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            "?charset=utf8mb4"
        )

    @property
    def allowed_email_domains_list(self) -> List[str]:
        """解析逗号分隔的域名列表"""
        return [d.strip().lower() for d in self.ALLOWED_EMAIL_DOMAINS.split(",") if d.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
