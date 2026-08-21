#!/bin/bash
# 这个脚本用于在 Render 部署时将 Prisma schema 从 SQLite 切换到 PostgreSQL
set -e

echo "🔄 Switching Prisma schema to PostgreSQL for production..."

# 检查是否设置了 PostgreSQL 环境变量
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" != postgresql* ]]; then
  echo "⚠️  DATABASE_URL is not set to PostgreSQL. Using SQLite."
  exit 0
fi

# 创建临时的 PostgreSQL schema
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Status {
  id        Int      @id @default(autoincrement())
  content   String
  mood      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Journal {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  mood      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Dish {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  category    String
  ingredients String?
  difficulty  Int      @default(1)
  imageUrl    String?
  available   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orders      Order[]
}

model Order {
  id        Int      @id @default(autoincrement())
  dishId    Int
  dish      Dish     @relation(fields: [dishId], references: [id])
  note      String?
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF

echo "✅ Schema switched to PostgreSQL"
