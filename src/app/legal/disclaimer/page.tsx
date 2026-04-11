import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "免责声明 — SBTI 赛博人格测定局",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--emerald)]"
      >
        <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" />
        返回首页
      </Link>

      <h1 className="font-display text-3xl text-[var(--ink-strong)] sm:text-4xl">免责声明</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">最后更新：2025 年 1 月</p>

      <article className="prose-sbti mt-8 space-y-6 text-sm leading-7 text-[var(--ink-soft)]">
        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">1. 娱乐性质</h2>
          <p>
            本站提供的"赛博人格测试"及所有测试结果均为趣味娱乐内容，
            不具备任何科学性、医学性或心理学诊断价值。测试结果不应被用作：
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>心理健康评估或诊断依据</li>
            <li>职业规划或人才选拔的参考标准</li>
            <li>人际关系决策的判断依据</li>
            <li>任何形式的专业建议替代品</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">2. 非营利声明</h2>
          <p>
            本站为完全非营利性的开源项目，不收取任何费用，不接受打赏或捐赠，
            不投放广告，不进行任何形式的商业变现。
            项目维护者以个人兴趣驱动开发，不承担任何商业义务。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">3. 内容来源</h2>
          <p>
            本站的题库与角色素材按 CC BY-NC-SA 协议共享。
            如内容创作者认为本站的使用方式不当，请通过 GitHub 仓库联系我们，
            我们将及时协商处理。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">4. 服务可用性</h2>
          <p>
            本站以"按现状"方式提供服务，不做任何形式的可用性、准确性或完整性保证。
            我们不对因使用本站而产生的任何直接或间接损失承担责任，包括但不限于：
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>服务中断或数据丢失</li>
            <li>测试结果引起的任何误解或不适</li>
            <li>因分享测试结果而产生的社交影响</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">5. 第三方内容</h2>
          <p>
            本站可能包含指向第三方网站的链接（如 GitHub）。
            我们不对第三方网站的内容、隐私政策或可用性负责。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">6. 联系方式</h2>
          <p>
            如有任何疑问或建议，欢迎通过项目 GitHub 仓库提交 Issue 与我们联系。
          </p>
        </section>
      </article>
    </div>
  );
}
