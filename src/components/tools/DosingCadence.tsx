"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

interface CadenceRecommendation {
  label: string;
  cadence: string;
  rationale: string;
  splitsPerWeek: number;
  pillClass: string;
}

function recommend(halfLifeHours: number, peakTroughRatio: number): CadenceRecommendation {
  // The math: if you want peak/trough <= R, you need to dose at most
  // log2(R) half-lives apart.
  const maxIntervalHours = Math.log2(peakTroughRatio) * halfLifeHours;

  if (!Number.isFinite(maxIntervalHours) || maxIntervalHours <= 0) {
    return {
      label: "Verify input",
      cadence: "—",
      rationale: "Half-life and target ratio must both be positive numbers.",
      splitsPerWeek: 0,
      pillClass: "bg-amber-500/10 text-amber-700",
    };
  }

  if (maxIntervalHours < 6) {
    return {
      label: "Multiple times daily",
      cadence: `Every ${maxIntervalHours.toFixed(1)} h (≈ ${Math.ceil(24 / maxIntervalHours)}× per day)`,
      rationale: "Short half-life requires near-continuous redosing to keep peak/trough within range.",
      splitsPerWeek: Math.ceil(24 / maxIntervalHours) * 7,
      pillClass: "bg-red-500/10 text-red-700",
    };
  }
  if (maxIntervalHours < 14) {
    return {
      label: "Twice daily",
      cadence: `Every ${maxIntervalHours.toFixed(1)} h (≈ 2× per day)`,
      rationale: "Short-acting peptide. Splitting AM/PM keeps levels within the target band.",
      splitsPerWeek: 14,
      pillClass: "bg-amber-500/10 text-amber-700",
    };
  }
  if (maxIntervalHours < 30) {
    return {
      label: "Once daily",
      cadence: `Every ${maxIntervalHours.toFixed(1)} h (1× per day)`,
      rationale: "Daily dosing keeps plasma levels stable for most use cases.",
      splitsPerWeek: 7,
      pillClass: "bg-[#0f6a52]/10 text-[#0f6a52]",
    };
  }
  if (maxIntervalHours < 96) {
    return {
      label: "Every 2–3 days",
      cadence: `Every ${maxIntervalHours.toFixed(0)} h (≈ ${(maxIntervalHours / 24).toFixed(1)} days)`,
      rationale: "Longer half-life. Spacing doses across multiple days reduces injection burden.",
      splitsPerWeek: Math.max(2, Math.round(7 / (maxIntervalHours / 24))),
      pillClass: "bg-[#0f6a52]/10 text-[#0f6a52]",
    };
  }
  return {
    label: "Weekly or longer",
    cadence: `Every ${(maxIntervalHours / 24).toFixed(1)} days (~ weekly)`,
    rationale: "Long half-life supports weekly or longer dosing while staying in range.",
    splitsPerWeek: 1,
    pillClass: "bg-[#0f6a52]/10 text-[#0f6a52]",
  };
}

export function DosingCadence() {
  const [halfLife, setHalfLife] = useState<string>("4");
  const [ratio, setRatio] = useState<string>("4");

  const result = useMemo(() => {
    const h = parseFloat(halfLife);
    const r = parseFloat(ratio);
    if (!Number.isFinite(h) || !Number.isFinite(r)) return null;
    return recommend(h, r);
  }, [halfLife, ratio]);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10">
      <div className="rounded-[16px] border border-[#103b2c]/10 bg-white p-5 md:p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
          Inputs
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
              Half-life
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={halfLife}
                onChange={(e) => setHalfLife(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3 pr-14 text-[15px] font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#103b2c]/45">
                hours
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { v: "0.5", label: "30 min" },
                { v: "4", label: "4 h" },
                { v: "12", label: "12 h" },
                { v: "24", label: "1 day" },
                { v: "168", label: "7 days" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setHalfLife(opt.v)}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-semibold transition-colors ${
                    halfLife === opt.v
                      ? "border-[#0f6a52] bg-[#0f6a52]/10 text-[#0f6a52]"
                      : "border-[#103b2c]/15 text-[#103b2c]/65 hover:border-[#103b2c]/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
              Target peak / trough ratio
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3 pr-14 text-[15px] font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#103b2c]/45">
                ratio
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { v: "2", label: "2× (tight)" },
                { v: "4", label: "4× (typical)" },
                { v: "8", label: "8× (loose)" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setRatio(opt.v)}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-semibold transition-colors ${
                    ratio === opt.v
                      ? "border-[#0f6a52] bg-[#0f6a52]/10 text-[#0f6a52]"
                      : "border-[#103b2c]/15 text-[#103b2c]/65 hover:border-[#103b2c]/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] text-[#103b2c]/55">
              Lower ratios = more stable plasma levels but more frequent dosing.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#0f6a52]/30 bg-[#0f6a52]/5 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#0f6a52]" strokeWidth={2.25} />
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
            Recommended cadence
          </p>
        </div>

        {!result ? (
          <p className="mt-6 text-[14px] text-[#103b2c]/60">
            Enter a half-life and target ratio.
          </p>
        ) : (
          <>
            <span
              className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${result.pillClass}`}
            >
              {result.label}
            </span>
            <p className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#103b2c] md:text-[34px]">
              {result.cadence}
            </p>
            <p className="mt-3 max-w-[480px] text-[14px] leading-[1.6] text-[#103b2c]/70">
              {result.rationale}
            </p>
            {result.splitsPerWeek > 0 && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#103b2c]/55">
                {result.splitsPerWeek} dose{result.splitsPerWeek === 1 ? "" : "s"} per week
              </p>
            )}
            <p className="mt-6 text-[11.5px] leading-[1.55] text-[#103b2c]/55">
              This is a research-math heuristic only. Real-world cadence depends on the compound&rsquo;s
              full pharmacokinetics, route of administration, and study protocol &mdash; not just half-life.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
