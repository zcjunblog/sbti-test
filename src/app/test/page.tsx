import type { Metadata } from "next";
import { QuizFlow } from "@/components/quiz-flow";
import { guaranteedQuestionCount, maxQuestionCount } from "@/lib/sbti-data";

export const metadata: Metadata = {
  title: "开始测试",
  description: "逐题完成 SBTI 赛博人格测试，获得你的 15 维画像与对应人格类型。",
};

export default function TestPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="space-y-4">
        <p className="eyebrow">开始测试</p>
        <h1 className="font-display text-4xl leading-tight text-[var(--ink-strong)] sm:text-5xl">
          逐题进入，让系统一点点拆掉你的伪装
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
          本页会把题库随机洗牌，并在过程中按条件插入隐藏分支。你通常会作答{" "}
          {guaranteedQuestionCount} 题；如果命中饮酒支线，最多会到 {maxQuestionCount} 题。
          完成后会直接生成结果页，同时把你的画像暂存在本地，方便继续做分享和榜单提交。
        </p>
      </section>

      <QuizFlow />
    </div>
  );
}
