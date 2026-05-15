import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  FlaskConical,
  Layers,
  Lock,
  Minus,
  Plus,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import vendorsHeroImage from "../../../images/vendorsimage.png";
import incentivesImage from "../../../images/incentivessection.png";
import { MobileStickyQuizCta } from "@/components/marketing/MobileStickyQuizCta";
import { Button } from "@/components/ui/button";
import { HeroSection as FeatureCarousel } from "@/components/ui/feature-carousel";
import { TestimonialsSection } from "@/components/ui/testimonials-columns-1";
import { CATEGORY_HUBS } from "@/data/category-hubs";

export const metadata: Metadata = {
  title: { absolute: "PeptidePros - Peptide Research, Trusted for Real Results" },
  description:
    "Independent peptide research and vendor comparison. Evidence-graded compounds, regulatory flags upfront, and personalized plans. We don't sell peptides — we help you choose wisely.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="bg-[#fbfaf7] pb-24 md:pb-0">
      <section id="landing-hero" className="relative overflow-hidden bg-[#fbfaf7]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "none",
          }}
        />

        <div className="relative z-[2] mx-auto grid w-full max-w-[1320px] items-center gap-10 px-6 pt-16 pb-0 md:grid-cols-[minmax(0,1fr)_360px] md:px-8 md:pt-24 md:pb-0 lg:grid-cols-[minmax(0,1fr)_470px] lg:gap-10">
          <div className="text-center md:self-center md:pb-0 md:text-left">
            <h1 className="mb-5 font-extrabold leading-[1.04] tracking-[-0.035em] text-black text-[44px] sm:text-[56px] md:text-[68px]">
              Stop guessing which
              <br />
              peptides{" "}
              <span className="relative inline-block italic text-[#0f6a52]">
                <span className="relative z-10">fit your goal</span>
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
              </span>
              .
            </h1>

            <p className="mx-auto mb-7 max-w-[520px] text-[16px] leading-[1.65] text-[#103b2c]/60 md:mx-0">
              Take our 2-minute quiz to get a peptide protocol matched to your body,
              health profile, and health goals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/quiz"
                className="inline-flex h-[52px] items-center gap-2.5 whitespace-nowrap rounded-[12px] bg-[#0f6a52] px-8 text-[15px] font-extrabold text-white shadow-[0_10px_30px_rgba(15,106,82,0.28)] transition-transform hover:-translate-y-0.5 hover:bg-[#0d5f49]"
              >
                Find My Peptide Stack
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] self-end">
            <Image
              src={vendorsHeroImage}
              alt="Hero portrait"
              priority
              sizes="(min-width: 1280px) 470px, (min-width: 768px) 360px, 100vw"
              className="h-auto w-full origin-bottom scale-[1.08] object-contain object-bottom"
            />
          </div>
        </div>

        <div className="relative z-[2] -mt-3 flex flex-wrap items-center justify-center gap-x-11 gap-y-3 bg-[#0c3226] px-14 py-3.5 md:-mt-5">
          {[
            { icon: ShieldCheck, label: "We don't sell peptides" },
            { icon: CheckCircle2, label: "Evidence tier on every compound" },
            { icon: ShieldAlert, label: "Regulatory flags always surfaced" },
            { icon: Lock, label: "Free forever for researchers" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-[12px] font-medium text-white/60"
            >
              <item.icon className="h-3.5 w-3.5 text-white/70" strokeWidth={2} />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              From question to plan in three steps.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                step: "01",
                title: "Tell us your goal",
                description:
                  "Answer a few quick questions about what you want to achieve, your experience, budget, and risk comfort.",
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
              Find My Peptide Stack <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-[#103b2c]/8 bg-[#fbfaf7] py-20 md:py-28">
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

      {/* ────────────────────────────────────────────
          STACK BUILDER
          Editorial split: oversized type left, live
          compatibility readout right. Cream over cream
          with a tinted card to break the rhythm.
          ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#fbfaf7] py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#103b2c]/15 to-transparent"
        />
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-16">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
                <span className="h-px w-6 bg-[#103b2c]/40" />
                Stack Builder
              </p>
              <h2 className="mb-6 font-extrabold leading-[1.02] tracking-[-0.03em] text-black text-[40px] sm:text-[48px] md:text-[56px]">
                Build a stack that{" "}
                <span className="relative inline-block italic text-[#0f6a52]">
                  <span className="relative z-10">won&rsquo;t</span>
                </span>{" "}
                fight itself.
              </h2>
              <p className="mb-8 max-w-[480px] text-[16px] leading-[1.65] text-[#103b2c]/65">
                Drop in compounds and watch the readout update in real time. Pathway overlaps,
                receptor competition, and dosing windows are flagged before you finalize.
              </p>
              <Link
                href="/stack-builder"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[6px] transition-colors hover:text-[#0f6a52]"
              >
                Open the stack builder
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-[20px] bg-[#0f6a52]/5"
              />
              <div className="relative overflow-hidden rounded-[16px] border border-[#103b2c]/10 bg-white shadow-[0_24px_60px_-24px_rgba(16,59,44,0.18)]">
                <div className="flex items-center justify-between border-b border-[#103b2c]/8 px-5 py-3.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                    <FlaskConical className="h-3.5 w-3.5" strokeWidth={2} />
                    Live readout
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f6a52]/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#0f6a52]">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#0f6a52]"
                      style={{ boxShadow: "0 0 6px #0f6a52" }}
                    />
                    Compatible
                  </span>
                </div>

                <ul className="divide-y divide-[#103b2c]/8">
                  {[
                    { name: "BPC-157", role: "Tissue repair", dose: "250 mcg · 2x/day", status: "ok" },
                    { name: "TB-500", role: "Recovery", dose: "2 mg · weekly", status: "ok" },
                    { name: "Tirzepatide", role: "Metabolic", dose: "5 mg · weekly", status: "warn" },
                  ].map((row) => (
                    <li key={row.name} className="flex items-center gap-4 px-5 py-4">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold ${
                          row.status === "ok"
                            ? "bg-[#0f6a52]/10 text-[#0f6a52]"
                            : "bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        {row.status === "ok" ? (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        ) : (
                          <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2.5} />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-[#103b2c]">{row.name}</p>
                        <p className="font-mono text-[11px] text-[#103b2c]/55">{row.role}</p>
                      </div>
                      <span className="hidden font-mono text-[11px] text-[#103b2c]/50 sm:inline">
                        {row.dose}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-[#103b2c]/8 bg-[#fbfaf7]/60 px-5 py-3.5">
                  <p className="flex items-start gap-2 text-[12px] leading-relaxed text-[#103b2c]/70">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={2.5} />
                    <span>
                      <strong className="font-semibold text-[#103b2c]">Heads up:</strong> Tirzepatide
                      titration overlaps with your fasted training window — consider AM dosing.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          GUIDES
          Magazine table-of-contents pattern. Index
          numbers, category eyebrows, varied row scale.
          ──────────────────────────────────────────── */}
      <section className="border-y border-[#103b2c]/8 bg-[#f4f1ea] py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[640px]">
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
                <span className="h-px w-6 bg-[#103b2c]/40" />
                Library
              </p>
              <h2 className="font-extrabold leading-[1.02] tracking-[-0.03em] text-black text-[40px] sm:text-[48px] md:text-[56px]">
                Learn before you{" "}
                <span className="relative inline-block italic text-[#0f6a52]">
                  <span className="relative z-10">stack</span>
                </span>
                .
              </h2>
            </div>
            <p className="max-w-[380px] text-[15px] leading-[1.6] text-[#103b2c]/65 md:text-right">
              Plain-English breakdowns of mechanisms, side-effect literacy, and vendor due-diligence
              &mdash; written without affiliate spin.
            </p>
          </div>

          <ol className="border-t border-[#103b2c]/15">
            {[
              {
                num: "01",
                category: "Metabolic",
                title: "Tirzepatide vs. Semaglutide for Fat Loss",
                meta: "12 min read",
                href: "/blog/tirzepatide-vs-semaglutide-fat-loss",
              },
              {
                num: "02",
                category: "Trust & Safety",
                title: "How to read a Certificate of Analysis",
                meta: "8 min read",
                href: "/blog",
              },
              {
                num: "03",
                category: "Recovery",
                title: "BPC-157 + TB-500: the recovery stack, examined",
                meta: "10 min read",
                href: "/blog",
              },
              {
                num: "04",
                category: "Logistics",
                title: "Reconstitution math without the headache",
                meta: "6 min read",
                href: "/blog",
              },
            ].map((post) => (
              <li key={post.num} className="border-b border-[#103b2c]/15">
                <Link
                  href={post.href}
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 transition-colors md:grid-cols-[64px_140px_1fr_auto] md:gap-x-8 md:py-8"
                >
                  <span className="font-mono text-[14px] font-medium text-[#103b2c]/40 md:text-[16px]">
                    {post.num}
                  </span>
                  <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-[#0f6a52] md:inline">
                    {post.category}
                  </span>
                  <h3 className="col-span-2 text-[20px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c] transition-colors group-hover:text-[#0f6a52] md:col-span-1 md:text-[26px]">
                    {post.title}
                  </h3>
                  <div className="col-start-2 col-end-3 flex items-center justify-end gap-3 font-mono text-[11px] text-[#103b2c]/50 md:col-auto">
                    <span>{post.meta}</span>
                    <ArrowRight
                      className="h-4 w-4 text-[#103b2c]/40 transition-all group-hover:translate-x-1 group-hover:text-[#0f6a52]"
                      strokeWidth={2}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[6px] transition-colors hover:text-[#0f6a52]"
            >
              Browse the full library
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          DE-RISKING / OBJECTION HANDLING
          Dark statement section. "We don't / We do"
          pairs. Calm, structural, confident.
          ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0c3226] py-20 text-white md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, #4ade80 0%, transparent 40%), radial-gradient(circle at 90% 80%, #4ade80 0%, transparent 35%)",
          }}
        />
        <div className="relative container mx-auto max-w-5xl px-4">
          <div className="mb-16 grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,460px)] md:gap-12">
            <div className="max-w-[640px]">
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                <span className="h-px w-6 bg-white/40" />
                How we work
              </p>
              <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-[40px] sm:text-[48px] md:text-[56px]">
                The incentives,{" "}
                <span className="relative inline-block italic text-[#4ade80]">
                  <span className="relative z-10">on the table</span>
                </span>
                .
              </h2>
              <p className="mt-6 max-w-[560px] text-[16px] leading-[1.65] text-white/65">
                Most peptide sites are vendors with a blog attached. We&rsquo;re the opposite. Here&rsquo;s
                what that actually means.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[460px] md:mx-0">
              <Image
                src={incentivesImage}
                alt="Our incentives, illustrated"
                sizes="(min-width: 768px) 460px, 90vw"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {[
              {
                no: "We don’t sell peptides.",
                yes: "We rank vendors who already sell them, by purity testing and policy.",
              },
              {
                no: "Vendors can’t pay to rank higher.",
                yes: "Order is determined by COA quality, refund policy, and shipping reliability.",
              },
              {
                no: "We don’t hide regulatory flags.",
                yes: "RUO labels, anti-doping status, and import flags surface on every compound.",
              },
              {
                no: "We don’t gate the quiz or guides.",
                yes: "Re-run the quiz, browse the library, and compare vendors as much as you want.",
              },
            ].map((row, i) => (
              <div key={i} className="bg-[#0c3226] p-7 md:p-8">
                <div className="mb-4 flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <X className="h-3 w-3 text-white/70" strokeWidth={3} />
                  </span>
                  <p className="text-[17px] font-semibold leading-[1.35] text-white/90 line-through decoration-white/30 decoration-1">
                    {row.no}
                  </p>
                </div>
                <div className="flex items-start gap-3 pl-8">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4ade80]" strokeWidth={2.5} />
                  <p className="text-[14px] leading-[1.55] text-white/65">{row.yes}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/quiz"
              className="group inline-flex items-center gap-2 text-[15px] font-semibold text-white underline decoration-[#4ade80] decoration-2 underline-offset-[6px] transition-colors hover:text-[#4ade80]"
            >
              Take the quiz
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="border-y border-[#103b2c]/8 bg-[#f4f1ea] py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#0f6a52]">
            What you unlock
          </p>
          <div className="grid gap-px bg-[#103b2c]/10 md:grid-cols-3">
            {[
              {
                title: "Free stack preview",
                body: "See the first compound, risk lane, compatibility score, and why the stack fits your quiz.",
              },
              {
                title: "Vendor comparison",
                body: "Jump to mapped vendor options with COA posture, region fit, and product-specific affiliate routes.",
              },
              {
                title: "Full protocol PDF",
                body: "Unlock the full compound map, timing logic, monitoring checklist, and red-flag rules.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#f4f1ea] p-6">
                <h3 className="text-xl font-bold tracking-[-0.01em] text-[#103b2c]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#103b2c]/68">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Your personalized plan is 2 minutes away.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Get matched with evidence-graded compounds, safety flags, and vendor options &mdash; completely free.
          </p>
          <Button size="lg" className="h-12 px-10 text-base" render={<Link href="/quiz" />}>
            Find My Peptide Stack <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-3 text-[13px] font-medium text-[#103b2c]/58">
            Free forever. Quiz output is yours to keep.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          FAQ
          Native <details>. Plus/minus toggle, generous
          rule-divided rows, no card chrome.
          ──────────────────────────────────────────── */}
      <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-12 md:mb-16">
            <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              FAQ
            </p>
            <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-black text-[36px] sm:text-[44px] md:text-[52px]">
              Honest answers,{" "}
              <span className="relative inline-block italic text-[#0f6a52]">
                <span className="relative z-10">first</span>
              </span>
              .
            </h2>
          </div>

          <div className="border-t border-[#103b2c]/15">
            {[
              {
                q: "Do you sell peptides?",
                a: "No. We don't ship, fulfill, or hold inventory. We help you compare what's already out there — vendors who do sell — by surfacing purity testing, refund policies, and regulatory flags side by side.",
              },
              {
                q: "How do you make money?",
                a: "Affiliate commissions when you click through to a vendor and buy. Vendors don't pay us to rank higher — order is set by COA quality, refund policy, and shipping reliability. The same logic NerdWallet applies to credit cards.",
              },
              {
                q: "Is this medical advice?",
                a: "No. Everything on the site is educational and research-reference only. Not for diagnosing, treating, curing, or preventing disease. Consult a qualified healthcare professional before starting anything.",
              },
              {
                q: "Is everything really free?",
                a: "Yes. The quiz, stack builder, compound pages, and the full guide library are free to use. The site is funded by affiliate commissions when you click through to a vendor and decide to buy — not by anything you pay us directly.",
              },
              {
                q: "What does RUO mean?",
                a: "Research Use Only. It's the regulatory category most peptide vendors operate under — the products are sold for laboratory research, not human consumption. We surface RUO status on every compound page so you know what you're looking at.",
              },
              {
                q: "Can I trust the vendor recommendations?",
                a: "Trust them as one input, not the final word. We weight third-party testing (Janoshik, independent COAs), refund policy, and customer-reported shipping reliability. We don't have inside knowledge of any vendor's supply chain — verify the COA on whatever you receive.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group border-b border-[#103b2c]/15 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] font-semibold leading-[1.35] tracking-[-0.005em] text-[#103b2c] transition-colors hover:text-[#0f6a52] md:py-7 md:text-[19px]">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#103b2c]/20 transition-colors group-hover:border-[#0f6a52] group-open:bg-[#0f6a52] group-open:border-[#0f6a52]"
                  >
                    <Plus
                      className="h-3.5 w-3.5 text-[#103b2c] transition-opacity group-open:opacity-0 group-hover:text-[#0f6a52]"
                      strokeWidth={2.5}
                    />
                    <Minus
                      className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity group-open:opacity-100"
                      strokeWidth={2.5}
                    />
                  </span>
                </summary>
                <div className="pb-6 pr-12 text-[15px] leading-[1.65] text-[#103b2c]/70 md:pb-7">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7]">
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

      <MobileStickyQuizCta />
    </div>
  );
}
