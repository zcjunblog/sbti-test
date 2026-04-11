# SBTI 赛博人格测定局 - 实施计划

> **职责**: 为 AI 开发者提供分步实施指令。每一步小而具体，每一步都包含验证正确性的测试。严禁包含代码——只写清晰、具体的指令。先聚焦于基础功能，完整功能后面再加。

---

## 规则（Always 级别）

1. **写任何代码前必须完整阅读** `memory-bank/architecture.md`（包含完整文件结构）
2. **写任何代码前必须完整阅读** `memory-bank/app-design-document.md`（包含设计意图）
3. **每完成一个重大功能或里程碑后**，必须更新 `memory-bank/architecture.md`
4. **每完成一步后**，必须更新 `memory-bank/progress.md`
5. **Next.js 16 注意**: 写代码前查阅 `node_modules/next/dist/docs/` 中的相关指南，留意废弃通知
6. **Tailwind CSS v4 注意**: 使用 `@import "tailwindcss"` 语法，不使用 v3 的 `@tailwind` 指令

---

## 阶段一: 项目基础设施（已完成）

### 步骤 1.1: 初始化 Next.js 项目
- 使用 create-next-app 创建项目，选择 TypeScript + Tailwind CSS + App Router
- **验证**: `npm run dev` 能正常启动，浏览器访问 localhost:3000 看到默认页面

### 步骤 1.2: 安装核心依赖
- 安装 `@fontsource/space-grotesk`、`@fontsource/noto-serif-sc`、`clsx`、`lucide-react`、`qrcode`、`@types/qrcode`
- **验证**: `npm run build` 无错误

### 步骤 1.3: 配置全局样式
- 在 `src/app/globals.css` 中定义 CSS 变量（颜色、字体）和全局样式（.panel、.eyebrow 等）
- 配置 Tailwind v4 的 `@theme inline` 块
- **验证**: 页面背景色、字体正确应用

### 步骤 1.4: 配置根布局
- 在 `src/app/layout.tsx` 中导入字体 CSS，设置 `<html lang="zh-CN">`，包裹 SiteChrome
- **验证**: 所有页面共享统一的 header/footer

---

## 阶段二: 数据层（已完成）

### 步骤 2.1: 准备静态数据文件
- 将题库、人格类型、维度定义等数据整理为 `src/data/sbti-data.json`
- 准备排行榜种子数据 `src/data/rankings-seed.json`
- **验证**: JSON 文件格式正确，能被 TypeScript 正确导入

### 步骤 2.2: 创建数据访问层
- 创建 `src/lib/sbti-data.ts`，导出类型定义和数据访问函数
- 包括: dimensionOrder、dimensionMeta、questions、types、typeByCode、typeBySlug 等
- **验证**: 在任意组件中导入并打印，确认数据结构正确

### 步骤 2.3: 创建排行榜存储层
- 创建 `src/lib/rankings-store.ts`，实现 JSON 文件读写、防重复提交、排名重建
- **验证**: 手动调用 submitRankingSubmission 后，rankings-store.json 正确更新

---

## 阶段三: 测试引擎（已完成）

### 步骤 3.1: 创建测试核心逻辑
- 创建 `src/lib/quiz.ts`，实现:
  - `buildQuestionDeck()`: 随机洗牌 + 隐藏入口题随机插入
  - `hydrateQuestionDeck()`: 根据答案动态追加饮酒跟进题
  - `computeResult()`: 15 维折算 + 距离匹配 + 隐藏人格判定
  - `buildResultSnapshot()`: 构建结果快照
  - localStorage 读写工具函数
- **验证**: 单元测试或手动测试 computeResult，确认不同答题组合能正确匹配到对应人格

### 步骤 3.2: 创建测试流程组件
- 创建 `src/components/quiz-flow.tsx` 客户端组件
- 实现: 开始界面 → 逐题答题 → 进度条 → 完成后跳转结果页
- 支持重新洗牌和重来功能
- **验证**: 完整走一遍测试流程，确认能正确跳转到结果页

---

## 阶段四: 结果与分享（已完成）

### 步骤 4.1: 创建结果页面
- 创建 `src/app/result/[slug]/page.tsx` 动态路由页面
- 创建 `src/components/result-panel.tsx` 客户端组件
- 展示: 人格卡片、15 维画像、匹配信息
- **验证**: 访问 `/result/{任意有效slug}` 能正确显示人格信息

### 步骤 4.2: 实现分享功能
- 在 result-panel 中实现三种分享方式:
  - 复制链接（Clipboard API）
  - 系统分享（Web Share API，优先附带海报）
  - 海报下载（Canvas 绘制 + QRCode）
- **验证**: 在桌面端测试复制链接，在移动端测试系统分享和海报下载

### 步骤 4.3: 实现榜单提交
- 在结果页添加"加入榜单"按钮
- 调用 `/api/rankings/submit` API 提交结果
- 防重复提交（基于 submissionId）
- **验证**: 提交后排行榜数据正确更新，重复提交被拒绝

---

## 阶段五: 浏览与展示页面（已完成）

### 步骤 5.1: 创建人格图鉴页
- 创建 `src/app/types/page.tsx`
- 分标准人格和隐藏人格两个区块展示
- **验证**: 页面正确显示 25 种标准人格 + 2 种隐藏人格

### 步骤 5.2: 创建人气榜单页
- 创建 `src/app/rankings/page.tsx`
- 展示 Top3 卡片 + 完整排名列表
- **验证**: 页面正确显示排行数据，点击条目能跳转到对应结果页

### 步骤 5.3: 创建测评说明页
- 创建 `src/app/about/page.tsx`
- 展示题库结构、判定逻辑、隐藏分支说明
- **验证**: 页面正确显示所有说明内容

### 步骤 5.4: 完善首页
- 在 `src/app/page.tsx` 中集成:
  - Hero 区块 + CTA 按钮
  - 数据指标卡片
  - 能力展示卡片
  - 人格走马灯
  - 维度说明区块
  - Top3 实时榜单
- **验证**: 首页所有区块正确渲染，走马灯动画流畅

---

## 阶段六: API 层（已完成）

### 步骤 6.1: 创建排行榜 API
- 创建 `src/app/api/rankings/route.ts` (GET 读取)
- 创建 `src/app/api/rankings/submit/route.ts` (POST 提交)
- **验证**: 用 curl 或 Postman 测试 GET/POST 请求，确认响应格式正确

---

## 阶段七: 公共组件（已完成）

### 步骤 7.1: 创建站点外壳组件
- 创建 `src/components/site-chrome.tsx`（header + 导航 + 移动端菜单 + footer）
- **验证**: 导航链接正确高亮当前页面，移动端菜单正常展开/收起

### 步骤 7.2: 创建人格类型卡片组件
- 创建 `src/components/type-card.tsx`（支持多种尺寸: default/small/marquee/compact）
- **验证**: 在不同页面中以不同尺寸渲染，确认样式正确

### 步骤 7.3: 创建 Logo 组件
- 创建 `src/components/logo-mark.tsx`（支持 compact 模式）
- **验证**: header 和 footer 中正确显示

---

## 后续迭代方向（未开始）

以下是可以后续逐步加入的增强功能：

1. **SEO 优化**: 为每个结果页生成 Open Graph 元数据和社交预览图
2. **国际化**: 支持英文版本
3. **数据持久化升级**: 从 JSON 文件迁移到数据库（如 SQLite/PostgreSQL）
4. **用户系统**: 登录/注册，保存历史测试记录
5. **统计分析**: 答题时长、维度分布热力图、人格关联分析
6. **无障碍优化**: ARIA 标签完善、键盘导航、屏幕阅读器支持
7. **性能优化**: 图片懒加载优化、ISR 增量静态再生成
8. **测试覆盖**: 添加单元测试（Vitest）和端到端测试（Playwright）
9. **动画增强**: 页面过渡动画、答题切换动画
10. **管理后台**: 题库管理、排行榜管理、数据导出
