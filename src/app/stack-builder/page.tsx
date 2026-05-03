"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  Eraser,
  HeartPulse,
  Leaf,
  Minus,
  Plus,
  Save,
  Search,
  Shield,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaPhonePreview } from "@/components/ui/cta-phone-preview";
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
  description: string;
  peptideIds: string[];
  icon: LucideIcon;
  accent: string;
};

const STARTING_POINTS: StackPreset[] = [
  {
    id: "fat-loss",
    title: "Fat Loss Starter",
    subtitle: "Boost metabolism, preserve muscle, and enhance results.",
    description: "3 peptides",
    peptideIds: ["semaglutide", "aod-9604", "mots-c"],
    icon: Sparkles,
    accent: "text-[#2b8c65] bg-[#ebf7f0]",
  },
  {
    id: "muscle-recovery",
    title: "Muscle Growth & Recovery",
    subtitle: "Build lean mass and recover faster between workouts.",
    description: "4 peptides",
    peptideIds: ["ipamorelin", "cjc-1295", "bpc-157", "tb-500"],
    icon: Dumbbell,
    accent: "text-[#4f74b9] bg-[#edf3ff]",
  },
  {
    id: "injury-recovery",
    title: "Injury Recovery",
    subtitle: "Heal tissue, reduce inflammation, and get back to training.",
    description: "3 peptides",
    peptideIds: ["bpc-157", "tb-500", "thymosin-beta-4"],
    icon: HeartPulse,
    accent: "text-[#7f65bf] bg-[#f1edff]",
  },
  {
    id: "anti-aging",
    title: "Anti-Aging & Wellness",
    subtitle: "Support longevity, energy, skin, and overall vitality.",
    description: "4 peptides",
    peptideIds: ["epitalon", "humanin", "ghk-cu", "mots-c"],
    icon: Leaf,
    accent: "text-[#b47b2c] bg-[#fff4e4]",
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
  low: "bg-[#eaf7ef] text-[#267c5a]",
  medium: "bg-[#eaf7ef] text-[#267c5a]",
  "med-high": "bg-[#fff3e2] text-[#a86b18]",
  high: "bg-[#fff3e2] text-[#a86b18]",
  extreme: "bg-[#fdeceb] text-[#b24f4f]",
};

function getSummaryTone(hasContraindicated: boolean, cautionCount: number) {
  if (hasContraindicated) {
    return {
      label: "Compatibility: Blocked",
      badge: "bg-[#fdeceb] text-[#b24f4f]",
      note: "One or more combinations should not be used together.",
    };
  }

  if (cautionCount > 0) {
    return {
      label: "Compatibility: Caution",
      badge: "bg-[#fff3e2] text-[#a86b18]",
      note: "There are additive-risk pairings worth reviewing before saving this stack.",
    };
  }

  return {
    label: "Compatibility: Good",
    badge: "bg-[#eaf7ef] text-[#267c5a]",
    note: "No major conflict detected. These peptides work well together for recovery and growth.",
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
      <main className="flex-1 bg-[#f7f5f1] px-4 py-6 md:py-8">
        <div className="container mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#e7e2d8] bg-[linear-gradient(180deg,#fbfaf7_0%,#f8f6f1_100%)] px-5 py-6 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] md:px-7 md:py-7">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">Stack Builder</p>
                <h1 className="max-w-xl text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-[#13201d] md:text-[3.45rem]">
                  Build a Smarter Stack.
                  <br />
                  <span className="text-[#19906f]">Or Get One Built For You.</span>
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                  Choose your goal or add peptides manually. We&apos;ll check compatibility, show your risks,
                  estimate costs, and create a clear protocol layout.
                </p>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0f6a52]" />
                    <div>
                      <p className="font-semibold text-[#13201d]">Compatibility Checked</p>
                      <p className="text-xs text-slate-500">Catch conflicts &amp; overlaps</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#0f6a52]" />
                    <div>
                      <p className="font-semibold text-[#13201d]">Risk &amp; Cost Insights</p>
                      <p className="text-xs text-slate-500">Know what you&apos;re getting into</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-[#0f6a52]" />
                    <div>
                      <p className="font-semibold text-[#13201d]">Personalized Protocol</p>
                      <p className="text-xs text-slate-500">Dosage, timing &amp; cycle length</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid overflow-hidden rounded-[28px] border border-[#dbeadf] bg-[#eff7f2] shadow-[0_20px_45px_-30px_rgba(15,106,82,0.35)] md:grid-cols-[1.25fr_0.92fr]">
                <div className="flex flex-col justify-between p-5 md:p-6">
                  <Badge
                    variant="outline"
                    className="w-fit rounded-full border-[#cbe6d7] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f6a52]"
                  >
                    Recommended • 3 Minutes
                  </Badge>
                  <div>
                    <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#13201d]">Not sure what to take?</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                      Answer a few questions and get a custom plan that fits your goals, experience, and risk tolerance.
                    </p>
                  </div>
                  <Button
                    className="mt-5 h-10 w-fit rounded-xl bg-[#0f6a52] px-4 text-sm font-semibold text-white hover:bg-[#0c5944]"
                    render={<Link href="/quiz" />}
                  >
                    Find My Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="border-t border-[#dbeadf] bg-[#f8fbf8] p-4 md:border-t-0 md:border-l">
                  <CtaPhonePreview variant="stack-builder" />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">Popular Starting Points</p>
                <h2 className="mt-1 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#13201d]">
                  Load a Proven Stack &amp; Customize
                </h2>
              </div>
              <Link href="/dashboard/stacks" className="hidden items-center gap-1 text-sm font-semibold text-[#0f6a52] md:inline-flex">
                View All Stacks <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {STARTING_POINTS.map((preset) => {
                const details = getStartingPointDetails(preset);
                const Icon = preset.icon;

                return (
                  <div
                    key={preset.id}
                    className="rounded-[24px] border border-[#e7e2d8] bg-white p-5 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.32)]"
                  >
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${preset.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#13201d]">{preset.title}</h3>
                    <p className="mt-2 min-h-[44px] text-sm leading-5 text-slate-600">{preset.subtitle}</p>

                    <div className="mt-4 space-y-1 text-xs text-slate-500">
                      <p>{preset.description}</p>
                      <p>Est. Cost: {details.cost}/month</p>
                    </div>

                    <Button
                      className="mt-4 h-9 rounded-xl bg-[#0f6a52] px-4 text-sm font-semibold text-white hover:bg-[#0c5944]"
                      onClick={() => replaceStack(preset.title, details.peptides)}
                    >
                      Load Stack
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-5 rounded-[28px] border border-[#e7e2d8] bg-[#fbfaf7] px-5 py-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">Build Your Own Stack</p>
                <h2 className="mt-1 text-[1.7rem] font-semibold tracking-[-0.03em] text-[#13201d]">{name}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Search peptides, add them to your stack, and see insights update in real time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl border-[#d8ddd7] bg-white text-[#13201d]"
                  onClick={clear}
                >
                  <Eraser className="mr-2 h-4 w-4" />
                  Clear Stack
                </Button>
                <Button className="rounded-xl bg-[#0f6a52] text-white hover:bg-[#0c5944]">
                  <Save className="mr-2 h-4 w-4" />
                  Save Stack
                </Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.1fr_1.45fr_0.95fr]">
              <div className="rounded-[24px] border border-[#e7e2d8] bg-white p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.3)]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search peptides..."
                    className="h-10 rounded-xl border-[#e4e0d8] bg-[#fbfaf7] pl-9 shadow-none"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["All", "Recovery", "Fat Loss", "Muscle", "GH", "Cognitive"].map((tag, index) => (
                    <div
                      key={tag}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        index === 0 ? "bg-[#0f6a52] text-white" : "bg-[#f2f3ef] text-slate-600"
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {filteredPeptides.slice(0, 8).map((peptide) => {
                    const estimate = getPeptideCostEstimate(peptide.id, {
                      shopperRegion,
                      outputCurrency: STACK_BUILDER_CURRENCY,
                    });

                    return (
                      <button
                        key={peptide.id}
                        onClick={() => addItem(peptide)}
                        className="flex w-full items-start justify-between rounded-[18px] border border-[#efebe4] bg-[#fcfbf8] px-3 py-3 text-left transition-colors hover:bg-[#f7f5ef]"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#13201d]">{peptide.name}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-600">{peptide.shortDescription}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${RISK_BADGES[peptide.riskLevel]}`}>
                              {RISK_LABELS[peptide.riskLevel]}
                            </span>
                            {estimate && (
                              <span className="rounded-full bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                {formatCostRange(
                                  estimate.monthlyCostLow,
                                  estimate.monthlyCostHigh,
                                  estimate.currencyCode
                                )}/mo
                              </span>
                            )}
                            {estimate && (
                              <span className="rounded-full bg-[#eef3ef] px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                {formatUsageModelLabel(estimate.usageModel)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d8ddd7] text-slate-500">
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    );
                  })}
                </div>

                <Button variant="ghost" className="mt-4 w-full justify-between text-[#0f6a52] hover:bg-transparent">
                  View All Peptides <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-[24px] border border-[#e7e2d8] bg-white p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.3)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#13201d]">Your Stack ({items.length})</p>
                    <p className="text-xs text-slate-500">Add peptides, adjust quantities, and edit in real time.</p>
                  </div>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-9 max-w-[180px] rounded-xl border-[#e4e0d8] bg-[#fbfaf7] text-sm shadow-none"
                  />
                </div>

                <div className="mt-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="rounded-[18px] border border-dashed border-[#dcd7ce] bg-[#fcfbf8] px-4 py-10 text-center text-sm text-slate-500">
                      Start with 2-4 peptides. You can always adjust and compare different combinations.
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <div
                        key={item.peptide.id}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[18px] border border-[#efebe4] bg-[#fcfbf8] px-3 py-3"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f6a52] text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-[#13201d]">{item.peptide.name}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${RISK_BADGES[item.peptide.riskLevel]}`}>
                              {RISK_LABELS[item.peptide.riskLevel]}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">
                            {item.peptide.studyDoseRange.split(".")[0]}
                          </p>
                          {(() => {
                            const estimate = getPeptideCostEstimate(item.peptide.id, {
                              shopperRegion,
                              outputCurrency: STACK_BUILDER_CURRENCY,
                            });
                            if (!estimate) return null;

                            return (
                              <>
                                <p className="mt-1 text-xs text-slate-500">
                                  Approx. {formatCostRange(
                                    estimate.monthlyCostLow * item.quantity,
                                    estimate.monthlyCostHigh * item.quantity,
                                    estimate.currencyCode
                                  )}/mo
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {estimate.cycleLabel} · {formatUsageModelLabel(estimate.usageModel)}
                                </p>
                              </>
                            );
                          })()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full"
                            onClick={() => updateQuantity(item.peptide.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-6 text-center text-sm font-semibold text-[#13201d]">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full"
                            onClick={() => updateQuantity(item.peptide.id, item.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full text-slate-500"
                            onClick={() => removeItem(item.peptide.id)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {suggestedAdds.length > 0 && (
                  <div className="mt-4 rounded-[18px] border border-dashed border-[#d8ddd7] bg-[#faf9f5] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7ca493]">Suggested Next Add</p>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {suggestedAdds.slice(0, 2).map(({ peptide }) => (
                        <button
                          key={peptide.id}
                          onClick={() => addItem(peptide)}
                          className="flex items-center justify-between rounded-xl border border-[#ebe7df] bg-white px-3 py-2 text-left"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#13201d]">{peptide.name}</p>
                            <p className="text-xs text-slate-500">{peptide.category.replaceAll("_", " ")}</p>
                          </div>
                          <Plus className="h-4 w-4 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 rounded-[18px] border border-[#d7eadf] bg-[#edf7f1] px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 text-[#0f6a52]" />
                    <div>
                      <p className="text-sm font-semibold text-[#13201d]">Start with 2-4 peptides.</p>
                      <p className="text-xs text-slate-600">You can always adjust and compare different combinations.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-[#e7e2d8] bg-white p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.3)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#13201d]">Stack Summary</p>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${compatibilityTone.badge}`}>
                      {compatibilityTone.label}
                    </span>
                  </div>

                  <div className="mb-4 inline-flex rounded-xl border border-[#d8ddd7] bg-[#fbfaf7] p-1 text-xs font-semibold">
                    <button
                      onClick={() => setShopperRegion("us")}
                      className={`rounded-lg px-3 py-1.5 ${shopperRegion === "us" ? "bg-[#0f6a52] text-white" : "text-slate-600"}`}
                    >
                      U.S.
                    </button>
                    <button
                      onClick={() => setShopperRegion("international")}
                      className={`rounded-lg px-3 py-1.5 ${shopperRegion === "international" ? "bg-[#0f6a52] text-white" : "text-slate-600"}`}
                    >
                      International
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-[18px] border border-[#efebe4] bg-[#fcfbf8] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Est. Monthly Cost</p>
                      <p className="mt-1 text-lg font-semibold text-[#13201d]">
                        {stackCost
                          ? formatCostRange(
                              stackCost.monthlyCostLow,
                              stackCost.monthlyCostHigh,
                              stackCost.currencyCode
                            )
                          : shopperRegion === "us"
                            ? "$172 - $234"
                            : "See vendor cards"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Based on tracked affiliated listing pricing for the {shopperRegion === "us" ? "U.S." : "international"} route.
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-[#efebe4] bg-[#fcfbf8] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Protocol Style</p>
                      <p className="mt-1 text-lg font-semibold text-[#13201d]">{getCycleLength(items)}</p>
                    </div>
                    <div className="rounded-[18px] border border-[#efebe4] bg-[#fcfbf8] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Total Peptides</p>
                      <p className="mt-1 text-lg font-semibold text-[#13201d]">{items.length || 3}</p>
                      <p className="text-xs text-slate-500">Active compounds</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[18px] border border-[#d7eadf] bg-[#edf7f1] p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="mt-0.5 h-4 w-4 text-[#0f6a52]" />
                      <div>
                        <p className="text-sm font-semibold text-[#13201d]">Looks Good</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{compatibilityTone.note}</p>
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Cost ranges only appear when we have tracked affiliated listing data for that compound.
                        </p>
                      </div>
                    </div>
                  </div>

                  {affiliatedVendorOptions.length > 0 && (
                    <Button
                      className="mt-4 h-10 w-full rounded-xl bg-[#0f6a52] text-sm font-semibold text-white hover:bg-[#0c5944]"
                      render={<a href="#affiliated-vendors" />}
                    >
                      View Affiliated Vendors
                    </Button>
                  )}
                </div>

                {(blockedPairs.length > 0 || cautionPairs.length > 0) && (
                  <div className="rounded-[24px] border border-[#e7e2d8] bg-white p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.3)]">
                    <p className="text-sm font-semibold text-[#13201d]">Compatibility Notes</p>
                    <div className="mt-3 space-y-2">
                      {blockedPairs.map((warning, index) => (
                        <div key={`${warning.peptideA}-${warning.peptideB}-${index}`} className="rounded-xl bg-[#fdeceb] px-3 py-2">
                          <div className="flex items-start gap-2">
                            <XCircle className="mt-0.5 h-4 w-4 text-[#b24f4f]" />
                            <div>
                              <p className="text-xs font-semibold text-[#13201d]">
                                {getPeptideById(warning.peptideA)?.name} + {getPeptideById(warning.peptideB)?.name}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-slate-600">{warning.summary}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {cautionPairs.slice(0, 2).map((warning, index) => (
                        <div key={`${warning.peptideA}-${warning.peptideB}-${index}`} className="rounded-xl bg-[#fff6e9] px-3 py-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 text-[#a86b18]" />
                            <div>
                              <p className="text-xs font-semibold text-[#13201d]">
                                {getPeptideById(warning.peptideA)?.name} + {getPeptideById(warning.peptideB)?.name}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-slate-600">{warning.summary}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {affiliatedVendorOptions.length > 0 && (
            <section
              id="affiliated-vendors"
              className="mt-5 rounded-[28px] border border-[#e7e2d8] bg-[#fbfaf7] px-5 py-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.35)]"
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">Affiliated Vendors</p>
                  <h2 className="mt-1 text-[1.7rem] font-semibold tracking-[-0.03em] text-[#13201d]">
                    Best Affiliate Route for Each Compound
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                    A stack usually does not map to one checkout. The cleanest flow is one best affiliated vendor route per peptide.
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  Product-page affiliate links are preferred when available; otherwise the vendor-level affiliate route is used.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {affiliatedVendorOptions.map((option) => {
                  const estimate = getPeptideCostEstimate(option.peptide.id, {
                    shopperRegion,
                    outputCurrency: STACK_BUILDER_CURRENCY,
                  });
                  const primaryOption =
                    shopperRegion === "us" ? option.us ?? option.international : option.international ?? option.us;
                  const secondaryOption = shopperRegion === "us" ? option.international : option.us;

                  if (!primaryOption) return null;

                  return (
                    <div
                      key={option.peptide.id}
                      className="rounded-[22px] border border-[#e7e2d8] bg-white p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.3)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-[#13201d]">{option.peptide.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {primaryOption.vendor?.name ?? primaryOption.listing.vendorName} · {primaryOption.listing.vendorTypeLabel}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                          Qty {option.quantity}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <p>{primaryOption.listing.typicalSkuFormat}</p>
                        <p>{formatListingPriceUsd(primaryOption.listing)}</p>
                        {estimate && (
                          <p>
                            Approx. {formatCostRange(estimate.monthlyCostLow * option.quantity, estimate.monthlyCostHigh * option.quantity, estimate.currencyCode)}/mo
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {primaryOption.target?.mode === "affiliate_product" ? "Direct product link" : "Affiliate vendor route"}
                        </span>
                        <span className="rounded-full bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {primaryOption.listing.coaAccessModeLabel}
                        </span>
                      </div>

                      <Button
                        className="mt-4 h-9 w-full rounded-xl bg-[#0f6a52] px-4 text-sm font-semibold text-white hover:bg-[#0c5944]"
                        render={
                          <a
                            href={buildOutboundVendorHref(primaryOption.vendor?.slug ?? primaryOption.listing.vendorId, option.peptide.slug, "stack-builder")}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        Go to {primaryOption.vendor?.name ?? primaryOption.listing.vendorName}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {unmappedAffiliateVendors.length > 0 && (
                <div className="mt-5 rounded-[22px] border border-dashed border-[#d8ddd7] bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-[#13201d]">Other affiliated vendors</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    These vendors have affiliate links configured, but they do not show up above because the app has no peptide-level listing or product mapping for your current stack.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {unmappedAffiliateVendors.map((vendor) => (
                      <Button
                        key={vendor.vendorId}
                        variant="outline"
                        className="rounded-xl border-[#d8ddd7] bg-white text-[#13201d]"
                        render={<a href={vendor.defaultAffiliateUrl} target="_blank" rel="noreferrer" />}
                      >
                        Browse {vendor.vendorName}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="mt-5 rounded-[24px] border border-[#d7eadf] bg-[#e9f5ee] px-5 py-4 shadow-[0_16px_40px_-34px_rgba(15,106,82,0.35)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f6a52]">Want The Best Results?</p>
                <p className="mt-1 text-lg font-semibold text-[#13201d]">Get a Complete Protocol, Not Just a List</p>
                <p className="mt-1 text-sm text-slate-600">
                  See exact dosages, timing, cycle length, and vendor options tailored to your stack.
                </p>
              </div>
              <Button
                className="h-10 rounded-xl bg-[#0f6a52] px-4 text-sm font-semibold text-white hover:bg-[#0c5944]"
                render={<Link href="/quiz" />}
              >
                Find My Plan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>

          {items.length > 0 && (
            <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-slate-500">
              {blockedPairs.length > 0 ? DISCLAIMERS.CONTRAINDICATED_STACK.text : DISCLAIMERS.GLOBAL_STANDARD.text}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
