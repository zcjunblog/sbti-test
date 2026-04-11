import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "隐私政策 — SBTI 赛博人格测定局",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--emerald)]"
      >
        <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" />
        返回首页
      </Link>

      <h1 className="font-display text-3xl text-[var(--ink-strong)] sm:text-4xl">隐私政策</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">最后更新：2025 年 1 月</p>

      <article className="prose-sbti mt-8 space-y-6 text-sm leading-7 text-[var(--ink-soft)]">
        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">1. 概述</h2>
          <p>
            SBTI 赛博人格测定局（以下简称"本站"）是一个非营利性、开源的趣味人格测试项目。
            我们高度重视用户隐私，承诺最大限度地减少数据收集。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">2. 我们收集的信息</h2>
          <p>本站不要求用户注册账号，不收集以下信息：</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>姓名、邮箱、手机号等个人身份信息</li>
            <li>支付信息或财务数据</li>
            <li>精确地理位置</li>
          </ul>
          <p>
            本站可能通过服务端日志记录基本的访问数据（如 IP 地址、浏览器类型、访问时间），
            这些数据仅用于维护服务稳定性，不会用于识别个人身份。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">3. 测试数据</h2>
          <p>
            您的测试答题记录仅保存在您的浏览器本地存储（localStorage）中，
            不会上传至任何服务器。清除浏览器数据即可完全删除。
            匿名的测试结果统计数据（如各人格类型的分布比例）可能被聚合用于展示排行榜，
            但不包含任何可识别个人的信息。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">4. Cookie 与追踪</h2>
          <p>
            本站不使用第三方分析工具（如 Google Analytics），不设置追踪 Cookie，
            不嵌入第三方广告脚本。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">5. 数据共享</h2>
          <p>
            我们不会将任何用户数据出售、出租或以其他方式提供给第三方。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">6. 联系方式</h2>
          <p>
            如对本隐私政策有任何疑问，欢迎通过项目 GitHub 仓库提交 Issue 与我们联系。
          </p>
        </section>
      </article>
    </div>
  );
}
