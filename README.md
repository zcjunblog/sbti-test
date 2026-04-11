# SBTI 赛博人格测定局

SBTI 赛博人格测试站点，保留完整题库、27 种人格图鉴和隐藏分支，配合全新视觉系统和交互体验，让它在桌面端、移动端和社交裂变场景里都更能打。

> 本项目为非营利性开源项目，不收取任何费用，不投放广告，不收集个人信息。

## 特性

- **完整题库复刻** — 30 道标准计分题 + 2 道隐藏饮酒支线，本地判定逻辑完整还原
- **27 种赛博人格** — 25 种标准人格 + 2 种隐藏人格（DRUNK / HHHH），每种都有专属插画与描述
- **15 维画像系统** — 覆盖自我、情感、态度、行动与社交五大模型，答题后生成个性化维度报告
- **移动端优先** — 页面节奏、触控区域和字体层级针对手机端重新优化
- **裂变分享闭环** — 结果页支持复制链接、系统分享、一键海报下载（Canvas 绘制 1080×1600 PNG + 二维码）
- **本地排行榜** — 测试结果写入本地榜单，形成站内热度反馈，防重复提交

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.2 |
| 前端 | React + TypeScript | 19 / 5 |
| 样式 | Tailwind CSS | v4 |
| 字体 | Space Grotesk + Noto Serif SC | — |
| 图标 | Lucide React | 1.8 |
| 海报生成 | Canvas API + qrcode | — |
| 数据存储 | 服务端 JSON 文件 + 客户端 localStorage | — |

## 快速开始

```bash
# 克隆项目
git clone https://github.com/zcjunblog/sbti-cloudbase.git
cd sbti-cloudbase

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可访问。

### 生产部署

```bash
npm run build
npm run start
```

默认监听 3000 端口，可通过 `PORT` 环境变量修改。

> **注意：** 本项目使用文件系统存储排行榜数据，仅适合单实例部署。详见下方[已知限制](#已知限制与架构说明)。

## 项目结构

```
src/
├── app/                         # 页面路由
│   ├── page.tsx                 # 首页 — 项目介绍、走马灯、Top3 榜单
│   ├── test/page.tsx            # 测试页 — 逐题答题引擎
│   ├── result/[slug]/           # 结果页 — 人格详情、分享、榜单提交
│   ├── types/page.tsx           # 人格图鉴 — 浏览全部 27 种人格
│   ├── rankings/page.tsx        # 人气榜单 — 排名与占比统计
│   ├── about/page.tsx           # 测评说明 — 判定逻辑与维度解释
│   ├── legal/                   # 法律页面（用户协议、隐私政策、免责声明）
│   └── api/rankings/            # 排行榜 API（GET 读取 / POST 提交）
├── components/                  # UI 组件
│   ├── quiz-flow.tsx            # 测试流程（洗牌、答题、分支、跳转）
│   ├── result-panel.tsx         # 结果面板（展示、分享、海报、榜单）
│   ├── type-card.tsx            # 人格卡片（多尺寸）
│   ├── site-chrome.tsx          # 站点外壳（导航栏、页脚）
│   └── logo-mark.tsx            # Logo 组件
├── lib/                         # 业务逻辑
│   ├── quiz.ts                  # 测试引擎（洗牌、判定、15 维折算）
│   ├── sbti-data.ts             # 数据访问层（类型定义、导出）
│   └── rankings-store.ts        # 排行榜存储（JSON 读写、防重复）
└── data/                        # 静态数据
    ├── sbti-data.json           # 题库 + 人格类型 + 维度定义
    └── rankings-seed.json       # 排行榜种子数据
```

## 数据存储

| 数据 | 存储位置 | 说明 |
|------|----------|------|
| 题库与人格定义 | `src/data/sbti-data.json` | 静态数据，随代码版本管理 |
| 排行榜 | `data/rankings-store.json` | 运行时生成，首次启动从种子数据初始化 |
| 用户答题记录 | 浏览器 localStorage | 仅保存在用户本地，不上传服务器 |
| 测试结果快照 | 浏览器 localStorage | 用于结果页展示和分享，清除浏览器数据即删除 |

## 判定逻辑

1. **题目洗牌** — 30 道标准题随机排列，隐藏入口题随机插入，通常作答 31 题
2. **维度折算** — 15 个维度累计得分折算为 L / M / H 三档（≤3 → L，=4 → M，≥5 → H）
3. **距离匹配** — 与 25 种标准人格模板做数值距离计算，按距离升序排列
4. **隐藏分支** — 命中饮酒支线触发 DRUNK；最高匹配度 < 60% 时兜底为 HHHH

## 已知限制与架构说明

### 文件存储的并发风险

排行榜数据存储在单个 JSON 文件（`data/rankings-store.json`）中。代码内通过 Promise 写入队列（`writeQueue`）在**单进程内**串行化写入操作，防止并发覆盖。

| 部署方式 | 是否安全 | 说明 |
|----------|----------|------|
| 单实例 `next start` | ✅ 安全 | 单进程，writeQueue 有效串行化 |
| PM2 cluster / 多容器 | ❌ 数据丢失风险 | 各进程有独立 writeQueue，文件写入会互相覆盖 |
| Serverless（Vercel / Lambda） | ❌ 不适用 | 每次请求可能是新进程，且临时文件系统不持久 |

### submissions 记录无限增长

`rankings-store.json` 中的 `submissions` 对象用于去重检测，**每次提交都会追加记录且永不清理**。随着提交量增长，文件体积会持续膨胀（10 万次提交 ≈ 15MB），导致每次读写的序列化/反序列化开销增大。

### 建议的演进方向

如果需要支持更高并发或多实例部署，建议将排行榜存储迁移至：

- **SQLite**（轻量级，单文件，内建并发写入锁，适合中等规模）
- **PostgreSQL / MySQL**（适合高并发、多实例、生产环境）

## 可用脚本

```bash
npm run dev      # 启动开发服务器（支持热更新）
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # ESLint 代码检查
```

## 素材说明

站内插画与题库内容按 **CC BY-NC-SA** 方式共享，适合学习、展示和非商业化的二次创作部署。

## 法律声明

本站为非营利性开源项目：

- [用户协议](/legal/terms) — 服务性质、使用条件、非交互式声明
- [隐私政策](/legal/privacy) — 不收集个人信息、不使用第三方追踪
- [免责声明](/legal/disclaimer) — 测试结果仅供娱乐，不构成专业建议

## License

本项目代码部分开源，素材部分遵循 CC BY-NC-SA 协议。
