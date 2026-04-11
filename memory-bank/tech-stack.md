# SBTI 赛博人格测定局 - 技术栈（CloudBase 分支）

> **职责**: 记录项目使用的技术栈。写任何代码前应了解当前技术栈，避免引入不兼容的依赖。

---

## 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 16.2.3 | 前端框架，App Router，静态导出（`output: "export"`） |
| **React** | 19.2.4 | UI 渲染（useTransition、Suspense） |
| **TypeScript** | ^5 | 类型安全 |

> **重要**: Next.js 16 可能有 breaking changes。写代码前查阅 `node_modules/next/dist/docs/`。

## 样式方案

| 技术 | 版本 | 用途 |
|------|------|------|
| **Tailwind CSS** | ^4 | 原子化 CSS，v4 语法（`@import "tailwindcss"`） |
| **clsx** | ^2.1.1 | 条件类名拼接 |

## 字体

| 技术 | 用途 |
|------|------|
| **@fontsource/space-grotesk** | UI 字体（正文、按钮、标签） |
| **@fontsource/noto-serif-sc** | 展示字体（标题、人格名称） |

## 功能依赖

| 技术 | 版本 | 用途 |
|------|------|------|
| **lucide-react** | ^1.8.0 | 图标库 |
| **qrcode** | ^1.5.4 | 海报二维码生成 |

## 云端服务（CloudBase）

| 服务 | 用途 |
|------|------|
| **静态网站托管** | 部署 Next.js 静态导出产物 |
| **云函数**（事件函数） | `sbti-rankings-get` + `sbti-rankings-submit` |
| **云接入**（HTTP 路由） | 将云函数暴露为 HTTP 端点，自动处理 CORS |
| **文档型数据库** | `sbti-rankings` + `sbti-submissions` 集合 |
| **@cloudbase/node-sdk** | ^3.18（云函数内使用） |

## 数据存储

| 方式 | 用途 |
|------|------|
| **CloudBase 云数据库** `sbti-rankings` | 排行榜数据（27 个人格类型的 count） |
| **CloudBase 云数据库** `sbti-submissions` | 提交去重记录（submissionId 作为 _id） |
| **静态 JSON** `src/data/sbti-data.json` | 题库、人格类型、维度定义 |
| **静态 JSON** `src/data/rankings-seed.json` | 排行榜初始种子数据 |
| **localStorage** | 客户端结果快照暂存 |

## 渲染策略

| 页面 | 策略 | 说明 |
|------|------|------|
| 所有页面 | **静态导出** | `output: "export"` 生成纯 HTML |
| `/result/[slug]` | **SSG** | `generateStaticParams` 预渲染 27 个页面 |
| 首页 Top3 | **CSR** | 客户端 `useEffect` 调用云函数 |
| 排行榜页 | **CSR** | 客户端 `useEffect` 调用云函数 |
| 结果页榜单提交 | **CSR** | 自动调用云函数提交 |

## 部署

| 步骤 | 命令/操作 |
|------|-----------|
| 构建 | `npm run build`（生成 `out/` 目录） |
| 静态托管 | CloudBase 静态网站托管，部署 `out/` 目录 |
| 云函数 | `tcb fn deploy` 或控制台上传 |
| 种子数据 | `tcb db nosql execute` 或 `node scripts/seed-database.js` |
| 本地预览 | `npx serve out` |
| 开发模式 | `npm run dev`（排行榜走线上云函数） |

## 不使用的技术（有意省略）

- **Node.js 运行时**: 静态导出，不需要服务端
- **Next.js API 路由**: 已迁移到云函数
- **本地 JSON 文件存储**: 已迁移到云数据库
- **状态管理库**: React 内置 state 足够
- **认证系统**: 通过 submissionId 做轻量防重复
