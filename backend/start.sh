#!/bin/bash
set -e

# 等待 MySQL 就绪
echo "等待 MySQL 就绪..."
until mysqladmin ping -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" --ssl=false --silent 2>/dev/null; do
  sleep 2
done
echo "MySQL 已就绪"

# 执行数据库迁移
echo "执行数据库迁移..."
alembic upgrade head

# 初始化种子数据
echo "初始化种子数据..."
python -m app.db.seed

# 启动 FastAPI
echo "启动 FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
