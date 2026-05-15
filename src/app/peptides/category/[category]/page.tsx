import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuizFooterCta } from "@/components/marketing/QuizFooterCta";
import { BreadcrumbList } from "@/components/seo/JsonLd";
import {
  PEPTIDE_CATEGORIES,
  getPeptideCategoryBySlug,
} from "@/data/peptide-categories";
import { getPeptidesByCategory } from "@/data/peptides";
import {
  evidencePillClass,
  riskPillClass,
} from "@/lib/compare-peptides-view";
import { buildSeoMetadata } from "@/lib/seo-metadata";

export async function generateStaticParams() {
  return PEPTIDE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = getPeptideCategoryBySlug(category);
  if (!meta) return { title: "Category Not Found" };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/peptides/category/${meta.slug}` },
    ...buildSeoMetadata({
      title: meta.title,
      description: meta.description,
      path: `/peptides/category/${meta.slug}`,
      imageAlt: `${meta.title} peptide category`,
    }),
  };
}

export default async function PeptideCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = getPeptideCategoryBySlug(category);
  if (!meta) notFound();

  const peptides = getPeptidesByCategory(meta.id);

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Peptides", href: "/peptides" },
          { name: meta.shortTitle, href: `/peptides/category/${meta.slug}` },
        ]}
      />
      <Header />
      <main className="bg-[#fbfaf7]">
        {/* HERO */}
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-6 pb-5 md:pt-8 md:pb-6">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              Category &middot; {meta.shortTitle}
            </p>
            <div>
                <h1 className="max-w-[760px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[24px] sm:text-[32px] md:text-[40px]">
                  {meta.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="relative inline-block italic text-[#0f6a52]">
                    <span className="relative z-10">
                      {meta.title.split(" ").slice(-1)[0]}
                    </span>
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
                  </span>
                  .
                </h1>
                <p className="mt-4 max-w-[560px] text-[16px] leading-[1.6] text-[#103b2c]/65">
                  {meta.description}
                </p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                  {peptides.length} compound{peptides.length === 1 ? "" : "s"} tracked
                </p>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            {peptides.length === 0 ? (
              <div className="border-y border-[#103b2c]/15 px-6 py-16 text-center">
                <p className="text-[15px] font-semibold text-[#103b2c]">
                  No published compounds in this category yet.
                </p>
                <p className="mx-auto mt-2 max-w-[380px] text-[13.5px] leading-[1.6] text-[#103b2c]/60">
                  We&rsquo;re still adding entries here. Check the full directory or browse by goal.
                </p>
              </div>
            ) : (
              <div className="grid gap-px bg-[#103b2c]/10 md:grid-cols-2 lg:grid-cols-3">
                {peptides.map((p) => (
                  <Link
                    key={p.id}
                    href={`/peptides/${p.slug}`}
                    className="group flex flex-col bg-[#fbfaf7] p-6 transition-colors hover:bg-white md:p-7"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${evidencePillClass(p.evidenceTier)}`}
                      >
                        Tier {p.evidenceTier}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${riskPillClass(p.riskLevel)}`}
                      >
                        {p.riskLevel} risk
                      </span>
                    </div>
                    <h2 className="mt-4 text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                      {p.name}
                    </h2>
                    {p.synonyms.length > 0 && (
                      <p className="mt-1 font-mono text-[11px] text-[#103b2c]/50">
                        {p.synonyms.slice(0, 2).join(" · ")}
                      </p>
                    )}
                    <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-[#103b2c]/65">
                      {p.shortDescription}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors group-hover:text-[#0f6a52]">
                      View profile
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        strokeWidth={2.5}
                      />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RELATED CATEGORIES */}
        <section className="border-t border-[#103b2c]/8 bg-[#f4f1ea] py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/55">
              All categories
            </p>
            <div className="flex flex-wrap gap-2">
              {PEPTIDE_CATEGORIES.filter((c) => c.id !== meta.id).map((c) => (
                <Link
                  key={c.id}
                  href={`/peptides/category/${c.slug}`}
                  className="inline-flex items-center rounded-full border border-[#103b2c]/15 bg-[#fbfaf7] px-4 py-2 text-[13px] font-semibold text-[#103b2c] transition-colors hover:border-[#0f6a52] hover:text-[#0f6a52]"
                >
                  {c.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <QuizFooterCta
          eyebrow="Personalized peptide routing"
          title={`Find the right path for ${meta.shortTitle}.`}
          body="Take the quiz before choosing a compound, vendor, or PDF. We match your goal, experience, budget, and monitoring comfort to the next best step in the funnel."
        />
      </main>
      <Footer />
    </>
  );
}
