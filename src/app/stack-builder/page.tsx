"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Dumbbell,
  Eraser,
  FlaskConical,
  HeartPulse,
  Leaf,
  Minus,
  Plus,
  Save,
  Search,
  ShieldAlert,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCompatibility } from "@/data/compatibility";
import { DISCLAIMERS } from "@/data/disclaimers";
import { AFFILIATE_VENDOR_LINKS } from "@/data/affiliate-links";
import { getGoalsForPeptide } from "@/data/goals";
import { getPeptideById, getStackablePeptides, type PeptideData, type RiskLevel } from "@/data/peptides";
import { getListingPriceBounds, type ResolvedVendorListing } from "@/data/vendor-listings";
import { useStackBuilder } from "@/hooks/useStackBuilder";
import {
  convertCurrencyValue,
  formatCostRange,
  formatUsageModelLabel,
  getPeptideCostEstimate,
  getStackCostEstimate,
} from "@/lib/costs";
import { buildOutboundVendorHref, getRegionalVendorOptionsForPeptide } from "@/lib/outbound-vendors";
import type { ShopperRegion } from "@/lib/shopper-country";

const STACK_BUILDER_CURRENCY = "USD" as const;

type StackPreset = {
  id: string;
  title: string;
  subtitle: string;
  peptideIds: string[];
  icon: LucideIcon;
};

const STARTING_POINTS: StackPreset[] = [
  {
    id: "fat-loss",
    title: "Fat Loss Starter",
    subtitle: "Boost metabolism, preserve lean mass, and amplify cut-phase results.",
    peptideIds: ["semaglutide", "aod-9604", "mots-c"],
    icon: Sparkles,
  },
  {
    id: "muscle-recovery",
    title: "Muscle Growth & Recovery",
    subtitle: "Build lean mass and shorten recovery between hard sessions.",
    peptideIds: ["ipamorelin", "cjc-1295", "bpc-157", "tb-500"],
    icon: Dumbbell,
  },
  {
    id: "injury-recovery",
    title: "Injury Recovery",
    subtitle: "Heal soft tissue, calm inflammation, and get back to training sooner.",
    peptideIds: ["bpc-157", "tb-500", "thymosin-beta-4"],
    icon: HeartPulse,
  },
  {
    id: "anti-aging",
    title: "Anti-Aging & Wellness",
    subtitle: "Support longevity, energy, skin quality, and overall vitality.",
    peptideIds: ["epitalon", "humanin", "ghk-cu", "mots-c"],
    icon: Leaf,
  },
];

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Low Risk",
  "med-high": "Med-High Risk",
  high: "High Risk",
  extreme: "High Risk",
};

const RISK_BADGES: Record<RiskLevel, string> = {
  low: "bg-[#0f6a52]/10 text-[#0f6a52]",
  medium: "bg-[#0f6a52]/10 text-[#0f6a52]",
  "med-high": "bg-amber-500/10 text-amber-700",
  high: "bg-amber-500/10 text-amber-700",
  extreme: "bg-red-500/10 text-red-700",
};

function getSummaryTone(hasContraindicated: boolean, cautionCount: number) {
  if (hasContraindicated) {
    return {
      label: "Blocked",
      badge: "bg-red-500/10 text-red-700",
      dot: "#dc2626",
      note: "One or more combinations should not be used together.",
    };
  }

  if (cautionCount > 0) {
    return {
      label: "Caution",
      badge: "bg-amber-500/10 text-amber-700",
      dot: "#d97706",
      note: "There are additive-risk pairings worth reviewing before saving this stack.",
    };
  }

  return {
    label: "Compatible",
    badge: "bg-[#0f6a52]/10 text-[#0f6a52]",
    dot: "#0f6a52",
    note: "No major conflict detected. These compounds work well together.",
  };
}

function getCycleLength(items: Array<{ peptide: PeptideData }>) {
  const labels = Array.from(
    new Set(
      items
        .map((item) => getPeptideCostEstimate(item.peptide.id)?.cycleLabel)
        .filter((value): value is string => Boolean(value))
    )
  );

  if (labels.length === 0) return "Protocol varies";
  if (labels.length === 1) return labels[0];
  if (labels.some((label) => label.includes("Continuous"))) return "Mixed, includes continuous";
  return "Mixed protocols";
}

function formatListingPriceUsd(listing: ResolvedVendorListing) {
  const bounds = getListingPriceBounds(listing);

  if (!bounds) {
    return "Vendor price shown on site";
  }

  return `${formatCostRange(
    convertCurrencyValue(bounds.low, bounds.currencyCode, STACK_BUILDER_CURRENCY),
    convertCurrencyValue(bounds.high, bounds.currencyCode, STACK_BUILDER_CURRENCY),
    STACK_BUILDER_CURRENCY
  )} listing price`;
}

function getStartingPointDetails(preset: StackPreset) {
  const peptides = preset.peptideIds
    .map((peptideId) => getPeptideById(peptideId))
    .filter((peptide): peptide is PeptideData => Boolean(peptide));
  const stackCost = getStackCostEstimate(peptides.map((peptide) => ({ peptideId: peptide.id, quantity: 1 })), {
    outputCurrency: STACK_BUILDER_CURRENCY,
  });

  return {
    peptides,
    cost: stackCost
      ? formatCostRange(stackCost.monthlyCostLow, stackCost.monthlyCostHigh, stackCost.currencyCode)
      : "See stack",
  };
}

export default function StackBuilderPage() {
  const {
    name,
    items,
    warnings,
    setName,
    replaceStack,
    addItem,
    removeItem,
    updateQuantity,
    hasContraindicated,
    clear,
  } = useStackBuilder();
  const [search, setSearch] = useState("");
  const [shopperRegion, setShopperRegion] = useState<ShopperRegion>("us");

  const stackablePeptides = getStackablePeptides();
  const addedIds = useMemo(() => new Set(items.map((item) => item.peptide.id)), [items]);

  const filteredPeptides = useMemo(
    () =>
      stackablePeptides.filter((peptide) => {
        if (addedIds.has(peptide.id)) return false;

        const q = search.toLowerCase();
        return (
          peptide.name.toLowerCase().includes(q) ||
          peptide.synonyms.some((synonym) => synonym.toLowerCase().includes(q)) ||
          peptide.category.toLowerCase().includes(q)
        );
      }),
    [addedIds, search, stackablePeptides]
  );

  const cautionPairs = warnings.filter((warning) => warning.status === "caution");
  const blockedPairs = warnings.filter((warning) => warning.status === "contraindicated");
  const stackCost = getStackCostEstimate(
    items.map((item) => ({ peptideId: item.peptide.id, quantity: item.quantity })),
    { shopperRegion, outputCurrency: STACK_BUILDER_CURRENCY }
  );
  const compatibilityTone = getSummaryTone(hasContraindicated(), cautionPairs.length);
  const affiliatedVendorOptions = useMemo(
    () =>
      items
        .map((item) => {
          const regionalOptions = getRegionalVendorOptionsForPeptide(item.peptide.id);
          if (!regionalOptions.us && !regionalOptions.international) {
            return null;
          }

          return {
            peptide: item.peptide,
            quantity: item.quantity,
            us: regionalOptions.us,
            international: regionalOptions.international,
          };
        })
        .filter((option): option is NonNullable<typeof option> => Boolean(option)),
    [items]
  );
  const unmappedAffiliateVendors = useMemo(
    () =>
      AFFILIATE_VENDOR_LINKS.filter(
        (vendor) =>
          !affiliatedVendorOptions.some(
            (option) =>
              option.us?.vendor?.id === vendor.vendorId ||
              option.international?.vendor?.id === vendor.vendorId
          )
      ),
    [affiliatedVendorOptions]
  );

  const suggestedAdds = useMemo(() => {
    if (items.length === 0) return [];

    return stackablePeptides
      .filter((candidate) => !addedIds.has(candidate.id))
      .map((candidate) => {
        const sharedGoals = getGoalsForPeptide(candidate.id)
          .map((goal) => goal.id)
          .filter((goalId) => items.some((item) => getGoalsForPeptide(item.peptide.id).some((goal) => goal.id === goalId)));

        const allCompatible = items.every((item) => getCompatibility(candidate.id, item.peptide.id).status !== "contraindicated");
        const cautionCount = items.filter((item) => getCompatibility(candidate.id, item.peptide.id).status === "caution").length;

        return {
          peptide: candidate,
          sharedGoals,
          allCompatible,
          cautionCount,
          score: sharedGoals.length * 5 - cautionCount * 2,
        };
      })
      .filter((candidate) => candidate.allCompatible && candidate.sharedGoals.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [addedIds, items, stackablePeptides]);

  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7]">
        <section
          aria-labelledby="stack-builder-h1"
          className="border-b border-[#103b2c]/8 bg-[#fbfaf7] pt-10 pb-6 md:pt-14 md:pb-8"
        >
          <div className="container mx-auto max-w-6xl px-4">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              Tool &middot; Live compatibility checker
            </p>
            <h1
              id="stack-builder-h1"
              className="max-w-[820px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[28px] sm:text-[36px] md:text-[44px]"
            >
              Peptide stack builder.
            </h1>
            <p className="mt-4 max-w-[640px] text-[15.5px] leading-[1.6] text-[#103b2c]/68">
              Combine compounds and see pathway overlap, receptor competition, and dosing-window
              conflicts in real time. Stacks pull pricing from tracked vendor listings and route
              to evidence-graded{" "}
              <Link href="/peptides" className="font-semibold text-[#0f6a52] underline-offset-4 hover:underline">
                compound profiles
              </Link>{" "}
              and side-by-side{" "}
              <Link
                href="/compare/peptides"
                className="font-semibold text-[#0f6a52] underline-offset-4 hover:underline"
              >
                comparisons
              </Link>
              . Not sure where to start? Take the{" "}
              <Link href="/quiz" className="font-semibold text-[#0f6a52] underline-offset-4 hover:underline">
                peptide quiz
              </Link>{" "}
              first.
            </p>
          </div>
        </section>

        <section
          id="starting-points"
          className="bg-[#fbfaf7] pt-12 pb-12 md:pt-16 md:pb-16"
        >
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {STARTING_POINTS.map((preset, index) => {
                const details = getStartingPointDetails(preset);
                const Icon = preset.icon;
                const indexLabel = String(index + 1).padStart(2, "0");

                return (
                  <button
                    key={preset.id}
                    onClick={() => replaceStack(preset.title, details.peptides)}
                    className="group flex flex-col items-start rounded-[18px] border border-[#103b2c]/12 bg-[#fbfaf7] p-6 text-left transition-all hover:-translate-y-0.5 hover:border-[#0f6a52]/40 hover:shadow-[0_18px_40px_-30px_rgba(16,59,44,0.4)]"
                  >
                    <div className="mb-5 flex w-full items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f6a52]/10 text-[#0f6a52]">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#103b2c]/40">
                        {indexLabel}
                      </span>
                    </div>

                    <h3 className="mb-2 text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c]">
                      {preset.title}
                    </h3>
                    <p className="mb-5 min-h-[44px] text-[13.5px] leading-[1.55] text-[#103b2c]/65">
                      {preset.subtitle}
                    </p>

                    <dl className="mb-5 grid w-full grid-cols-2 gap-y-1 border-t border-[#103b2c]/10 pt-4 text-[12px]">
                      <dt className="font-mono uppercase tracking-[0.14em] text-[#103b2c]/45">Compounds</dt>
                      <dd className="text-right font-semibold text-[#103b2c]">{preset.peptideIds.length}</dd>
                      <dt className="font-mono uppercase tracking-[0.14em] text-[#103b2c]/45">Est./mo</dt>
                      <dd className="text-right font-semibold text-[#103b2c]">{details.cost}</dd>
                    </dl>

                    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors group-hover:text-[#0f6a52]">
                      Load stack
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#fbfaf7] pb-16 md:pb-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-center justify-end gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={clear}
                  className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3.5 text-[13px] font-semibold text-[#103b2c] transition-colors hover:border-[#103b2c]/30 hover:bg-white"
                >
                  <Eraser className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Clear
                </button>
                <button className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#103b2c] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0c3226]">
                  <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Save stack
                </button>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_1.3fr_0.95fr]">
              {/* CATALOG */}
              <div className="rounded-[18px] border border-[#103b2c]/10 bg-white">
                <div className="border-b border-[#103b2c]/8 px-5 py-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/50">
                    Catalog
                  </p>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#103b2c]/40"
                      strokeWidth={2}
                    />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search peptides…"
                      className="h-10 rounded-[10px] border-[#103b2c]/15 bg-[#fbfaf7] pl-9 text-[13px] shadow-none focus-visible:border-[#0f6a52]"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["All", "Recovery", "Fat Loss", "Muscle", "GH", "Cognitive"].map((tag, index) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                          index === 0
                            ? "bg-[#103b2c] text-white"
                            : "bg-[#103b2c]/5 text-[#103b2c]/70"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="divide-y divide-[#103b2c]/8">
                  {filteredPeptides.slice(0, 8).map((peptide) => {
                    const estimate = getPeptideCostEstimate(peptide.id, {
                      shopperRegion,
                      outputCurrency: STACK_BUILDER_CURRENCY,
                    });

                    return (
                      <li key={peptide.id}>
                        <button
                          onClick={() => addItem(peptide)}
                          className="group flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[#fbfaf7]"
                        >
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-[#103b2c]">{peptide.name}</p>
                            <p className="mt-1 text-[12px] leading-[1.5] text-[#103b2c]/60">
                              {peptide.shortDescription}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${RISK_BADGES[peptide.riskLevel]}`}
                              >
                                {RISK_LABELS[peptide.riskLevel]}
                              </span>
                              {estimate && (
                                <span className="rounded-full bg-[#103b2c]/5 px-2 py-0.5 font-mono text-[10px] text-[#103b2c]/65">
                                  {formatCostRange(
                                    estimate.monthlyCostLow,
                                    estimate.monthlyCostHigh,
                                    estimate.currencyCode
                                  )}
                                  /mo
                                </span>
                              )}
                              {estimate && (
                                <span className="rounded-full bg-[#103b2c]/5 px-2 py-0.5 font-mono text-[10px] text-[#103b2c]/65">
                                  {formatUsageModelLabel(estimate.usageModel)}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#103b2c]/15 text-[#103b2c]/60 transition-colors group-hover:border-[#0f6a52] group-hover:bg-[#0f6a52] group-hover:text-white">
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-[#103b2c]/8 px-5 py-4">
                  <Link
                    href="/peptides"
                    className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors hover:text-[#0f6a52]"
                  >
                    Browse all peptides
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>

              {/* STACK */}
              <div className="rounded-[18px] border border-[#103b2c]/10 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#103b2c]/8 px-5 py-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/50">
                      Stack &middot; {items.length}
                    </p>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-1 h-7 max-w-[260px] border-0 bg-transparent p-0 text-[16px] font-semibold tracking-[-0.01em] text-[#103b2c] shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${compatibilityTone.badge}`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: compatibilityTone.dot, boxShadow: `0 0 6px ${compatibilityTone.dot}` }}
                    />
                    {compatibilityTone.label}
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="px-5 py-16 text-center">
                    <FlaskConical className="mx-auto mb-4 h-8 w-8 text-[#103b2c]/30" strokeWidth={1.5} />
                    <p className="text-[14px] font-semibold text-[#103b2c]">Your workbench is empty.</p>
                    <p className="mx-auto mt-1.5 max-w-[280px] text-[13px] leading-[1.55] text-[#103b2c]/55">
                      Load a starting point above, or search the catalog and drop in 2&ndash;4 compounds to begin.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-[#103b2c]/8">
                    {items.map((item, index) => {
                      const estimate = getPeptideCostEstimate(item.peptide.id, {
                        shopperRegion,
                        outputCurrency: STACK_BUILDER_CURRENCY,
                      });
                      return (
                        <li
                          key={item.peptide.id}
                          className="grid grid-cols-[auto_1fr_auto] items-start gap-4 px-5 py-4"
                        >
                          <span className="font-mono text-[14px] font-medium text-[#103b2c]/35 tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[14px] font-semibold text-[#103b2c]">{item.peptide.name}</p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${RISK_BADGES[item.peptide.riskLevel]}`}
                              >
                                {RISK_LABELS[item.peptide.riskLevel]}
                              </span>
                            </div>
                            <p className="mt-1 text-[12px] leading-[1.5] text-[#103b2c]/60">
                              {item.peptide.studyDoseRange.split(".")[0]}
                            </p>
                            {estimate && (
                              <p className="mt-1.5 font-mono text-[11px] text-[#103b2c]/55">
                                {formatCostRange(
                                  estimate.monthlyCostLow * item.quantity,
                                  estimate.monthlyCostHigh * item.quantity,
                                  estimate.currencyCode
                                )}
                                /mo &middot; {estimate.cycleLabel}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.peptide.id, Math.max(1, item.quantity - 1))}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#103b2c]/12 text-[#103b2c]/65 transition-colors hover:border-[#103b2c]/30 hover:text-[#103b2c]"
                            >
                              <Minus className="h-3 w-3" strokeWidth={2.5} />
                            </button>
                            <span className="w-6 text-center font-mono text-[13px] font-semibold text-[#103b2c]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.peptide.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#103b2c]/12 text-[#103b2c]/65 transition-colors hover:border-[#103b2c]/30 hover:text-[#103b2c]"
                            >
                              <Plus className="h-3 w-3" strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => removeItem(item.peptide.id)}
                              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-[#103b2c]/40 transition-colors hover:bg-red-500/10 hover:text-red-600"
                            >
                              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {suggestedAdds.length > 0 && (
                  <div className="border-t border-[#103b2c]/8 bg-[#fbfaf7]/60 px-5 py-4">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f6a52]">
                      Suggested next add
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {suggestedAdds.slice(0, 2).map(({ peptide }) => (
                        <button
                          key={peptide.id}
                          onClick={() => addItem(peptide)}
                          className="group flex items-center justify-between rounded-[10px] border border-[#103b2c]/10 bg-white px-3 py-2.5 text-left transition-colors hover:border-[#0f6a52]/40"
                        >
                          <div>
                            <p className="text-[13px] font-semibold text-[#103b2c]">{peptide.name}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#103b2c]/45">
                              {peptide.category.replaceAll("_", " ")}
                            </p>
                          </div>
                          <Plus className="h-4 w-4 text-[#103b2c]/40 transition-colors group-hover:text-[#0f6a52]" strokeWidth={2.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* READOUT */}
              <div className="space-y-5">
                <div className="rounded-[18px] border border-[#103b2c]/10 bg-white">
                  <div className="border-b border-[#103b2c]/8 px-5 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/50">
                      Readout
                    </p>
                  </div>

                  <div className="border-b border-[#103b2c]/8 p-5">
                    <div className="inline-flex rounded-[10px] border border-[#103b2c]/12 bg-[#fbfaf7] p-1 text-[11px] font-semibold">
                      <button
                        onClick={() => setShopperRegion("us")}
                        className={`rounded-[7px] px-3 py-1.5 transition-colors ${
                          shopperRegion === "us"
                            ? "bg-[#103b2c] text-white"
                            : "text-[#103b2c]/60 hover:text-[#103b2c]"
                        }`}
                      >
                        U.S.
                      </button>
                      <button
                        onClick={() => setShopperRegion("international")}
                        className={`rounded-[7px] px-3 py-1.5 transition-colors ${
                          shopperRegion === "international"
                            ? "bg-[#103b2c] text-white"
                            : "text-[#103b2c]/60 hover:text-[#103b2c]"
                        }`}
                      >
                        International
                      </button>
                    </div>
                  </div>

                  <dl className="divide-y divide-[#103b2c]/8">
                    <div className="px-5 py-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                        Est. monthly cost
                      </dt>
                      <dd className="mt-1.5 text-[26px] font-extrabold tracking-[-0.02em] text-[#103b2c]">
                        {stackCost
                          ? formatCostRange(
                              stackCost.monthlyCostLow,
                              stackCost.monthlyCostHigh,
                              stackCost.currencyCode
                            )
                          : "—"}
                      </dd>
                      <dd className="mt-1 text-[12px] leading-[1.5] text-[#103b2c]/55">
                        Tracked affiliated listing pricing &middot; {shopperRegion === "us" ? "U.S." : "International"} route.
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-[#103b2c]/8">
                      <div className="px-5 py-4">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                          Protocol
                        </dt>
                        <dd className="mt-1.5 text-[14px] font-semibold leading-[1.3] text-[#103b2c]">
                          {getCycleLength(items)}
                        </dd>
                      </div>
                      <div className="px-5 py-4">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                          Compounds
                        </dt>
                        <dd className="mt-1.5 text-[14px] font-semibold leading-[1.3] text-[#103b2c]">
                          {items.length || 0} active
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <div className="border-t border-[#103b2c]/8 bg-[#fbfaf7]/60 p-5">
                    <p className="flex items-start gap-2 text-[12px] leading-[1.55] text-[#103b2c]/70">
                      <ShieldAlert
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        style={{ color: compatibilityTone.dot }}
                        strokeWidth={2.5}
                      />
                      <span>{compatibilityTone.note}</span>
                    </p>
                  </div>

                  {affiliatedVendorOptions.length > 0 && (
                    <div className="border-t border-[#103b2c]/8 p-5">
                      <a
                        href="#affiliated-vendors"
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[#103b2c] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0c3226]"
                      >
                        View affiliated vendors
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </a>
                    </div>
                  )}
                </div>

                {(blockedPairs.length > 0 || cautionPairs.length > 0) && (
                  <div className="rounded-[18px] border border-[#103b2c]/10 bg-white">
                    <div className="border-b border-[#103b2c]/8 px-5 py-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/50">
                        Compatibility notes
                      </p>
                    </div>
                    <ul className="divide-y divide-[#103b2c]/8">
                      {blockedPairs.map((warning, index) => (
                        <li
                          key={`blocked-${warning.peptideA}-${warning.peptideB}-${index}`}
                          className="flex items-start gap-3 px-5 py-4"
                        >
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
                          <div>
                            <p className="text-[13px] font-semibold text-[#103b2c]">
                              {getPeptideById(warning.peptideA)?.name} &times; {getPeptideById(warning.peptideB)?.name}
                            </p>
                            <p className="mt-1 text-[12px] leading-[1.55] text-[#103b2c]/65">{warning.summary}</p>
                          </div>
                        </li>
                      ))}
                      {cautionPairs.slice(0, 2).map((warning, index) => (
                        <li
                          key={`caution-${warning.peptideA}-${warning.peptideB}-${index}`}
                          className="flex items-start gap-3 px-5 py-4"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={2.5} />
                          <div>
                            <p className="text-[13px] font-semibold text-[#103b2c]">
                              {getPeptideById(warning.peptideA)?.name} &times; {getPeptideById(warning.peptideB)?.name}
                            </p>
                            <p className="mt-1 text-[12px] leading-[1.55] text-[#103b2c]/65">{warning.summary}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────
            VENDOR ROUTES
            Sand band. Editorial list (rows over cards),
            mono price/qty columns, underlined CTA.
            ──────────────────────────────────────────── */}
        {affiliatedVendorOptions.length > 0 && (
          <section
            id="affiliated-vendors"
            className="border-y border-[#103b2c]/8 bg-[#f4f1ea] py-12 md:py-16"
          >
            <div className="container mx-auto max-w-6xl px-4">
              <p className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
                Vendor Routes
              </p>
              <ol className="border-t border-[#103b2c]/15">
                {affiliatedVendorOptions.map((option) => {
                  const estimate = getPeptideCostEstimate(option.peptide.id, {
                    shopperRegion,
                    outputCurrency: STACK_BUILDER_CURRENCY,
                  });
                  const primaryOption =
                    shopperRegion === "us" ? option.us ?? option.international : option.international ?? option.us;

                  if (!primaryOption) return null;

                  return (
                    <li key={option.peptide.id} className="border-b border-[#103b2c]/15">
                      <div className="grid items-center gap-x-6 gap-y-3 py-6 md:grid-cols-[1.2fr_1fr_auto] md:py-7">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f6a52]">
                            {primaryOption.target?.mode === "affiliate_product"
                              ? "Direct product link"
                              : "Vendor route"}{" "}
                            &middot; Qty {option.quantity}
                          </p>
                          <h3 className="mt-1 text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c] md:text-[26px]">
                            {option.peptide.name}
                          </h3>
                          <p className="mt-1 text-[13px] text-[#103b2c]/65">
                            {primaryOption.vendor?.name ?? primaryOption.listing.vendorName} &middot;{" "}
                            {primaryOption.listing.vendorTypeLabel}
                          </p>
                        </div>

                        <div className="space-y-1 text-[12.5px] text-[#103b2c]/70">
                          <p className="font-mono">{primaryOption.listing.typicalSkuFormat}</p>
                          <p className="font-mono">{formatListingPriceUsd(primaryOption.listing)}</p>
                          {estimate && (
                            <p className="font-mono">
                              ~ {formatCostRange(
                                estimate.monthlyCostLow * option.quantity,
                                estimate.monthlyCostHigh * option.quantity,
                                estimate.currencyCode
                              )}
                              /mo
                            </p>
                          )}
                          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#103b2c]/45">
                            {primaryOption.listing.coaAccessModeLabel}
                          </p>
                        </div>

                        <a
                          href={buildOutboundVendorHref(
                            primaryOption.vendor?.slug ?? primaryOption.listing.vendorId,
                            option.peptide.slug,
                            "stack-builder"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#103b2c] bg-[#103b2c] px-5 py-3 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0c3226]"
                        >
                          Go to {primaryOption.vendor?.name ?? primaryOption.listing.vendorName}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {unmappedAffiliateVendors.length > 0 && (
                <div className="mt-10 border-t border-[#103b2c]/10 pt-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/50">
                    Other affiliated vendors
                  </p>
                  <p className="mt-2 max-w-[720px] text-[13px] leading-[1.55] text-[#103b2c]/60">
                    These vendors have affiliate links configured but don&rsquo;t appear above &mdash; we
                    don&rsquo;t have peptide-level listing or product mapping for your current stack yet.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {unmappedAffiliateVendors.map((vendor) => (
                      <Button
                        key={vendor.vendorId}
                        variant="outline"
                        className="rounded-[10px] border-[#103b2c]/15 bg-[#fbfaf7] text-[13px] text-[#103b2c]"
                        render={<a href={vendor.defaultAffiliateUrl} target="_blank" rel="noreferrer" />}
                      >
                        Browse {vendor.vendorName}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-16 md:py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="mb-10">
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
                <span className="h-px w-6 bg-[#103b2c]/40" />
                FAQ
              </p>
              <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-black text-[32px] sm:text-[40px] md:text-[44px]">
                Common{" "}
                <span className="relative inline-block italic text-[#0f6a52]">
                  <span className="relative z-10">questions</span>
                </span>
                .
              </h2>
            </div>

            <div className="border-t border-[#103b2c]/15">
              {[
                {
                  q: "How does compatibility checking work?",
                  a: "Each compound pair is graded against a curated dataset of pathway overlaps, receptor competition, additive risk profiles, and known contraindications. The readout updates the moment you add or remove a peptide.",
                },
                {
                  q: "Where do the cost estimates come from?",
                  a: "Tracked listing prices from affiliated vendors, normalized to USD. We show the high-end estimate because vial size, usage assumptions, and shipping route can all raise the per-month spend. If we don’t have listing data for a compound, it won’t contribute to the estimate.",
                },
                {
                  q: "What does U.S. vs International change?",
                  a: "It swaps which vendor route is treated as primary — U.S.-domestic vendors versus international shipping options. Pricing, COA access, and shipping reliability differ between the two routes.",
                },
                {
                  q: "Are these protocols safe to follow?",
                  a: "The stack builder is an educational research tool, not medical advice. Compatibility flags reduce obvious mistakes but do not replace a qualified healthcare professional. Always verify sourcing, COAs, and dosing for your situation.",
                },
                {
                  q: "Can I save or share a stack?",
                  a: "Yes. Use “Save stack” to keep it on your dashboard, or open a saved stack’s page for a shareable URL. You can re-run the builder as many times as you want.",
                },
                {
                  q: "Why does one stack need multiple vendors?",
                  a: "A stack rarely maps to a single checkout — different vendors carry different compounds at different purity tiers and price points. We surface the cleanest affiliated route per peptide, product-level when available, vendor-level otherwise.",
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group border-b border-[#103b2c]/15 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-semibold leading-[1.35] tracking-[-0.005em] text-[#103b2c] transition-colors hover:text-[#0f6a52] md:py-6 md:text-[18px]">
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#103b2c]/20 transition-colors group-hover:border-[#0f6a52] group-open:border-[#0f6a52] group-open:bg-[#0f6a52]"
                    >
                      <Plus
                        className="h-3.5 w-3.5 text-[#103b2c] transition-opacity group-open:opacity-0 group-hover:text-[#0f6a52]"
                        strokeWidth={2.5}
                      />
                      <Minus
                        className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity group-open:opacity-100"
                        strokeWidth={2.5}
                      />
                    </span>
                  </summary>
                  <div className="pb-5 pr-12 text-[14.5px] leading-[1.65] text-[#103b2c]/70 md:pb-6">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {items.length > 0 && (
          <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7]">
            <div className="container mx-auto max-w-4xl px-4 py-8">
              <p className="text-center text-[11px] leading-relaxed text-[#103b2c]/55">
                {blockedPairs.length > 0 ? DISCLAIMERS.CONTRAINDICATED_STACK.text : DISCLAIMERS.GLOBAL_STANDARD.text}
              </p>
            </div>
          </section>
        )}

        <section
          aria-labelledby="about-stack-builder"
          className="border-t border-[#103b2c]/8 bg-white"
        >
          <div className="container mx-auto max-w-4xl px-4 py-14 md:py-16">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f6a52]">
              About this tool
            </p>
            <h2
              id="about-stack-builder"
              className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-[#103b2c] md:text-[28px]"
            >
              What the stack builder actually checks.
            </h2>
            <div className="mt-5 grid gap-4 text-[14.5px] leading-[1.7] text-[#103b2c]/75 md:grid-cols-2">
              <p>
                Every compound you add is cross-referenced against the others on three axes:
                <strong> pathway overlap</strong> (two compounds activating the same downstream
                signal), <strong>receptor competition</strong> (binding the same target with
                different efficacy), and <strong>dosing-window conflicts</strong> (compounds whose
                timing or fasting requirements collide). Conflicts surface inline as you build.
              </p>
              <p>
                Costs come from tracked vendor listings — the same data that powers the{" "}
                <Link
                  href="/vendors"
                  className="font-semibold text-[#0f6a52] underline-offset-4 hover:underline"
                >
                  vendor directory
                </Link>
                . Stacks save to a permalink, can be exported, and link back to each compound&rsquo;s
                full profile so you can review evidence tier, regulatory status, and reported
                side effects before ordering.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <Link
                href="/peptides"
                className="group rounded-xl border border-[#103b2c]/12 bg-[#fbfaf7] p-4 transition-colors hover:border-[#0f6a52]/40 hover:bg-white"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
                  Browse
                </p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-[#103b2c]">
                  All peptides
                </p>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-[#103b2c]/60">
                  Full index of researched compounds, filterable by category and evidence tier.
                </p>
              </Link>
              <Link
                href="/compare/peptides"
                className="group rounded-xl border border-[#103b2c]/12 bg-[#fbfaf7] p-4 transition-colors hover:border-[#0f6a52]/40 hover:bg-white"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
                  Head-to-head
                </p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-[#103b2c]">
                  Compare two peptides
                </p>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-[#103b2c]/60">
                  Side-by-side breakdowns on evidence, risk, dosing, cost, and vendor coverage.
                </p>
              </Link>
              <Link
                href="/vendors"
                className="group rounded-xl border border-[#103b2c]/12 bg-[#fbfaf7] p-4 transition-colors hover:border-[#0f6a52]/40 hover:bg-white"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
                  Sourcing
                </p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-[#103b2c]">
                  Vendor directory
                </p>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-[#103b2c]/60">
                  Independent vendor ranking by documentation, COA access, and shipping clarity.
                </p>
              </Link>
              <Link
                href="/quiz"
                className="group rounded-xl border border-[#103b2c]/12 bg-[#fbfaf7] p-4 transition-colors hover:border-[#0f6a52]/40 hover:bg-white"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
                  Personalized
                </p>
                <p className="mt-1.5 text-[14.5px] font-semibold text-[#103b2c]">
                  Take the quiz
                </p>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-[#103b2c]/60">
                  Matches you to compounds, dosing references, and vendor options by goal and risk.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
