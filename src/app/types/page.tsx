import type { Metadata } from "next";
import { TypeCard } from "@/components/type-card";
import { types } from "@/lib/sbti-data";

export const metadata: Metadata = {
  title: "人格图鉴",
  description: "查看 SBTI 的全部人格类型，包括标准人格和隐藏人格。",
};

const normalTypes = types.filter((type) => !type.special);
const specialTypes = types.filter((type) => type.special);

export default function TypesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="panel rounded-[40px] p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">人格图鉴</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl leading-tight text-[var(--ink-strong)] sm:text-5xl">
              27 种赛博人格的角色档案都在这里
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
              每一种人格都对应自己的维度模板、插画和一段毫不客气的描述。你可以先逛图鉴，再决定要不要去测一把。
            </p>
          </div>
          <div className="rounded-[28px] border border-black/6 bg-[var(--paper-strong)] px-5 py-4 text-sm leading-7 text-[var(--ink-soft)]">
            标准人格 {normalTypes.length} 种
            <br />
            隐藏人格 {specialTypes.length} 种
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="eyebrow">标准人格</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)]">
            主人格库
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {normalTypes.map((type) => (
            <TypeCard key={type.code} type={type} size="small" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="eyebrow">隐藏人格</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)]">
            非常规分支
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {specialTypes.map((type) => (
            <TypeCard key={type.code} type={type} badge="隐藏判定" size="small" />
          ))}
        </div>
      </section>
    </div>
  );
}
