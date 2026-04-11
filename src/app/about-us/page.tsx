import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Coffee, CodeSquare, Heart, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "关于我们 — SBTI 赛博人格测定局",
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--emerald)]"
      >
        <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" />
        返回首页
      </Link>

      <h1 className="font-display text-3xl text-[var(--ink-strong)] sm:text-4xl">关于我们</h1>

      <div className="mt-10 space-y-12">
        {/* 项目介绍 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--emerald)]/10 text-[var(--emerald)]">
              <Heart size={18} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink-strong)]">这是什么项目</h2>
          </div>
          <div className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <p>
              SBTI 赛博人格测定局是一个趣味人格测试站点，通过 30 道题目和 15 个维度，
              帮你匹配到 27 种赛博人格中最像你的那一种。
            </p>
            <p>
              这个项目完全是出于个人兴趣搭建的，非营利、非商业，不收集任何个人信息。
              所有测试判定都在你的浏览器本地完成，我们甚至不知道你选了什么。
            </p>
          </div>
        </section>

        {/* 开源 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--emerald)]/10 text-[var(--emerald)]">
              <CodeSquare size={18} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink-strong)]">项目已开源</h2>
          </div>
          <div className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <p>
              项目代码已在 GitHub 开源，欢迎 Star、Fork 和提 Issue。
              如果你也想搭一个类似的测试站点，可以直接拿去用。
            </p>
            <a
              href="https://github.com/zcjunblog/sbti-cloudbase"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[var(--paper-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-white"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              查看 GitHub 仓库
            </a>
            <p className="text-xs text-[var(--ink-soft)]">
              题库与角色素材按 CC BY-NC-SA 协议共享，代码部分开源。
            </p>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--emerald)]/10 text-[var(--emerald)]">
              <MessageCircle size={18} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink-strong)]">提建议 / 聊一聊</h2>
          </div>
          <div className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <p>
              遇到 Bug、有功能建议、或者单纯想聊聊，都可以加微信找我。
              也可以在 GitHub 仓库提 Issue。
            </p>
            <div className="inline-flex flex-col items-center gap-2 rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <div className="relative h-40 w-40 overflow-hidden rounded-[16px]">
                <Image
                  src="/brand/wechat-qr.png"
                  alt="微信二维码"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-xs text-[var(--ink-soft)]">微信扫码添加好友</p>
            </div>
          </div>
        </section>

        {/* 请我喝咖啡 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--gold-mist)] text-[var(--emerald)]">
              <Coffee size={18} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink-strong)]">请我喝杯咖啡</h2>
          </div>
          <div className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <p>
              这个项目完全免费，服务器费用也是自掏腰包。
              如果你觉得测试好玩、或者这个项目对你有帮助，可以请我喝杯咖啡，给我一点继续维护的动力。
            </p>
            <p>
              当然完全不打赏也没关系，转发给朋友就是最好的支持。
            </p>
            <div className="inline-flex flex-col items-center gap-2 rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <div className="relative h-48 w-48 overflow-hidden rounded-[16px]">
                <Image
                  src="/brand/coffee-qr.png"
                  alt="赞赏码"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-xs text-[var(--ink-soft)]">微信扫码赞赏</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
