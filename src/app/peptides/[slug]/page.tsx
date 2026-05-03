import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPeptideBySlug, getPublishedPeptides, type PeptideData } from "@/data/peptides";
import { getGoalsForPeptide } from "@/data/goals";
import { getListingPriceLabel, getVendorListingsForPeptide } from "@/data/vendor-listings";
import { getDisclaimersForPeptide } from "@/data/disclaimers";
import { getGuidesForPeptide } from "@/data/guides";
import { getAgeGuidanceForPeptide } from "@/data/age-guidance";
import { getMonitoringGuidanceForPeptide } from "@/data/monitoring-guidance";
import { getSexGuidanceForPeptide } from "@/data/sex-guidance";
import { COMPATIBILITY_RULES } from "@/data/compatibility";
import { buildOutboundVendorHref, getPreferredVendorForPeptide, getRegionalVendorOptionsForPeptide } from "@/lib/outbound-vendors";
import { getShopperRegion, type ShopperCountry } from "@/lib/shopper-country";
import {
  formatConfidenceLabel,
  formatCostRange,
  formatCostUnit,
  formatUsageModelLabel,
  getListingCostEstimate,
  getPeptideCostEstimate,
} from "@/lib/costs";
import { ArrowLeft, AlertTriangle, ShieldAlert, Info } from "lucide-react";

export async function generateStaticParams() {
  return getPublishedPeptides().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return { title: "Peptide Not Found" };
  return {
    title: `${peptide.name} - PeptidePros`,
    description: peptide.shortDescription,
  };
}

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "danger") return <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />;
  if (severity === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />;
  return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
}

function getRelatedPeptides(peptide: PeptideData): PeptideData[] {
  const allPeptides = getPublishedPeptides();
  const goals = getGoalsForPeptide(peptide.id);
  const goalPeptideIds = new Set(goals.flatMap((g) => g.peptideIds));
  goalPeptideIds.delete(peptide.id);

  return allPeptides
    .filter((p) => goalPeptideIds.has(p.id))
    .slice(0, 4);
}

function getCompatibilityNotes(peptideId: string) {
  return COMPATIBILITY_RULES.filter(
    (r) => r.peptideA === peptideId || r.peptideB === peptideId
  ).map((r) => ({
    otherPeptide: r.peptideA === peptideId ? r.peptideB : r.peptideA,
    status: r.status,
    summary: r.rationaleSummary,
  }));
}

const SECTION_CARD =
  "rounded-xl border border-stone-200 bg-white/90 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]";
const DETAIL_CELL =
  "rounded-lg bg-stone-50 border border-stone-100 p-3";
const DETAIL_LABEL =
  "text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)] mb-1";

export default async function PeptideDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ fromQuiz?: string; country?: string }>;
}) {
  const { slug } = await params;
  const { fromQuiz, country } = await searchParams;
  const peptide = getPeptideBySlug(slug);

  if (!peptide) notFound();

  const goals = getGoalsForPeptide(peptide.id);
  const vendorListings = getVendorListingsForPeptide(peptide.id);
  const disclaimers = getDisclaimersForPeptide(peptide.copyWarnings);
  const relatedGuides = getGuidesForPeptide(peptide.id).slice(0, 3);
  const related = getRelatedPeptides(peptide);
  const compatNotes = getCompatibilityNotes(peptide.id);
  const ageGuidance = getAgeGuidanceForPeptide(peptide.id);
  const monitoringGuidance = getMonitoringGuidanceForPeptide(peptide.id);
  const sexGuidance = getSexGuidanceForPeptide(peptide.id);
  const shopperCountry = country as ShopperCountry | undefined;
  const shopperRegion = getShopperRegion(shopperCountry);
  const costEstimate = getPeptideCostEstimate(peptide.id, { shopperCountry });
  const preferredVendor = getPreferredVendorForPeptide(peptide.id, { shopperCountry });
  const regionalVendors = getRegionalVendorOptionsForPeptide(peptide.id);
  const showQuizRecommendation = fromQuiz === "1";

  const flagDisclaimers = disclaimers.slice(1);
  const primaryRoute = peptide.administrationRoutes[0] ?? "—";
  const tierStat = `Tier ${peptide.evidenceTier}`;
  const cycleStat = costEstimate ? costEstimate.cycleLabel : "—";
  const riskStat = peptide.riskLevel.replace("-", "–");
  const routeStat = primaryRoute.length > 8 ? `${primaryRoute.slice(0, 6)}.` : primaryRoute;

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
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                  {peptide.name}
                </h1>
                {peptide.synonyms.length > 0 && (
                  <p className="mt-2 text-xs uppercase tracking-wider text-white/45">
                    Also known as {peptide.synonyms.slice(0, 3).join(" · ")}
                  </p>
                )}
                <p className="mt-3 max-w-[520px] text-sm text-white/65 leading-relaxed">
                  {peptide.shortDescription}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <HeroChip tone="ghost">Tier {peptide.evidenceTier}</HeroChip>
                  <HeroChip tone="ghost" className="capitalize">
                    {peptide.riskLevel.replace("-", "–")} risk
                  </HeroChip>
                  <HeroChip tone="ghost" className="capitalize">
                    {peptide.experienceLevel}
                  </HeroChip>
                  {peptide.regulatoryStatus === "rx_approved" && (
                    <HeroChip tone="yellow">Rx Only</HeroChip>
                  )}
                  {peptide.wadaFlag !== "none" && peptide.wadaFlag !== "unknown" && (
                    <HeroChip tone="red">WADA {peptide.wadaFlag}</HeroChip>
                  )}
                  {peptide.fdaCompoundingRiskFlag === "flagged" && (
                    <HeroChip tone="yellow">FDA Flagged</HeroChip>
                  )}
                </div>
              </div>

              {/* Stats float panel */}
              <div className="rounded-xl border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <StatCell value={tierStat} label="Evidence" />
                  <StatCell value={cycleStat} label="Protocol" />
                  <StatCell value={riskStat} label="Risk" capitalize />
                  <StatCell value={routeStat} label="Route" capitalize />
                </div>
                <div className="mt-4 flex gap-2 border-t border-white/12 pt-3">
                  {vendorListings.length > 0 && (
                    <Button
                      size="sm"
                      className="flex-1"
                      render={<Link href={`/vendors?peptide=${peptide.slug}`} />}
                    >
                      Vendors
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                    render={<Link href="/peptides" />}
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Flags strip ─────────────────────────────────────── */}
        {flagDisclaimers.length > 0 && (
          <section className="border-b border-stone-200 bg-white">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-3">
              <div className={`grid gap-2 ${flagDisclaimers.length > 1 ? "md:grid-cols-2" : ""}`}>
                {flagDisclaimers.map((d) => (
                  <div
                    key={d.type}
                    className={`flex items-start gap-3 rounded-md border-l-[3px] p-3 ${
                      d.severity === "danger"
                        ? "border-l-red-500 bg-red-500/5"
                        : d.severity === "warning"
                          ? "border-l-yellow-500 bg-yellow-500/5"
                          : "border-l-blue-500 bg-blue-500/5"
                    }`}
                  >
                    <SeverityIcon severity={d.severity} />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          d.severity === "danger"
                            ? "text-red-700"
                            : d.severity === "warning"
                              ? "text-yellow-800"
                              : "text-blue-700"
                        }`}
                      >
                        {d.shortLabel}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{d.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Two-col body ────────────────────────────────────── */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            {/* ── Main column ── */}
            <div className="flex flex-col gap-5">
              {showQuizRecommendation && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
                  <p className="text-sm font-semibold text-emerald-900">Quiz recommendation</p>
                  <p className="mt-1 text-sm text-emerald-900/80">
                    This compound is the strongest current fit from your intake. We prioritized the{" "}
                    {shopperRegion === "us" ? "U.S." : "international"} route based on your country and
                    kept the alternate region visible below.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preferredVendor?.vendor && preferredVendor.target && (
                      <Button
                        render={
                          <a
                            href={buildOutboundVendorHref(
                              preferredVendor.vendor.slug,
                              peptide.slug,
                              "quiz-recommendation"
                            )}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        {shopperRegion === "us" ? "Primary U.S. route" : "Primary international route"}
                      </Button>
                    )}
                    {regionalVendors.us?.vendor && shopperRegion !== "us" && (
                      <Button
                        variant="outline"
                        render={
                          <a
                            href={buildOutboundVendorHref(
                              regionalVendors.us.vendor.slug,
                              peptide.slug,
                              "quiz-recommendation-alt"
                            )}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        View U.S. option
                      </Button>
                    )}
                    {regionalVendors.international?.vendor && shopperRegion !== "international" && (
                      <Button
                        variant="outline"
                        render={
                          <a
                            href={buildOutboundVendorHref(
                              regionalVendors.international.vendor.slug,
                              peptide.slug,
                              "quiz-recommendation-alt"
                            )}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        View international option
                      </Button>
                    )}
                    {!preferredVendor?.vendor && (
                      <Button
                        variant="outline"
                        render={<Link href={`/vendors?peptide=${peptide.slug}`} />}
                      >
                        Review tracked vendors
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {peptide.longDescription}
                </p>
              </div>

              {/* Research Details */}
              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold text-foreground mb-4">Research Details</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Mechanism of Action</div>
                    <p className="text-sm text-foreground/80">{peptide.mechanism}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Administration Routes</div>
                    <p className="text-sm text-foreground/80 capitalize">
                      {peptide.administrationRoutes.join(", ")}
                    </p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Study Dose Range</div>
                    <p className="text-sm text-foreground/80">{peptide.studyDoseRange}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Expected Effects</div>
                    <p className="text-sm text-foreground/80">{peptide.expectedEffects}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Dosing Timeline</div>
                    <p className="text-sm text-foreground/80">{peptide.onsetTimeline}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Contraindications</div>
                    <p className="text-sm text-foreground/80">{peptide.contraindications}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Adverse Effects</div>
                    <p className="text-sm text-foreground/80">{peptide.adverseEffects}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Interaction Notes</div>
                    <p className="text-sm text-foreground/80">{peptide.interactionNotes}</p>
                  </div>
                </div>
              </div>

              {/* Cost at a glance */}
              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold text-foreground mb-3">Cost at a glance</h2>
                {costEstimate ? (
                  <div className="space-y-4 text-sm">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Typical cycle cost
                        </p>
                        <p className="text-foreground/90">
                          {formatCostRange(
                            costEstimate.cycleCostLow,
                            costEstimate.cycleCostHigh,
                            costEstimate.currencyCode
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Estimated monthly
                        </p>
                        <p className="text-foreground/90">
                          {formatCostRange(
                            costEstimate.monthlyCostLow,
                            costEstimate.monthlyCostHigh,
                            costEstimate.currencyCode
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Protocol style
                        </p>
                        <p className="text-foreground/90">{costEstimate.cycleLabel}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatUsageModelLabel(costEstimate.usageModel)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Estimate confidence
                        </p>
                        <p className="text-foreground/90">
                          {formatConfidenceLabel(costEstimate.confidence)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Assumes roughly {formatCostUnit(costEstimate.unit, costEstimate.amountPerCycleLow)}–
                      {formatCostUnit(costEstimate.unit, costEstimate.amountPerCycleHigh)} per cycle, using{" "}
                      {costEstimate.estimateSource === "tracked_listing"
                        ? `${costEstimate.basedOnListings} tracked affiliated listing${costEstimate.basedOnListings === 1 ? "" : "s"}`
                        : costEstimate.sourceLabel}
                      .
                    </p>
                    <p className="text-xs text-muted-foreground">{costEstimate.note}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No reliable cycle cost estimate yet. We need cleaner listing price and pack-size
                    data before showing a trustworthy number.
                  </p>
                )}
              </div>

              {/* Age / Sex / Monitoring */}
              {(ageGuidance || sexGuidance || monitoringGuidance) && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Age, sex, and monitoring
                  </h2>
                  <div className="space-y-5 text-sm">
                    {ageGuidance && (
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium text-foreground mb-1">Life-stage fit</p>
                          <p className="text-muted-foreground">{ageGuidance.lifeStageNote}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ageGuidance.supportedAgeRanges.map((range) => (
                            <Badge key={range} variant="outline">
                              {range}
                            </Badge>
                          ))}
                        </div>
                        {ageGuidance.bestFitAgeRanges && ageGuidance.bestFitAgeRanges.length > 0 && (
                          <p className="text-muted-foreground">
                            Best fit age ranges: {ageGuidance.bestFitAgeRanges.join(", ")}
                          </p>
                        )}
                        {ageGuidance.avoidByAge && (
                          <div className="space-y-2">
                            {Object.entries(ageGuidance.avoidByAge).map(([range, note]) => (
                              <div
                                key={range}
                                className="rounded-lg border border-red-500/30 bg-red-500/5 p-3"
                              >
                                <p className="font-medium text-red-600">{range}</p>
                                <p className="mt-1 text-muted-foreground">{note}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {sexGuidance && (
                      <div className="space-y-3">
                        {ageGuidance && <Separator />}
                        <div>
                          <p className="font-medium text-foreground mb-1">Sex-specific note</p>
                          <p className="text-muted-foreground">{sexGuidance.note}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sexGuidance.supportedSexes.map((sex) => (
                            <Badge key={sex} variant="outline" className="capitalize">
                              {sex}
                            </Badge>
                          ))}
                        </div>
                        {sexGuidance.exclusionBySex && (
                          <div className="space-y-2">
                            {Object.entries(sexGuidance.exclusionBySex).map(([sex, note]) => (
                              <div
                                key={sex}
                                className="rounded-lg border border-red-500/30 bg-red-500/5 p-3"
                              >
                                <p className="font-medium capitalize text-red-600">{sex}</p>
                                <p className="mt-1 text-muted-foreground">{note}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {sexGuidance.cautionBySex && (
                          <div className="space-y-2">
                            {Object.entries(sexGuidance.cautionBySex).map(([sex, note]) => (
                              <div
                                key={sex}
                                className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3"
                              >
                                <p className="font-medium capitalize text-yellow-700">{sex}</p>
                                <p className="mt-1 text-muted-foreground">{note}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {monitoringGuidance && (
                      <div className="space-y-3">
                        {(ageGuidance || sexGuidance) && <Separator />}
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">Monitoring burden</p>
                          <Badge variant="outline" className="capitalize">
                            {monitoringGuidance.burden}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{monitoringGuidance.summary}</p>
                        <div>
                          <p className="font-medium text-foreground mb-1">Baseline labs and checks</p>
                          <p className="text-muted-foreground">
                            {monitoringGuidance.baselineLabs.join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Follow-up cadence</p>
                          <p className="text-muted-foreground">
                            {monitoringGuidance.followUpFrequency}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Red flags</p>
                          <ul className="list-disc pl-5 text-muted-foreground">
                            {monitoringGuidance.redFlags.map((flag) => (
                              <li key={flag}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Known Interactions */}
              {compatNotes.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Known Interactions</h2>
                  <div className="divide-y divide-stone-100">
                    {compatNotes.map((note, i) => {
                      const otherPeptide = getPeptideBySlug(note.otherPeptide);
                      const isContra = note.status === "contraindicated";
                      return (
                        <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                          <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              isContra
                                ? "border-red-500/40 bg-red-500/10 text-red-700"
                                : "border-yellow-500/40 bg-yellow-500/10 text-yellow-800"
                            }`}
                          >
                            {isContra ? "Avoid" : "Caution"}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              <Link
                                href={`/peptides/${note.otherPeptide}`}
                                className="underline decoration-stone-300 underline-offset-2 hover:decoration-foreground"
                              >
                                {otherPeptide?.name ?? note.otherPeptide}
                              </Link>
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">{note.summary}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Frequently Compared */}
              {related.length > 0 && (
                <div className={SECTION_CARD}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">Frequently Compared</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link
                          href={`/compare/peptides?ids=${[
                            peptide.slug,
                            ...related.slice(0, 2).map((item) => item.slug),
                          ].join(",")}`}
                        />
                      }
                    >
                      Compare top
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {related.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{r.name}</p>
                          <span className="mt-0.5 inline-block rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Tier {r.evidenceTier}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <Button size="sm" render={<Link href={`/peptides/${r.slug}`} />}>
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            render={
                              <Link href={`/compare/peptides?ids=${peptide.slug},${r.slug}`} />
                            }
                          >
                            Compare
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sticky right rail ── */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
              {/* Available From */}
              <div className={SECTION_CARD.replace("p-6", "p-5")}>
                <h3 className="text-base font-semibold text-foreground mb-3">Available From</h3>
                {vendorListings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No vendors currently listed for this peptide.
                  </p>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {vendorListings.map((listing) => {
                      const listingEstimate = getListingCostEstimate(peptide.id, listing);
                      return (
                        <div
                          key={`${listing.vendorId}-${listing.productPageUrl}`}
                          className="py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {listing.vendorName}
                              </p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {listing.vendorTypeLabel} · COA: {listing.coaAccessModeLabel}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="shrink-0 h-7 px-2.5 text-xs"
                              render={
                                <a
                                  href={buildOutboundVendorHref(
                                    listing.vendor?.slug ?? listing.vendorId,
                                    peptide.slug,
                                    "peptide-detail"
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              }
                            >
                              Visit
                            </Button>
                          </div>
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            {listing.typicalSkuFormat} · {listing.typicalRetailPriceRangeUsd}
                          </p>
                          {listingEstimate && (
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Cycle cost:{" "}
                              {formatCostRange(
                                listingEstimate.cycleCostLow,
                                listingEstimate.cycleCostHigh,
                                listingEstimate.currencyCode
                              )}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {listing.regulatoryShippingFlags}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Related Goals */}
              {goals.length > 0 && (
                <div className={SECTION_CARD.replace("p-6", "p-5")}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Related Goals
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {goals.map((g) => (
                      <Link
                        key={g.id}
                        href={`/goals/${g.id}`}
                        className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-foreground hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors"
                      >
                        {g.displayName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Guides CTA */}
              {relatedGuides.length > 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: "oklch(0.52 0.11 164 / 0.2)",
                    background: "oklch(0.52 0.11 164 / 0.05)",
                  }}
                >
                  <p className="text-sm font-semibold text-[color:var(--primary)] mb-1">
                    Read before comparing vendors
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Quality signals, QC methods, and COA caveats — so you know what you&apos;re
                    actually looking at.
                  </p>
                  <ul className="space-y-1.5">
                    {relatedGuides.map((guide) => (
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

          {/* Global disclaimer */}
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
            {disclaimers[0].text}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
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
