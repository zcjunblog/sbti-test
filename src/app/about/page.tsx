import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitBranch, ScanSearch, ShieldCheck } from "lucide-react";
import {
  dimensionGroups,
  dimensionMeta,
  guaranteedQuestionCount,
  maxQuestionCount,
  questions,
  specialQuestions,
  standardQuestionCount,
  types,
} from "@/lib/sbti-data";

export const metadata: Metadata = {
  title: "测评说明",
  description: "了解 SBTI 的题库结构、15 维判定逻辑与隐藏人格分支。",
};

const processItems = [
  {
    icon: ScanSearch,
    title: "题面采样",
    desc: `标准计分题共 ${standardQuestionCount} 道，所有人都会额外遇到 1 道隐藏入口题；命中饮酒支线时，第 ${maxQuestionCount} 题才会出现。`,
  },
  {
    icon: ShieldCheck,
    title: "维度折算",
    desc: "每个维度会根据累计得分折算成 L / M / H 三档，再与标准人格模板做距离匹配。",
  },
  {
    icon: GitBranch,
    title: "分支兜底",
    desc: "饮酒支线会直接触发 DRUNK；如果与常规人格库的匹配整体过低，则会进入 HHHH 兜底类型。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="panel rounded-[40px] p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">测评说明</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="font-display text-4xl leading-tight text-[var(--ink-strong)] sm:text-5xl">
              这套测试到底是怎么把你分进某个人格里的
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
              站点保留了原版题库和人格素材，但把判定逻辑全部拉回本地实现。
              也就是说，从题目洗牌、支线插入、维度计算到最终类型匹配，现在都能在你自己的项目里完整跑起来。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <article className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--emerald)]">题库</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--ink-strong)]">
                {questions.length + specialQuestions.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                最大题量含隐藏分支，通常实际作答 {guaranteedQuestionCount} 题
              </p>
            </article>
            <article className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--emerald)]">维度</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--ink-strong)]">15</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">五大模型拆分而来</p>
            </article>
            <article className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--emerald)]">类型</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--ink-strong)]">{types.length}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">含标准人格与隐藏人格</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {processItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="panel rounded-[32px] p-6">
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

      <section className="panel rounded-[36px] p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">十五维度</p>
        <h2 className="mt-3 font-display text-4xl text-[var(--ink-strong)]">
          五大模型的维度拆解
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          {dimensionGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] p-5"
            >
              <p className="text-sm font-semibold tracking-[0.14em] text-[var(--emerald)]">
                {group.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {group.description}
              </p>
              <div className="mt-5 space-y-2">
                {group.dimensions.map((dimension) => (
                  <div
                    key={dimension}
                    className="rounded-2xl border border-black/6 bg-white/76 px-3 py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--ink-strong)]">
                      {dimension}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                      {dimensionMeta[dimension]?.name}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="panel rounded-[32px] p-6 sm:p-8">
          <p className="eyebrow">隐藏分支</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)]">
            两种非常规结果
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-lg font-semibold text-[var(--ink-strong)]">DRUNK</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                当隐藏饮酒问题命中触发项时，系统会直接跳转到酒鬼人格，不再继续采用常规人格作为最终结果。
              </p>
            </div>
            <div className="rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5">
              <p className="text-lg font-semibold text-[var(--ink-strong)]">HHHH</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                如果你与标准人格库的最高相似度都过低，说明没有任何一类能稳稳接住你，系统会使用兜底人格处理。
              </p>
            </div>
          </div>
        </article>

        <article className="panel rounded-[32px] p-6 sm:p-8">
          <p className="eyebrow">授权说明</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)]">
            图片与题库素材的使用方式
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--ink-soft)]">
            <p>
              站内插画与题库内容以 CC BY-NC-SA 方式共享，
              适合学习、展示和非商业化的二次创作部署。
            </p>
            <p>
              这也是为什么本项目直接把角色图放在 `public/images/types` 下，
              并围绕它们新增了移动端布局、榜单与分享海报能力。
            </p>
          </div>
          <Link
            href="/test"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--emerald)] px-5 py-3 text-sm font-semibold !text-white shadow-[0_18px_32px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)] [&_svg]:!text-white"
          >
            去做一次测试
            <ArrowRight size={16} />
          </Link>
        </article>
      </section>
    </div>
  );
}
