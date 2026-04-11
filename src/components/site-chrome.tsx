"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { LogoMark } from "@/components/logo-mark";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/test", label: "开始测试" },
  { href: "/types", label: "人格图鉴" },
  { href: "/rankings", label: "人气榜单" },
  { href: "/about", label: "测评说明" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(196,148,92,0.26),rgba(196,148,92,0))]" />
        <div className="absolute -left-20 top-48 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(21,102,89,0.18),rgba(21,102,89,0))]" />
        <div className="absolute right-[-6rem] top-72 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(231,214,188,0.72),rgba(231,214,188,0))]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-black/6 bg-[rgba(248,241,228,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <LogoMark />
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-black/6 bg-white/70 p-1.5 shadow-[0_12px_35px_rgba(17,24,39,0.06)] md:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--emerald)] !text-white shadow-[0_12px_24px_rgba(6,63,55,0.22)]"
                      : "text-[var(--ink-soft)] hover:bg-black/4 hover:text-[var(--ink-strong)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/test"
              className="hidden rounded-full border border-[var(--emerald)]/15 bg-[var(--emerald)] px-5 py-3 text-sm font-semibold !text-white shadow-[0_16px_30px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)] sm:inline-flex"
            >
              立即开测
            </Link>
            <button
              type="button"
              onClick={() => setOpenPath(open ? null : pathname)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white/80 text-[var(--ink-strong)] md:hidden"
              aria-label={open ? "关闭菜单" : "打开菜单"}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-black/6 bg-[rgba(248,241,228,0.96)] px-4 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-[var(--emerald)] !text-white"
                        : "bg-white/72 text-[var(--ink-soft)]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-black/6 bg-[rgba(252,248,240,0.88)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-3">
              <LogoMark compact />
              <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                基于 SBTI 赛博人格测试的题库与类型素材重新设计，
                针对桌面端与移动端做了排版重构，并补齐了本地榜单、裂变分享和结果海报能力。
              </p>
              <a
                href="https://github.com/zcjunblog/sbti-cloudbase"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--emerald)]"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                GitHub
              </a>
            </div>
            <div className="space-y-2 text-sm text-[var(--ink-soft)]">
              <p>题库与角色图片素材按 CC BY-NC-SA 方式共享。</p>
              <p>本站为非营利性开源项目，不收集个人信息，不提供付费服务。</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/6 pt-6 text-xs text-[var(--ink-soft)]">
            <Link href="/legal/terms" className="transition hover:text-[var(--emerald)]">用户协议</Link>
            <span className="text-black/15">|</span>
            <Link href="/legal/privacy" className="transition hover:text-[var(--emerald)]">隐私政策</Link>
            <span className="text-black/15">|</span>
            <Link href="/legal/disclaimer" className="transition hover:text-[var(--emerald)]">免责声明</Link>
            <span className="ml-auto text-black/30">&copy; {new Date().getFullYear()} SBTI Cloudbase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
