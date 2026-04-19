import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPeptideBySlug, getPublishedPeptides, type PeptideData } from "@/data/peptides";
import { getGoalsForPeptide } from "@/data/goals";
import { getVendorListingsForPeptide } from "@/data/vendor-listings";
import { getDisclaimersForPeptide } from "@/data/disclaimers";
import { getGuidesForPeptide } from "@/data/guides";
import { getAgeGuidanceForPeptide } from "@/data/age-guidance";
import { getMonitoringGuidanceForPeptide } from "@/data/monitoring-guidance";
import { getSexGuidanceForPeptide } from "@/data/sex-guidance";
import { COMPATIBILITY_RULES } from "@/data/compatibility";
import { buildOutboundVendorHref, getPreferredVendorForPeptide } from "@/lib/outbound-vendors";
import { formatConfidenceLabel, formatCostRange, getListingCostEstimate, getPeptideCostEstimate } from "@/lib/costs";
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

export default async function PeptideDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ fromQuiz?: string }>;
}) {
  const { slug } = await params;
  const { fromQuiz } = await searchParams;
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
  const costEstimate = getPeptideCostEstimate(peptide.id);
  const preferredVendor = getPreferredVendorForPeptide(peptide.id);
  const showQuizRecommendation = fromQuiz === "1";

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" className="mb-6" render={<Link href="/peptides" />}>
            <ArrowLeft className="mr-2 h-4 w-4" /> All Peptides
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{peptide.name}</h1>
            {peptide.synonyms.length > 0 && (
              <p className="text-sm text-muted-foreground mb-3">
                Also known as: {peptide.synonyms.join(", ")}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="outline"
                className={
                  peptide.evidenceTier === "A"
                    ? "bg-green-500/10 text-green-600 border-green-500/30"
                    : peptide.evidenceTier.startsWith("B")
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                      : peptide.evidenceTier.startsWith("C")
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                        : "bg-red-500/10 text-red-600 border-red-500/30"
                }
              >
                Evidence Tier {peptide.evidenceTier}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {peptide.riskLevel} risk
              </Badge>
              <Badge variant="outline" className="capitalize">
                {peptide.experienceLevel}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {peptide.regulatoryStatus.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">{peptide.shortDescription}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {vendorListings.length > 0 && (
                <Button render={<Link href={`/vendors?peptide=${peptide.slug}`} />}>
                  Compare vendor listings
                </Button>
              )}
              <Button variant="outline" render={<Link href="/peptides" />}>
                Browse more peptides
              </Button>
            </div>
          </div>

          {showQuizRecommendation && (
            <Card className="mb-6 border-emerald-200 bg-emerald-50/50">
              <CardHeader>
                <CardTitle>Quiz recommendation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    This compound is the strongest current fit from your intake.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use the direct vendor route below to jump straight to the tracked product page for this exact compound.
                  </p>
                </div>
                {preferredVendor?.vendor && preferredVendor.target ? (
                  <Button
                    className="shrink-0"
                    render={
                      <a
                        href={buildOutboundVendorHref(preferredVendor.vendor.slug, peptide.slug, "quiz-recommendation")}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    Get {peptide.name} from {preferredVendor.vendor.name}
                  </Button>
                ) : (
                  <Button variant="outline" className="shrink-0" render={<Link href={`/vendors?peptide=${peptide.slug}`} />}>
                    Review tracked vendors
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Full description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>{peptide.longDescription}</p>
            </CardContent>
          </Card>

          {/* Mechanism & research details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Research Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Mechanism of Action</p>
                  <p className="text-muted-foreground">{peptide.mechanism}</p>
                </div>
                <Separator />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-foreground mb-1">Study Dose Range</p>
                    <p className="text-muted-foreground">{peptide.studyDoseRange}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Administration Routes</p>
                    <p className="text-muted-foreground capitalize">{peptide.administrationRoutes.join(", ")}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Onset / Timeline</p>
                    <p className="text-muted-foreground">{peptide.onsetTimeline}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Expected Effects</p>
                    <p className="text-muted-foreground">{peptide.expectedEffects}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-foreground mb-1">Adverse Effects</p>
                    <p className="text-muted-foreground">{peptide.adverseEffects}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Contraindications</p>
                    <p className="text-muted-foreground">{peptide.contraindications}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-foreground mb-1">Interaction Notes</p>
                  <p className="text-muted-foreground">{peptide.interactionNotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          {goals.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Related Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {goals.map((g) => (
                    <Badge key={g.id} variant="secondary">
                      {g.displayName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cost at a glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {costEstimate ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="font-medium text-foreground mb-1">Typical cycle cost</p>
                      <p className="text-muted-foreground">
                        {formatCostRange(costEstimate.cycleCostLow, costEstimate.cycleCostHigh)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Estimated monthly cost</p>
                      <p className="text-muted-foreground">
                        {formatCostRange(costEstimate.monthlyCostLow, costEstimate.monthlyCostHigh)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Typical cycle length</p>
                      <p className="text-muted-foreground">
                        {costEstimate.cycleWeeks} week{costEstimate.cycleWeeks === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Estimate confidence</p>
                      <p className="text-muted-foreground">{formatConfidenceLabel(costEstimate.confidence)}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Assumes roughly {costEstimate.amountPerCycleLow}-{costEstimate.amountPerCycleHigh} {peptide.id === "ghk-cu" ? "mg of product" : "mg"} per cycle,
                    based on {costEstimate.basedOnListings} tracked listing{costEstimate.basedOnListings === 1 ? "" : "s"}.
                  </p>
                  <p className="text-muted-foreground">{costEstimate.note}</p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No reliable cycle cost estimate yet. We need cleaner listing price and pack-size data before showing a trustworthy number.
                </p>
              )}
            </CardContent>
          </Card>

          {(ageGuidance || sexGuidance || monitoringGuidance) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Age, sex, and monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
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
                          <div key={range} className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
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
                    {(ageGuidance || monitoringGuidance) && <Separator />}
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
                          <div key={sex} className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                            <p className="font-medium capitalize text-red-600">{sex}</p>
                            <p className="mt-1 text-muted-foreground">{note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {sexGuidance.cautionBySex && (
                      <div className="space-y-2">
                        {Object.entries(sexGuidance.cautionBySex).map(([sex, note]) => (
                          <div key={sex} className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
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
                      <p className="text-muted-foreground">{monitoringGuidance.baselineLabs.join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Follow-up cadence</p>
                      <p className="text-muted-foreground">{monitoringGuidance.followUpFrequency}</p>
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
              </CardContent>
            </Card>
          )}

          {/* Regulatory flags */}
          {disclaimers.length > 1 && (
            <div className="space-y-2 mb-6">
              {disclaimers.slice(1).map((d) => (
                <div
                  key={d.type}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    d.severity === "danger"
                      ? "border-red-500/30 bg-red-500/5"
                      : d.severity === "warning"
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "border-blue-500/30 bg-blue-500/5"
                  }`}
                >
                  <SeverityIcon severity={d.severity} />
                  <div>
                    <p className="text-sm font-medium">{d.shortLabel}</p>
                    <p className="text-xs text-muted-foreground">{d.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Compatibility */}
          {compatNotes.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Known Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {compatNotes.map((note, i) => {
                    const otherPeptide = getPeptideBySlug(note.otherPeptide);
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          note.status === "contraindicated"
                            ? "border-red-500/30 bg-red-500/5"
                            : "border-yellow-500/30 bg-yellow-500/5"
                        }`}
                      >
                        {note.status === "contraindicated" ? (
                          <ShieldAlert className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            <span className="capitalize">{note.status}</span> with{" "}
                            <Link
                              href={`/peptides/${note.otherPeptide}`}
                              className="underline hover:no-underline"
                            >
                              {otherPeptide?.name ?? note.otherPeptide}
                            </Link>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{note.summary}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vendors */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Available From</CardTitle>
            </CardHeader>
            <CardContent>
              {vendorListings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No vendors currently listed for this peptide.</p>
              ) : (
                <div className="space-y-3">
                  {vendorListings.map((listing) => (
                    <div key={`${listing.vendorId}-${listing.productPageUrl}`} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between gap-3">
                      <div>
                          <p className="font-medium text-sm">{listing.vendorName}</p>
                          <p className="text-xs text-muted-foreground">
                            {listing.vendorTypeLabel} &middot; COA: {listing.coaAccessModeLabel}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {listing.typicalSkuFormat} &middot; {listing.typicalRetailPriceRangeUsd}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {listing.regulatoryShippingFlags}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {listing.credibilityNote}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="text-xs">
                            {listing.country}
                          </Badge>
                          <Button
                            variant="default"
                            size="sm"
                            render={
                              <a
                                href={buildOutboundVendorHref(listing.vendor?.slug ?? listing.vendorId, peptide.slug, "peptide-detail")}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            Visit Vendor
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        QC: {listing.qcMethodsListed}
                      </p>
                      {(() => {
                        const estimate = getListingCostEstimate(peptide.id, listing);
                        if (!estimate) return null;

                        return (
                          <p className="text-xs text-muted-foreground mt-1">
                            Typical cycle cost from this listing: {formatCostRange(estimate.cycleCostLow, estimate.cycleCostHigh)}
                          </p>
                        );
                      })()}
                      <p className="text-xs text-muted-foreground mt-1">
                        Shipping: {listing.shippingRegions} &middot; {listing.affiliateProgramStatus}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {relatedGuides.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Read this before you compare products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {relatedGuides.map((guide) => (
                    <div key={guide.id} className="rounded-xl border p-4">
                      <p className="font-medium text-sm">{guide.title}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{guide.summary}</p>
                      <Button className="mt-4" variant="outline" size="sm" render={<Link href={`/guides/${guide.slug}`} />}>
                        Read guide
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related peptides */}
          {related.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Frequently Compared</CardTitle>
                  {related.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/compare/peptides?ids=${[peptide.slug, ...related.slice(0, 2).map((item) => item.slug)].join(",")}`} />}
                    >
                      Compare top options
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <div key={r.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {r.shortDescription}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          Tier {r.evidenceTier}
                        </Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" render={<Link href={`/peptides/${r.slug}`} />}>
                          View
                        </Button>
                        <Button size="sm" render={<Link href={`/compare/peptides?ids=${peptide.slug},${r.slug}`} />}>
                          Compare
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Global disclaimer */}
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto mt-8">
            {disclaimers[0].text}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
