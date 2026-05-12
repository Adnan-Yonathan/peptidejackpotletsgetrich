"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PdfPaywall } from "@/components/paywall/PdfPaywall";
import { QuizCountdownBanner } from "@/components/paywall/QuizCountdownBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getGoalById } from "@/data/goals";
import { getGoalProtocolPdfPair } from "@/data/protocol-pdfs";
import { getVendorBySlug } from "@/data/vendors";
import { useQuizState } from "@/hooks/useQuizState";
import { generatePlannerResult } from "@/lib/planner-engine";
import { getShopperRegion } from "@/lib/shopper-country";
import type { PlannerAnswers, PlannerRecommendation } from "@/types/planner";

const PLANNER_DEFAULTS: Partial<PlannerAnswers> = {
  secondaryGoalIds: [],
  topProblems: [],
  healthConditions: [],
  medications: [],
  reproductiveStatus: "none",
  femaleLifeStage: "not_applicable",
  maleHormoneContext: "not_applicable",
  notes: "",
  deliveryPreference: "flexible",
  stackingPreference: "basic_stack",
  routineConsistency: "medium",
  monitoringWillingness: "basic",
  planStyle: "balanced",
};

const SURFACE = "rounded-[1.1rem] border border-[#103b2c]/10 bg-white shadow-sm";

function formatTitleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getRiskLabel(riskTolerance: PlannerAnswers["riskTolerance"]) {
  if (riskTolerance <= 2) return "Conservative";
  if (riskTolerance === 3) return "Balanced";
  return "Aggressive";
}

function getCycleLabel(timeframe: PlannerAnswers["timeframe"]) {
  if (timeframe === "short") return "4-week cycle";
  if (timeframe === "medium") return "8-week cycle";
  return "12-week cycle";
}

function getRouteTag(recommendations: PlannerRecommendation[]) {
  const route = recommendations[0]?.peptide.administrationRoutes?.[0];
  return route ? formatTitleCase(route) : "Mixed route";
}

function getCompoundClassLabel(recommendation: PlannerRecommendation) {
  const alias = recommendation.peptide.synonyms[0];
  const category = formatTitleCase(recommendation.peptide.category);
  return alias ? `${alias} · ${category}` : category;
}

function getTwoSentenceDescription(recommendation: PlannerRecommendation) {
  const short = recommendation.peptide.shortDescription.trim();
  const effectSentence = recommendation.peptide.expectedEffects.split(".")[0]?.trim();
  return effectSentence ? `${short} ${effectSentence}.` : short;
}

function getRegulatoryChip(recommendation: PlannerRecommendation) {
  const status = recommendation.peptide.regulatoryStatus;
  if (status === "rx_approved") return "Rx approved";
  if (status === "investigational") return "Investigational";
  if (status === "ruo_only") return "RUO only";
  return "Not approved";
}

function getCompatibilityStatus(plan: ReturnType<typeof generatePlannerResult>) {
  const warningCount = plan.compatibilityWarnings.length;
  if (warningCount === 0) {
    return {
      label: "Strong",
      filledDots: 7,
      note: "Your leading compounds do not trigger a major stack conflict from the current ruleset.",
      tone: "bg-emerald-500",
    };
  }

  if (warningCount === 1) {
    return {
      label: "Moderate",
      filledDots: 5,
      note: "One interaction note surfaced, but the stack is still workable with closer review.",
      tone: "bg-amber-500",
    };
  }

  return {
    label: "Review",
    filledDots: 3,
    note: "Multiple stack-level cautions surfaced. Review the full protocol before acting on the recommendation.",
    tone: "bg-red-500",
  };
}

function buildResultsOutboundHref(vendorSlug: string, peptideSlug: string, region: "us" | "eu") {
  const params = new URLSearchParams({
    sourcePage: "quiz-results-v2",
    utm_source: "peptidepros",
    utm_medium: "affiliate",
    utm_campaign: `quiz-results-${region}`,
    utm_content: vendorSlug,
  });

  return `/out/${vendorSlug}/${peptideSlug}?${params.toString()}`;
}

function TrustChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#103b2c]/10 bg-[#fbfaf7] px-2 py-1 text-[10px] font-medium text-[#103b2c]/78">
      {children}
    </span>
  );
}

function FreeCompoundCard({ recommendation }: { recommendation: PlannerRecommendation }) {
  return (
    <div className="rounded-[1rem] border border-[#103b2c]/10 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-black">
            {recommendation.peptide.name}
          </p>
          <p className="mt-0.5 text-[12px] text-[#103b2c]/58">{getCompoundClassLabel(recommendation)}</p>
        </div>
        <Badge className="bg-[#0f6a52] text-white hover:bg-[#0f6a52]">
          {recommendation.role === "goal-driver" ? "Primary" : formatTitleCase(recommendation.role)}
        </Badge>
      </div>

      <p className="mt-2 text-[12px] leading-[1.35rem] text-[#103b2c]/72">
        {getTwoSentenceDescription(recommendation)}
      </p>

      <div className="mt-2 flex flex-wrap gap-1">
        <TrustChip>Tier {recommendation.peptide.evidenceTier}</TrustChip>
        <TrustChip>{formatTitleCase(recommendation.peptide.riskLevel)} risk</TrustChip>
        <TrustChip>{formatTitleCase(recommendation.peptide.administrationRoutes[0] ?? "mixed")}</TrustChip>
        <TrustChip>{getRegulatoryChip(recommendation)}</TrustChip>
      </div>
    </div>
  );
}

function LockedCompoundCard({ recommendation }: { recommendation: PlannerRecommendation | undefined }) {
  const title = recommendation?.peptide.name ?? "Locked protocol compound";
  const label = recommendation ? getCompoundClassLabel(recommendation) : "Stack-specific add-on";
  const copy = recommendation
    ? getTwoSentenceDescription(recommendation)
    : "This compound is included in the full protocol only, along with the exact role it plays in your cycle.";

  return (
    <div className="relative overflow-hidden rounded-[1rem] border border-[#103b2c]/10 bg-white p-3">
      <div className="blur-[3px]">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-black">{title}</p>
          <p className="mt-0.5 text-[12px] text-[#103b2c]/58">{label}</p>
        </div>
        <p className="mt-2 text-[12px] leading-[1.35rem] text-[#103b2c]/72">{copy}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <TrustChip>Tier {recommendation?.peptide.evidenceTier ?? "B-C"}</TrustChip>
          <TrustChip>{formatTitleCase(recommendation?.peptide.riskLevel ?? "medium")} risk</TrustChip>
          <TrustChip>{formatTitleCase(recommendation?.peptide.administrationRoutes[0] ?? "subcutaneous")}</TrustChip>
          <TrustChip>{recommendation ? getRegulatoryChip(recommendation) : "Protocol only"}</TrustChip>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/65 backdrop-blur-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#103b2c] text-white">
          <Lock className="h-3.5 w-3.5" />
        </div>
        <p className="mt-2 text-[13px] font-semibold text-[#103b2c]">Unlock in full protocol</p>
      </div>
    </div>
  );
}

function VendorCard({
  badge,
  href,
  vendorSlug,
  isPrimary,
  regionLabel,
}: {
  badge: string;
  href: string;
  vendorSlug: "amino-club" | "xl-peptides";
  isPrimary: boolean;
  regionLabel: string;
}) {
  const vendor = getVendorBySlug(vendorSlug);
  if (!vendor) return null;

  const coaLabel =
    vendor.coaAccessMode === "public_pdf"
      ? "Public COA"
      : vendor.coaAccessMode === "unknown"
        ? "COA varies"
        : formatTitleCase(vendor.coaAccessMode);

  return (
    <div
      className={`rounded-[1.1rem] border p-3.5 ${
        isPrimary
          ? "border-[#0f6a52] bg-white shadow-[0_10px_30px_rgba(15,106,82,0.08)]"
          : "border-[#103b2c]/10 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge
            variant={isPrimary ? "default" : "outline"}
            className={
              isPrimary ? "bg-[#0f6a52] text-white hover:bg-[#0f6a52]" : "border-[#103b2c]/15 text-[#103b2c]"
            }
          >
            {badge}
          </Badge>
          <p className="mt-2.5 text-lg font-semibold tracking-tight text-black">{vendor.name}</p>
          <p className="mt-1 text-[13px] text-[#103b2c]/58">
            {regionLabel} · {vendorSlug === "amino-club" ? "🇺🇸 United States" : "🇪🇺 UK / EU"}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <TrustChip>{vendor.trustpilotRating ?? "N/A"}/5 rating</TrustChip>
        <TrustChip>{coaLabel}</TrustChip>
        <TrustChip>{vendorSlug === "amino-club" ? "US shipping" : "UK/EU shipping"}</TrustChip>
      </div>

      <p className="mt-2.5 text-[13px] leading-5 text-[#103b2c]/72">
        {vendorSlug === "amino-club"
          ? "Best fit when you want faster U.S. routing and direct product-page affiliate paths."
          : "Best fit when you want UK/EU fulfillment and a wide international catalog for this stack."}
      </p>

      <Button
        className={`mt-3.5 h-10 w-full ${isPrimary ? "" : "border-[#103b2c]/15 bg-white text-[#103b2c] hover:bg-[#fbfaf7]"}`}
        variant={isPrimary ? "default" : "outline"}
        render={<a href={href} target="_blank" rel="noreferrer" />}
      >
        Go to {vendor.name}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

export default function QuizResultsPage() {
  const router = useRouter();
  const { answers, isComplete, reset, completedAt, markCompletedNow } = useQuizState();
  const [vendorRegion, setVendorRegion] = useState<"us" | "eu">(
    getShopperRegion(answers.country ?? "us") === "us" ? "us" : "eu"
  );
  const [shareMessage, setShareMessage] = useState("Copy stack");

  // Stamp the moment of first completion once the user lands here with a
  // complete quiz. Idempotent — returning visitors keep their original timestamp.
  const complete = isComplete();
  useEffect(() => {
    if (complete) markCompletedNow();
  }, [complete, markCompletedNow]);

  if (!isComplete()) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <h2 className="mb-2 text-xl font-semibold">Quiz not completed</h2>
              <p className="mb-4 text-muted-foreground">
                Complete the intake first so the planner has enough context to recommend a stack.
              </p>
              <Button render={<Link href="/quiz" />}>Start intake</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const completedAnswers = { ...PLANNER_DEFAULTS, ...answers } as PlannerAnswers;
  const plan = generatePlannerResult(completedAnswers);
  const recommendedStack = plan.primary;

  if (recommendedStack.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 px-4 py-12">
          <div className="mx-auto w-full max-w-3xl">
            <Button variant="ghost" render={<Link href="/quiz" />}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to intake
            </Button>

            <Card className="mt-6">
              <CardContent className="space-y-4 pt-6">
                <h1 className="text-2xl font-semibold">No clear stack recommendation</h1>
                <p className="text-muted-foreground">
                  Your current inputs are conservative enough that the planner did not keep a strong stack recommendation.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => {
                      reset();
                      router.push("/quiz");
                    }}
                  >
                    Reset and retake
                  </Button>
                  <Button render={<Link href="/peptides" />}>Browse compounds manually</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const goal = getGoalById(completedAnswers.primaryGoalId);
  const protocolPdfPair = getGoalProtocolPdfPair(completedAnswers.primaryGoalId);
  const primaryProtocol = protocolPdfPair?.primary;
  const addonProtocol = protocolPdfPair?.addon;
  const stackName = `${goal?.displayName ?? "Personalized"} Stack`;
  const protocolName = primaryProtocol?.name ?? `${goal?.displayName ?? "Goal"} Protocol`;
  const protocolPrice = primaryProtocol?.priceLabel ?? "Coming soon";
  const cycleLabel = getCycleLabel(completedAnswers.timeframe);
  const routeTag = getRouteTag(recommendedStack);
  const compatibility = getCompatibilityStatus(plan);
  const visibleCompounds = recommendedStack.slice(0, 1);
  const lockedCompounds = [
    recommendedStack[1] ?? plan.alternatives[0],
    recommendedStack[2] ?? plan.alternatives[1] ?? plan.alternatives[0],
    recommendedStack[3] ?? plan.alternatives[2] ?? plan.alternatives[1] ?? plan.alternatives[0],
  ];
  const primaryPeptideSlug = recommendedStack[0]?.peptide.slug ?? "bpc-157";
  const vendorOrder =
    vendorRegion === "us"
      ? [
          { slug: "amino-club" as const, primary: true, badge: "Recommended for you", region: "US route" },
          { slug: "xl-peptides" as const, primary: false, badge: "Carries your stack", region: "EU route" },
        ]
      : [
          { slug: "xl-peptides" as const, primary: true, badge: "Recommended for you", region: "EU route" },
          { slug: "amino-club" as const, primary: false, badge: "Carries your stack", region: "US route" },
        ];

  async function handleShareResults() {
    const anonymousId = crypto.randomUUID();
    const sharePayload = {
      createdAt: new Date().toISOString(),
      stackName,
      compounds: recommendedStack.map((item) => item.peptide.slug),
    };
    window.localStorage.setItem(`peptidepros-shared-stack:${anonymousId}`, JSON.stringify(sharePayload));
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("stack", anonymousId);

    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      setShareMessage("Copied");
    } catch {
      setShareMessage("Copy failed");
    }

    window.setTimeout(() => setShareMessage("Copy stack"), 1800);
  }

  return (
    <>
      <Header />
      <QuizCountdownBanner completedAt={completedAt} />
      <main className="flex-1 bg-[#fbfaf7] px-4 py-5 md:py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
          <div className="flex items-center justify-between">
            <Button variant="ghost" render={<Link href="/quiz" />}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to quiz
            </Button>
          </div>

          <section className={`${SURFACE} px-4 py-4 md:px-5`}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0f6a52]">
              Quiz complete
            </p>
            <h1 className="mt-2 text-[1.7rem] font-bold tracking-tight text-black md:text-[2.15rem]">
              {stackName}
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[#103b2c]/72">
              Built for a <span className="font-semibold text-[#103b2c]">{formatTitleCase(completedAnswers.experience)}</span> researcher with a{" "}
              <span className="font-semibold text-[#103b2c]">{getRiskLabel(completedAnswers.riskTolerance)}</span> risk profile, a{" "}
              <span className="font-semibold text-[#103b2c]">{cycleLabel}</span>, and a{" "}
              <span className="font-semibold text-[#103b2c]">{formatTitleCase(completedAnswers.budget)}</span> budget lane.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge className="bg-[#0f6a52] text-white hover:bg-[#0f6a52]">✓ Compatibility checked</Badge>
              <Badge variant="outline" className="border-[#103b2c]/15 text-[#103b2c]">
                {goal?.displayName ?? "Goal-based stack"}
              </Badge>
              <Badge variant="outline" className="border-[#103b2c]/15 text-[#103b2c]">
                {routeTag}
              </Badge>
              <Badge variant="outline" className="border-[#103b2c]/15 text-[#103b2c]">
                {cycleLabel}
              </Badge>
              <Badge variant="outline" className="border-[#103b2c]/15 text-[#103b2c]">
                {recommendedStack.length} compounds
              </Badge>
            </div>
          </section>

          <section className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5 md:gap-3">
              <FreeCompoundCard recommendation={visibleCompounds[0]} />
              <LockedCompoundCard recommendation={lockedCompounds[0]} />
              <LockedCompoundCard recommendation={lockedCompounds[1]} />
              <LockedCompoundCard recommendation={lockedCompounds[2]} />
            </div>

            <div className="rounded-[1rem] border border-[#103b2c]/10 bg-white px-3 py-2.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-[#103b2c]">Compatibility score</p>
                  <span className="text-[13px] font-semibold text-black">{compatibility.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-full rounded-full ${
                        index < compatibility.filledDots ? compatibility.tone : "bg-[#103b2c]/10"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[12px] leading-[1.35rem] text-[#103b2c]/60">
                  {compatibility.note}
                </p>
              </div>
            </div>
          </section>

          <PdfPaywall
            primaryProtocol={primaryProtocol}
            addonProtocol={addonProtocol}
            protocolName={protocolName}
          />

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
                  Vendor recommendations
                </p>
                <h2 className="mt-1.5 text-[1.7rem] font-bold tracking-tight text-black">
                  Best sources for your stack
                </h2>
              </div>
            </div>

            <div className="grid gap-3.5 md:grid-cols-2">
              {vendorOrder.map((item) => (
                <VendorCard
                  key={item.slug}
                  badge={item.badge}
                  vendorSlug={item.slug}
                  regionLabel={item.region}
                  isPrimary={item.primary}
                  href={buildResultsOutboundHref(item.slug, primaryPeptideSlug, vendorRegion)}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <div className="inline-flex rounded-full border border-[#103b2c]/10 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setVendorRegion("us")}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    vendorRegion === "us" ? "bg-[#103b2c] text-white" : "text-[#103b2c]/65"
                  }`}
                >
                  US
                </button>
                <button
                  type="button"
                  onClick={() => setVendorRegion("eu")}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    vendorRegion === "eu" ? "bg-[#103b2c] text-white" : "text-[#103b2c]/65"
                  }`}
                >
                  EU
                </button>
              </div>
            </div>
          </section>

          <section className={`${SURFACE} grid gap-4 px-4 py-4.5 md:grid-cols-[1.25fr_0.75fr] md:px-6`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
                Protocol preview
              </p>
              <h2 className="mt-2.5 text-[1.7rem] font-bold tracking-tight text-black">
                Your full protocol is ready — goal strategy, tradeoffs, and checklists are locked
              </h2>
              <p className="mt-2.5 max-w-2xl text-[13px] leading-5 text-[#103b2c]/72">
                The full unlock includes the goal-specific compound map, stack logic, safety screens, timeline expectations, and workbook pages built around your quiz result.
              </p>

              <div className="mt-3.5 space-y-2">
                {[
                  "Goal lane — [blurred] conservative vs balanced vs advanced path",
                  "Stack logic — [blurred] foundation, goal-driver, and adjunct roles",
                  "Checkpoint — [blurred] reassessment and clinician discussion checklist",
                ].map((line) => (
                  <div
                    key={line}
                    className="rounded-[0.95rem] border border-[#103b2c]/10 bg-[#fbfaf7] px-3.5 py-2.5 text-[13px] text-[#103b2c]/55 blur-[1.5px]"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <Button
                className="h-11 w-full text-[15px]"
                size="lg"
                disabled={!primaryProtocol}
                {...(primaryProtocol ? { render: <Link href={`/checkout/${primaryProtocol.slug}`} /> } : {})}
              >
                {primaryProtocol ? `Unlock My Protocol → ${protocolPrice}` : "Protocol coming soon"}
              </Button>
            </div>
          </section>

          <section className="rounded-[1rem] border border-[#103b2c]/10 bg-white px-3.5 py-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#103b2c]">
                  Not ready? Copy your stack and come back when you are ready.
                </p>
                <p className="mt-1.5 text-[11px] text-[#103b2c]/55">
                  For research purposes only. Not intended for human use or self-medication.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="h-10 border-[#103b2c]/15 bg-white text-[#103b2c]" onClick={handleShareResults}>
                  <Copy className="mr-2 h-4 w-4" />
                  {shareMessage}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
