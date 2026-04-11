import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "用户协议 — SBTI 赛博人格测定局",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--emerald)]"
      >
        <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" />
        返回首页
      </Link>

      <h1 className="font-display text-3xl text-[var(--ink-strong)] sm:text-4xl">用户协议</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">最后更新：2025 年 1 月</p>

      <article className="prose-sbti mt-8 space-y-6 text-sm leading-7 text-[var(--ink-soft)]">
        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">1. 服务性质</h2>
          <p>
            SBTI 赛博人格测定局（以下简称"本站"）是一个非营利性、开源的趣味人格测试项目。
            本站不提供任何付费服务，不涉及商业交易，所有功能均免费向公众开放。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">2. 使用条件</h2>
          <p>使用本站即表示您同意以下条件：</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>本站提供的测试结果仅供娱乐参考，不构成任何心理学、医学或职业方面的专业建议</li>
            <li>您不得将本站内容用于任何违法或侵害他人权益的目的</li>
            <li>您不得对本站进行恶意攻击、逆向工程或未经授权的自动化访问</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">3. 内容与知识产权</h2>
          <p>
            本站的题库与角色图片素材按 CC BY-NC-SA 协议共享。
            本站的界面设计与代码实现为开源项目，遵循项目仓库中声明的开源许可证。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">4. 非交互式声明</h2>
          <p>
            本站为单向信息展示与趣味测试工具，不提供用户注册、登录、评论、私信等社交交互功能。
            用户之间无法通过本站进行任何形式的直接沟通。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">5. 服务变更</h2>
          <p>
            本站保留随时修改、暂停或终止服务的权利，无需提前通知。
            我们不保证服务的持续可用性。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--ink-strong)]">6. 协议更新</h2>
          <p>
            本协议可能不定期更新。继续使用本站即视为接受更新后的协议内容。
            如对本协议有疑问，欢迎通过项目 GitHub 仓库提交 Issue。
          </p>
        </section>
      </article>
    </div>
  );
}
