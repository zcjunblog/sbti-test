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
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
          <div className="space-y-3">
            <LogoMark compact />
            <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              这是一个基于原始题库与类型素材重新设计的 SBTI 镜像站点，
              针对桌面端与移动端都做了排版重构，并补齐了本地榜单、裂变分享和结果海报能力。
            </p>
          </div>
          <div className="space-y-2 text-sm text-[var(--ink-soft)]">
            <p>题库与角色图片素材镜像自原站内容，按 CC BY-NC-SA 方式继续共享。</p>
            <p>本地部署后可直接用于测试、海报下载与社交传播。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
