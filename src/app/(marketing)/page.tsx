import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FlaskConical,
  Headphones,
  Layers,
  Lock,
  NotebookPen,
  RefreshCw,
  Shield,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import heroImage from "../../../images/ChatGPT Image Apr 13, 2026, 10_55_43 PM.png";
import { LaptopMockup } from "@/components/ui/laptop-mockup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSection as FeatureCarousel } from "@/components/ui/feature-carousel";
import { Separator } from "@/components/ui/separator";
import { TestimonialsSection } from "@/components/ui/testimonials-columns-1";
import { CATEGORY_HUBS } from "@/data/category-hubs";
import { COMPATIBILITY_RULES } from "@/data/compatibility";
import { getFeaturedGuides } from "@/data/guides";
import { getPublishedPeptides } from "@/data/peptides";
import { getActiveVendors } from "@/data/vendors";

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
  const featuredGuides = getFeaturedGuides().slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="relative container mx-auto max-w-6xl px-4 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_420px] md:gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6 text-xs font-medium tracking-wide">
                Research-grade decision support &middot; 100% free
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl md:text-6xl">
                The smarter way to
                <br />
                <span className="text-primary">research peptides.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Personalized plans, evidence-graded compounds, vendor comparison,
                and compatibility checking - all in one place. Free account required only for your personalized plan.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" render={<Link href="/quiz" />}>
                  Take the Free Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" className="h-12 text-base" render={<Link href="/peptides" />}>
                  Browse {peptideCount} Peptides
                </Button>
              </div>
            </div>

            <HeroImageArt />
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-[#103b2c]">
          <div className="mx-auto grid max-w-5xl justify-center gap-4 px-4 py-5 text-sm text-white/88 md:grid-cols-3 md:gap-6">
            {[
              "We don't sell peptides - we help you choose",
              "Evidence tier on every compound",
              "Regulatory flags always surfaced",
            ].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2.5 text-center">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#9ad9c0]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              From question to plan in three steps.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Browse freely, then create a free account when you want a personalized plan matched to your goals.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-mono text-muted-foreground">STEP {item.step}</p>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="text-base" render={<Link href="/quiz" />}>
              Start the Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything you need to research with confidence.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
                  "See FDA safety flags, WADA status, and Rx-only markers up front instead of digging through footnotes.",
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
              <Card key={item.title} className="border bg-background transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
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

      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
                Education first.
                <br />
                Not a store.
              </h2>
              <p className="mb-8 leading-relaxed text-muted-foreground">
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
                  "Most research tools are open. Account required only for the personalized quiz.",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-6">
              <p className="mb-4 text-xs font-mono text-muted-foreground">EXAMPLE: COMPOUND DETAIL</p>
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold">BPC-157</p>
                  <p className="text-xs text-muted-foreground">Body Protection Compound 157</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/10 text-xs text-yellow-600">
                    Evidence Tier C
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    High Risk
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    Intermediate
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/5 p-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-xs font-medium text-red-600">FDA Compounding Safety Flag</p>
                    <p className="text-[11px] text-muted-foreground">
                      FDA has identified potential safety risks for compounding
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-md border border-yellow-500/20 bg-yellow-500/5 p-2.5">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                  <div>
                    <p className="text-xs font-medium text-yellow-600">WADA S0  Non-Approved Substance</p>
                    <p className="text-[11px] text-muted-foreground">
                      Prohibited at all times under anti-doping rules
                    </p>
                  </div>
                </div>
                <Separator />
                <p className="text-xs leading-relaxed text-muted-foreground">
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

      <section className="bg-[#f1f2ee] py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f6a52]">
                Execution Layer
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-black md:text-5xl">
                Stop guessing your dosing.
                <br />
                Follow a protocol that{" "}
                <span className="relative inline-block italic text-[#0f6a52]">
                  <span className="relative z-10">actually</span>
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-1 left-0 h-[10px] w-full"
                    viewBox="0 0 120 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2,7 C25,3 55,8 80,5 C98,3 110,6 118,5"
                      stroke="#0f6a52"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                works.
              </h2>
              <p className="mt-5 max-w-2xl text-base text-muted-foreground">
                PeptidePros turns your plan into a daily system so you know exactly what to take, when to take it, and never lose your place.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                {[
                  "No guesswork",
                  "On-time, every time",
                  "Stay on track. Get results.",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0f6a52]" />
                    <span className="font-medium text-[#103b2c]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/protocol"
              className="group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[#0f6a52] transition-colors hover:text-[#103b2c] md:mt-12"
            >
              See PeptidePros in action
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.9fr]">
            <div className="rounded-xl bg-white p-6 ring-1 ring-foreground/10 md:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                What you get
              </p>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    icon: CalendarCheck,
                    title: "Daily dose checklist",
                    body: "Every compound in your plan, slotted into your day. One tap marks it complete.",
                  },
                  {
                    icon: Clock,
                    title: "Smart timing & reminders",
                    body: "Countdown to your next dose with personalized timing so you never miss it.",
                  },
                  {
                    icon: Calendar,
                    title: "Full cycle timeline",
                    body: "See your entire cycle at a glance-ramp, active, and taper phases laid out visually.",
                  },
                  {
                    icon: BarChart3,
                    title: "Adherence & streaks",
                    body: "Track consistency with streaks and weekly charts that keep you accountable.",
                  },
                  {
                    icon: NotebookPen,
                    title: "Daily notes & effects",
                    body: "Log how you feel, side effects, sleep, appetite, and more. Autosaves to your device.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Upgrade paths when ready",
                    body: "Fitness and diet add-ons, advanced protocol tuning, and insights-layered in one dashboard.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e7f4ee] text-[#0f6a52]">
                      <item.icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-[#103b2c]">{item.title}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Button render={<Link href="/protocol" />}>
                  Get My Protocol <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" render={<Link href="/quiz" />}>
                  Take the quiz first
                </Button>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                <Lock className="mr-1 inline h-3 w-3 align-[-1px]" />
                Ungated beta &middot; Progress saves to your device
              </p>
            </div>

            <div className="flex items-start justify-center">
              <div className="relative w-full">
                <LaptopMockup className="w-full">
                  <div className="flex h-full w-full flex-col bg-white">
                    <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <FlaskConical className="h-3 w-3 text-[#103b2c]" />
                        <span className="text-[11px] font-bold tracking-tight text-[#103b2c]">
                          PeptidePros +
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {["Today", "Protocol", "Timeline", "Insights"].map((t, i) => (
                          <span
                            key={t}
                            className={
                              i === 0
                                ? "rounded-full bg-[#e7f4ee] px-2.5 py-0.5 text-[9px] font-semibold text-[#0f6a52]"
                                : "px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
                            }
                          >
                            {t}
                          </span>
                        ))}
                        <div className="ml-1.5 flex items-center gap-0.5 rounded-full border border-foreground/10 px-1.5 py-0.5">
                          <div className="h-3 w-3 rounded-full bg-[#e7f4ee] ring-1 ring-[#0f6a52]/20" />
                          <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pt-3">
                      <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Today
                      </p>
                      <p className="mt-0.5 text-[13px] font-bold tracking-tight text-[#103b2c]">
                        WEDNESDAY, APRIL 21
                      </p>
                    </div>

                    <div className="mt-2.5 grid flex-1 grid-cols-[1.3fr_1fr] gap-2.5 px-4 pb-4">
                      <div className="flex flex-col gap-1.5 rounded-[8px] bg-[#fbfaf7] p-2.5 ring-1 ring-foreground/5">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Today&rsquo;s doses
                        </p>
                        {[
                          { t: "7:00 AM", name: "BPC-157", dose: "500 mcg", done: true },
                          { t: "7:00 AM", name: "CJC-1295", dose: "100 mcg", done: true },
                          { t: "12:00 PM", name: "Ipamorelin", dose: "100 mcg", done: false },
                          { t: "8:00 PM", name: "TB-500", dose: "2 mg", done: false },
                        ].map((d) => (
                          <div
                            key={d.name}
                            className="flex items-center justify-between rounded-[6px] bg-white px-2 py-1.5 ring-1 ring-foreground/5"
                          >
                            <div className="flex items-center gap-1.5">
                              <div
                                className={
                                  d.done
                                    ? "flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0f6a52] text-white"
                                    : "h-3.5 w-3.5 rounded-full border border-foreground/20"
                                }
                              >
                                {d.done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
                              </div>
                              <div className="leading-tight">
                                <p className="text-[9px] font-semibold text-[#103b2c]">
                                  {d.name}
                                </p>
                                <p className="text-[7px] text-muted-foreground">{d.dose}</p>
                              </div>
                            </div>
                            <span className="font-mono text-[8px] text-muted-foreground">
                              {d.t}
                            </span>
                          </div>
                        ))}
                        <p className="mt-0.5 text-center text-[8px] font-medium text-[#0f6a52]">
                          Mark all as complete
                        </p>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <div className="flex flex-col items-center gap-1 rounded-[8px] bg-[#fbfaf7] p-2.5 ring-1 ring-foreground/5">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Cycle progress
                          </p>
                          <div className="relative flex h-[72px] w-[72px] items-center justify-center">
                            <svg viewBox="0 0 72 72" className="absolute inset-0">
                              <circle cx="36" cy="36" r="30" fill="none" stroke="#e7f4ee" strokeWidth="5" />
                              <circle
                                cx="36"
                                cy="36"
                                r="30"
                                fill="none"
                                stroke="#0f6a52"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray="188.5"
                                strokeDashoffset="120.6"
                                transform="rotate(-90 36 36)"
                              />
                            </svg>
                            <div className="flex flex-col items-center leading-none">
                              <span className="text-[15px] font-bold text-[#103b2c]">36%</span>
                            </div>
                          </div>
                          <p className="text-[8px] font-semibold text-[#103b2c]">
                            WEEK 5 OF 14
                          </p>
                          <p className="text-[7px] text-muted-foreground">Active Phase</p>
                        </div>

                        <div className="rounded-[8px] bg-[#fbfaf7] p-2.5 ring-1 ring-foreground/5">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Adherence
                          </p>
                          <div className="mt-1.5 grid grid-cols-7 gap-1">
                            {[
                              { d: "M", filled: true },
                              { d: "T", filled: true },
                              { d: "W", filled: true },
                              { d: "T", filled: true },
                              { d: "F", filled: true },
                              { d: "S", filled: false },
                              { d: "S", filled: false },
                            ].map((b, i) => (
                              <div key={i} className="flex flex-col items-center gap-0.5">
                                <div
                                  className={
                                    b.filled
                                      ? "h-4 w-full rounded-[2px] bg-[#0f6a52]"
                                      : "h-4 w-full rounded-[2px] bg-[#e7f4ee]"
                                  }
                                />
                                <span className="text-[6px] font-semibold text-muted-foreground">
                                  {b.d}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-1.5 text-[8px] text-[#103b2c]">
                            Streak: <span className="font-bold">7 days</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </LaptopMockup>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 rounded-xl bg-white px-6 py-6 ring-1 ring-foreground/10 md:grid-cols-4 md:px-8">
            {[
              {
                icon: ShieldCheck,
                title: "Built for real protocols",
                body: "Designed by peptide users, for peptide users.",
              },
              {
                icon: Lock,
                title: "Your data stays yours",
                body: "Private, secure, and never shared.",
              },
              {
                icon: RefreshCw,
                title: "Works across devices",
                body: "Access your protocol anytime, anywhere.",
              },
              {
                icon: Headphones,
                title: "Help when you need it",
                body: "Real support from people who get it.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e7f4ee] text-[#0f6a52]">
                  <item.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#103b2c]">{item.title}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4 text-xs font-medium tracking-wide">
                Education layer
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Start with the guides before you click into products.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Reconstitution, storage, COAs, RUO language, vendor comparison, and peptide safety all live in one place with the same design language as the landing page.
              </p>
            </div>
            <Button variant="ghost" render={<Link href="/guides" />}>
              Explore all guides <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredGuides.map((guide) => (
              <Card key={guide.id} className="border bg-background transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <Badge variant="outline" className="mb-4 capitalize">
                    {guide.categoryId.replace(/-/g, " ")}
                  </Badge>
                  <h3 className="text-lg font-semibold">{guide.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>
                  <Button className="mt-6" variant="outline" size="sm" render={<Link href={`/guides/${guide.slug}`} />}>
                    Read guide <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Your personalized plan is 2 minutes away.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Answer 6 questions. Get matched with evidence-graded compounds, safety flags, and vendor options  completely free.
          </p>
          <Button size="lg" className="h-12 px-10 text-base" render={<Link href="/quiz" />}>
            Take the Quiz <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="border-t">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/70">
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
