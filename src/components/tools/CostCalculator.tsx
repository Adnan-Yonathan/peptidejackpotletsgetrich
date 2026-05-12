"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import {
  getPublishedPeptides,
  getPeptideBySlug,
  type PeptideData,
} from "@/data/peptides";
import {
  formatCostRange,
  getPeptideCostEstimate,
} from "@/lib/costs";
import type { ShopperRegion } from "@/lib/shopper-country";

interface Props {
  peptide?: PeptideData;
}

const ALL_PEPTIDES = getPublishedPeptides();

export function CostCalculator({ peptide }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string>(peptide?.slug ?? ALL_PEPTIDES[0]?.slug ?? "");
  const [cycleWeeks, setCycleWeeks] = useState<string>("12");
  const [region, setRegion] = useState<ShopperRegion>("us");

  const selected = peptide ?? getPeptideBySlug(selectedSlug);

  const result = useMemo(() => {
    if (!selected) return null;
    const estimate = getPeptideCostEstimate(selected.id, {
      shopperRegion: region,
      outputCurrency: "USD",
    });
    if (!estimate) return null;

    const weeks = parseFloat(cycleWeeks);
    if (!Number.isFinite(weeks) || weeks <= 0) return null;

    const months = weeks / 4.345;
    const cycleLow = estimate.monthlyCostLow * months;
    const cycleHigh = estimate.monthlyCostHigh * months;

    return {
      estimate,
      months,
      cycleLow,
      cycleHigh,
    };
  }, [selected, cycleWeeks, region]);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10">
      {/* Inputs */}
      <div className="rounded-[16px] border border-[#103b2c]/10 bg-white p-5 md:p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
          Inputs
        </p>

        <div className="mt-5 space-y-5">
          {!peptide && (
            <div>
              <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
                Peptide
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3 text-[14px] font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52]"
              >
                {ALL_PEPTIDES.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
              Cycle length
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={cycleWeeks}
                onChange={(e) => setCycleWeeks(e.target.value)}
                className="h-11 w-full rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3 pr-16 text-[15px] font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#103b2c]/45">
                weeks
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["4", "8", "12", "16", "24"].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setCycleWeeks(w)}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-semibold transition-colors ${
                    cycleWeeks === w
                      ? "border-[#0f6a52] bg-[#0f6a52]/10 text-[#0f6a52]"
                      : "border-[#103b2c]/15 text-[#103b2c]/65 hover:border-[#103b2c]/30"
                  }`}
                >
                  {w}w
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
              Shipping region
            </label>
            <div className="inline-flex rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] p-1 text-[12px] font-semibold">
              <button
                type="button"
                onClick={() => setRegion("us")}
                className={`rounded-[6px] px-4 py-1.5 transition-colors ${
                  region === "us" ? "bg-[#103b2c] text-white" : "text-[#103b2c]/65"
                }`}
              >
                U.S.
              </button>
              <button
                type="button"
                onClick={() => setRegion("international")}
                className={`rounded-[6px] px-4 py-1.5 transition-colors ${
                  region === "international" ? "bg-[#103b2c] text-white" : "text-[#103b2c]/65"
                }`}
              >
                International
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="rounded-[16px] border border-[#0f6a52]/30 bg-[#0f6a52]/5 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-[#0f6a52]" strokeWidth={2.25} />
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
            Estimate
          </p>
        </div>

        {!selected ? (
          <p className="mt-6 text-[14px] text-[#103b2c]/60">Pick a peptide to see costs.</p>
        ) : !result ? (
          <p className="mt-6 text-[14px] text-[#103b2c]/60">
            We don&rsquo;t have tracked listing data for {selected.name} yet. Check the vendor page
            for current pricing.
          </p>
        ) : (
          <>
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/45">
                Full cycle ({cycleWeeks}w)
              </p>
              <p className="mt-2 text-[40px] font-extrabold leading-none tracking-[-0.03em] text-[#103b2c] md:text-[52px]">
                {formatCostRange(result.cycleLow, result.cycleHigh, "USD")}
              </p>
              <p className="mt-2 text-[12.5px] text-[#103b2c]/65">
                {selected.name} &middot; {region === "us" ? "U.S." : "International"} route
              </p>
            </div>

            <dl className="mt-6 grid gap-px border-y border-[#103b2c]/10 bg-[#103b2c]/10 sm:grid-cols-2">
              <div className="bg-[#0f6a52]/5 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                  Per month
                </dt>
                <dd className="mt-1.5 text-[16px] font-semibold text-[#103b2c]">
                  {formatCostRange(
                    result.estimate.monthlyCostLow,
                    result.estimate.monthlyCostHigh,
                    result.estimate.currencyCode
                  )}
                </dd>
              </div>
              <div className="bg-[#0f6a52]/5 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                  Confidence
                </dt>
                <dd className="mt-1.5 text-[16px] font-semibold capitalize text-[#103b2c]">
                  {result.estimate.confidence}
                </dd>
                <dd className="text-[11.5px] text-[#103b2c]/55">
                  Based on {result.estimate.basedOnListings} tracked listing
                  {result.estimate.basedOnListings === 1 ? "" : "s"}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-[11.5px] leading-[1.55] text-[#103b2c]/55">
              Estimates pulled from tracked vendor listings, normalized to USD. Final pricing varies
              by vial size, dosing, and shipping route.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-[#103b2c]/10 pt-5">
              <Link
                href={`/vendors?peptide=${selected.slug}`}
                className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#103b2c] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0c3226]"
              >
                Compare vendors
                <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
              </Link>
              <Link
                href={`/peptides/${selected.slug}`}
                className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors hover:text-[#0f6a52]"
              >
                Open profile
                <ArrowRight
                  className="h-3 w-3 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
