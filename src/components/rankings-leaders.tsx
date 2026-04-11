"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { typeByCode, type RankingsSnapshot } from "@/lib/sbti-data";
import { fetchRankings } from "@/lib/cloudbase-api";

export function RankingsLeaders() {
  const [rankings, setRankings] = useState<RankingsSnapshot | null>(null);

  useEffect(() => {
    fetchRankings().then(setRankings).catch(() => {});
  }, []);

  const leaders = rankings
    ? rankings.entries
        .slice(0, 3)
        .map((entry) => ({ entry, type: typeByCode[entry.typeCode] }))
        .filter((item) => item.type)
    : [];

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-black/6 bg-[linear-gradient(180deg,rgba(6,63,55,0.96),rgba(7,42,38,0.98))] p-6 text-white shadow-[0_34px_90px_rgba(4,17,15,0.26)] sm:p-8">
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(246,216,155,0.34),rgba(246,216,155,0))]" />
      <div className="relative">
        <p className="eyebrow !text-[rgba(255,255,255,0.7)]">实时人气</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">本地榜单 Top 3</h2>
            <p className="mt-2 text-sm leading-7 text-white/74">
              {rankings
                ? `当前已累计 ${rankings.totalSubmissions.toLocaleString("zh-CN")} 份结果。`
                : "正在加载榜单数据……"}
            </p>
          </div>
          <Link
            href="/rankings"
            className="text-sm font-semibold text-[var(--gold-light)] transition hover:text-white"
          >
            查看完整榜单
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {!rankings ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[76px] animate-pulse rounded-[24px] border border-white/10 bg-white/8"
              />
            ))
          ) : (
            leaders.map(({ entry, type }) => (
              <article
                key={entry.typeCode}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[24px] border border-white/10 bg-white/8 px-4 py-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-[var(--gold-light)]">
                  #{entry.rank}
                </div>
                <div>
                  <p className="font-display text-2xl">{type.cn}</p>
                  <p className="text-sm text-white/70">
                    {type.code} · 占比 {(entry.share * 100).toFixed(1)}%
                  </p>
                </div>
                <p className="text-sm text-white/72">
                  {entry.count.toLocaleString("zh-CN")} 人
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
