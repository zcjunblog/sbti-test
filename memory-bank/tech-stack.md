# SBTI 赛博人格测定局 - 技术栈

> **职责**: 记录项目使用的技术栈，保持最简单但最健壮的选型。写任何代码前应了解当前技术栈，避免引入不兼容的依赖。

---

## 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 16.2.3 | 全栈框架，App Router 模式 |
| **React** | 19.2.4 | UI 渲染（使用 React 19 新特性如 useTransition） |
| **TypeScript** | ^5 | 类型安全 |

> **重要**: 本项目使用 Next.js 16，与训练数据中的版本可能存在 breaking changes。写代码前必须查阅 `node_modules/next/dist/docs/` 中的相关指南，留意废弃通知。

## 样式方案

| 技术 | 版本 | 用途 |
|------|------|------|
| **Tailwind CSS** | ^4 | 原子化 CSS，使用 v4 新语法（@import "tailwindcss"） |
| **@tailwindcss/postcss** | ^4 | PostCSS 插件集成 |
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

## 开发工具

| 技术 | 用途 |
|------|------|
| **ESLint** | 代码规范检查（eslint-config-next） |
| **PostCSS** | CSS 处理管线 |

## 数据存储

| 方式 | 用途 |
|------|------|
| **JSON 文件** (`data/rankings-store.json`) | 服务端排行榜持久化存储 |
| **JSON 数据** (`src/data/sbti-data.json`) | 题库、人格类型、维度定义等静态数据 |
| **JSON 种子** (`src/data/rankings-seed.json`) | 排行榜初始种子数据 |
| **localStorage** | 客户端结果快照暂存 |

## 渲染策略

| 页面 | 策略 | 说明 |
|------|------|------|
| `/` (首页) | `force-dynamic` | 需要实时读取排行榜数据 |
| `/test` | 静态 + CSR | 页面壳静态渲染，测试逻辑在客户端 |
| `/result/[slug]` | 动态 SSR | 根据 slug 查找人格类型 |
| `/types` | 静态 | 人格图鉴纯静态数据 |
| `/rankings` | `force-dynamic` | 实时读取排行榜 |
| `/about` | 静态 | 测评说明纯静态内容 |
| API routes | 动态 | 排行榜读写 API |

## 部署

- **构建**: `next build`
- **启动**: `next start`
- **开发**: `next dev`
- **推荐平台**: Vercel 或任何支持 Node.js 的服务器

## 不使用的技术（有意省略）

- **数据库**: 不使用，排行榜用本地 JSON 文件即可满足需求
- **状态管理库**: 不使用 Redux/Zustand 等，React 内置 state 足够
- **CSS-in-JS**: 不使用 styled-components 等，Tailwind CSS 覆盖全部样式需求
- **认证系统**: 不使用，通过 submissionId 做轻量防重复
- **测试框架**: 当前未配置，后续可按需加入
