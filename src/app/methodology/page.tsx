import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PeptidePros Methodology",
  description:
    "How PeptidePros reviews peptide evidence, vendor trust signals, COA quality, affiliate links, calculator assumptions, and RUO compliance.",
  alternates: { canonical: "/methodology" },
};

const sections = [
  {
    id: "evidence",
    title: "Evidence tiers",
    points: [
      "Compound pages weigh approved-drug status, human data, preclinical depth, regulatory posture, and uncertainty.",
      "Low-evidence compounds are not presented as proven therapies, even when vendor demand is high.",
      "FDA, WADA, and primary literature sources are prioritized over anecdotal marketplace claims.",
    ],
  },
  {
    id: "vendor-scoring",
    title: "Vendor scoring",
    points: [
      "Vendor rankings emphasize documentation strength, COA visibility, product-page specificity, reputation signals, shipping clarity, and support visibility.",
      "Affiliate status can be disclosed near CTAs but does not override documentation, regulatory, or product-match quality.",
      "Exact product-page links are treated as stronger than broad vendor homepage routing.",
    ],
  },
  {
    id: "coa-checks",
    title: "COA and quality checks",
    points: [
      "Useful COAs should make identity, purity, lot, method, date, and lab context easy to verify.",
      "PeptidePros flags whether COA access is public, portal-based, request-based, label-based, or unknown.",
      "COA presence is not treated as proof of suitability, safety, legality, or medical appropriateness.",
    ],
  },
  {
    id: "tools",
    title: "Calculator assumptions",
    points: [
      "Tools perform arithmetic and comparison support; they are not dosing instructions.",
      "Users must verify vial labels, concentration, volume, sterility, and clinician guidance independently.",
      "Calculator pages route users back to peptide profiles, vendors, and the quiz so math is not divorced from risk context.",
    ],
  },
  {
    id: "affiliate-policy",
    title: "Affiliate policy",
    points: [
      "PeptidePros may earn commissions from some outbound vendor links.",
      "Affiliate links are routed through blocked `/out/*` paths so they do not become indexable SEO pages.",
      "Commercial pages should explain why a vendor appears before sending users off site.",
    ],
  },
  {
    id: "compliance",
    title: "RUO and medical boundaries",
    points: [
      "PeptidePros does not sell peptides, prescribe peptides, or provide medical advice.",
      "Research-use-only and non-approved compounds require conservative language and clear warnings.",
      "Competitive athletes should treat WADA risk as a primary filter, not a footnote.",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7] text-[#103b2c]">
        <section className="border-b border-[#103b2c]/10 py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              Methodology
            </p>
            <h1 className="max-w-[820px] text-[42px] font-extrabold leading-[1.02] tracking-[-0.03em] text-black md:text-[64px]">
              How PeptidePros evaluates evidence, vendors, and protocol paths.
            </h1>
            <p className="mt-6 max-w-[680px] text-[17px] leading-[1.65] text-[#103b2c]/70">
              The site is built for research decision support, not peptide sales. Every content
              template should make uncertainty, commercial incentives, and safety boundaries visible
              before a user starts the quiz, opens a vendor link, or buys a protocol PDF.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="rounded-xl border border-[#103b2c]/12 bg-white p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0f6a52]/10 text-[#0f6a52]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold tracking-[-0.01em]">{section.title}</h2>
                    <ul className="mt-4 space-y-3">
                      {section.points.map((point) => (
                        <li key={point} className="flex gap-2 text-sm leading-relaxed text-[#103b2c]/72">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f6a52]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[#103b2c]/10 bg-[#f4f1ea] py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 rounded-lg bg-[#103b2c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0c3226]"
            >
              Take the quiz with this context
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
