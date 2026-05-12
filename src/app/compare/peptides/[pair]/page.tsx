import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbList } from "@/components/seo/JsonLd";
import {
  getPeptideBySlug,
  getPublishedPeptides,
  type PeptideData,
} from "@/data/peptides";
import { getGoalsForPeptide } from "@/data/goals";
import {
  buildComparisonSections,
  buildQuickWinners,
  evidencePillClass,
  riskPillClass,
} from "@/lib/compare-peptides-view";

export const dynamicParams = false;

type PairSlugs = { a: string; b: string };

function canonicalPair(a: string, b: string): PairSlugs {
  return a < b ? { a, b } : { a: b, b: a };
}

function pairKey(p: PairSlugs) {
  return `${p.a}-vs-${p.b}`;
}

function parsePairParam(param: string): PairSlugs | null {
  const idx = param.indexOf("-vs-");
  if (idx <= 0) return null;
  const a = param.slice(0, idx);
  const b = param.slice(idx + 4);
  if (!a || !b || a === b) return null;
  return { a, b };
}

function getCuratedPairs(): PairSlugs[] {
  const peptides = getPublishedPeptides();
  const seen = new Set<string>();
  const pairs: PairSlugs[] = [];

  for (let i = 0; i < peptides.length; i++) {
    const p1 = peptides[i];
    const p1Goals = new Set(getGoalsForPeptide(p1.id).map((g) => g.id));
    for (let j = i + 1; j < peptides.length; j++) {
      const p2 = peptides[j];
      const sameCategory = p1.category === p2.category;
      const sharesGoal = getGoalsForPeptide(p2.id).some((g) => p1Goals.has(g.id));
      if (!sameCategory && !sharesGoal) continue;

      const pair = canonicalPair(p1.slug, p2.slug);
      const key = pairKey(pair);
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push(pair);
    }
  }

  return pairs;
}

export async function generateStaticParams() {
  return getCuratedPairs().map((p) => ({ pair: pairKey(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const slugs = parsePairParam(pair);
  if (!slugs) return { title: "Compare Peptides" };

  const a = getPeptideBySlug(slugs.a);
  const b = getPeptideBySlug(slugs.b);
  if (!a || !b) return { title: "Compare Peptides" };

  const title = `${a.name} vs ${b.name}: Side-by-Side Comparison`;
  const description = `Compare ${a.name} and ${b.name} on evidence, risk, dosing, regulatory status, cost, and vendor coverage. ${a.shortDescription.split(".")[0]}. ${b.shortDescription.split(".")[0]}.`.slice(0, 320);

  return {
    title,
    description,
    alternates: { canonical: `/compare/peptides/${pairKey(canonicalPair(slugs.a, slugs.b))}` },
  };
}

export default async function PeptidePairComparisonPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const slugs = parsePairParam(pair);
  if (!slugs) notFound();

  const a = getPeptideBySlug(slugs.a);
  const b = getPeptideBySlug(slugs.b);
  if (!a || !b || a.status !== "published" || b.status !== "published") notFound();

  const peptides: PeptideData[] = [a, b];
  const sections = buildComparisonSections(peptides);
  const quickWinners = buildQuickWinners(peptides);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare/peptides" },
    { name: `${a.name} vs ${b.name}`, href: `/compare/peptides/${pairKey(canonicalPair(a.slug, b.slug))}` },
  ];

  return (
    <>
      <BreadcrumbList items={breadcrumbs} />
      <Header />
      <main className="bg-[#fbfaf7]">
        {/* HERO */}
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-6 pb-5 md:pt-8 md:pb-6">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              Compare &middot; Head-to-head
            </p>
            <h1 className="max-w-[820px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[24px] sm:text-[32px] md:text-[40px]">
              {a.name}{" "}
              <span className="relative inline-block italic text-[#0f6a52]">
                <span className="relative z-10">vs</span>
              </span>{" "}
              {b.name}.
            </h1>
            <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-[#103b2c]/65">
              Evidence, risk, regulatory flags, cost, and vendor coverage compared side by side.
              We don&rsquo;t sell peptides &mdash; we help you choose between them.
            </p>
          </div>
        </section>

        {/* HEADLINES */}
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

        {/* SUBJECTS */}
        <section className="bg-[#fbfaf7] pb-2">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-px bg-[#103b2c]/10 border-y border-[#103b2c]/15 grid-cols-2">
              {peptides.map((p, i) => (
                <div key={p.id} className="bg-[#fbfaf7] p-5 md:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/45">
                    {String(i + 1).padStart(2, "0")} &middot; Subject
                  </p>
                  <h2 className="mt-2 text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c] md:text-[28px]">
                    {p.name}
                  </h2>
                  <p className="mt-2 text-[13.5px] leading-[1.55] text-[#103b2c]/65">
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

        {/* TABLES */}
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

        {/* DARK CTA */}
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
              The quiz factors in your goal, experience, and risk tolerance to surface a starting
              compound and dosing range.
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
                href="/peptides"
                className="group inline-flex items-center gap-2 text-[14px] font-semibold text-white underline decoration-[#4ade80] decoration-2 underline-offset-[6px] transition-colors hover:text-[#4ade80]"
              >
                Browse all peptides
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
