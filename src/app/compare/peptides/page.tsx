import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPeptideBySlug, type PeptideData, type EvidenceTier, type RiskLevel } from "@/data/peptides";
import { getAgeGuidanceForPeptide } from "@/data/age-guidance";
import { getMonitoringGuidanceForPeptide } from "@/data/monitoring-guidance";
import { formatConfidenceLabel, formatCostRange, getPeptideCostEstimate } from "@/lib/costs";
import {
  formatFdaFlag,
  formatRegulatoryStatus,
  formatWadaFlag,
  getGoalLabelsForPeptide,
  getPeptidePurchaseSummary,
  getPeptideSourcingNote,
  getVendorCoverageCount,
} from "@/lib/compare-peptides";

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

export const metadata: Metadata = {
  title: "Compare Peptides",
  description: "Compare research peptides side by side on evidence, risk, practical fit, and sourcing context.",
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

function parseSelectedPeptides(ids: string | string[] | undefined) {
  const rawIds = Array.isArray(ids) ? ids.join(",") : ids ?? "";
  const slugs = rawIds
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  return Array.from(new Set(slugs))
    .map((slug) => getPeptideBySlug(slug))
    .filter((peptide): peptide is PeptideData => Boolean(peptide && peptide.status === "published"))
    .slice(0, 4);
}

function getSectionRows(peptides: PeptideData[]) {
  return [
    {
      title: "At a glance",
      rows: [
        {
          label: "Primary fit",
          values: peptides.map((peptide) => getPeptidePurchaseSummary(peptide).bestFor),
        },
        {
          label: "Evidence",
          values: peptides.map((peptide) => (
            <Badge key={`${peptide.id}-evidence`} variant="outline" className={getEvidenceClasses(peptide.evidenceTier)}>
              Tier {peptide.evidenceTier}
            </Badge>
          )),
        },
        {
          label: "Risk",
          values: peptides.map((peptide) => (
            <Badge key={`${peptide.id}-risk`} variant="outline" className={`capitalize ${getRiskClasses(peptide.riskLevel)}`}>
              {peptide.riskLevel} risk
            </Badge>
          )),
        },
        {
          label: "Experience level",
          values: peptides.map((peptide) => peptide.experienceLevel),
        },
        {
          label: "Budget tier",
          values: peptides.map((peptide) => peptide.budgetTier),
        },
        {
          label: "Administration route",
          values: peptides.map((peptide) => peptide.administrationRoutes.join(", ")),
        },
      ],
    },
    {
      title: "Use case and timing",
      rows: [
        {
          label: "Goal fit",
          values: peptides.map((peptide) => getGoalLabelsForPeptide(peptide.id).join(", ") || "Not categorized yet"),
        },
        {
          label: "What users are usually comparing it for",
          values: peptides.map((peptide) => peptide.expectedEffects),
        },
        {
          label: "Timeline",
          values: peptides.map((peptide) => peptide.onsetTimeline),
        },
        {
          label: "Main tradeoff",
          values: peptides.map((peptide) => getPeptidePurchaseSummary(peptide).tradeoff),
        },
      ],
    },
    {
      title: "Safety and restrictions",
      rows: [
        {
          label: "Adverse effects",
          values: peptides.map((peptide) => peptide.adverseEffects),
        },
        {
          label: "Contraindications",
          values: peptides.map((peptide) => peptide.contraindications),
        },
        {
          label: "Interaction notes",
          values: peptides.map((peptide) => peptide.interactionNotes),
        },
        {
          label: "Regulatory status",
          values: peptides.map((peptide) => formatRegulatoryStatus(peptide.regulatoryStatus)),
        },
        {
          label: "FDA flag",
          values: peptides.map((peptide) => formatFdaFlag(peptide.fdaCompoundingRiskFlag)),
        },
        {
          label: "WADA status",
          values: peptides.map((peptide) => formatWadaFlag(peptide.wadaFlag)),
        },
      ],
    },
    {
      title: "Age and monitoring",
      rows: [
        {
          label: "Supported age ranges",
          values: peptides.map((peptide) => getAgeGuidanceForPeptide(peptide.id)?.supportedAgeRanges.join(", ") || "No age guidance yet"),
        },
        {
          label: "Life-stage note",
          values: peptides.map((peptide) => getAgeGuidanceForPeptide(peptide.id)?.lifeStageNote || "No structured life-stage note yet"),
        },
        {
          label: "Monitoring burden",
          values: peptides.map((peptide) => getMonitoringGuidanceForPeptide(peptide.id)?.burden || "Not specified"),
        },
        {
          label: "Follow-up cadence",
          values: peptides.map((peptide) => getMonitoringGuidanceForPeptide(peptide.id)?.followUpFrequency || "No structured cadence yet"),
        },
      ],
    },
    {
      title: "Cost and sourcing",
      rows: [
        {
          label: "Typical cycle cost",
          values: peptides.map((peptide) => {
            const estimate = getPeptideCostEstimate(peptide.id);
            return estimate ? formatCostRange(estimate.cycleCostLow, estimate.cycleCostHigh) : "No reliable estimate yet";
          }),
        },
        {
          label: "Estimated monthly cost",
          values: peptides.map((peptide) => {
            const estimate = getPeptideCostEstimate(peptide.id);
            return estimate ? formatCostRange(estimate.monthlyCostLow, estimate.monthlyCostHigh) : "No reliable estimate yet";
          }),
        },
        {
          label: "Cost confidence",
          values: peptides.map((peptide) => {
            const estimate = getPeptideCostEstimate(peptide.id);
            return estimate ? formatConfidenceLabel(estimate.confidence) : "No estimate";
          }),
        },
      ],
    },
    {
      title: "Before you buy",
      rows: [
        {
          label: "Tracked vendor listings",
          values: peptides.map((peptide) => `${getVendorCoverageCount(peptide.id)} listing${getVendorCoverageCount(peptide.id) === 1 ? "" : "s"}`),
        },
        {
          label: "Sourcing note",
          values: peptides.map((peptide) => getPeptideSourcingNote(peptide.id)),
        },
        {
          label: "Stack-friendly",
          values: peptides.map((peptide) => (peptide.isStackable ? "Usually stack-friendly" : "Usually better as a standalone decision")),
        },
      ],
    },
  ];
}

function getQuickWinners(peptides: PeptideData[]) {
  if (peptides.length === 0) return [];

  const strongestEvidence = [...peptides].sort(
    (a, b) => EVIDENCE_PRIORITY[a.evidenceTier] - EVIDENCE_PRIORITY[b.evidenceTier]
  )[0];
  const lowestRisk = [...peptides].sort((a, b) => RISK_PRIORITY[a.riskLevel] - RISK_PRIORITY[b.riskLevel])[0];
  const easiestStart = [...peptides].sort((a, b) => {
    const experienceRank = { beginner: 0, intermediate: 1, advanced: 2 } as const;
    const experienceDelta = experienceRank[a.experienceLevel] - experienceRank[b.experienceLevel];
    if (experienceDelta !== 0) return experienceDelta;
    return RISK_PRIORITY[a.riskLevel] - RISK_PRIORITY[b.riskLevel];
  })[0];
  const mostAvailable = [...peptides].sort(
    (a, b) => getVendorCoverageCount(b.id) - getVendorCoverageCount(a.id)
  )[0];

  return [
    {
      label: "Strongest evidence",
      peptide: strongestEvidence,
      detail: `Tier ${strongestEvidence.evidenceTier}`,
    },
    {
      label: "Lowest risk",
      peptide: lowestRisk,
      detail: `${lowestRisk.riskLevel} risk`,
    },
    {
      label: "Easiest place to start",
      peptide: easiestStart,
      detail: `${easiestStart.experienceLevel} level`,
    },
    {
      label: "Most tracked vendor coverage",
      peptide: mostAvailable,
      detail: `${getVendorCoverageCount(mostAvailable.id)} tracked listing${getVendorCoverageCount(mostAvailable.id) === 1 ? "" : "s"}`,
    },
  ];
}

export default async function ComparePeptidesPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { ids } = await searchParams;
  const peptides = parseSelectedPeptides(ids);
  const quickWinners = getQuickWinners(peptides);
  const sections = getSectionRows(peptides);

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-12">
        <div className="container mx-auto max-w-7xl">
          <section className="mb-10 rounded-[2rem] border bg-gradient-to-br from-background via-background to-primary/5 p-8 md:p-10">
            <Badge variant="secondary" className="mb-4">
              Compare peptides
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Compare the details that actually shape the buying decision
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Look at evidence, risk, use case fit, and sourcing context side by side before you choose a peptide to research further.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/peptides" />}>
                Browse peptides
              </Button>
              <Button variant="ghost" size="lg" render={<Link href="/quiz" />}>
                Get a personalized plan
              </Button>
            </div>
          </section>

          {peptides.length < 2 ? (
            <Card>
              <CardHeader>
                <CardTitle>Pick at least two peptides to compare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Use the peptide directory to add compounds to your compare tray, then come back here for the side-by-side view.
                </p>
                <Button render={<Link href="/peptides" />}>Open peptide directory</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <section className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {quickWinners.map((winner) => (
                  <Card key={winner.label}>
                    <CardHeader className="pb-3">
                      <p className="text-sm text-muted-foreground">{winner.label}</p>
                      <CardTitle className="text-xl">{winner.peptide.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{winner.detail}</p>
                      <Button variant="outline" size="sm" render={<Link href={`/peptides/${winner.peptide.slug}`} />}>
                        View profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <section className="mb-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                {peptides.map((peptide) => (
                  <Card key={peptide.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">{peptide.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{peptide.shortDescription}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getEvidenceClasses(peptide.evidenceTier)}>
                          Tier {peptide.evidenceTier}
                        </Badge>
                        <Badge variant="outline" className={`capitalize ${getRiskClasses(peptide.riskLevel)}`}>
                          {peptide.riskLevel} risk
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button size="sm" variant="outline" render={<Link href={`/peptides/${peptide.slug}`} />}>
                          View peptide
                        </Button>
                        <Button size="sm" render={<Link href={`/vendors?peptide=${peptide.slug}`} />}>
                          Compare vendors
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <div className="space-y-8">
                {sections.map((section) => (
                  <Card key={section.title}>
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[220px]">Decision factor</TableHead>
                            {peptides.map((peptide) => (
                              <TableHead key={peptide.id} className="min-w-[220px]">
                                {peptide.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.rows.map((row) => (
                            <TableRow key={row.label}>
                              <TableCell className="align-top font-medium">{row.label}</TableCell>
                              {row.values.map((value, index) => (
                                <TableCell key={`${row.label}-${peptides[index].id}`} className="align-top text-sm text-muted-foreground">
                                  {value}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-10" />

              <section className="rounded-[2rem] border p-8 md:p-10">
                <h2 className="text-2xl font-bold">Still deciding?</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  The side-by-side table helps you narrow the field. If you want a more guided answer based on your goal, experience level, and risk tolerance, use the quiz.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" render={<Link href="/quiz" />}>
                    Find your plan
                  </Button>
                  <Button variant="outline" size="lg" render={<Link href="/guides/how-to-compare-peptide-vendors" />}>
                    Read the vendor guide
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
