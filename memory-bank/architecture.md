# SBTI 赛博人格测定局 - 架构文档（纯静态 / GitHub Pages 分支）

> **重要变更（local 分支）**: 已移除全部 CloudBase 服务端依赖（`functions/`、`scripts/`、`cloudbaserc.json` 已删除）。榜单数据全部来自本地种子 `src/data/rankings-seed.json`，`src/lib/cloudbase-api.ts` 的 `fetchRankings`/`submitRanking` 已改为读取/回显本地种子，不再发起任何网络请求。部署方式改为 GitHub Pages（`.github/workflows/deploy.yml`）。

> **职责**: 记录项目中每个文件的作用，包含完整的数据结构定义。写任何代码前必须完整阅读本文件。每完成一个重大功能或里程碑后，必须更新本文件。

---

## 项目目录结构

```
sbti-cloudbase/
├── CLAUDE.md                    # Claude AI 指令文件
├── AGENTS.md                    # AI 代理规则（Next.js 16 breaking changes 警告）
├── README.md                    # 项目说明
├── package.json                 # 依赖管理与脚本
├── tsconfig.json                # TypeScript 配置（paths @/* → ./src/*）
├── next.config.ts               # Next.js 配置（output: "export", images: unoptimized, trailingSlash）
├── cloudbaserc.json             # CloudBase Framework 部署配置
├── .env.local                   # 环境变量（NEXT_PUBLIC_CLOUDBASE_ENV_ID，已 gitignore）
│
├── memory-bank/                 # 项目记忆库（AI 上下文文档）
│   ├── app-design-document.md   # 设计文档
│   ├── tech-stack.md            # 技术栈
│   ├── implementation-plan.md   # 实施计划
│   ├── progress.md              # 进度记录
│   └── architecture.md          # 架构文档（本文件）
│
├── functions/                   # CloudBase 云函数
│   ├── sbti-rankings-get/       # 查询排行榜
│   │   ├── index.js             # 查询 sbti-rankings 集合，计算 rank/share
│   │   └── package.json         # 依赖 @cloudbase/node-sdk
│   └── sbti-rankings-submit/    # 提交测试结果
│       ├── index.js             # 校验 → 去重 → 原子递增 → 返回排名
│       └── package.json         # 依赖 @cloudbase/node-sdk
│
├── scripts/                     # 工具脚本
│   ├── seed-database.js         # 数据库种子脚本（导入初始排行榜数据）
│   └── sbti-rankings-import.json # CLI 导入用的 NDJSON 文件
│
├── public/                      # 静态资源
│   ├── brand/sbti-logo.svg      # 站点 Logo
│   └── images/types/*.webp      # 27 种人格类型插画
│
├── out/                         # 构建产物（静态导出，gitignore）
│
├── src/
│   ├── app/                     # Next.js App Router 页面
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 首页（静态 + 客户端 RankingsLeaders）
│   │   ├── globals.css          # 全局样式
│   │   ├── not-found.tsx        # 404 页面
│   │   ├── test/page.tsx        # 测试页面
│   │   ├── result/[slug]/page.tsx # 结果页（SSG + Suspense）
│   │   ├── types/page.tsx       # 人格图鉴页
│   │   ├── rankings/page.tsx    # 人气榜单页（客户端 RankingsContent）
│   │   ├── about/page.tsx       # 测评说明页
│   │   └── legal/               # 法律页面
│   │       ├── terms/page.tsx   # 用户协议
│   │       ├── privacy/page.tsx # 隐私政策
│   │       └── disclaimer/page.tsx # 免责声明
│   │
│   ├── components/
│   │   ├── site-chrome.tsx      # 站点外壳（header + nav + footer + GitHub 链接 + 法律链接）
│   │   ├── quiz-flow.tsx        # 测试流程（答题动画、触感反馈、洗牌旋转）
│   │   ├── result-panel.tsx     # 结果面板（展示、分享、海报、自动入榜、toast）
│   │   ├── type-card.tsx        # 人格类型卡片（多尺寸）
│   │   ├── logo-mark.tsx        # Logo 组件
│   │   ├── rankings-leaders.tsx # 首页 Top3 客户端组件（带骨架屏）
│   │   └── rankings-content.tsx # 排行榜页面客户端组件（带骨架屏）
│   │
│   ├── lib/
│   │   ├── sbti-data.ts         # 数据访问层（类型定义 + 数据导出）
│   │   ├── quiz.ts              # 测试引擎（洗牌、分支、判定、结果快照）
│   │   └── cloudbase-api.ts     # 榜单数据访问（fetchRankings/submitRanking 均读本地种子，无网络请求）
│   │
│   └── data/
│       ├── sbti-data.json       # 核心数据（题库 + 人格类型 + 维度定义）
│       └── rankings-seed.json   # 排行榜种子数据
```

**已删除（相比 main 分支）**:
- `src/lib/rankings-store.ts` — 本地 JSON 文件读写，已迁移到云函数
- `src/app/api/` — Next.js API 路由，已迁移到云函数
- `data/rankings-store.json` — 本地排行榜文件，已迁移到云数据库

---

## 云函数说明（已废弃 — 仅作历史记录）

> ⚠️ local 分支已删除 `functions/` 与对应云数据库。以下内容保留以备将来恢复后端时参考，当前代码不再调用。

### `sbti-rankings-get` — 查询排行榜
- 查询 `sbti-rankings` 集合全部文档，按 count 降序
- 实时计算 totalSubmissions、rank、share
- 返回 `RankingsSnapshot` 对象
- 通过云接入路由暴露为 HTTP GET

### `sbti-rankings-submit` — 提交测试结果
- 从 `event.body` 解析 POST JSON（`{ submissionId, finalTypeCode }`）
- 校验 finalTypeCode 合法性（27 个有效值）
- 用 submissionId 作为 `_id` 插入 `sbti-submissions`（利用唯一约束去重）
- `_.inc(1)` 原子递增 `sbti-rankings` 对应文档的 count
- 读回排名返回给客户端
- 通过云接入路由暴露为 HTTP POST

---

## 云数据库集合（已废弃 — 仅作历史记录）

> ⚠️ local 分支已不使用云数据库，榜单数据由 `src/data/rankings-seed.json` 提供。

### `sbti-rankings`（ADMINONLY 权限）
| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | string | typeCode（如 "SEXY"） |
| `typeCode` | string | 人格代号 |
| `slug` | string | URL slug |
| `cn` | string | 中文名 |
| `count` | number | 提交总数 |

### `sbti-submissions`（ADMINONLY 权限）
| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | string | submissionId（UUID，天然去重） |
| `typeCode` | string | 人格代号 |
| `submittedAt` | string | ISO 8601 时间戳 |

---

## 关键设计决策

1. **静态导出**: `output: "export"` 生成纯静态 HTML，部署到 CDN，无需 Node.js 运行时
2. **客户端数据获取**: 排行榜数据通过客户端组件 useEffect 调用云函数，不阻塞首屏渲染
3. **云函数事件模式**: 使用事件函数（非 HTTP 函数），通过云接入路由暴露 HTTP 端点，CORS 由网关自动处理
4. **原子递增**: `_.inc(1)` 保证并发安全，无需锁或队列
5. **_id 去重**: submissionId 直接作为文档 _id，数据库唯一约束天然防重
6. **自动入榜**: 用户进入结果页后自动提交，无需手动点击
7. **纯客户端计算**: 所有测试判定逻辑在浏览器完成，不依赖服务端
