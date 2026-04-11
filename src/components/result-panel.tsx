"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Download,
  Link2,
  Medal,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import QRCode from "qrcode";
import {
  getCanonicalResultPath,
  getCanonicalType,
  getPersonalizedDimensionItems,
  readResultSnapshot,
  writeResultSnapshot,
  type ResultSnapshot,
} from "@/lib/quiz";
import { getDisplayCode, type SbtiType } from "@/lib/sbti-data";
import { submitRanking } from "@/lib/cloudbase-api";

type SubmitResponse =
  | {
      accepted: true;
      entry: {
        count: number;
        rank: number;
      };
    }
  | {
      accepted: false;
      reason: string;
    };

type ResultPanelProps = {
  type: SbtiType;
  suggestedTypes: SbtiType[];
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${source}`));
    image.src = source;
  });
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  let currentLine = "";

  for (const character of text) {
    const nextLine = `${currentLine}${character}`;
    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = character;
      continue;
    }
    currentLine = nextLine;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function ResultPanel({ type, suggestedTypes }: ResultPanelProps) {
  const searchParams = useSearchParams();
  const [snapshot, setSnapshot] = useState<ResultSnapshot | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  useEffect(() => {
    setSnapshot(readResultSnapshot());
  }, []);

  useEffect(() => {
    return () => {
      if (posterPreviewUrl) {
        URL.revokeObjectURL(posterPreviewUrl);
      }
    };
  }, [posterPreviewUrl]);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => setActionMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  // Auto-submit to rankings on first visit from quiz
  useEffect(() => {
    if (!snapshot || snapshot.finalTypeCode !== type.code) return;
    if (snapshot.rankingSubmission) return; // already submitted
    submitToRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  const cameFromQuiz = searchParams.get("source") === "quiz";
  const hasMatchingSnapshot = snapshot?.finalTypeCode === type.code;
  const personalizedItems = hasMatchingSnapshot
    ? getPersonalizedDimensionItems(snapshot)
    : null;
  const dimensionItems = personalizedItems ?? type.canonicalItems;
  const secondaryType = snapshot?.secondaryTypeCode
    ? getCanonicalType(snapshot.secondaryTypeCode)
    : null;
  const rankingStatus = hasMatchingSnapshot ? snapshot?.rankingSubmission : null;

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return getCanonicalResultPath(type.slug);
    }
    return new URL(getCanonicalResultPath(type.slug), window.location.origin).toString();
  }, [type.slug]);

  const shareTitle = useMemo(
    () => `我是 ${type.cn} · ${getDisplayCode(type.code)}`,
    [type.cn, type.code],
  );

  const shareText = useMemo(
    () => `${type.intro} 扫码或打开链接，看看你会被分到哪一型。`,
    [type.intro],
  );

  async function renderPosterBlob() {
    await document.fonts.ready;

    const [typeImage, qrImage] = await Promise.all([
      loadImage(new URL(type.image, window.location.origin).toString()),
      QRCode.toDataURL(shareUrl, {
        width: 280,
        margin: 1,
        color: {
          dark: "#0a4038",
          light: "#ffffff",
        },
      }).then((source) => loadImage(source)),
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1600;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas unavailable");
    }

    const gradient = context.createLinearGradient(0, 0, 1080, 1600);
    gradient.addColorStop(0, "#f7f0e3");
    gradient.addColorStop(0.52, "#f9f6ef");
    gradient.addColorStop(1, "#efe4d4");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1080, 1600);

    context.fillStyle = "rgba(10, 64, 56, 0.08)";
    context.beginPath();
    context.arc(880, 240, 230, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(180, 1350, 260, 0, Math.PI * 2);
    context.fillStyle = "rgba(181, 128, 55, 0.08)";
    context.fill();

    context.fillStyle = "#0b3f38";
    context.font = "700 26px Space Grotesk, sans-serif";
    context.fillText("SBTI 赛博人格测定局", 84, 104);

    context.fillStyle = "#112a28";
    context.font = "700 88px 'Noto Serif SC', serif";
    context.fillText(type.cn, 84, 226);

    context.fillStyle = "#0b5d53";
    context.font = "700 38px Space Grotesk, sans-serif";
    context.fillText(getDisplayCode(type.code), 84, 290);

    context.fillStyle = "#4f5d5a";
    context.font = "500 30px 'Noto Serif SC', serif";
    context.fillText(type.intro, 84, 348);

    context.save();
    {
      const boxX = 480;
      const boxY = 60;
      const boxW = 540;
      const boxH = 740;
      context.beginPath();
      context.roundRect(boxX, boxY, boxW, boxH, 42);
      context.clip();
      const imgW = typeImage.naturalWidth || typeImage.width;
      const imgH = typeImage.naturalHeight || typeImage.height;
      const scale = Math.min(boxW / imgW, boxH / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      // align bottom-right within the box
      const drawX = boxX + (boxW - drawW);
      const drawY = boxY + (boxH - drawH);
      context.drawImage(typeImage, drawX, drawY, drawW, drawH);
    }
    context.restore();

    context.fillStyle = "#ffffff";
    context.beginPath();
    context.roundRect(72, 430, 420, 520, 38);
    context.fill();

    context.strokeStyle = "rgba(11, 63, 56, 0.08)";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "#637370";
    context.font = "600 22px Space Grotesk, sans-serif";
    context.fillText("PERSONAL DOSSIER", 108, 486);

    context.fillStyle = "#172826";
    context.font = "500 34px 'Noto Serif SC', serif";
    const descLines = wrapText(context, type.desc.slice(0, 120), 350).slice(0, 7);
    descLines.forEach((line, lineIndex) => {
      context.fillText(line, 108, 560 + lineIndex * 52);
    });

    context.fillStyle = "#0b5d53";
    context.beginPath();
    context.roundRect(72, 996, 936, 432, 42);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "700 34px 'Noto Serif SC', serif";
    context.fillText("来测测你是什么赛博人格", 118, 1086);

    context.font = "500 28px 'Noto Serif SC', serif";
    const posterSubtitle = cameFromQuiz
      ? "我已经测完了，你也来看看自己会被分到哪一型。"
      : "点开同款测试，看看你的朋友和你是不是同一种怪东西。";
    wrapText(context, posterSubtitle, 500)
      .slice(0, 2)
      .forEach((line, lineIndex) => {
        context.fillText(line, 118, 1150 + lineIndex * 44);
      });

    context.save();
    context.beginPath();
    context.roundRect(710, 1046, 220, 220, 28);
    context.clip();
    context.drawImage(qrImage, 710, 1046, 220, 220);
    context.restore();

    context.fillStyle = "rgba(255,255,255,0.7)";
    context.font = "500 22px Space Grotesk, sans-serif";
    context.fillText("SCAN TO START", 730, 1312);

    context.fillStyle = "#edf3f2";
    context.font = "600 24px Space Grotesk, sans-serif";
    context.fillText("sbti mirrored edition · mobile friendly · share enabled", 118, 1362);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((nextBlob) => {
        if (nextBlob) {
          resolve(nextBlob);
          return;
        }
        reject(new Error("Poster encoding failed"));
      }, "image/png");
    });

    return blob;
  }

  async function createPosterFile() {
    const posterBlob = await renderPosterBlob();
    return new File([posterBlob], `sbti-${type.slug}-poster.png`, {
      type: "image/png",
    });
  }

  async function copyLink({ silent = false }: { silent?: boolean } = {}) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      if (!silent) {
        try { navigator.vibrate?.(50); } catch {}
        setActionMessage("结果链接已复制，直接粘到微信或群聊里就能发。");
      }
    } catch {
      if (!silent) {
        setActionMessage("复制失败了，请手动复制地址栏链接。");
      }
    }
  }

  async function shareNatively() {
    setBusyAction("share");
    setActionMessage(null);

    try {
      if (!navigator.share) {
        await copyLink({ silent: true });
        setActionMessage("当前浏览器不支持系统分享，已自动复制链接。微信里更稳的方式是直接发海报。");
        return;
      }

      const linkShareData = {
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      };

      if (typeof navigator.canShare === "function") {
        try {
          const posterFile = await createPosterFile();
          const fileShareData = {
            files: [posterFile],
            title: shareTitle,
            text: `${type.intro} 扫码看完整结果`,
          };

          if (navigator.canShare(fileShareData)) {
            await navigator.share(fileShareData);
            setActionMessage("系统分享已打开，已附上带二维码的海报。转发到微信时，发图通常比直接发网页更稳。");
            return;
          }
        } catch {
          // Fall back to link sharing when the platform refuses file payloads.
        }

        if (navigator.canShare(linkShareData)) {
          await navigator.share(linkShareData);
          setActionMessage("系统分享已打开；如果微信没有正确接住内容，建议改用“下载海报”或“复制链接”。");
          return;
        }
      }

      await navigator.share(linkShareData);
      setActionMessage("系统分享已打开；如果微信没有正确接住内容，建议改用“下载海报”或“复制链接”。");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setActionMessage("已取消分享。微信里更建议直接发海报，成功率通常更高。");
        return;
      }

      await copyLink({ silent: true });
      setActionMessage("系统分享没有成功接管，已自动复制结果链接。微信里建议直接发送海报图片或粘贴链接。");
    } finally {
      setBusyAction(null);
    }
  }

  async function downloadPoster() {
    setBusyAction("poster");
    setActionMessage(null);

    try {
      const posterBlob = await renderPosterBlob();
      const objectUrl = URL.createObjectURL(posterBlob);
      setPosterPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return objectUrl;
      });
      // poster preview opened, no toast needed
    } catch {
      setActionMessage("海报生成失败了，先复制链接分享也可以。");
    } finally {
      setBusyAction(null);
    }
  }

  function closePosterPreview() {
    setPosterPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return null;
    });
  }

  function confirmPosterDownload() {
    if (!posterPreviewUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = posterPreviewUrl;
    link.download = `sbti-${type.slug}-poster.png`;
    link.click();
    setActionMessage("海报已开始下载，直接发到微信或朋友圈会比系统分享更稳。");
    window.setTimeout(() => {
      closePosterPreview();
    }, 0);
  }

  function submitToRankings() {
    if (!snapshot || !hasMatchingSnapshot || isSubmitting) {
      return;
    }

    startTransition(async () => {
      setActionMessage(null);

      try {
        const data = await submitRanking(
          snapshot.submissionId,
          snapshot.finalTypeCode,
        ) as SubmitResponse;

        if (!data.accepted) {
          if (data.reason === "duplicate") {
            setActionMessage("这份结果已经写入过榜单了，不会重复刷票。");
            return;
          }
          setActionMessage("提交榜单失败，请稍后再试。");
          return;
        }

        const nextSnapshot = {
          ...snapshot,
          rankingSubmission: {
            submittedAt: new Date().toISOString(),
            count: data.entry.count,
            rank: data.entry.rank,
          },
        };

        setSnapshot(nextSnapshot);
        writeResultSnapshot(nextSnapshot);
        setActionMessage(
          `榜单已更新，你的类型现在排在第 ${data.entry.rank} 位，总人数 ${data.entry.count}。`,
        );
      } catch {
        setActionMessage("提交榜单时出了点问题，请稍后刷新重试。");
      }
    });
  }

  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden rounded-[36px]">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="relative overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(242,215,157,0.32),rgba(242,215,157,0)_52%),linear-gradient(180deg,rgba(13,78,69,0.12),rgba(255,255,255,0.92)_68%)] p-6">
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-[rgba(10,64,56,0.9)] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-white uppercase">
                {getDisplayCode(type.code)}
              </span>
              <span className="inline-flex rounded-full border border-black/6 bg-white/76 px-3 py-1 text-xs font-medium text-[var(--ink-soft)]">
                {type.special ? "隐藏人格" : "标准人格"}
              </span>
            </div>
            <div className="relative mx-auto aspect-[4/4.6] max-w-[18rem] sm:max-w-[20rem]">
              <Image
                src={type.image}
                alt={`${type.cn}插画`}
                fill
                sizes="(max-width: 640px) 288px, 320px"
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <p className="eyebrow">结果档案</p>
              <div className="space-y-3">
                <h1 className="font-display text-4xl leading-tight text-[var(--ink-strong)] sm:text-5xl">
                  {type.cn}
                </h1>
                <p className="text-lg text-[var(--emerald)] sm:text-xl">{type.intro}</p>
                <p className="text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
                  {hasMatchingSnapshot && snapshot ? snapshot.sub : type.desc}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  void copyLink();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-white"
              >
                <Link2 size={16} />
                复制链接
              </button>
              <button
                type="button"
                onClick={shareNatively}
                disabled={busyAction === "share"}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--ink-strong)] transition hover:bg-white disabled:opacity-70"
              >
                <Share2 size={16} />
                {busyAction === "share" ? "准备分享" : "系统分享"}
              </button>
              <button
                type="button"
                onClick={downloadPoster}
                disabled={busyAction === "poster"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--emerald)] px-5 py-3 text-sm font-semibold !text-white shadow-[0_18px_32px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)] disabled:translate-y-0 disabled:opacity-70 [&_svg]:!text-white"
              >
                <Download size={16} />
                {busyAction === "poster" ? "生成预览中" : "预览海报"}
              </button>
            </div>

            <p className="text-xs leading-6 text-[var(--ink-soft)]">
              复制链接适合直接丢群里，系统分享适合手机端转发，海报适合朋友圈与社媒传播。
            </p>

            {hasMatchingSnapshot && snapshot ? (
              <div className="grid gap-4 rounded-[28px] border border-[var(--emerald)]/10 bg-[var(--emerald)]/6 p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">主标签</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--ink-strong)]">
                    {snapshot.modeKicker}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">匹配情况</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--ink-strong)]">
                    {snapshot.badge}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">榜单状态</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--ink-strong)]">
                    {rankingStatus
                      ? `第 ${rankingStatus.rank} 名 · ${rankingStatus.count.toLocaleString("zh-CN")} 人`
                      : isSubmitting
                        ? "提交中…"
                        : "尚未入榜"}
                  </p>
                </div>
              </div>
            ) : null}

            {/* toast rendered at portal level below */}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">
                {hasMatchingSnapshot ? "你的 15 维画像" : "标准类型维度样本"}
              </p>
              <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)]">
                {hasMatchingSnapshot ? "系统是这样理解你的" : "这个人格大概率是什么构成"}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--ink-soft)]">
              {hasMatchingSnapshot
                ? "以下是基于你这次答题直接计算出的 15 个维度结果。"
                : "以下为该类型的标准画像模板，未必与你本人完全一致。"}
            </p>
          </div>

          {dimensionItems.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dimensionItems.map((item) => (
                <article
                  key={`${item.dim}-${item.level}`}
                  className="rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
                      {item.dim}
                    </p>
                    <span className="inline-flex rounded-full bg-[var(--emerald)]/12 px-3 py-1 text-xs font-semibold text-[var(--emerald)]">
                      {item.level}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                    {item.explanation}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5 text-sm leading-7 text-[var(--ink-soft)]">
              这个结果属于隐藏人格，不提供标准 15 维模板。建议你直接分享给朋友，让他们也一起掉进这个支线。
            </div>
          )}
        </div>

        <div className="space-y-8">
          <section className="panel rounded-[32px] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gold-mist)] text-[var(--emerald)]">
                <Trophy size={22} />
              </div>
              <div>
                <p className="eyebrow">裂变传播</p>
                <h2 className="mt-1 font-display text-2xl text-[var(--ink-strong)]">
                  让这份结果开始扩散
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--ink-soft)]">
              <p>复制链接适合直接丢群里，系统分享适合手机端转发，海报适合朋友圈与社媒截图传播。</p>
              <p>结果页链接是可独立访问的，别人打开后能直接看到对应人格，再顺手进入测试页。</p>
            </div>

            {hasMatchingSnapshot ? (
              <div className="mt-6 rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--emerald)]/10 text-[var(--emerald)]">
                    <Medal size={18} />
                  </div>
                  {rankingStatus ? (
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-[var(--ink-strong)]">
                        已入榜 · 当前排名第 {rankingStatus.rank} 位
                      </p>
                      <p className="text-sm leading-7 text-[var(--ink-soft)]">
                        共 {rankingStatus.count.toLocaleString("zh-CN")} 人选择了这个类型。
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-base font-semibold text-[var(--ink-strong)]">
                          {isSubmitting ? "正在提交到榜单…" : "将我的结果写入榜单"}
                        </p>
                        <p className="mt-1 text-sm leading-7 text-[var(--ink-soft)]">
                          这样排行榜会记录这次测试，方便后续继续做站内传播和统计。
                        </p>
                      </div>
                      {!isSubmitting && (
                        <button
                          type="button"
                          onClick={submitToRankings}
                          className="inline-flex items-center justify-center rounded-full bg-[var(--emerald)] px-5 py-3 text-sm font-semibold !text-white shadow-[0_18px_32px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)]"
                        >
                          加入榜单
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-black/6 bg-[var(--paper-strong)] p-5 text-sm leading-7 text-[var(--ink-soft)]">
                这个页面是公开结果页。只有你从测试流程里生成的本人结果，才会出现提交榜单与个性化维度。
              </div>
            )}

            {secondaryType ? (
              <div className="mt-6 rounded-[24px] border border-[var(--gold)]/18 bg-[var(--gold-mist)] p-5">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/82 text-[var(--emerald)]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[var(--ink-strong)]">
                      常规人格备选：{secondaryType.cn}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                      这次因为触发了隐藏支线，你被分到了特殊类型；但按常规人格库计算，
                      你最接近的仍然是 {secondaryType.cn}。
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="panel rounded-[32px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">继续逛</p>
              <Link
                href="/types"
                className="text-sm font-semibold text-[var(--emerald)] transition hover:text-[var(--emerald-strong)]"
              >
                查看全部图鉴
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {suggestedTypes.map((suggestedType) => (
                <Link
                  key={suggestedType.code}
                  href={`/result/${suggestedType.slug}`}
                  className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 rounded-[20px] border border-black/6 bg-[var(--paper-strong)] px-3 py-3 transition hover:-translate-y-0.5 hover:border-[var(--emerald)]/18 hover:bg-white"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-[14px] bg-[radial-gradient(circle_at_top,rgba(14,88,77,0.18),rgba(255,255,255,0)_62%),linear-gradient(180deg,rgba(8,34,30,0.05),rgba(255,255,255,0.94)_72%)]">
                    <Image
                      src={suggestedType.image}
                      alt={`${suggestedType.cn}插画`}
                      fill
                      sizes="56px"
                      className="object-contain object-bottom p-1"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold text-[var(--ink-strong)]">
                      {suggestedType.cn}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--ink-soft)]">
                      {getDisplayCode(suggestedType.code)} · {suggestedType.intro}
                    </p>
                  </div>
                  <ArrowUpRight size={15} className="shrink-0 text-[var(--ink-soft)] transition group-hover:text-[var(--emerald)]" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      {posterPreviewUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="海报预览"
          onClick={closePosterPreview}
        >
          <div
            className="relative flex max-h-full w-full max-w-sm flex-col gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-h-0 flex-1 overflow-hidden rounded-[18px] border border-black/6 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
              <img
                src={posterPreviewUrl}
                alt={`${type.cn}海报预览`}
                className="block h-full w-full object-contain"
              />
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closePosterPreview}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[var(--ink-strong)] backdrop-blur-sm transition hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmPosterDownload}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--emerald)] px-4 py-2.5 text-sm font-semibold !text-white shadow-[0_18px_32px_rgba(6,63,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--emerald-strong)]"
              >
                <Download size={15} />
                保存海报
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {actionMessage ? (
        <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
          <div className="pointer-events-auto animate-[toast-in_0.25s_ease-out] rounded-2xl bg-black/70 px-6 py-4 text-center text-sm font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm">
            {actionMessage}
          </div>
        </div>
      ) : null}
    </div>
  );
}

