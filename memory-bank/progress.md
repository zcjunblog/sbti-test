# SBTI 赛博人格测定局 - 进度记录（CloudBase 分支）

> **职责**: 记录已完成的步骤和里程碑。每完成一个步骤后必须更新本文件。

---

## 当前状态: CloudBase 部署完成，线上运行中

项目已从本地 JSON 文件存储迁移到腾讯云 CloudBase（静态托管 + 云函数 + 云数据库），线上可访问。

---

## 已完成的里程碑

### [2026-04-10] 基础功能全部完成（main 分支）
- [x] 项目初始化与核心功能开发
- [x] 测试引擎、结果展示、分享系统、排行榜
- [x] 所有页面（首页、测试、结果、图鉴、榜单、说明）

### [2026-04-11] UI 优化与交互增强
- [x] 海报预览弹窗响应式优化（移动端适配）
- [x] 海报人格图片 contain 模式（不拉伸）
- [x] 人格图鉴详情页图片尺寸控制
- [x] 复制链接 toast 提示（黑色半透明居中，微信小程序风格）
- [x] 复制链接触感反馈（navigator.vibrate）
- [x] 答题选项按压反馈（active:scale + opacity）
- [x] 答题切换动画（选中高亮 → 淡出 → 下一题淡入）
- [x] 重新洗牌按钮旋转动画 + 触感反馈
- [x] 自动入榜（进入结果页自动提交排行榜）

### [2026-04-11] 法律与内容合规
- [x] 创建用户协议、隐私政策、免责声明页面
- [x] 页脚添加 GitHub 链接和法律链接
- [x] 移除所有 sbti.dev 引用和"镜像"字样
- [x] 更新网站文案（面向用户而非开发者）

### [2026-04-11] CloudBase 迁移
- [x] `next.config.ts` 配置静态导出（output: "export"）
- [x] 动态路由添加 `generateStaticParams`
- [x] 创建 `src/lib/cloudbase-api.ts` 客户端 API 模块
- [x] 创建云函数 `sbti-rankings-get` 和 `sbti-rankings-submit`
- [x] 首页排行榜改为客户端获取（RankingsLeaders 组件）
- [x] 排行榜页面改为客户端获取（RankingsContent 组件）
- [x] 结果页提交逻辑改为调用云函数
- [x] 删除服务端代码（rankings-store.ts、api/ 目录）
- [x] 创建 `cloudbaserc.json` 部署配置
- [x] 创建数据库种子脚本
- [x] CloudBase 云数据库创建集合并导入种子数据（27 条）
- [x] 云函数部署（tcb fn deploy）
- [x] 云接入路由配置（HTTP GET/POST）
- [x] 静态网站托管部署
- [x] 自定义域名 sbti.x4v.cn 绑定
- [x] 云函数 CORS 清理（由云接入网关自动处理）
- [x] 修复 submit 函数 event.body 解析问题

---

## 已知问题

- 云函数冷启动可能导致首次加载排行榜较慢（约 1-2 秒）
- CloudBase 静态托管根路径只能部署一个网站

---

## 待开始的迭代方向

参见 `implementation-plan.md` 的"后续迭代方向"章节。
