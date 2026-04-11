# SBTI 赛博人格测定局 - 架构文档

> **职责**: 记录项目中每个文件的作用，包含完整的数据结构定义。写任何代码前必须完整阅读本文件。每完成一个重大功能或里程碑后，必须更新本文件。

---

## 项目目录结构

```
sbti-cloudbase/
├── CLAUDE.md                    # Claude AI 指令文件，指向 AGENTS.md
├── AGENTS.md                    # AI 代理规则（Next.js 16 breaking changes 警告）
├── README.md                    # 项目说明（默认 create-next-app 模板）
├── package.json                 # 依赖管理与脚本
├── tsconfig.json                # TypeScript 配置（target ES2017, paths @/* → ./src/*）
├── next.config.ts               # Next.js 配置（当前为空配置）
├── postcss.config.mjs           # PostCSS 配置（@tailwindcss/postcss 插件）
├── eslint.config.mjs            # ESLint 配置（eslint-config-next）
│
├── memory-bank/                 # 项目记忆库（AI 上下文文档）
│   ├── app-design-document.md   # 设计文档 — 应用结构和意图
│   ├── tech-stack.md            # 技术栈 — 依赖和选型说明
│   ├── implementation-plan.md   # 实施计划 — 分步指令
│   ├── progress.md              # 进度记录 — 已完成步骤
│   └── architecture.md          # 架构文档 — 本文件，每个文件的作用
│
├── public/                      # 静态资源
│   ├── brand/
│   │   └── sbti-logo.svg        # 站点 Logo SVG
│   └── images/
│       └── types/               # 27 种人格类型的插画图片
│           ├── {slug}.webp      # 每种人格对应一张插画
│           └── ...
│
├── data/                        # 运行时数据（服务端写入）
│   └── rankings-store.json      # 排行榜持久化存储（运行时动态生成和更新）
│
├── scripts/                     # 工具脚本目录
│
├── src/                         # 源代码根目录
│   ├── app/                     # Next.js App Router 页面
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 首页
│   │   ├── globals.css          # 全局样式
│   │   ├── not-found.tsx        # 404 页面
│   │   ├── test/
│   │   │   └── page.tsx         # 测试页面
│   │   ├── result/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # 结果页面（动态路由）
│   │   ├── types/
│   │   │   └── page.tsx         # 人格图鉴页
│   │   ├── rankings/
│   │   │   └── page.tsx         # 人气榜单页
│   │   ├── about/
│   │   │   └── page.tsx         # 测评说明页
│   │   └── api/
│   │       └── rankings/
│   │           ├── route.ts     # GET /api/rankings — 读取排行榜
│   │           └── submit/
│   │               └── route.ts # POST /api/rankings/submit — 提交结果
│   │
│   ├── components/              # React 组件
│   │   ├── site-chrome.tsx      # 站点外壳（header + nav + mobile menu + footer）
│   │   ├── quiz-flow.tsx        # 测试流程组件（答题引擎）
│   │   ├── result-panel.tsx     # 结果展示面板（含分享和榜单提交）
│   │   ├── type-card.tsx        # 人格类型卡片（多尺寸）
│   │   └── logo-mark.tsx        # Logo 组件
│   │
│   ├── lib/                     # 业务逻辑和工具函数
│   │   ├── sbti-data.ts         # 数据访问层（类型定义 + 数据导出 + 辅助函数）
│   │   ├── quiz.ts              # 测试引擎（洗牌、分支、判定、结果快照）
│   │   └── rankings-store.ts    # 排行榜存储层（JSON 文件读写 + 防重复 + 排名计算）
│   │
│   └── data/                    # 静态数据文件
│       ├── sbti-data.json       # 核心数据（题库 + 人格类型 + 维度定义）
│       └── rankings-seed.json   # 排行榜种子数据
│
└── tmp/                         # 临时文件（构建产物等）
```

---

## 文件详细说明

### 页面文件 (`src/app/`)

#### `layout.tsx` — 根布局
- 导入 Space Grotesk 和 Noto Serif SC 字体 CSS
- 导入全局样式 `globals.css`
- 设置 `<html lang="zh-CN">`
- 用 `<SiteChrome>` 包裹所有子页面
- 定义全站 metadata（title template: "%s | SBTI"）

#### `page.tsx` — 首页
- **渲染策略**: `force-dynamic`（需要读取实时排行榜数据）
- **Server Component**: 在服务端调用 `getRankingsSnapshot()` 获取 Top3
- **区块**: Hero（标题 + CTA）、数据指标卡片（4项）、能力展示卡片（4项）、人格走马灯、维度说明（5大模型 × 15维度）

#### `test/page.tsx` — 测试页面
- 静态壳 + 客户端 `<QuizFlow />` 组件
- 显示测试说明和题量信息

#### `result/[slug]/page.tsx` — 结果页面
- **动态路由**: 根据 slug 查找人格类型
- 如果 slug 无效则 `notFound()`
- 获取 3 个推荐类型传给 `<ResultPanel />`

#### `types/page.tsx` — 人格图鉴页
- 分为标准人格（25种）和隐藏人格（2种）两个网格
- 使用 `<TypeCard size="small" />` 展示

#### `rankings/page.tsx` — 人气榜单页
- **渲染策略**: `force-dynamic`
- 统计信息（累计结果数、榜单类型数、最后更新时间）
- Top3 卡片 + 完整排名列表（可点击跳转结果页）

#### `about/page.tsx` — 测评说明页
- 题库结构介绍（标准题数、维度数、类型数）
- 判定流程说明（题面采样、维度折算、分支兜底）
- 15 维度详解（5大模型分组）
- 隐藏分支说明（DRUNK、HHHH）
- 授权说明（CC BY-NC-SA）

#### `not-found.tsx` — 404 页面
- 提示用户 slug 可能无效
- 提供返回首页和查看图鉴的链接

### API 路由 (`src/app/api/`)

#### `rankings/route.ts` — 排行榜读取 API
- **方法**: GET
- **响应**: `RankingsSnapshot` JSON
- **渲染**: `force-dynamic`

#### `rankings/submit/route.ts` — 排行榜提交 API
- **方法**: POST
- **请求体**: `{ submissionId: string, finalTypeCode: string }`
- **响应**: 成功返回 `{ accepted: true, entry: RankingEntry }`，失败返回 `{ accepted: false, reason: string }`
- **校验**: submissionId 非空、finalTypeCode 有效、防重复

### 组件文件 (`src/components/`)

#### `site-chrome.tsx` — 站点外壳
- **类型**: Client Component（使用 `usePathname` 做导航高亮）
- **导航项**: 首页、开始测试、人格图鉴、人气榜单、测评说明
- **功能**: 桌面端胶囊导航、移动端汉堡菜单、固定 header、footer
- **背景装饰**: 三个渐变圆形光晕

#### `quiz-flow.tsx` — 测试流程组件
- **类型**: Client Component
- **状态**: baseDeck, deck, answers, index, started, startTip, isPending
- **开始前**: 测试说明 + "开始测我"按钮 + "重新洗牌题序"按钮
- **进行中**: 进度条 + 当前题目 + 选项按钮 + "重来一次"按钮
- **完成时**: 调用 `computeResult` → `buildResultSnapshot` → `writeResultSnapshot` → 路由跳转到结果页
- **分支逻辑**: 每次选择后调用 `hydrateQuestionDeck` 动态更新题目列表

#### `result-panel.tsx` — 结果展示面板
- **类型**: Client Component
- **功能**:
  - 从 localStorage 读取 ResultSnapshot，与当前页面类型匹配
  - 展示人格卡片（插画 + 类型信息）
  - 三种分享方式（复制链接、系统分享、海报预览/下载）
  - Canvas 海报渲染（1080×1600 PNG + QRCode）
  - 榜单提交（fetch POST → /api/rankings/submit）
  - 15 维画像展示（个性化或标准模板）
  - 推荐类型列表
  - 海报预览弹窗

#### `type-card.tsx` — 人格类型卡片
- **尺寸**: default / small / marquee / compact
- **展示**: 插画、类型标签、中文名、简介、描述、排名/人数/占比（可选）
- **交互**: 可链接（Link 包裹）或纯展示（article）

#### `logo-mark.tsx` — Logo 组件
- **模式**: 完整版（Logo + 文字）/ compact（仅 Logo）
- Logo 图片: `/brand/sbti-logo.svg`

### 业务逻辑 (`src/lib/`)

#### `sbti-data.ts` — 数据访问层
- **导入**: `sbti-data.json` 和 `rankings-seed.json`
- **类型导出**: Level, QuestionOption, Question, CanonicalItem, SbtiType, RankingEntry, RankingsSnapshot
- **数据导出**: dimensionOrder, dimensionMeta, dimensionExplanations, questions, specialQuestions, types, typeByCode, typeBySlug, normalTypes, featuredTypes, dimensionGroups
- **常量**: requiredQuestionCount, standardQuestionCount, maxQuestionCount, guaranteedQuestionCount
- **函数**: getDisplayCode, getTypeBySlug, getSuggestedTypes

#### `quiz.ts` — 测试引擎
- **常量**: `RESULT_SNAPSHOT_KEY = "sbti:result-snapshot:v1"`
- **类型**: QuizAnswers, RankedType, ResultSnapshot, ComputedResult
- **核心函数**:
  - `buildQuestionDeck()`: 洗牌标准题 + 随机位置插入隐藏入口题
  - `hydrateQuestionDeck(baseDeck, answers)`: 当入口题选 value=3 时追加跟进题
  - `computeResult(answers)`: 
    - 计算 15 维原始得分
    - 折算 L/M/H 级别（<=3→L, =4→M, >=5→H）
    - 与 25 种标准人格做距离匹配
    - 排序: 距离升序 → 精准命中数降序 → 相似度降序
    - 隐藏判定: 饮酒→DRUNK, 相似度<60%→HHHH
  - `buildResultSnapshot(result, submissionId)`: 构建持久化快照
  - `getPersonalizedDimensionItems(snapshot)`: 获取个性化维度解释
  - `readResultSnapshot() / writeResultSnapshot() / clearResultSnapshot()`: localStorage 操作
  - `createSubmissionId()`: crypto.randomUUID() 或 fallback

#### `rankings-store.ts` — 排行榜存储层
- **存储路径**: `data/rankings-store.json`
- **数据结构**: `{ snapshot: RankingsSnapshot, submissions: Record<string, SubmissionRecord> }`
- **写入队列**: 使用 Promise 链保证并发安全
- **核心函数**:
  - `getRankingsSnapshot()`: 读取当前排行榜快照
  - `submitRankingSubmission(input)`: 提交新结果，防重复，重建排名

### 样式文件

#### `globals.css` — 全局样式
- CSS 变量: --paper, --paper-strong, --ink-strong, --ink-soft, --emerald, --emerald-strong, --gold, --gold-light, --gold-mist, --font-ui, --font-display
- Tailwind v4 @theme inline 配置
- 全局样式: body 背景渐变 + 网格纹理, .panel（毛玻璃卡片）, .eyebrow（小标签）
- 走马灯动画: .sbti-marquee-track（110s 无限循环）
- 无障碍: prefers-reduced-motion 禁用动画

### 数据文件 (`src/data/`)

#### `sbti-data.json` — 核心数据
- `dimensionOrder`: 15 个维度的排列顺序（字符串数组）
- `dimensionMeta`: 每个维度的元数据 `{ name: string, model: string }`
- `dimensionExplanations`: 每个维度在 L/M/H 三档的解释文本
- `questions`: 30 道标准计分题（每题有 dim 指向所属维度）
- `specialQuestions`: 2 道隐藏支线题（饮酒入口 + 饮酒跟进）
- `requiredQuestionCount`: 31（通常作答题数）
- `types`: 27 种人格类型（25 标准 + 2 隐藏）

#### `rankings-seed.json` — 排行榜种子数据
- 初始排行榜快照，包含预设的各类型人数和排名
- 用于首次启动时初始化 rankings-store.json

---

## 数据库结构（JSON 文件）

### rankings-store.json

```json
{
  "snapshot": {
    "totalSubmissions": number,
    "updatedAt": "ISO 8601 timestamp",
    "entries": [
      {
        "typeCode": "string (人格代号)",
        "slug": "string (URL slug)",
        "cn": "string (中文名)",
        "count": number,
        "rank": number,
        "share": number (0-1 小数)
      }
    ]
  },
  "submissions": {
    "[submissionId]": {
      "submittedAt": "ISO 8601 timestamp",
      "typeCode": "string"
    }
  }
}
```

### localStorage — sbti:result-snapshot:v1

```json
{
  "submissionId": "string (UUID)",
  "finalTypeCode": "string",
  "bestNormalCode": "string",
  "rawScores": { "[dimension]": number },
  "levels": { "[dimension]": "L|M|H" },
  "similarity": number (0-100),
  "exact": number (0-15),
  "special": boolean,
  "modeKicker": "string",
  "badge": "string",
  "sub": "string",
  "secondaryTypeCode": "string? (仅 DRUNK 时有值)",
  "rankingSubmission": {
    "submittedAt": "ISO 8601",
    "count": number,
    "rank": number
  }
}
```

---

## 关键设计决策

1. **纯本地计算**: 所有测试判定逻辑在客户端完成，不依赖远程 API
2. **JSON 文件存储**: 排行榜使用本地 JSON 文件而非数据库，简单但足够
3. **写入队列**: rankings-store.ts 用 Promise 链实现串行写入，避免并发冲突
4. **submissionId 防刷**: 每次测试生成唯一 ID，同一 ID 只能提交一次
5. **分支动态注入**: 题目列表不是预先固定的，而是根据答题实时水合
6. **Canvas 海报**: 不依赖第三方截图服务，纯客户端 Canvas 绘制
