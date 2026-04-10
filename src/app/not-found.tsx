import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
      <div className="panel rounded-[40px] px-6 py-12 sm:px-10 sm:py-16">
        <p className="eyebrow justify-center">404</p>
        <h1 className="mt-4 font-display text-4xl text-[var(--ink-strong)] sm:text-5xl">
          这个人格档案页没有被系统找到
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
          你可能点进了一个不存在的结果链接，或者这个 slug 被输错了。
          先回首页重新测试，或者去人格图鉴里直接浏览。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[var(--emerald)] px-6 py-3 text-sm font-semibold !text-white shadow-[0_18px_32px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)]"
          >
            返回首页
          </Link>
          <Link
            href="/types"
            className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white/74 px-6 py-3 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-white"
          >
            查看人格图鉴
          </Link>
        </div>
      </div>
    </div>
  );
}
