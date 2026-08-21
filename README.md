# 🍳 Our Space

一个属于我们的私人网站 —— 发布状态、写日志、点菜系统。

## ✨ 功能

- **📡 发布状态** - 分享此刻的心情和想法
- **✎ 写日志** - 记录生活中的点点滴滴
- **🍽️ 点菜系统** - 配置菜单，浏览食谱，点菜并追踪订单状态
- **⚙ 管理中心** - 管理菜品、状态、日志
- **🎨 科幻风格** - 赛博朋克设计，粒子动画背景，霓虹灯效果

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- React Router (路由)
- Axios (HTTP 请求)

### 后端
- Express.js + TypeScript
- Prisma ORM
- SQLite 数据库
- Zod (数据校验)

## 🚀 快速开始

### 前置要求
- Node.js >= 18
- npm

### 安装

```bash
# 1. 安装所有依赖
npm run install:all

# 2. 初始化数据库
npm run db:migrate

# 3. 填充示例数据
npm run db:seed
```

### 开发模式

```bash
# 同时启动前后端
npm run dev

# 或者分别启动
npm run dev:frontend   # 前端: http://localhost:5173
npm run dev:backend    # 后端: http://localhost:3000
```

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
cook/
├── frontend/          # 前端项目 (React + Vite)
│   ├── src/
│   │   ├── api/       # API 客户端
│   │   ├── components/# UI 组件
│   │   ├── hooks/     # 自定义 Hooks
│   │   ├── pages/     # 页面组件
│   │   └── types/     # TypeScript 类型定义
│   ├── index.html
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── backend/           # 后端项目 (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma  # 数据库模型
│   │   └── seed.ts        # 种子数据
│   └── src/
│       └── server.ts      # 服务器入口 & API 路由
│
├── package.json       # 根配置（脚本入口）
└── README.md
```

## 🌐 部署指南

### 方案 A: GitHub Pages + 免费后端

#### 前端部署到 GitHub Pages

1. 修改 `frontend/vite.config.ts` 中的 `base` 为你的仓库名：
   ```ts
   base: '/你的仓库名/',
   ```

2. 构建前端：
   ```bash
   cd frontend && npm run build
   ```

3. 使用 GitHub Actions 自动部署，创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: cd frontend && npm install && npm run build
         - uses: peaceiris/actions-gh-pages@v4
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./frontend/dist
   ```

#### 后端部署（免费选项）

| 平台 | 免费额度 | 特点 |
|------|---------|------|
| [Render](https://render.com) | 750h/月 | 简单易用，支持自动部署 |
| [Railway](https://railway.app) | $5/月额度 | 快速部署，支持数据库 |
| [Fly.io](https://fly.io) | 3个共享实例 | 全球分布，性能好 |

### 方案 B: Vercel 全栈部署

1. 将前端推送到 GitHub
2. 在 Vercel 导入项目，设置 root directory 为 `frontend`
3. 后端可以使用 Vercel Serverless Functions

## 🔧 配置说明

### 环境变量

**后端** (`backend/.env`):
```
PORT=3000
DATABASE_URL="file:./dev.db"
```

**前端** (`frontend/.env`):
```
VITE_API_URL=http://localhost:3000/api
```

生产环境需要将 `VITE_API_URL` 设置为后端实际部署地址。

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/statuses | 获取所有状态 |
| POST | /api/statuses | 创建状态 |
| PUT | /api/statuses/:id | 更新状态 |
| DELETE | /api/statuses/:id | 删除状态 |
| GET | /api/journals | 获取所有日志 |
| POST | /api/journals | 创建日志 |
| GET | /api/journals/:id | 获取日志详情 |
| PUT | /api/journals/:id | 更新日志 |
| DELETE | /api/journals/:id | 删除日志 |
| GET | /api/dishes | 获取所有菜品 |
| POST | /api/dishes | 创建菜品 |
| PUT | /api/dishes/:id | 更新菜品 |
| DELETE | /api/dishes/:id | 删除菜品 |
| GET | /api/orders | 获取所有订单 |
| POST | /api/orders | 创建订单 |
| PATCH | /api/orders/:id/status | 更新订单状态 |
| DELETE | /api/orders/:id | 删除订单 |
| GET | /api/categories | 获取所有分类 |

## 📱 响应式设计

网站完全支持移动端、平板和桌面端自适应：
- 移动端：底部抽屉式导航
- 平板：两列网格布局
- 桌面：三列网格布局 + 完整导航栏

## 💡 维护建议

- 代码按功能模块组织，易于扩展
- 所有 API 使用 TypeScript 类型定义，保证类型安全
- 前后端分离，可独立部署和扩展
- 使用 Prisma 管理数据库，迁移方便
- 组件化设计，UI 组件可复用

---

Made with ♥ for us
