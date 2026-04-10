import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, Crown, Sparkles } from "lucide-react";
import { getDisplayCode, type SbtiType } from "@/lib/sbti-data";

type TypeCardSize = "default" | "small" | "marquee";

type TypeCardProps = {
  type: SbtiType;
  href?: string;
  rank?: number;
  count?: number;
  share?: number;
  badge?: string;
  compact?: boolean;
  size?: TypeCardSize;
  className?: string;
};

export function TypeCard({
  type,
  href = `/result/${type.slug}`,
  rank,
  count,
  share,
  badge,
  compact = false,
  size = "default",
  className,
}: TypeCardProps) {
  const isSmall = size === "small";
  const isMarquee = size === "marquee";
  const isCondensed = compact || isSmall || isMarquee;

  const imageSizes = isMarquee
    ? "(max-width: 768px) 58vw, 14vw"
    : isSmall
      ? "(max-width: 768px) 48vw, 20vw"
      : compact
        ? "(max-width: 768px) 100vw, 25vw"
        : "(max-width: 768px) 100vw, 33vw";

  const content = (
    <>
      <div
        className={clsx(
          "relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,88,77,0.22),rgba(255,255,255,0)_58%),linear-gradient(180deg,rgba(8,34,30,0.08),rgba(255,255,255,0.95)_70%)]",
          isMarquee ? "aspect-[4/3.05]" : isSmall ? "aspect-[4/3.5]" : "aspect-[4/4.8]",
        )}
      >
        <div
          className={clsx(
            "absolute flex flex-wrap",
            isMarquee ? "left-3 top-3 gap-1.5" : isSmall ? "left-3 top-3 gap-2" : "left-4 top-4 gap-2",
          )}
        >
          {rank ? (
            <span
              className={clsx(
                "inline-flex items-center gap-1 rounded-full bg-[rgba(10,64,56,0.92)] font-semibold text-white",
                isCondensed ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs",
              )}
            >
              <Crown size={isCondensed ? 12 : 13} />
              #{rank}
            </span>
          ) : null}
          <span
            className={clsx(
              "inline-flex rounded-full border border-white/55 bg-white/72 font-medium text-[var(--ink-strong)]",
              isCondensed ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs",
            )}
          >
            {type.special ? "隐藏人格" : "标准人格"}
          </span>
        </div>

        <div
          className={clsx(
            "absolute bottom-0",
            isMarquee ? "inset-x-4 top-6" : isSmall ? "inset-x-5 top-8" : "inset-x-8 top-10",
          )}
        >
          <Image
            src={type.image}
            alt={`${type.cn}插画`}
            fill
            sizes={imageSizes}
            className="object-contain object-bottom transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </div>

      <div
        className={clsx(
          "flex flex-1 flex-col",
          isMarquee ? "gap-3 p-4" : isSmall ? "gap-3 p-4 sm:p-5" : "gap-4 p-5 sm:p-6",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={clsx(
              "rounded-full border border-[var(--gold)]/20 bg-[var(--gold-mist)] font-semibold tracking-[0.2em] text-[var(--emerald)] uppercase",
              isCondensed ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs",
            )}
          >
            {getDisplayCode(type.code)}
          </span>
          {badge ? (
            <span
              className={clsx(
                "inline-flex items-center gap-1 rounded-full bg-[var(--emerald)]/10 font-medium text-[var(--emerald)]",
                isCondensed ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs",
              )}
            >
              <Sparkles size={isCondensed ? 11 : 12} />
              {badge}
            </span>
          ) : null}
        </div>

        <div className={clsx("space-y-2", isMarquee && "min-h-[4.5rem]")}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={clsx(
                  "font-display font-semibold tracking-[0.03em] text-[var(--ink-strong)]",
                  isMarquee ? "text-lg leading-snug" : isSmall ? "text-xl" : "text-2xl",
                )}
              >
                {type.cn}
              </h3>
              <p
                className={clsx(
                  "text-[var(--ink-soft)]",
                  isMarquee ? "line-clamp-2 text-xs leading-5" : "text-sm",
                )}
              >
                {type.intro}
              </p>
            </div>
            {href ? (
              <span
                className={clsx(
                  "inline-flex shrink-0 items-center justify-center rounded-full border border-black/6 bg-[var(--paper)] text-[var(--emerald)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  isMarquee ? "h-8 w-8" : "h-10 w-10",
                )}
              >
                <ArrowUpRight size={isMarquee ? 14 : 16} />
              </span>
            ) : null}
          </div>

          {!isMarquee ? (
            <p
              className={clsx(
                "text-sm text-[var(--ink-soft)]",
                isCondensed ? "line-clamp-2 leading-6" : "line-clamp-3 leading-7",
              )}
            >
              {type.desc}
            </p>
          ) : null}
        </div>

        {rank || count || share ? (
          <div
            className={clsx(
              "mt-auto grid grid-cols-3 rounded-[22px] border border-black/6 bg-[var(--paper-strong)]",
              isCondensed ? "gap-2 p-3" : "gap-3 p-4",
            )}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                排名
              </p>
              <p
                className={clsx(
                  "font-semibold text-[var(--ink-strong)]",
                  isCondensed ? "mt-1.5 text-base" : "mt-2 text-lg",
                )}
              >
                {rank ? `#${rank}` : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                人数
              </p>
              <p
                className={clsx(
                  "font-semibold text-[var(--ink-strong)]",
                  isCondensed ? "mt-1.5 text-base" : "mt-2 text-lg",
                )}
              >
                {count ? count.toLocaleString("zh-CN") : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                占比
              </p>
              <p
                className={clsx(
                  "font-semibold text-[var(--ink-strong)]",
                  isCondensed ? "mt-1.5 text-base" : "mt-2 text-lg",
                )}
              >
                {typeof share === "number" ? `${(share * 100).toFixed(1)}%` : "-"}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );

  const classes = clsx(
    "group relative flex h-full flex-col overflow-hidden border border-black/6 bg-white/85 transition duration-300",
    isMarquee
      ? "rounded-[24px] shadow-[0_16px_40px_rgba(12,19,18,0.08)]"
      : isSmall
        ? "rounded-[24px] shadow-[0_16px_48px_rgba(12,19,18,0.08)]"
        : "rounded-[30px] shadow-[0_20px_60px_rgba(12,19,18,0.08)]",
    href
      ? "hover:-translate-y-1 hover:border-[var(--emerald)]/16 hover:shadow-[0_28px_80px_rgba(12,19,18,0.12)]"
      : "",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <article className={classes}>{content}</article>;
}
