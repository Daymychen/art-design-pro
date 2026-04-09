from pydantic_settings import BaseSettings


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

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            "?charset=utf8mb4"
        )

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
