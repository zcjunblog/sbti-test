import Image from "next/image";

type LogoMarkProps = {
  compact?: boolean;
};

export function LogoMark({ compact = false }: LogoMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(4,21,18,0.18)]">
        <Image
          src="/brand/sbti-logo.svg"
          alt="SBTI 标志"
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold tracking-[0.16em] text-[var(--ink-strong)]">
            赛博人格测定局
          </p>
          <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)] uppercase">
            Spectral Brain Type Index
          </p>
        </div>
      ) : null}
    </div>
  );
}
