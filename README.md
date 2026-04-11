# SBTI 赛博人格测定局

SBTI 赛博人格测试站点，保留完整题库、27 种人格图鉴和隐藏分支，配合全新视觉系统和交互体验，让它在桌面端、移动端和社交裂变场景里都更能打。

**线上地址**: [sbti.x4v.cn](https://sbti.x4v.cn)

> 本项目为非营利性开源项目，不收取任何费用，不投放广告，不收集个人信息。

## 特性

- **完整题库** — 30 道标准计分题 + 2 道隐藏饮酒支线，判定逻辑完整
- **27 种赛博人格** — 25 种标准人格 + 2 种隐藏人格（DRUNK / HHHH），每种都有专属插画与描述
- **15 维画像系统** — 覆盖自我、情感、态度、行动与社交五大模型，答题后生成个性化维度报告
- **移动端优先** — 页面节奏、触控区域和字体层级针对手机端重新优化
- **裂变分享闭环** — 结果页支持复制链接、系统分享、一键海报下载（Canvas 绘制 1080×1600 PNG + 二维码）
- **实时排行榜** — 测试结果自动入榜，基于云数据库实时统计，支持并发

## 架构

本项目采用 **静态前端 + Serverless 后端** 架构，部署在腾讯云 CloudBase 上：

```
用户浏览器
  ├── 静态页面（CloudBase 静态网站托管 / CDN）
  └── 排行榜数据（CloudBase 云函数 → 云数据库）
```

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Next.js 16 静态导出 | `output: "export"` 生成纯 HTML/CSS/JS |
| 后端 | CloudBase 云函数 | 事件函数 + 云接入路由 |
| 数据库 | CloudBase 文档型数据库 | 类 MongoDB，ADMINONLY 权限 |
| 托管 | CloudBase 静态网站托管 | CDN 加速 |

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router, Static Export) | 16.2 |
| 前端 | React + TypeScript | 19 / 5 |
| 样式 | Tailwind CSS | v4 |
| 字体 | Space Grotesk + Noto Serif SC | — |
| 图标 | Lucide React | 1.8 |
| 海报生成 | Canvas API + qrcode | — |
| 云服务 | 腾讯云 CloudBase | — |
| 云函数 SDK | @cloudbase/node-sdk | 3.x |

## 项目结构

```
sbti-cloudbase/
├── functions/                   # CloudBase 云函数
│   ├── sbti-rankings-get/       # 查询排行榜（HTTP GET）
│   └── sbti-rankings-submit/    # 提交结果（HTTP POST）
├── scripts/                     # 工具脚本
│   └── seed-database.js         # 数据库种子数据导入
├── src/
│   ├── app/                     # 页面路由
│   │   ├── page.tsx             # 首页
│   │   ├── test/                # 测试页
│   │   ├── result/[slug]/       # 结果页（SSG，27 个静态页面）
│   │   ├── types/               # 人格图鉴
│   │   ├── rankings/            # 人气榜单
│   │   ├── about/               # 测评说明
│   │   └── legal/               # 法律页面
│   ├── components/              # UI 组件
│   │   ├── quiz-flow.tsx        # 测试流程（答题动画、触感反馈）
│   │   ├── result-panel.tsx     # 结果面板（分享、海报、自动入榜）
│   │   ├── rankings-leaders.tsx # 首页 Top3（客户端获取）
│   │   ├── rankings-content.tsx # 排行榜内容（客户端获取）
│   │   └── ...
│   ├── lib/
│   │   ├── cloudbase-api.ts     # CloudBase API 客户端
│   │   ├── quiz.ts              # 测试引擎（洗牌、判定、15 维折算）
│   │   └── sbti-data.ts         # 数据访问层
│   └── data/                    # 静态数据
├── cloudbaserc.json             # CloudBase 部署配置
└── next.config.ts               # Next.js 配置（静态导出）
```

## 云数据库设计

| 集合 | 文档数 | 权限 | 说明 |
|------|--------|------|------|
| `sbti-rankings` | 27 | ADMINONLY | 每个人格类型一条，记录 count |
| `sbti-submissions` | 动态增长 | ADMINONLY | 每次提交一条，_id = submissionId 天然去重 |

> rank 和 share 不存数据库，由 `sbti-rankings-get` 云函数实时计算。

## 快速开始

### 本地开发

```bash
git clone https://github.com/zcjunblog/sbti-cloudbase.git
cd sbti-cloudbase
npm install
npm run dev
```

> 排行榜功能需要 `.env.local` 中配置 `NEXT_PUBLIC_CLOUDBASE_ENV_ID`，否则排行榜区域为空。其他功能（答题、结果、图鉴）正常可用。

### 构建与预览

```bash
npm run build     # 静态导出到 out/ 目录
npx serve out     # 本地预览
```

## 部署到 CloudBase

### 1. 准备环境

- 创建 CloudBase 环境
- 在云数据库中创建 `sbti-rankings` 和 `sbti-submissions` 集合（ADMINONLY 权限）

### 2. 导入种子数据

```bash
npm install -g @cloudbase/cli
tcb login
# 使用 CLI 导入或运行种子脚本
```

### 3. 部署云函数

```bash
tcb fn deploy sbti-rankings-get --dir functions/sbti-rankings-get --runtime Nodejs18.15 -e <envId>
tcb fn deploy sbti-rankings-submit --dir functions/sbti-rankings-submit --runtime Nodejs18.15 -e <envId>
```

### 4. 配置云接入路由

```bash
tcb routes add -e <envId> --data '{"domain":"<envId>.service.tcloudbase.com","routes":[
  {"path":"/sbti-rankings-get","upstreamResourceType":"SCF","upstreamResourceName":"sbti-rankings-get"},
  {"path":"/sbti-rankings-submit","upstreamResourceType":"SCF","upstreamResourceName":"sbti-rankings-submit"}
]}'
```

### 5. 部署静态站点

配置 GitHub 自动构建或手动上传 `out/` 目录到静态网站托管。

构建时需设置环境变量：`NEXT_PUBLIC_CLOUDBASE_ENV_ID=<envId>`

## 判定逻辑

1. **题目洗牌** — 30 道标准题随机排列，隐藏入口题随机插入，通常作答 31 题
2. **维度折算** — 15 个维度累计得分折算为 L / M / H 三档（≤3 → L，=4 → M，≥5 → H）
3. **距离匹配** — 与 25 种标准人格模板做数值距离计算，按距离升序排列
4. **隐藏分支** — 命中饮酒支线触发 DRUNK；最高匹配度 < 60% 时兜底为 HHHH

## 可用脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 静态导出到 out/
npm run lint     # ESLint 代码检查
```

## 素材说明

站内插画与题库内容按 **CC BY-NC-SA** 方式共享，适合学习、展示和非商业化的二次创作部署。

## 法律声明

本站为非营利性开源项目：

- [用户协议](https://sbti.x4v.cn/legal/terms/) — 服务性质、使用条件、非交互式声明
- [隐私政策](https://sbti.x4v.cn/legal/privacy/) — 不收集个人信息、不使用第三方追踪
- [免责声明](https://sbti.x4v.cn/legal/disclaimer/) — 测试结果仅供娱乐，不构成专业建议

## License

本项目代码部分开源，素材部分遵循 CC BY-NC-SA 协议。
