import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FlaskConical,
  MoveRight,
  Scale,
  Shield,
  Sparkles,
  Syringe,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaPhonePreview } from "@/components/ui/cta-phone-preview";
import { GOALS } from "@/data/goals";
import { getGuideBySlug, getPublishedGuides, type GuideData } from "@/data/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Foundational peptide guides on safety, reconstitution, storage, COAs, vendor comparison, and regulatory basics.",
};

const CATEGORY_STYLES: Record<
  string,
  {
    label: string;
    icon: LucideIcon;
    badge: string;
    accent: string;
    note: string;
    image?: string;
  }
> = {
  basics: {
    label: "Basics",
    icon: Beaker,
    badge: "border-[#d9e5ff] bg-[#eef5ff] text-[#3f67b1]",
    accent: "bg-[#edf5ff]",
    note: "Why it matters: Avoid costly confusion, mistakes and hype.",
    image: "/images/peptides/bpc-157.png",
  },
  "safety-quality": {
    label: "Safety",
    icon: Shield,
    badge: "border-[#ffe0b3] bg-[#fff1df] text-[#a46907]",
    accent: "bg-[#f8fbf9]",
    note: "Why it matters: Protect your health and get better results.",
  },
  "dosing-reconstitution": {
    label: "Dosing",
    icon: Syringe,
    badge: "border-[#caecd8] bg-[#e9f8ef] text-[#267c5a]",
    accent: "bg-[#f4faf7]",
    note: "Why it matters: Do it right, get accurate dosing, avoid waste.",
    image: "/images/peptides/semaglutide.png",
  },
  "storage-handling": {
    label: "Storage",
    icon: FlaskConical,
    badge: "border-[#d9e1d0] bg-[#eef2ea] text-[#6f7756]",
    accent: "bg-[#f7f8f4]",
    note: "Why it matters: Protect potency and prevent degradation.",
    image: "/images/peptides/ghk-cu.png",
  },
  "legal-regulatory": {
    label: "Legal",
    icon: Scale,
    badge: "border-[#e1d2ff] bg-[#f4ecff] text-[#7b57b2]",
    accent: "bg-[#f9f6ff]",
    note: "Why it matters: Improve compliance and avoid costly surprises.",
  },
};

const FEATURED_GUIDE_SPECS = [
  "what-are-peptides",
  "peptide-safety-basics",
  "how-to-reconstitute-peptides",
  "ruo-vs-human-use",
  "how-to-read-a-coa",
  "how-to-store-peptides",
] as const;

const GOAL_PILLS = ["All", "Fat Loss", "Muscle Growth", "Recovery", "Anti-Aging"] as const;

const GOAL_CARD_COPY: Record<string, { title: string; description: string; icon: LucideIcon }> = {
  fat_loss: {
    title: "Fat Loss Guides",
    description: "Cut fat and optimize metabolism",
    icon: Zap,
  },
  muscle_growth: {
    title: "Muscle Growth Guides",
    description: "Build muscle and increase strength",
    icon: FlaskConical,
  },
  recovery: {
    title: "Recovery Guides",
    description: "Heal faster and reduce inflammation",
    icon: Shield,
  },
  anti_aging: {
    title: "Anti-Aging Guides",
    description: "Optimize longevity and vitality",
    icon: Sparkles,
  },
};

function getGuideStyle(guide: GuideData) {
  return CATEGORY_STYLES[guide.categoryId] ?? CATEGORY_STYLES.basics;
}

function getReadTime(guide: GuideData) {
  const sectionWeight = guide.sections.length * 0.6;
  const faqWeight = guide.faqs.length * 0.3;
  const takeawayWeight = guide.keyTakeaways.length * 0.2;
  return Math.max(3, Math.round(sectionWeight + faqWeight + takeawayWeight));
}

export default function GuidesPage() {
  const featuredGuides = FEATURED_GUIDE_SPECS.map((slug) => getGuideBySlug(slug)).filter(
    (guide): guide is GuideData => Boolean(guide)
  );
  const totalGuides = getPublishedGuides().length;
  const goalCards = GOALS.filter((goal) => goal.id in GOAL_CARD_COPY).sort(
    (a, b) =>
      ["fat_loss", "muscle_growth", "recovery", "anti_aging"].indexOf(a.id) -
      ["fat_loss", "muscle_growth", "recovery", "anti_aging"].indexOf(b.id)
  );

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f7f5f1] px-4 py-6 md:py-8">
        <div className="container mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#e7e2d8] bg-[linear-gradient(180deg,#fbfaf7_0%,#f8f6f1_100%)] px-5 py-6 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] md:px-7 md:py-7">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
              <div className="pt-1">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
                  Guides &amp; Education
                </p>
                <h1 className="max-w-xl text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-[#13201d] md:text-[3.55rem]">
                  Make Smarter Decisions.
                  <br />
                  <span className="text-[#19906f]">Stay Safe. Get Results.</span>
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                  Evidence-based guides that cut through confusion and help you choose peptides with confidence.
                </p>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0f6a52]" />
                    <div>
                      <p className="font-semibold text-[#13201d]">Evidence Based</p>
                      <p className="text-xs text-slate-500">Curated &amp; Reviewed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-[#0f6a52]" />
                    <div>
                      <p className="font-semibold text-[#13201d]">Updated Regularly</p>
                      <p className="text-xs text-slate-500">Latest Science &amp; Guidelines</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#0f6a52]" />
                    <div>
                      <p className="font-semibold text-[#13201d]">Built for Real Results</p>
                      <p className="text-xs text-slate-500">Safety First, Always</p>
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
                    Start Here • 2 Minutes
                  </Badge>
                  <div>
                    <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#13201d]">Not sure what you need?</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                      Answer a few questions and get a personalized peptide plan tailored to your goals and experience.
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
                  <CtaPhonePreview variant="guides" />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[28px] border border-[#e7e2d8] bg-[#f8faf8] px-5 py-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="grid gap-5 lg:grid-cols-[240px_1fr] lg:items-center">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-[#dbeadf] bg-white p-3 text-[#0f6a52]">
                  <MoveRight className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f6a52]">New Here? Follow This Path</p>
                  <h2 className="mt-1 text-[1.65rem] font-semibold tracking-[-0.03em] text-[#13201d]">Get Started in 3 Simple Steps</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Learn the Basics",
                    body: "Understand what peptides are and why they work.",
                    cta: "Start with the basics",
                    href: `/guides/${featuredGuides[0]?.slug ?? "what-are-peptides"}`,
                  },
                  {
                    step: "2",
                    title: "Know the Risks",
                    body: "Learn safety, legality, and how to research properly.",
                    cta: "Read safety guides",
                    href: `/guides/${featuredGuides[1]?.slug ?? "peptide-safety-basics"}`,
                  },
                  {
                    step: "3",
                    title: "Find Your Plan",
                    body: "Get personalized recommendations and compare the best options.",
                    cta: "Take the quiz",
                    href: "/quiz",
                  },
                ].map((item, index) => (
                  <div key={item.step} className="relative rounded-[24px] p-1">
                    {index < 2 && (
                      <div className="pointer-events-none absolute right-[-24px] top-8 hidden text-slate-300 md:block">
                        <MoveRight className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-h-[132px] rounded-[22px] bg-white p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.45)]">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f6a52] text-xs font-bold text-white">
                          {item.step}
                        </span>
                        <p className="text-sm font-semibold text-[#13201d]">{item.title}</p>
                      </div>
                      <p className="text-sm leading-5 text-slate-600">{item.body}</p>
                      <Link href={item.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#0f6a52]">
                        {item.cta} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">Most Popular Guides</p>
                <h2 className="mt-1 text-[1.95rem] font-semibold tracking-[-0.03em] text-[#13201d]">Start With These</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  The guides our users read first and the ones most likely to prevent bad assumptions.
                </p>
              </div>
              <Button
                variant="outline"
                className="hidden rounded-full border-[#d8ddd7] bg-white px-4 text-[#13201d] md:inline-flex"
                render={<Link href="/guides" />}
              >
                View All Articles
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredGuides.map((guide) => {
                const style = getGuideStyle(guide);
                const Icon = style.icon;
                const readTime = getReadTime(guide);

                return (
                  <div
                    key={guide.id}
                    className="rounded-[24px] border border-[#e7e2d8] bg-white p-4 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.45)] transition-shadow hover:shadow-[0_18px_55px_-34px_rgba(15,23,42,0.5)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${style.badge}`}
                      >
                        {style.label}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock3 className="h-3 w-3" />
                        {readTime} min read
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-[1fr_96px] gap-4">
                      <div>
                        <h3 className="text-[1.05rem] font-semibold leading-tight tracking-[-0.02em] text-[#13201d]">
                          {guide.title}
                        </h3>
                        <p className="mt-2 text-sm leading-5 text-slate-600">{guide.summary}</p>
                      </div>
                      <div className={`relative overflow-hidden rounded-[20px] border border-[#edf0ea] ${style.accent}`}>
                        {style.image ? (
                          <Image
                            src={style.image}
                            alt={guide.title}
                            fill
                            className="object-contain p-2"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Icon className="h-11 w-11 text-slate-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#f5f7f3] px-3 py-2 text-xs leading-5 text-slate-600">
                      {style.note}
                    </div>

                    <Button
                      className="mt-4 h-8 rounded-lg bg-[#0f6a52] px-3 text-xs font-semibold text-white hover:bg-[#0c5944]"
                      size="sm"
                      render={<Link href={`/guides/${guide.slug}`} />}
                    >
                      Read Guide <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-5">
            <div className="flex flex-col gap-4 rounded-[24px] border border-[#d7eadf] bg-[#e9f5ee] px-5 py-4 shadow-[0_16px_40px_-34px_rgba(15,106,82,0.35)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-[#13201d]">Ready to skip the guesswork?</p>
                <p className="mt-1 text-sm text-slate-600">
                  Get a personalized peptide plan based on your goals, experience, and risk tolerance.
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

          <section className="mt-5 rounded-[28px] border border-[#e7e2d8] bg-[#fbfaf7] px-5 py-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">Browse By Goal</p>
                <h2 className="mt-1 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#13201d]">
                  Find Guides for Your Goals
                </h2>
              </div>
              <Button variant="ghost" className="hidden text-[#0f6a52] hover:bg-transparent md:inline-flex" render={<Link href="/guides" />}>
                View all guides <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {GOAL_PILLS.map((pill) => (
                <div
                  key={pill}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    pill === "All"
                      ? "border-[#0f6a52] bg-[#0f6a52] text-white"
                      : "border-[#e5e1d8] bg-white text-slate-600"
                  }`}
                >
                  {pill}
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {goalCards.map((goal) => {
                const GoalIcon = GOAL_CARD_COPY[goal.id].icon;

                return (
                  <div key={goal.id} className="rounded-[24px] border border-[#e7e2d8] bg-white p-4 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.35)]">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6f4ef] text-[#0f6a52]">
                      <GoalIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-[#13201d]">{GOAL_CARD_COPY[goal.id].title}</h3>
                    <p className="mt-2 text-sm leading-5 text-slate-600">{GOAL_CARD_COPY[goal.id].description}</p>
                    <p className="mt-3 text-xs font-semibold text-[#0f6a52]">
                      {Math.min(totalGuides, Math.max(6, Math.ceil(goal.peptideIds.length / 2)))} guides
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-5 rounded-[24px] border border-[#e7e2d8] bg-[#fbfaf7] px-5 py-4 shadow-[0_16px_40px_-36px_rgba(15,23,42,0.35)]">
            <div className="grid gap-4 text-center text-sm text-slate-600 md:grid-cols-4">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-[#0f6a52]" />
                <span className="font-medium text-[#13201d]">Research First</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4 text-[#0f6a52]" />
                <span className="font-medium text-[#13201d]">50+ Guides &amp; Resources</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-[#0f6a52]" />
                <span className="font-medium text-[#13201d]">Updated April 2026</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0f6a52]" />
                <span className="font-medium text-[#13201d]">10,000+ Active Users</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
