import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntentCtaPanel } from "@/components/marketing/IntentCtaPanel";
import { QuizFooterCta } from "@/components/marketing/QuizFooterCta";
import { EditorialTrustBlock } from "@/components/seo/EditorialTrustBlock";
import { SourceList } from "@/components/seo/SourceList";
import type { EditorialReview } from "@/lib/editorial";
import { TOOL_CATEGORIES, type ToolEntry } from "@/lib/tools";

interface Props {
  tool: ToolEntry;
  /** Optional override for the H1 (used by per-peptide pages, e.g. "BPC-157 Reconstitution"). */
  heading?: ReactNode;
  /** Optional override for the supporting paragraph. */
  description?: ReactNode;
  /** Optional eyebrow override (replaces the default "Tools · {category}" line). */
  eyebrow?: ReactNode;
  editorialReview?: EditorialReview;
  secondaryHref?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
  children: ReactNode;
}

export function ToolPageShell({
  tool,
  heading,
  description,
  eyebrow,
  editorialReview,
  secondaryHref,
  secondaryLabel,
  tertiaryHref,
  tertiaryLabel,
  children,
}: Props) {
  const cat = TOOL_CATEGORIES.find((c) => c.id === tool.category);

  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7]">
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-8 pb-6 md:pt-10 md:pb-8">
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              {eyebrow ?? <>Tools &middot; {cat?.label}</>}
            </p>
            <div>
                <h1 className="max-w-[820px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[26px] sm:text-[34px] md:text-[40px]">
                  {heading ?? tool.name}
                </h1>
                <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-[#103b2c]/65">
                  {description ?? tool.description}
                </p>
            </div>
          </div>
        </section>

        {editorialReview && (
          <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-5">
            <div className="container mx-auto max-w-6xl px-4">
              <EditorialTrustBlock review={editorialReview} />
            </div>
          </section>
        )}

        <section className="border-t border-[#103b2c]/8 bg-[#fbfaf7] py-10 md:py-14">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <div>{children}</div>
              <aside className="space-y-4 lg:sticky lg:top-20">
                <IntentCtaPanel
                  eyebrow="Tool next step"
                  title="Use the math, then validate the path."
                  body="Take the quiz before moving from calculator output to compound, vendor, or protocol decisions."
                  secondaryHref={secondaryHref}
                  secondaryLabel={secondaryLabel}
                  tertiaryHref={tertiaryHref}
                  tertiaryLabel={tertiaryLabel}
                />
              </aside>
            </div>
            {editorialReview && (
              <div className="mt-8">
                <SourceList sources={editorialReview.sources} />
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-[#103b2c]/8 bg-[#f4f1ea] py-10 md:py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Link
              href="/tools"
              className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors hover:text-[#0f6a52]"
            >
              Back to all tools
              <ArrowRight
                className="h-3 w-3 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </section>
        <QuizFooterCta
          eyebrow="Personalized tool routing"
          title="Find the next step for your protocol."
          body="Take the quiz before choosing a calculator, vendor, or PDF. We match your goal, experience, budget, and monitoring comfort to the next best step in the funnel."
        />
      </main>
      <Footer />
    </>
  );
}
