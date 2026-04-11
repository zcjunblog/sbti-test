"use client";

import { useRouter } from "next/navigation";
import { RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import clsx from "clsx";
import {
  buildQuestionDeck,
  buildResultSnapshot,
  clearResultSnapshot,
  computeResult,
  createSubmissionId,
  hydrateQuestionDeck,
  writeResultSnapshot,
  type QuizAnswers,
} from "@/lib/quiz";
import {
  guaranteedQuestionCount,
  maxQuestionCount,
  standardQuestionCount,
  type Question,
} from "@/lib/sbti-data";

const featureItems = [
  "逐题推进，每次只给你一个高压问题。",
  `标准计分题 ${standardQuestionCount} 道，通常作答 ${guaranteedQuestionCount} 题，命中支线时最多 ${maxQuestionCount} 题。`,
  "结果页支持复制链接、系统分享和海报下载。",
];

export function QuizFlow() {
  const router = useRouter();
  const [baseDeck, setBaseDeck] = useState<Question[]>(() => buildQuestionDeck());
  const [deck, setDeck] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [startTip, setStartTip] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetQuizState(nextDeck: Question[], message: string | null) {
    setBaseDeck(nextDeck);
    setDeck([]);
    setAnswers({});
    setIndex(0);
    setStarted(false);
    setStartTip(message);
    clearResultSnapshot();
  }

  const [isShuffling, setIsShuffling] = useState(false);

  function reshuffleDeck() {
    try { navigator.vibrate?.(50); } catch {}
    setIsShuffling(true);
    setTimeout(() => setIsShuffling(false), 600);
    const shuffledDeck = buildQuestionDeck();
    resetQuizState(
      shuffledDeck,
      "题序已重新洗牌。正式开始后会使用新的随机顺序，隐藏分支的插入位置也会一起更新。",
    );
  }

  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const currentQuestion = deck[index];
  const answeredCount = Object.keys(answers).length;
  const progress = deck.length
    ? Math.max(5, Math.round((answeredCount / deck.length) * 100))
    : 0;

  function resetQuiz() {
    resetQuizState(
      buildQuestionDeck(),
      "已结束当前这轮测试，并重新洗了一遍题序。你可以直接重新开始。",
    );
  }

  function startQuiz() {
    setDeck(baseDeck);
    setStarted(true);
    setStartTip(null);
    clearResultSnapshot();
  }

  const handleSelect = useCallback((value: number) => {
    if (!currentQuestion || isPending || selectedValue !== null) {
      return;
    }

    try { navigator.vibrate?.(30); } catch {}
    setSelectedValue(value);

    // Phase 1: highlight selected, then fade out after brief pause
    const fadeOutDelay = setTimeout(() => {
      setTransitioning(true);

      // Phase 2: after fade-out completes, advance question
      const advanceDelay = setTimeout(() => {
        const nextAnswers = {
          ...answers,
          [currentQuestion.id]: value,
        };

        const nextDeck = hydrateQuestionDeck(baseDeck, nextAnswers);
        const isLastQuestion = index >= nextDeck.length - 1;

        setAnswers(nextAnswers);
        setDeck(nextDeck);

        if (isLastQuestion) {
          startTransition(() => {
            const result = computeResult(nextAnswers);
            const snapshot = buildResultSnapshot(result, createSubmissionId());
            writeResultSnapshot(snapshot);
            router.push(`/result/${result.finalType.slug}?source=quiz`);
          });
          return;
        }

        setIndex((prev) => prev + 1);
        setSelectedValue(null);
        setTransitioning(false);
      }, 300);

      transitionTimer.current = advanceDelay;
    }, 250);

    transitionTimer.current = fadeOutDelay;
  }, [currentQuestion, isPending, selectedValue, answers, baseDeck, index, router, startTransition]);

  if (!started) {
    return (
      <section className="panel overflow-hidden rounded-[32px]">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <p className="eyebrow">开始测试</p>
            <div className="space-y-4">
              <h2 className="font-display text-4xl leading-tight text-[var(--ink-strong)] sm:text-5xl">
                你的脑回路，准备好接受一次不留情面的剖开了吗？
              </h2>
              <p className="max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
                这不是传统 MBTI，那套温柔话术在这里行不通。我们会用更锋利的题面，
                把你在自我、情感、态度、行动与社交上的默认姿态拆开重组，最后映射到 27 种赛博人格。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center justify-center rounded-full bg-[var(--emerald)] px-6 py-3 text-sm font-semibold !text-white shadow-[0_18px_32px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)]"
              >
                开始测我
              </button>
              <button
                type="button"
                onClick={reshuffleDeck}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-white active:scale-95 active:opacity-60"
              >
                <RotateCcw size={15} className={clsx("transition-transform duration-500", isShuffling && "animate-[spin-once_0.5s_ease-in-out]")} />
                重新洗牌题序
              </button>
            </div>
            <div className="space-y-3" aria-live="polite">
              <p className="text-sm leading-7 text-[var(--ink-soft)]">
                重新洗牌只会改变题目顺序和隐藏分支的插入位置，不会改动题库内容和判定规则。
              </p>
              {startTip ? (
                <div className="rounded-[20px] border border-[var(--emerald)]/12 bg-[var(--emerald)]/6 px-4 py-3 text-sm leading-7 text-[var(--emerald)]">
                  {startTip}
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,rgba(7,62,55,0.95),rgba(9,39,36,0.97))] p-6 text-white shadow-[0_30px_80px_rgba(4,17,15,0.28)]">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(239,208,146,0.3),rgba(239,208,146,0))]" />
            <p className="eyebrow !text-[rgba(255,255,255,0.72)]">测评体验</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-5">
                <p className="text-4xl font-semibold">{`${guaranteedQuestionCount}-${maxQuestionCount}`}</p>
                <p className="mt-2 text-sm leading-7 text-white/74">
                  通常会作答 {guaranteedQuestionCount} 题，命中隐藏饮酒支线时最多到 {maxQuestionCount} 题。
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-5">
                <ul className="space-y-3 text-sm leading-7 text-white/76">
                  {featureItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Sparkles size={16} className="mt-1 shrink-0 text-[var(--gold-light)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden rounded-[32px]">
      <div className="border-b border-black/6 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">测试进行中</p>
            <h2 className="mt-2 font-display text-2xl text-[var(--ink-strong)] sm:text-3xl">
              {!currentQuestion
                ? "结果生成中"
                : `第 ${Math.min(index + 1, deck.length)} / ${deck.length} 题`}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 self-start rounded-full border border-black/8 bg-white/74 px-4 py-2 text-sm font-medium text-[var(--ink-strong)] transition hover:bg-white"
          >
            <RotateCcw size={15} />
            重来一次
          </button>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/6">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--emerald),var(--gold))] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={clsx(
          "space-y-8 p-6 transition-all duration-300 sm:p-8 md:p-10",
          transitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-[var(--gold)]/20 bg-[var(--gold-mist)] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[var(--emerald)] uppercase">
            请按直觉作答
          </span>
          <h3 className="font-display text-3xl leading-tight text-[var(--ink-strong)] sm:text-4xl">
            {currentQuestion?.text}
          </h3>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            当前已回答 {answeredCount} 题。不要试图讨好系统，选你第一反应最像的那个。
          </p>
        </div>

        <div className="grid gap-4">
          {currentQuestion?.options.map((option, optionIndex) => {
            const isSelected = selectedValue === option.value;
            const isUnselected = selectedValue !== null && !isSelected;
            return (
              <button
                key={`${currentQuestion.id}_${option.value}`}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={isPending || selectedValue !== null}
                className={clsx(
                  "group rounded-[26px] border px-5 py-5 text-left shadow-[0_16px_40px_rgba(17,24,39,0.06)] transition-all duration-200 sm:px-6",
                  isSelected
                    ? "scale-[0.98] border-[var(--emerald)] bg-[var(--emerald)]/8 shadow-[0_8px_24px_rgba(11,93,83,0.15)]"
                    : isUnselected
                      ? "border-black/4 opacity-40"
                      : "border-black/6 bg-white/85 hover:-translate-y-0.5 hover:border-[var(--emerald)]/20 hover:shadow-[0_24px_52px_rgba(17,24,39,0.08)] active:scale-[0.97] active:opacity-60",
                  isPending ? "opacity-70" : "",
                )}
              >
                <div className="flex items-start gap-4">
                  <span className={clsx(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200",
                    isSelected
                      ? "bg-[var(--emerald)] text-white"
                      : "bg-[var(--paper-strong)] text-[var(--emerald)]",
                  )}>
                    {isSelected ? "✓" : optionIndex + 1}
                  </span>
                  <span className="pt-1 text-base leading-8 text-[var(--ink-strong)] sm:text-lg">
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {isPending ? (
          <div className="rounded-[24px] border border-[var(--emerald)]/10 bg-[var(--emerald)]/6 px-5 py-4 text-sm text-[var(--emerald)]">
            正在汇总你的 15 维画像，请稍等片刻……
          </div>
        ) : null}
      </div>
    </section>
  );
}
