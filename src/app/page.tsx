import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Share2,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { TypeCard } from "@/components/type-card";
import {
  dimensionGroups,
  dimensionMeta,
  guaranteedQuestionCount,
  maxQuestionCount,
  types,
  typeByCode,
} from "@/lib/sbti-data";
import { getRankingsSnapshot } from "@/lib/rankings-store";

export const dynamic = "force-dynamic";

const metricItems = [
  {
    value: `${guaranteedQuestionCount}-${maxQuestionCount}`,
    label: "实际作答",
    sub: "通常 31 题，命中隐藏支线时最多 32 题",
  },
  { value: "15", label: "人格维度", sub: "覆盖自我、情感、态度、行动与社交" },
  { value: "27", label: "结果类型", sub: "含 2 个隐藏人格分支" },
  { value: "3", label: "分享方式", sub: "复制链接、系统分享、海报下载" },
];

const capabilityItems = [
  {
    icon: Sparkles,
    title: "原题库完整复刻",
    desc: "保留完整问题文本、类型图鉴和隐藏饮酒支线，配合本地判定逻辑。",
  },
  {
    icon: Smartphone,
    title: "移动端优先排版",
    desc: "页面节奏、触控区域和字体层级全部重新梳理，手机上也不会挤成一团。",
  },
  {
    icon: Share2,
    title: "裂变传播闭环",
    desc: "结果页支持直接复制链接、系统分享与一键海报下载，适合社群传播。",
  },
  {
    icon: BarChart3,
    title: "本地榜单统计",
    desc: "测试结果可以写入本地排行榜，让站点自己形成内容沉淀和热度反馈。",
  },
];

const marqueeLoops = [0, 1];

export default async function HomePage() {
  const rankings = await getRankingsSnapshot();
  const leaders = rankings.entries
    .slice(0, 3)
    .map((entry) => ({
      entry,
      type: typeByCode[entry.typeCode],
    }))
    .filter((item) => item.type);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="panel overflow-hidden rounded-[40px]">
        <div className="grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="eyebrow">开源重构版</p>
              <h1 className="font-display text-5xl leading-[1.04] text-[var(--ink-strong)] sm:text-6xl lg:text-7xl">
                一套更适合传播的
                <br />
                赛博人格测试站
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
                基于 SBTI 赛博人格测试的核心玩法重新设计，
                保留完整题库、人格图鉴和隐藏分支，配合全新视觉系统，
                让它在桌面端、移动端和社交裂变场景里都更能打。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/test"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--emerald)] px-6 py-3 text-sm font-semibold !text-white shadow-[0_20px_36px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)] [&_svg]:!text-white"
              >
                立即开始测试
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/types"
                className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/74 px-6 py-3 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-white"
              >
                浏览人格图鉴
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metricItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5"
                >
                  <p className="text-3xl font-semibold text-[var(--ink-strong)]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--ink-strong)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{item.sub}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[34px] border border-black/6 bg-[linear-gradient(180deg,rgba(6,63,55,0.96),rgba(7,42,38,0.98))] p-6 text-white shadow-[0_34px_90px_rgba(4,17,15,0.26)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(246,216,155,0.34),rgba(246,216,155,0))]" />
            <div className="relative">
              <p className="eyebrow !text-[rgba(255,255,255,0.7)]">实时人气</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl">本地榜单 Top 3</h2>
                  <p className="mt-2 text-sm leading-7 text-white/74">
                    当前已累计 {rankings.totalSubmissions.toLocaleString("zh-CN")} 份结果。
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
                {leaders.map(({ entry, type }) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {capabilityItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="panel rounded-[30px] p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gold-mist)] text-[var(--emerald)]">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 font-display text-2xl text-[var(--ink-strong)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{item.desc}</p>
            </article>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">精选图鉴</p>
            <h2 className="mt-2 font-display text-4xl text-[var(--ink-strong)]">
              先感受一下这套人格宇宙
            </h2>
          </div>
          <Link
            href="/types"
            className="text-sm font-semibold text-[var(--emerald)] transition hover:text-[var(--emerald-strong)]"
          >
            查看全部 27 类结果
          </Link>
        </div>
        <div className="sbti-marquee panel relative overflow-hidden rounded-[34px] px-3 py-4 sm:px-4 sm:py-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-[linear-gradient(90deg,var(--paper),rgba(248,241,228,0))] sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-[linear-gradient(270deg,var(--paper),rgba(248,241,228,0))] sm:w-20" />

          <div className="sbti-marquee-track flex w-max">
            {marqueeLoops.map((loop) => (
              <div
                key={loop}
                aria-hidden={loop === 1}
                className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
              >
                {types.map((type) => (
                  <TypeCard
                    key={`${loop}-${type.code}`}
                    type={type}
                    size="marquee"
                    className="w-[11.75rem] shrink-0 sm:w-[12.75rem] lg:w-[13.5rem]"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rounded-[36px] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">判定方法</p>
            <h2 className="mt-3 font-display text-4xl text-[var(--ink-strong)]">
              五大模型，拆成十五个维度一起算
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">
              系统会把你的答题结果折算为 15 个 `L / M / H` 级别，再与标准人格模式库做距离匹配。
              如果触发饮酒分支或整体匹配过低，则会进入隐藏人格判定。
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-white"
          >
            查看完整测评说明
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          {dimensionGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--emerald)]">
                {group.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {group.description}
              </p>
              <div className="mt-4 space-y-2">
                {group.dimensions.map((dimension) => (
                  <div
                    key={dimension}
                    className="rounded-2xl border border-black/6 bg-white/76 px-3 py-3 text-sm text-[var(--ink-soft)]"
                  >
                    <p className="font-semibold text-[var(--ink-strong)]">{dimension}</p>
                    <p className="mt-1">{dimensionMeta[dimension]?.name}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
