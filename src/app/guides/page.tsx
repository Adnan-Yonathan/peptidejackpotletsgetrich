import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Beaker, FlaskConical, Scale, Shield, Syringe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getGuideBySlug, type GuideData } from "@/data/guides";
import guidesHeroImage from "../../../images/guidesimage.png";
import howToReadCoaImage from "../../../images/how to read a COA.png";
import howToReconstitutePeptidesImage from "../../../images/how to reconstitute peptides.png";
import howToStorePeptidesImage from "../../../images/how to store peptides.png";
import peptideSafetyBasicsImage from "../../../images/peptide safety basics.png";
import ruoVsHumanUseImage from "../../../images/RUO vs human use.png";
import whatArePeptidesImage from "../../../images/what are peptides.png";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Foundational peptide guides on safety, reconstitution, storage, COAs, vendor comparison, and regulatory basics.",
};

const CATEGORY_LABELS: Record<string, { label: string; icon: LucideIcon }> = {
  basics: { label: "Basics", icon: Beaker },
  "safety-quality": { label: "Safety", icon: Shield },
  "dosing-reconstitution": { label: "Dosing", icon: Syringe },
  "storage-handling": { label: "Storage", icon: FlaskConical },
  "legal-regulatory": { label: "Legal", icon: Scale },
};

const FEATURED_GUIDE_SPECS = [
  "what-are-peptides",
  "peptide-safety-basics",
  "how-to-reconstitute-peptides",
  "ruo-vs-human-use",
  "how-to-read-a-coa",
  "how-to-store-peptides",
] as const;

const FEATURED_GUIDE_IMAGES: Record<(typeof FEATURED_GUIDE_SPECS)[number], StaticImageData> = {
  "what-are-peptides": whatArePeptidesImage,
  "peptide-safety-basics": peptideSafetyBasicsImage,
  "how-to-reconstitute-peptides": howToReconstitutePeptidesImage,
  "ruo-vs-human-use": ruoVsHumanUseImage,
  "how-to-read-a-coa": howToReadCoaImage,
  "how-to-store-peptides": howToStorePeptidesImage,
};

function getCategoryMeta(guide: GuideData) {
  return CATEGORY_LABELS[guide.categoryId] ?? CATEGORY_LABELS.basics;
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

  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7]">
        {/* HERO */}
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-6 pb-5 md:pt-8 md:pb-6">
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] md:gap-8">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
                  <span className="h-px w-6 bg-[#103b2c]/40" />
                  Library
                </p>
                <h1 className="max-w-[620px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[22px] sm:text-[28px] md:text-[32px]">
                  Understand the{" "}
                  <span className="relative inline-block italic text-[#0f6a52]">
                    <span className="relative z-10">science</span>
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
                  behind peptides.
                </h1>
                <p className="mt-4 max-w-[480px] text-[16px] leading-[1.6] text-[#103b2c]/65">
                  Mechanism breakdowns, side-effect literacy, reconstitution math, and vendor due-diligence
                  &mdash; written without affiliate spin or hype.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[340px] md:mx-0">
                <Image
                  src={guidesHeroImage}
                  alt="Peptide guides illustration"
                  priority
                  sizes="(min-width: 768px) 340px, 70vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-px bg-[#103b2c]/10 md:grid-cols-2 lg:grid-cols-3">
              {featuredGuides.map((guide) => {
                const meta = getCategoryMeta(guide);
                const readTime = getReadTime(guide);
                const guideImage = FEATURED_GUIDE_IMAGES[guide.slug as keyof typeof FEATURED_GUIDE_IMAGES];

                return (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.slug}`}
                    className="group flex flex-col bg-[#fbfaf7] p-6 transition-colors hover:bg-white md:p-7"
                  >
                    <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[12px] border border-[#103b2c]/8 bg-[#f4f1ea]">
                      {guideImage ? (
                        <Image
                          src={guideImage}
                          alt={guide.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <meta.icon className="h-10 w-10 text-[#103b2c]/30" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
                      {meta.label} &middot; {readTime} min
                    </p>
                    <h3 className="mt-2.5 text-[20px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                      {guide.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-[#103b2c]/65">
                      {guide.summary}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors group-hover:text-[#0f6a52]">
                      Read guide
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* DARK CTA BAND */}
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
              Skip the rabbit hole
            </p>
            <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-[36px] sm:text-[44px] md:text-[52px]">
              Get a plan{" "}
              <span className="relative inline-block italic text-[#4ade80]">
                <span className="relative z-10">tailored</span>
              </span>{" "}
              to your research.
            </h2>
            <p className="mx-auto mt-6 max-w-[480px] text-[15px] leading-[1.65] text-white/65">
              Answer a few questions and we&rsquo;ll match compounds, safety flags, and vendor options to your
              goals, experience, and risk tolerance.
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
                Or browse all peptides
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
