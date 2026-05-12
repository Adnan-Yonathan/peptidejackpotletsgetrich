import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuizFooterCta } from "@/components/marketing/QuizFooterCta";
import { BreadcrumbList } from "@/components/seo/JsonLd";
import { TOOL_CATEGORIES, TOOLS, getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Peptide Tools — Calculators, Stack Builder, Comparisons",
  description:
    "Free peptide research tools: stack compatibility, side-by-side comparisons, dose conversion, reconstitution math, cost estimation, and more.",
  alternates: { canonical: "/tools" },
};

const liveCount = TOOLS.filter((t) => t.status === "live").length;
const totalCount = TOOLS.length;

export default function ToolsHubPage() {
  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
        ]}
      />
      <Header />
      <main className="bg-[#fbfaf7]">
        {/* HERO */}
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-8 pb-6 md:pt-10 md:pb-8">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              Tools
            </p>
            <div>
                <h1 className="max-w-[820px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[26px] sm:text-[34px] md:text-[40px]">
                  Free peptide{" "}
                  <span className="relative inline-block italic text-[#0f6a52]">
                    <span className="relative z-10">research</span>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-1 left-0 h-[8px] w-full"
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
                  tools.
                </h1>
                <p className="mt-4 max-w-[560px] text-[16px] leading-[1.6] text-[#103b2c]/65">
                  Calculators, comparisons, and compatibility checks built on tracked vendor data and
                  evidence-graded compound profiles.
                </p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                  {liveCount} live &middot; {totalCount - liveCount} in development &middot; {totalCount} total
                </p>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 space-y-12 md:space-y-14">
            {TOOL_CATEGORIES.map((cat) => {
              const tools = getToolsByCategory(cat.id);
              if (tools.length === 0) return null;
              return (
                <div key={cat.id}>
                  <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
                    {cat.label}
                  </p>
                  <div className="grid gap-px bg-[#103b2c]/10 md:grid-cols-2 lg:grid-cols-3">
                    {tools.map((t) => {
                      const Icon = t.icon;
                      const isLive = t.status === "live";
                      return (
                        <Link
                          key={t.id}
                          href={t.href}
                          className="group flex flex-col bg-[#fbfaf7] p-6 transition-colors hover:bg-white md:p-7"
                        >
                          <div className="mb-5 flex items-center justify-between">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f6a52]/10 text-[#0f6a52]">
                              <Icon className="h-5 w-5" strokeWidth={2} />
                            </span>
                            {isLive ? (
                              <span className="rounded-full bg-[#0f6a52]/10 px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#0f6a52]">
                                Live
                              </span>
                            ) : (
                              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-amber-700">
                                Coming soon
                              </span>
                            )}
                          </div>
                          <h2 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                            {t.name}
                          </h2>
                          <p className="mt-2 flex-1 text-[13.5px] leading-[1.55] text-[#103b2c]/65">
                            {t.description}
                          </p>
                          <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors group-hover:text-[#0f6a52]">
                            {isLive ? "Open tool" : "Preview"}
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                              strokeWidth={2.5}
                            />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <QuizFooterCta
          eyebrow="Personalized tool routing"
          title="Find the next tool for your protocol."
          body="Take the quiz before choosing a calculator, vendor, or PDF. We match your goal, experience, budget, and monitoring comfort to the next best step in the funnel."
        />
      </main>
      <Footer />
    </>
  );
}
