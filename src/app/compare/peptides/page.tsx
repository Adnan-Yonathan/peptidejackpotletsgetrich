import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPeptideBySlug, type PeptideData } from "@/data/peptides";
import {
  buildComparisonSections,
  buildQuickWinners,
  evidencePillClass,
  riskPillClass,
} from "@/lib/compare-peptides-view";
import { canonicalPair, pairKey } from "@/lib/compare-pairs";

export const metadata: Metadata = {
  title: "Compare Peptides Side by Side",
  description:
    "Compare research peptides on evidence tier, risk, dosing, regulatory flags, cost, and vendor coverage. Side-by-side decision support without affiliate spin.",
  alternates: { canonical: "/compare/peptides" },
};

function parseSelectedPeptides(ids: string | string[] | undefined) {
  const rawIds = Array.isArray(ids) ? ids.join(",") : ids ?? "";
  const slugs = rawIds
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  return Array.from(new Set(slugs))
    .map((slug) => getPeptideBySlug(slug))
    .filter(
      (peptide): peptide is PeptideData =>
        Boolean(peptide && peptide.status === "published")
    )
    .slice(0, 4);
}

export default async function ComparePeptidesPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { ids } = await searchParams;
  const peptides = parseSelectedPeptides(ids);
  if (ids && peptides.length === 2) {
    permanentRedirect(`/compare/peptides/${pairKey(canonicalPair(peptides[0].slug, peptides[1].slug))}`);
  }
  const quickWinners = buildQuickWinners(peptides);
  const sections = buildComparisonSections(peptides);
  const hasComparison = peptides.length >= 2;

  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7]">
        {/* HERO */}
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-6 pb-5 md:pt-8 md:pb-6">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              Compare
            </p>
            <h1 className="max-w-[820px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[22px] sm:text-[28px] md:text-[32px]">
              The details that{" "}
              <span className="relative inline-block italic text-[#0f6a52]">
                <span className="relative z-10">actually</span>
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
              shape the buying decision.
            </h1>
            <p className="mt-4 max-w-[560px] text-[16px] leading-[1.6] text-[#103b2c]/65">
              Evidence, risk, regulatory flags, cost, and vendor coverage &mdash; side by side, without
              affiliate spin.
            </p>
          </div>
        </section>

        {!hasComparison ? (
          <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-16 md:py-20">
            <div className="container mx-auto max-w-3xl px-4 text-center">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#0f6a52]">
                Pick at least two
              </p>
              <h2 className="mt-3 font-extrabold leading-[1.05] tracking-[-0.025em] text-black text-[26px] sm:text-[32px] md:text-[36px]">
                Add 2&ndash;4 peptides to compare.
              </h2>
              <p className="mx-auto mt-5 max-w-[480px] text-[15px] leading-[1.6] text-[#103b2c]/65">
                Open the peptide directory, drop the compounds you&rsquo;re weighing into the compare
                tray, and come back here for the side-by-side view.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/peptides"
                  className="inline-flex h-[52px] items-center gap-2.5 whitespace-nowrap rounded-[12px] bg-[#103b2c] px-7 text-[15px] font-extrabold text-white shadow-[0_4px_24px_rgba(16,59,44,0.25)] transition-transform hover:-translate-y-0.5"
                >
                  Open peptide directory
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/quiz"
                  className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[6px] transition-colors hover:text-[#0f6a52]"
                >
                  Or skip and take the quiz
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-12 md:py-14">
              <div className="container mx-auto max-w-6xl px-4">
                <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/55">
                  Headlines
                </p>
                <div className="grid gap-px bg-[#103b2c]/10 sm:grid-cols-2 lg:grid-cols-4">
                  {quickWinners.map((w) => (
                    <Link
                      key={w.eyebrow}
                      href={`/peptides/${w.peptide.slug}`}
                      className="group flex flex-col bg-[#fbfaf7] p-5 transition-colors hover:bg-white md:p-6"
                    >
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
                        {w.eyebrow}
                      </p>
                      <p className="mt-3 text-[20px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                        {w.peptide.name}
                      </p>
                      <p className="mt-1.5 text-[13px] capitalize text-[#103b2c]/60">{w.detail}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors group-hover:text-[#0f6a52]">
                        View profile
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-[#fbfaf7] pb-2">
              <div className="container mx-auto max-w-6xl px-4">
                <div
                  className="grid gap-px bg-[#103b2c]/10 border-y border-[#103b2c]/15"
                  style={{ gridTemplateColumns: `repeat(${peptides.length}, minmax(0, 1fr))` }}
                >
                  {peptides.map((p, i) => (
                    <div key={p.id} className="bg-[#fbfaf7] p-5 md:p-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/45">
                        {String(i + 1).padStart(2, "0")} &middot; Subject
                      </p>
                      <h3 className="mt-2 text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c]">
                        {p.name}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-[13px] leading-[1.55] text-[#103b2c]/65">
                        {p.shortDescription}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${evidencePillClass(p.evidenceTier)}`}>
                          Tier {p.evidenceTier}
                        </span>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${riskPillClass(p.riskLevel)}`}>
                          {p.riskLevel} risk
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/peptides/${p.slug}`}
                          className="text-[12.5px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] hover:text-[#0f6a52]"
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/vendors?peptide=${p.slug}`}
                          className="text-[12.5px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] hover:text-[#0f6a52]"
                        >
                          Vendors
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-[#fbfaf7] py-12 md:py-16">
              <div className="container mx-auto max-w-6xl px-4 space-y-12 md:space-y-16">
                {sections.map((section) => (
                  <div key={section.title}>
                    <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
                      {section.eyebrow} &middot; {section.title}
                    </p>
                    <div className="overflow-x-auto border-t border-[#103b2c]/15">
                      <table className="w-full min-w-[640px]">
                        <thead>
                          <tr className="border-b border-[#103b2c]/15">
                            <th className="w-[200px] py-3 pr-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#103b2c]/45 md:w-[220px]">
                              Decision factor
                            </th>
                            {peptides.map((p) => (
                              <th key={p.id} className="py-3 pr-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#103b2c]/45">
                                {p.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.map((row) => (
                            <tr key={row.label} className="border-b border-[#103b2c]/10 align-top">
                              <td className="py-4 pr-4 text-[13px] font-semibold text-[#103b2c]">
                                {row.label}
                              </td>
                              {row.values.map((value, i) => (
                                <td key={`${row.label}-${peptides[i].id}`} className="py-4 pr-4 text-[13px] leading-[1.55] text-[#103b2c]/72">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="relative overflow-hidden bg-[#0c3226] py-20 text-white md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 10%, #4ade80 0%, transparent 40%), radial-gradient(circle at 90% 80%, #4ade80 0%, transparent 35%)",
            }}
          />
          <div className="relative container mx-auto max-w-4xl px-4 text-center">
            <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
              <span className="h-px w-6 bg-white/40" />
              Still deciding
            </p>
            <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-[36px] sm:text-[44px] md:text-[52px]">
              Get a plan{" "}
              <span className="relative inline-block italic text-[#4ade80]">
                <span className="relative z-10">tailored</span>
              </span>{" "}
              to you.
            </h2>
            <p className="mx-auto mt-6 max-w-[480px] text-[15px] leading-[1.65] text-white/65">
              Side-by-side narrows the field. The quiz factors in your goal, experience, and risk
              tolerance to surface a starting compound and dosing range.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/quiz"
                className="inline-flex h-[52px] items-center gap-2.5 whitespace-nowrap rounded-[12px] bg-white px-7 text-[15px] font-extrabold text-[#103b2c] shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
              >
                Find my plan
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/guides/how-to-compare-peptide-vendors"
                className="group inline-flex items-center gap-2 text-[14px] font-semibold text-white underline decoration-[#4ade80] decoration-2 underline-offset-[6px] transition-colors hover:text-[#4ade80]"
              >
                Read the vendor guide
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
