import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { buildOutboundVendorHref, getPreferredVendorForPeptide } from "@/lib/outbound-vendors";

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
          [getGuideById("peptide-safety-basics"), getGuideById("how-to-compare-peptide-vendors")].filter(
            (guide): guide is NonNullable<typeof guide> => Boolean(guide)
          )
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
        Number(b.affiliateProgramStatus.includes("affiliate")) - Number(a.affiliateProgramStatus.includes("affiliate"));
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

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <section className="mb-12 rounded-[2rem] border bg-gradient-to-br from-background via-background to-primary/5 p-8 md:p-12">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                Browse by goal
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{hub.title}</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{hub.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {hub.outcomes.map((outcome) => (
                  <Badge key={outcome} variant="outline" className="capitalize">
                    {outcome}
                  </Badge>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href={`/peptides?goal=${hub.goalIds[0]}`} />}>
                  Browse matching peptides <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" render={<Link href="/quiz" />}>
                  Build a custom plan
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                {peptideCount} relevant peptides in this hub out of {allPeptideCount} published compounds.
                {hubCostSummary && (
                  <> Typical tracked cycle cost in this goal runs about {formatCostRange(hubCostSummary.low, hubCostSummary.high)}.</>
                )}
              </p>
            </div>
          </section>

          {educationGuides.length > 0 && (
            <section className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Start with the guides</h2>
                <p className="mt-2 text-muted-foreground">
                  These guides help you understand the basics before comparing compounds or choosing a vendor.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {educationGuides.map((guide) => (
                  <Card key={guide.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{guide.summary}</p>
                      <Button variant="outline" size="sm" render={<Link href={`/guides/${guide.slug}`} />}>
                        Read guide
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="mb-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Best options to research first</h2>
                <p className="mt-2 text-muted-foreground">
                  Ranked for this goal by evidence first, then risk. This is a research starting point, not a clinical recommendation.
                </p>
              </div>
              {featuredPeptides.length >= 2 && (
                <Button
                  variant="outline"
                  render={<Link href={`/compare/peptides?ids=${featuredPeptides.slice(0, 3).map((peptide) => peptide.slug).join(",")}`} />}
                >
                  Compare top options
                </Button>
              )}
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredPeptides.map((peptide) => (
                <Card key={peptide.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">{peptide.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{peptide.shortDescription}</p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className={getEvidenceClasses(peptide.evidenceTier)}>
                        Tier {peptide.evidenceTier}
                      </Badge>
                      <Badge variant="outline" className={`capitalize ${getRiskClasses(peptide.riskLevel)}`}>
                        {peptide.riskLevel} risk
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {peptide.experienceLevel}
                      </Badge>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Routes: {peptide.administrationRoutes.join(", ")}. Timeline: {peptide.onsetTimeline}
                    </p>
                    {(() => {
                      const costEstimate = getPeptideCostEstimate(peptide.id);
                      if (!costEstimate) return null;

                      return (
                        <p className="mb-4 text-sm text-muted-foreground">
                          Typical cycle cost: {formatCostRange(costEstimate.cycleCostLow, costEstimate.cycleCostHigh)}
                        </p>
                      );
                    })()}
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        {getVendorListingsForPeptide(peptide.id).length} vendor listing
                        {getVendorListingsForPeptide(peptide.id).length === 1 ? "" : "s"}
                      </span>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const preferredVendor = getPreferredVendorForPeptide(peptide.id);
                          if (!preferredVendor?.vendor) return null;
                          return (
                            <Button
                              size="sm"
                              render={
                                <a
                                  href={buildOutboundVendorHref(preferredVendor.vendor.slug, peptide.slug, "goal-hub")}
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              }
                            >
                              Visit vendor
                            </Button>
                          );
                        })()}
                        <Button variant="outline" size="sm" render={<Link href={`/peptides/${peptide.slug}`} />}>
                          View profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-12 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lower-risk options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lowerRiskPeptides.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No low- or medium-risk compounds are currently tagged for this hub.</p>
                ) : (
                  lowerRiskPeptides.map((peptide) => (
                    <div key={peptide.id} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{peptide.name}</p>
                          <p className="text-sm text-muted-foreground">{peptide.shortDescription}</p>
                        </div>
                        <Badge variant="outline" className={`capitalize ${getRiskClasses(peptide.riskLevel)}`}>
                          {peptide.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Higher-risk or more advanced options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highRiskPeptides.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No high-risk compounds are currently tagged for this hub.</p>
                ) : (
                  highRiskPeptides.map((peptide) => (
                    <div key={peptide.id} className="rounded-xl border p-4">
                      <div className="flex items-start gap-3">
                        <TriangleAlert className="mt-0.5 h-4 w-4 text-orange-500" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{peptide.name}</p>
                            <Badge variant="outline" className={`capitalize ${getRiskClasses(peptide.riskLevel)}`}>
                              {peptide.riskLevel}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{peptide.adverseEffects}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{hub.vendorHeadline}</h2>
              <p className="mt-2 text-muted-foreground">
                These vendors currently carry compounds in this goal category. The hub page is the trust layer; outbound vendor clicks happen after the comparison.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {trustedVendors.map((vendor) => (
                <Card key={vendor.vendorId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg">{vendor.vendorName}</CardTitle>
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>{vendor.relevantCompounds} relevant compound listings in this hub.</p>
                      <p>COA access: {vendor.coaAccessModeLabel}</p>
                      <p>QC: {vendor.qcMethodsListed}</p>
                      <p>Shipping: {vendor.shippingRegions}</p>
                      <p>Affiliate status: {vendor.affiliateProgramStatus}</p>
                    </div>
                    <Button className="mt-4 w-full" variant="outline" render={<Link href={`/vendors/${vendor.vendorSlug}`} />}>
                      Review vendor
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

