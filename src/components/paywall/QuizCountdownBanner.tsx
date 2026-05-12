"use client";

import { useEffect, useState } from "react";
import { Clock, Flame } from "lucide-react";

/** Limited-release pricing window after quiz completion. 60 minutes. */
const COUNTDOWN_MS = 60 * 60 * 1000;

interface QuizCountdownBannerProps {
  /** Unix-ms timestamp of when the user first completed the quiz. */
  completedAt: number | null;
}

/**
 * Slim full-width urgency strip rendered above the quiz-results page.
 * Auto-removes itself once the limited-release window has elapsed OR if the
 * user is a returning visitor (completedAt was set on a previous session and
 * has already expired).
 */
export function QuizCountdownBanner({ completedAt }: QuizCountdownBannerProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // SSR + returning visitors: render nothing.
  if (now === null || completedAt === null) return null;
  const remaining = COUNTDOWN_MS - (now - completedAt);
  if (remaining <= 0) return null;

  const totalSec = Math.floor(remaining / 1000);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <div className="sticky top-16 z-40 overflow-hidden border-b border-[#0f6a52]/40 bg-[#0d3327] text-[#f1e9d4] shadow-[0_10px_30px_-20px_rgba(13,51,39,0.65)]">
      {/* Subtle shimmer overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 50%, rgba(125,211,167,0.18), transparent 32%), radial-gradient(circle at 88% 50%, rgba(125,211,167,0.12), transparent 36%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[120%] opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(241,233,212,0.18) 50%, transparent 100%)",
          animation: "shimmer 6s linear infinite",
        }}
      />
      <style>{`@keyframes shimmer { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }`}</style>

      <div className="relative mx-auto flex max-w-5xl flex-col items-start justify-between gap-3.5 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3.5 sm:items-center">
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0a85a]/15 ring-1 ring-inset ring-[#f0a85a]/30 sm:mt-0">
            <Flame className="h-5 w-5 text-[#f0a85a]" strokeWidth={2.4} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#7dd3a7]">
              Limited release &middot; live now
            </span>
            <span className="mt-1 text-[16px] font-extrabold tracking-tight text-[#f1e9d4] sm:text-[17px]">
              Discount held for the next 100 protocols
            </span>
            <span className="mt-0.5 text-[12px] text-[#f1e9d4]/65">
              <span className="font-semibold tabular-nums text-[#f1e9d4]/85">84 / 100</span>{" "}
              claimed &middot; this seat reserved for the next hour
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <div className="flex flex-col items-end gap-0.5 leading-none">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f1e9d4]/55">
              Expires in
            </span>
            <span className="text-[10.5px] text-[#f1e9d4]/45">Hold this price</span>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#f1e9d4]/[0.08] px-3.5 py-2 font-mono text-[22px] font-extrabold tabular-nums text-[#f1e9d4] ring-1 ring-inset ring-[#f1e9d4]/20 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[26px]"
            aria-live="off"
          >
            <Clock className="h-4 w-4 text-[#7dd3a7] sm:h-[18px] sm:w-[18px]" strokeWidth={2.4} />
            {hh}
            <span className="text-[#f1e9d4]/40">:</span>
            {mm}
            <span className="text-[#f1e9d4]/40">:</span>
            {ss}
          </span>
        </div>
      </div>
    </div>
  );
}
