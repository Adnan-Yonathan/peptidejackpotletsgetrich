import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  FlaskConical,
  BarChart3,
  BookOpen,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroSection as FeatureCarousel } from "@/components/ui/feature-carousel";
import { getPublishedPeptides } from "@/data/peptides";
import { CATEGORY_HUBS } from "@/data/category-hubs";
import { COMPATIBILITY_RULES } from "@/data/compatibility";
import { getActiveVendors } from "@/data/vendors";
import heroImage from "../../../images/ChatGPT Image Apr 13, 2026, 10_55_43 PM.png";

function HeroImageArt() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden md:flex min-h-[460px] items-center justify-center"
    >
      <div className="dna-hero-glow absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="dna-hero-panel relative h-[460px] w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-border/60 bg-background/75 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <div className="dna-hero-grid absolute inset-0 z-10 opacity-30" />
        <div className="absolute left-6 top-6 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Research peptide guide
        </div>
        <div className="absolute bottom-6 right-6 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Visual reference
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 via-transparent to-primary/15" />
        <Image
          src={heroImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 420px, 0px"
          className="hero-image-motion object-cover object-center"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-background/35 to-transparent" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const peptideCount = getPublishedPeptides().length;
  const vendorCount = getActiveVendors().length;
  const ruleCount = COMPATIBILITY_RULES.length;

  return (
    <div>
      {/*  HERO  */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="relative container mx-auto max-w-6xl px-4 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_420px] md:gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <Badge variant="secondary" className="mb-6 text-xs font-medium tracking-wide">
                Research-grade decision support &middot; 100% free
              </Badge>

              {/* Headline  Hims-style: short, bold, one clear promise */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                The smarter way to
                <br />
                <span className="text-primary">research peptides.</span>
              </h1>

              {/* Subheadline  NerdWallet-style: position as advisor, not seller */}
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Personalized plans, evidence-graded compounds, vendor comparison,
                and compatibility checking - all in one place. No accounts. No paywalls.
              </p>

              {/* Single primary CTA  Hims pattern: one bold action */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="text-base px-8 h-12" render={<Link href="/quiz" />}>
                  Take the Free Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" className="text-base h-12" render={<Link href="/peptides" />}>
                  Browse {peptideCount} Peptides
                </Button>
              </div>
            </div>

            <HeroImageArt />
          </div>
        </div>
      </section>
      {/*  BROWSE BY GOAL HUB  NerdWallet-style category navigation  */}
      <section className="border-y bg-muted/10 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <FeatureCarousel
            className="min-h-0 p-0"
            title={
              <>
                Browse by <span className="text-primary">goal</span>
              </>
            }
            subtitle="Start with the future outcome you care about, compare the compounds that fit, and move toward trusted vendor options from there."
            images={CATEGORY_HUBS.map((hub) => ({
              src: hub.imageSrc,
              alt: hub.imageAlt,
              title: hub.title,
              description: hub.description,
              href: `/goals/${hub.slug}`,
              tags: hub.outcomes.slice(0, 3),
            }))}
          />
          <div className="mt-8 flex justify-center">
            <Button variant="ghost" render={<Link href="/peptides" />}>
              Browse all peptides <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      {/*  HOW IT WORKS  Hims-style: minimal steps, clear path  */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              From question to plan in three steps.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              No signup required. No credit card. Just answers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Tell us your goal",
                description:
                  "Answer 6 quick questions about what you want to achieve, your experience, budget, and risk comfort.",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "Get matched",
                description:
                  "Our engine cross-references your answers against evidence tiers, regulatory flags, and compatibility data.",
                icon: Layers,
              },
              {
                step: "03",
                title: "Compare & decide",
                description:
                  "Review your personalized plan, compare vendors side-by-side, and build your stack with live safety checks.",
                icon: BarChart3,
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">STEP {item.step}</p>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="text-base" render={<Link href="/quiz" />}>
              Start the Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/*  WHAT YOU GET  NerdWallet-style: tool-first, value-dense  */}
      <section className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to research with confidence.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: FlaskConical,
                title: "Evidence-Graded Directory",
                description:
                  "Every compound rated Tier A through D based on clinical evidence  from FDA-approved therapeutics to preclinical-only research peptides.",
                detail: `${peptideCount} compounds with full mechanism, dosing, safety, and regulatory data`,
              },
              {
                icon: Shield,
                title: "Regulatory Flag System",
                description:
                  "FDA compounding safety flags, WADA prohibited-list status, and Rx-only markers are first-class data  not buried footnotes.",
                detail: "Danger/warning/info severity levels with templated disclaimers",
              },
              {
                icon: Layers,
                title: "Stack Builder + Compatibility Engine",
                description:
                  "Build multi-peptide stacks with real-time compatibility checking. Contraindicated combinations are blocked. Caution pairs are flagged.",
                detail: `${ruleCount} rules covering GH-axis, melanocortin, mitogenic, and CNS interactions`,
              },
              {
                icon: BarChart3,
                title: "Vendor Comparison",
                description:
                  "Institutional RUO, consumer RUO, and Rx manufacturers  categorized by type, COA access, and QC methods. No hidden rankings.",
                detail: `${vendorCount} vendors across 3 vendor types`,
              },
            ].map((item) => (
              <Card key={item.title} className="border bg-background hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/*  TRUST / DIFFERENTIATION  NerdWallet advisor positioning  */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Education first.
                <br />
                Not a store.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                PeptidePros is a decision-support tool, not a retailer. We don&apos;t sell peptides.
                We help you understand the research, compare options transparently, and make informed
                decisions with accurate regulatory context.
              </p>
              <div className="space-y-4">
                {[
                  "Every compound shows evidence tier, not hype",
                  "FDA and WADA flags are visible, not hidden",
                  "Contraindicated stacks are blocked, not suggested",
                  "Vendor types are disclosed  institutional vs consumer vs Rx",
                  "No login required. No paywall. No data harvesting.",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: quick-glance safety example */}
            <div className="bg-muted/30 rounded-2xl p-6 border">
              <p className="text-xs font-mono text-muted-foreground mb-4">EXAMPLE: COMPOUND DETAIL</p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">BPC-157</p>
                  <p className="text-xs text-muted-foreground">Body Protection Compound 157</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 text-xs">
                    Evidence Tier C
                  </Badge>
                  <Badge variant="outline" className="capitalize text-xs">
                    High Risk
                  </Badge>
                  <Badge variant="outline" className="capitalize text-xs">
                    Intermediate
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-500/5 border border-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-red-600">FDA Compounding Safety Flag</p>
                    <p className="text-[11px] text-muted-foreground">
                      FDA has identified potential safety risks for compounding
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-md bg-yellow-500/5 border border-yellow-500/20">
                  <Shield className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-yellow-600">WADA S0  Non-Approved Substance</p>
                    <p className="text-[11px] text-muted-foreground">
                      Prohibited at all times under anti-doping rules
                    </p>
                  </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Preclinical cytoprotective peptide studied for tissue repair and GI protection in animal models.
                  Not approved for human use.
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs" render={<Link href="/peptides/bpc-157" />}>
                  View Full Profile <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  FINAL CTA  Hims-style: clean, single action, low friction  */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your personalized plan is 2 minutes away.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Answer 6 questions. Get matched with evidence-graded compounds, safety flags, and vendor options  completely free.
          </p>
          <Button size="lg" className="text-base px-10 h-12" render={<Link href="/quiz" />}>
            Take the Quiz <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            No account needed &middot; No credit card &middot; No spam
          </p>
        </div>
      </section>

      {/*  DISCLAIMER  */}
      <section className="border-t">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <p className="text-[11px] text-muted-foreground/70 text-center leading-relaxed">
            PeptidePros provides educational and research reference information only. This is not medical advice.
            Not for diagnosing, treating, curing, or preventing disease. Products referenced may be labeled
            Research Use Only (RUO) by vendors and are not approved for human or veterinary use. If you are
            subject to anti-doping rules, many peptide hormones and growth-factor-related substances are prohibited.
            Always consult a qualified healthcare professional.
          </p>
        </div>
      </section>
    </div>
  );
}
