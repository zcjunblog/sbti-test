# SBTI 赛博人格测定局 - 技术栈（纯静态 / GitHub Pages 分支）

> **职责**: 记录项目使用的技术栈。写任何代码前应了解当前技术栈，避免引入不兼容的依赖。

> **重要变更（local 分支）**: 已彻底移除 CloudBase 服务端依赖。榜单数据全部来自本地种子文件，部署到 GitHub Pages。

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

## 云端服务

无。已移除全部 CloudBase 依赖（云函数 / 云数据库 / 云接入 / @cloudbase/node-sdk）。
原 `functions/`、`scripts/`、`cloudbaserc.json` 已删除。

## 数据存储

| 方式 | 用途 |
|------|------|
| **静态 JSON** `src/data/sbti-data.json` | 题库、人格类型、维度定义 |
| **静态 JSON** `src/data/rankings-seed.json` | 排行榜数据（构建时即最终数据，`fetchRankings` 直接返回） |
| **localStorage** | 客户端结果快照暂存 |

## 渲染策略

| 页面 | 策略 | 说明 |
|------|------|------|
| 所有页面 | **静态导出** | `output: "export"` 生成纯 HTML |
| `/result/[slug]` | **SSG** | `generateStaticParams` 预渲染 27 个页面 |
| 首页 Top3 | **CSR** | 客户端 `useEffect` 调用 `fetchRankings()`（读本地种子） |
| 排行榜页 | **CSR** | 客户端 `useEffect` 调用 `fetchRankings()`（读本地种子） |
| 结果页榜单提交 | **CSR** | `submitRanking()` 回显本地种子数据，不写远端 |

## 部署

| 步骤 | 命令/操作 |
|------|-----------|
| 构建 | `npm run build`（生成 `out/` 目录） |
| 托管 | GitHub Pages，由 `.github/workflows/deploy.yml` 自动构建并部署 |
| 触发 | push 到 `local` 分支，或手动 `workflow_dispatch` |
| 本地预览 | `npx serve out` |
| 开发模式 | `npm run dev` |

## 不使用的技术（有意省略）

- **Node.js 运行时**: 静态导出，不需要服务端
- **任何后端 / API**: 榜单数据为构建时静态种子
- **状态管理库**: React 内置 state 足够
- **认证系统**: 无服务端，结果快照仅存于 localStorage
