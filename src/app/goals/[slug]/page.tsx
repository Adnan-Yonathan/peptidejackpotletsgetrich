import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, TriangleAlert } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_HUBS,
  getCategoryHubBySlug,
  getHubGoals,
  getHubPeptideIds,
} from "@/data/category-hubs";
import { getGuideById, getGuidesForGoal } from "@/data/guides";
import { formatCostRange, getPeptideCostEstimate } from "@/lib/costs";
import {
  getPeptideById,
  getPublishedPeptides,
  type PeptideData,
  type EvidenceTier,
  type RiskLevel,
} from "@/data/peptides";
import { getVendorListingsForPeptide } from "@/data/vendor-listings";

const SECTION_CARD =
  "rounded-xl border border-stone-200 bg-white/90 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]";
const DETAIL_CELL = "rounded-lg bg-stone-50 border border-stone-100 p-3";
const DETAIL_LABEL =
  "text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)] mb-1";

const EVIDENCE_PRIORITY: Record<EvidenceTier, number> = {
  A: 0,
  B: 1,
  "B-C": 2,
  C: 3,
  "C-D": 4,
  D: 5,
};

const RISK_PRIORITY: Record<RiskLevel, number> = {
  low: 0,
  medium: 1,
  "med-high": 2,
  high: 3,
  extreme: 4,
};

function getEvidenceClasses(tier: EvidenceTier) {
  const colors: Record<EvidenceTier, string> = {
    A: "bg-green-500/10 text-green-700 border-green-500/30",
    B: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    "B-C": "bg-sky-500/10 text-sky-700 border-sky-500/30",
    C: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
    "C-D": "bg-orange-500/10 text-orange-700 border-orange-500/30",
    D: "bg-red-500/10 text-red-700 border-red-500/30",
  };

  return colors[tier];
}

function getRiskClasses(level: RiskLevel) {
  const colors: Record<RiskLevel, string> = {
    low: "bg-green-500/10 text-green-700 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
    "med-high": "bg-orange-500/10 text-orange-700 border-orange-500/30",
    high: "bg-red-500/10 text-red-700 border-red-500/30",
    extreme: "bg-red-700/10 text-red-800 border-red-700/30",
  };

  return colors[level];
}

function isPublishedPeptide(peptide: PeptideData | undefined): peptide is PeptideData {
  return Boolean(peptide && peptide.status === "published");
}

function HeroChip({
  children,
  tone = "ghost",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "ghost" | "yellow" | "red";
  className?: string;
}) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide";
  const tones: Record<string, string> = {
    ghost: "border-white/20 bg-white/[0.07] text-white/80",
    yellow: "border-yellow-300/50 bg-yellow-300/15 text-yellow-100",
    red: "border-red-400/50 bg-red-400/15 text-red-100",
  };
  return <span className={`${base} ${tones[tone]} ${className}`}>{children}</span>;
}

function StatCell({
  value,
  label,
  capitalize = false,
}: {
  value: string;
  label: string;
  capitalize?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`text-xl font-bold text-white leading-none ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
        {label}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return CATEGORY_HUBS.map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hub = getCategoryHubBySlug(slug);

  if (!hub) {
    return { title: "Goal Not Found" };
  }

  return {
    title: `${hub.title} Research Guide`,
    description: hub.description,
  };
}

export default async function GoalHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = getCategoryHubBySlug(slug);

  if (!hub) {
    notFound();
  }

  const peptideIds = getHubPeptideIds(hub);
  const educationGuides = Array.from(
    new Map(
      hub.goalIds
        .flatMap((goalId) => getGuidesForGoal(goalId))
        .concat(
          [
            getGuideById("peptide-safety-basics"),
            getGuideById("how-to-compare-peptide-vendors"),
          ].filter((guide): guide is NonNullable<typeof guide> => Boolean(guide))
        )
        .map((guide) => [guide.id, guide])
    ).values()
  ).slice(0, 4);
  const peptides = peptideIds
    .map((peptideId) => getPeptideById(peptideId))
    .filter(isPublishedPeptide)
    .sort((a, b) => {
      const evidenceDelta = EVIDENCE_PRIORITY[a.evidenceTier] - EVIDENCE_PRIORITY[b.evidenceTier];
      if (evidenceDelta !== 0) return evidenceDelta;
      return RISK_PRIORITY[a.riskLevel] - RISK_PRIORITY[b.riskLevel];
    });

  const featuredPeptides = peptides.slice(0, 6);
  const lowerRiskPeptides = peptides
    .filter((peptide) => peptide.riskLevel === "low" || peptide.riskLevel === "medium")
    .slice(0, 4);
  const highRiskPeptides = peptides
    .filter((peptide) => peptide.riskLevel === "high" || peptide.riskLevel === "extreme")
    .slice(0, 4);

  const vendorMap = new Map<
    string,
    {
      vendorId: string;
      vendorSlug: string;
      vendorName: string;
      relevantCompounds: number;
      affiliateProgramStatus: string;
      coaAccessModeLabel: string;
      qcMethodsListed: string;
      shippingRegions: string;
    }
  >();

  peptideIds.forEach((peptideId) => {
    getVendorListingsForPeptide(peptideId).forEach((listing) => {
      if (!listing.vendor) return;
      const current = vendorMap.get(listing.vendorId);
      if (current) {
        current.relevantCompounds += 1;
        return;
      }

      vendorMap.set(listing.vendorId, {
        vendorId: listing.vendorId,
        vendorSlug: listing.vendor.slug,
        vendorName: listing.vendorName,
        relevantCompounds: 1,
        affiliateProgramStatus: listing.affiliateProgramStatus,
        coaAccessModeLabel: listing.coaAccessModeLabel,
        qcMethodsListed: listing.qcMethodsListed,
        shippingRegions: listing.shippingRegions,
      });
    });
  });

  const trustedVendors = Array.from(vendorMap.values())
    .sort((a, b) => {
      const affiliateDelta =
        Number(b.affiliateProgramStatus.includes("affiliate")) -
        Number(a.affiliateProgramStatus.includes("affiliate"));
      if (affiliateDelta !== 0) return affiliateDelta;
      return b.relevantCompounds - a.relevantCompounds;
    })
    .slice(0, 6);

  const goals = getHubGoals(hub);
  const peptideCount = peptides.length;
  const allPeptideCount = getPublishedPeptides().length;
  const hubCostEstimates = featuredPeptides
    .map((peptide) => getPeptideCostEstimate(peptide.id))
    .filter((estimate): estimate is NonNullable<typeof estimate> => Boolean(estimate));
  const hubCostSummary =
    hubCostEstimates.length > 0
      ? {
          low: Math.min(...hubCostEstimates.map((estimate) => estimate.cycleCostLow)),
          high: Math.max(...hubCostEstimates.map((estimate) => estimate.cycleCostHigh)),
        }
      : undefined;

  const peptideStat = String(peptideCount);
  const vendorStat = String(trustedVendors.length);
  const guideStat = String(educationGuides.length);
  const costStat = hubCostSummary
    ? formatCostRange(hubCostSummary.low, hubCostSummary.high)
    : "—";

  const quickFacts: { label: string; value: string }[] = [
    { label: "Peptides in hub", value: `${peptideCount} of ${allPeptideCount}` },
  ];
  if (lowerRiskPeptides.length > 0) {
    quickFacts.push({ label: "Lower-risk options", value: String(lowerRiskPeptides.length) });
  }
  if (highRiskPeptides.length > 0) {
    quickFacts.push({ label: "Higher-risk options", value: String(highRiskPeptides.length) });
  }
  if (trustedVendors.length > 0) {
    quickFacts.push({ label: "Tracked vendors", value: String(trustedVendors.length) });
  }
  if (hubCostSummary) {
    quickFacts.push({ label: "Cycle cost range", value: costStat });
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #103b2c 0%, oklch(0.52 0.11 164) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-10">
            <Link
              href="/peptides"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Peptides
            </Link>

            <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 mb-3">
                  Research Hub
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                  {hub.title}
                </h1>
                <p className="mt-3 max-w-[560px] text-sm text-white/65 leading-relaxed">
                  {hub.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {hub.outcomes.map((outcome) => (
                    <HeroChip key={outcome} className="capitalize">
                      {outcome}
                    </HeroChip>
                  ))}
                </div>
              </div>

              {/* Stats float panel */}
              <div className="rounded-xl border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <StatCell value={peptideStat} label="Peptides" />
                  <StatCell value={vendorStat} label="Vendors" />
                  <StatCell value={guideStat} label="Guides" />
                  <StatCell value={costStat} label="Cycle cost" />
                </div>
                <div className="mt-4 flex gap-2 border-t border-white/12 pt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    render={<Link href={`/peptides?goal=${hub.goalIds[0]}`} />}
                  >
                    Peptides
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                    render={<Link href="/quiz" />}
                  >
                    Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Two-col body ────────────────────────────────────── */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            {/* ── Main column ── */}
            <div className="flex flex-col gap-5">
              {/* Overview */}
              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{hub.description}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Peptides tracked</div>
                    <p className="text-sm text-foreground/80">
                      {peptideCount} of {allPeptideCount} published compounds
                    </p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Cycle cost</div>
                    <p className="text-sm text-foreground/80">{costStat}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Goals covered</div>
                    <p className="text-sm text-foreground/80 capitalize">
                      {goals.length > 0
                        ? goals.map((goal) => goal.displayName).join(", ")
                        : hub.goalIds.join(", ")}
                    </p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Outcomes</div>
                    <p className="text-sm text-foreground/80 capitalize">
                      {hub.outcomes.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Best options to research first */}
              {featuredPeptides.length > 0 && (
                <div className={SECTION_CARD}>
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Best options to research first
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ranked by evidence first, then risk. A research starting point, not a
                        clinical recommendation.
                      </p>
                    </div>
                    {featuredPeptides.length >= 2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs shrink-0"
                        render={
                          <Link
                            href={`/compare/peptides?ids=${featuredPeptides
                              .slice(0, 3)
                              .map((peptide) => peptide.slug)
                              .join(",")}`}
                          />
                        }
                      >
                        Compare top
                      </Button>
                    )}
                  </div>
                  <div className="divide-y divide-stone-100">
                    {featuredPeptides.map((peptide) => {
                      const costEstimate = getPeptideCostEstimate(peptide.id);
                      const listingCount = getVendorListingsForPeptide(peptide.id).length;
                      return (
                        <div
                          key={peptide.id}
                          className="py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">
                                {peptide.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {peptide.shortDescription}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2.5 text-xs"
                                render={<Link href={`/vendors?peptide=${peptide.slug}`} />}
                              >
                                Vendors
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                render={<Link href={`/peptides/${peptide.slug}`} />}
                              >
                                Profile
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getEvidenceClasses(peptide.evidenceTier)}`}
                            >
                              Tier {peptide.evidenceTier}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${getRiskClasses(peptide.riskLevel)}`}
                            >
                              {peptide.riskLevel} risk
                            </span>
                            <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] font-semibold capitalize text-foreground/80">
                              {peptide.experienceLevel}
                            </span>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div className={DETAIL_CELL}>
                              <div className={DETAIL_LABEL}>Routes</div>
                              <p className="text-xs text-foreground/80">
                                {peptide.administrationRoutes.join(", ")}
                              </p>
                            </div>
                            <div className={DETAIL_CELL}>
                              <div className={DETAIL_LABEL}>Timeline</div>
                              <p className="text-xs text-foreground/80">{peptide.onsetTimeline}</p>
                            </div>
                            {costEstimate && (
                              <div className={DETAIL_CELL}>
                                <div className={DETAIL_LABEL}>Cycle cost</div>
                                <p className="text-xs text-foreground/80">
                                  {formatCostRange(
                                    costEstimate.cycleCostLow,
                                    costEstimate.cycleCostHigh,
                                    costEstimate.currencyCode
                                  )}
                                </p>
                              </div>
                            )}
                            <div className={DETAIL_CELL}>
                              <div className={DETAIL_LABEL}>Vendor listings</div>
                              <p className="text-xs text-foreground/80">
                                {listingCount} tracked
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lower-risk + Higher-risk split */}
              <div className="grid gap-5 lg:grid-cols-2">
                <div className={`${SECTION_CARD} min-w-0 overflow-hidden`}>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Lower-risk options</h2>
                  {lowerRiskPeptides.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No low- or medium-risk compounds are currently tagged for this hub.
                    </p>
                  ) : (
                    <div className="grid min-w-0 gap-2">
                      {lowerRiskPeptides.map((peptide) => (
                        <Link
                          key={peptide.id}
                          href={`/peptides/${peptide.slug}`}
                          className={`${DETAIL_CELL} flex w-full min-w-0 items-center justify-between gap-2 overflow-hidden transition-colors hover:border-[color:var(--primary)]/40`}
                        >
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {peptide.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {peptide.shortDescription}
                            </p>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${getRiskClasses(peptide.riskLevel)}`}
                          >
                            {peptide.riskLevel}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`${SECTION_CARD} min-w-0 overflow-hidden`}>
                  <h2 className="text-lg font-semibold text-foreground mb-3">
                    Higher-risk options
                  </h2>
                  {highRiskPeptides.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No high-risk compounds are currently tagged for this hub.
                    </p>
                  ) : (
                    <div className="grid min-w-0 gap-2">
                      {highRiskPeptides.map((peptide) => (
                        <div key={peptide.id} className={`${DETAIL_CELL} min-w-0 overflow-hidden`}>
                          <div className="flex min-w-0 items-start gap-2">
                            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Link
                                  href={`/peptides/${peptide.slug}`}
                                  className="text-sm font-semibold text-foreground hover:text-[color:var(--primary)]"
                                >
                                  {peptide.name}
                                </Link>
                                <span
                                  className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold capitalize ${getRiskClasses(peptide.riskLevel)}`}
                                >
                                  {peptide.riskLevel}
                                </span>
                              </div>
                              <p className="mt-1 break-words text-[11px] text-muted-foreground leading-relaxed">
                                {peptide.adverseEffects}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Trusted vendors */}
              {trustedVendors.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    {hub.vendorHeadline}
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    These vendors currently carry compounds in this goal category. Hub is the trust
                    layer; outbound clicks happen after comparison.
                  </p>
                  <div className="divide-y divide-stone-100">
                    {trustedVendors.map((vendor) => (
                      <div key={vendor.vendorId} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4 shrink-0 text-[color:var(--primary)]" />
                              <p className="text-sm font-semibold text-foreground truncate">
                                {vendor.vendorName}
                              </p>
                            </div>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {vendor.relevantCompounds} relevant compound
                              {vendor.relevantCompounds === 1 ? "" : "s"} in hub
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="shrink-0 h-7 px-2.5 text-xs"
                            render={<Link href={`/vendors/${vendor.vendorSlug}`} />}
                          >
                            Review
                          </Button>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <div className={DETAIL_CELL}>
                            <div className={DETAIL_LABEL}>COA</div>
                            <p className="text-xs text-foreground/80">
                              {vendor.coaAccessModeLabel}
                            </p>
                          </div>
                          <div className={DETAIL_CELL}>
                            <div className={DETAIL_LABEL}>QC</div>
                            <p className="text-xs text-foreground/80">{vendor.qcMethodsListed}</p>
                          </div>
                          <div className={DETAIL_CELL}>
                            <div className={DETAIL_LABEL}>Shipping</div>
                            <p className="text-xs text-foreground/80">{vendor.shippingRegions}</p>
                          </div>
                          <div className={DETAIL_CELL}>
                            <div className={DETAIL_LABEL}>Affiliate</div>
                            <p className="text-xs text-foreground/80">
                              {vendor.affiliateProgramStatus}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sticky right rail ── */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
              {/* Quick facts */}
              {quickFacts.length > 0 && (
                <div className={SECTION_CARD.replace("p-6", "p-5")}>
                  <h3 className="text-base font-semibold text-foreground mb-3">Quick facts</h3>
                  <div className="divide-y divide-stone-100">
                    {quickFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {fact.label}
                        </p>
                        <p className="text-xs text-foreground/90 text-right break-words min-w-0">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related goals */}
              {goals.length > 0 && (
                <div className={SECTION_CARD.replace("p-6", "p-5")}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Goals covered
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {goals.map((goal) => (
                      <Link
                        key={goal.id}
                        href={`/peptides?goal=${goal.id}`}
                        className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-foreground hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors"
                      >
                        {goal.displayName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Read before choosing */}
              {educationGuides.length > 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: "oklch(0.52 0.11 164 / 0.2)",
                    background: "oklch(0.52 0.11 164 / 0.05)",
                  }}
                >
                  <p className="text-sm font-semibold text-[color:var(--primary)] mb-1">
                    Start with the guides
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Understand the basics before comparing compounds or choosing a vendor.
                  </p>
                  <ul className="space-y-1.5">
                    {educationGuides.map((guide) => (
                      <li key={guide.id}>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="group flex items-start gap-1.5 text-xs text-foreground/90 hover:text-[color:var(--primary)]"
                        >
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--primary)]/60" />
                          <span className="underline decoration-transparent group-hover:decoration-current underline-offset-2">
                            {guide.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
