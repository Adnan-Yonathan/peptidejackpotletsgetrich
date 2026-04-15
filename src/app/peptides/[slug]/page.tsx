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
import { COMPATIBILITY_RULES } from "@/data/compatibility";
import { buildOutboundVendorHref } from "@/lib/outbound-vendors";
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);

  if (!peptide) notFound();

  const goals = getGoalsForPeptide(peptide.id);
  const vendorListings = getVendorListingsForPeptide(peptide.id);
  const disclaimers = getDisclaimersForPeptide(peptide.copyWarnings);
  const related = getRelatedPeptides(peptide);
  const compatNotes = getCompatibilityNotes(peptide.id);

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
          </div>

          {/* Regulatory flags */}
          {disclaimers.length > 1 && (
            <div className="space-y-2 mb-8">
              {disclaimers.slice(1).map((d) => (
                <div
                  key={d.type}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
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

          <Separator className="my-8" />

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
                      <p className="text-xs text-muted-foreground mt-1">
                        Shipping: {listing.shippingRegions} &middot; {listing.affiliateProgramStatus}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related peptides */}
          {related.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Frequently Compared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/peptides/${r.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {r.shortDescription}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 ml-2">
                        Tier {r.evidenceTier}
                      </Badge>
                    </Link>
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
