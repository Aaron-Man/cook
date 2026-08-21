#!/bin/bash
# 这个脚本用于在 Render 部署时将 Prisma schema 从 SQLite 切换到 PostgreSQL
set -e

echo "🔄 Switching Prisma schema to PostgreSQL for production..."

# 检查是否设置了 PostgreSQL 环境变量
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" != postgresql* ]]; then
  echo "⚠️  DATABASE_URL is not set to PostgreSQL. Using SQLite (schema.prisma)."
  exit 0
fi

# 复制 PostgreSQL schema 覆盖默认 schema
cp prisma/schema.postgres.prisma prisma/schema.prisma

echo "✅ Schema switched to PostgreSQL"
