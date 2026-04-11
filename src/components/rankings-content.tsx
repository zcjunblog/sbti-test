"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { TypeCard } from "@/components/type-card";
import { typeByCode, type RankingsSnapshot } from "@/lib/sbti-data";
import { fetchRankings } from "@/lib/cloudbase-api";

export function RankingsContent() {
  const [snapshot, setSnapshot] = useState<RankingsSnapshot | null>(null);

  useEffect(() => {
    fetchRankings().then(setSnapshot).catch(() => {});
  }, []);

  if (!snapshot) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <section className="panel rounded-[40px] p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">人气榜单</p>
          <div className="mt-4">
            <h1 className="font-display text-4xl leading-tight text-[var(--ink-strong)] sm:text-5xl">
              看看哪种人格，正在这套测试里最抢戏
            </h1>
            <div className="mt-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-[26px] border border-black/6 bg-[var(--paper-strong)]" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const topThree = snapshot.entries.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="panel rounded-[40px] p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">人气榜单</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="font-display text-4xl leading-tight text-[var(--ink-strong)] sm:text-5xl">
              看看哪种人格，正在这套测试里最抢戏
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
              榜单数据来自本站提交记录。结果页提交一次后，排名和占比都会实时更新，更适合做站内传播和持续运营。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <article className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--emerald)]">累计结果</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--ink-strong)]">
                {snapshot.totalSubmissions.toLocaleString("zh-CN")}
              </p>
            </article>
            <article className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--emerald)]">榜单类型数</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--ink-strong)]">
                {snapshot.entries.length}
              </p>
            </article>
            <article className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--emerald)]">最后更新</p>
              <p className="mt-3 text-base font-semibold leading-7 text-[var(--ink-strong)]">
                {new Date(snapshot.updatedAt).toLocaleString("zh-CN")}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Top 3</p>
            <h2 className="mt-2 font-display text-4xl text-[var(--ink-strong)]">
              当前最热门的人格
            </h2>
          </div>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--emerald)] transition hover:text-[var(--emerald-strong)]"
          >
            我也去生成一份结果
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 justify-items-center md:grid-cols-2 xl:grid-cols-3">
          {topThree.map((entry) => {
            const type = typeByCode[entry.typeCode];
            return (
              <TypeCard
                key={entry.typeCode}
                type={type}
                rank={entry.rank}
                count={entry.count}
                share={entry.share}
                badge="榜单头部"
                size="small"
                className="w-full max-w-[18rem]"
              />
            );
          })}
        </div>
      </section>

      <section className="panel rounded-[36px] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">完整排名</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)]">
              全量榜单
            </h2>
          </div>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            占比按当前累计结果实时计算，同票数时优先保持历史顺位。
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {snapshot.entries.map((entry) => {
            const type = typeByCode[entry.typeCode];
            return (
              <Link
                key={entry.typeCode}
                href={`/result/${entry.slug}`}
                className="grid gap-4 rounded-[26px] border border-black/6 bg-[var(--paper-strong)] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[var(--emerald)]/18 hover:bg-white sm:grid-cols-[auto_auto_1fr_auto] sm:items-center sm:px-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-base font-semibold text-[var(--emerald)] shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
                  #{entry.rank}
                </div>

                <div className="relative h-20 w-20 overflow-hidden rounded-[22px] border border-black/6 bg-[radial-gradient(circle_at_top,rgba(14,88,77,0.18),rgba(255,255,255,0)_62%),linear-gradient(180deg,rgba(8,34,30,0.05),rgba(255,255,255,0.94)_72%)]">
                  <Image
                    src={type.image}
                    alt={`${type.cn}插画`}
                    fill
                    sizes="80px"
                    className="object-contain object-bottom p-2"
                  />
                </div>

                <div className="min-w-0">
                  <p className="font-display text-2xl text-[var(--ink-strong)]">{type.cn}</p>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {type.code} · {type.intro}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-soft)]">
                    {type.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-[var(--ink-soft)] sm:grid-cols-1 sm:text-right">
                  <div>
                    <p className="uppercase tracking-[0.18em]">人数</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--ink-strong)]">
                      {entry.count.toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.18em]">占比</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--ink-strong)]">
                      {(entry.share * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
