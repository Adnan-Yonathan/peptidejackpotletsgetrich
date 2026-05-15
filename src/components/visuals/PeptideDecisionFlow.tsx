import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface PeptideDecisionFlowProps {
  pageType: "blog" | "guide" | "peptide";
  title?: string;
  body?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  relatedLabel?: string;
}

const PAGE_COPY: Record<PeptideDecisionFlowProps["pageType"], string[]> = {
  blog: ["Read the context", "Compare compounds", "Take the quiz", "Choose next step"],
  guide: ["Learn the framework", "Check risk", "Take the quiz", "Compare vendors"],
  peptide: ["Read evidence", "Check risk", "Compare options", "Build plan"],
};

export function PeptideDecisionFlow({
  pageType,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  relatedLabel,
}: PeptideDecisionFlowProps) {
  const steps = PAGE_COPY[pageType];

  return (
    <section className="rounded-xl border border-[#103b2c]/12 bg-white p-5 text-[#103b2c]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
            Decision path
          </p>
          <h2 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[-0.02em]">
            {title ?? "Turn research into the next right action."}
          </h2>
          <p className="mt-2 max-w-[620px] text-[13.5px] leading-6 text-[#103b2c]/70">
            {body ??
              "Use the page for context, then validate fit before moving into a compound, vendor, or protocol decision."}
          </p>
        </div>
        {relatedLabel && (
          <span className="inline-flex w-fit rounded-full border border-[#103b2c]/12 bg-[#fbfaf7] px-3 py-1 text-[11px] font-semibold text-[#103b2c]/70">
            {relatedLabel}
          </span>
        )}
      </div>
      <ol className="mt-5 grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step} className="relative rounded-lg border border-[#103b2c]/10 bg-[#fbfaf7] p-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f6a52]">
              0{index + 1}
            </p>
            <p className="mt-1 text-[13px] font-bold text-[#103b2c]">{step}</p>
            {index < steps.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="absolute right-2 top-3 hidden h-3.5 w-3.5 text-[#103b2c]/35 md:block"
              />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={primaryHref}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#103b2c] px-4 text-[13px] font-semibold text-white hover:bg-[#0c3226]"
        >
          {primaryLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#103b2c]/18 bg-white px-4 text-[13px] font-semibold text-[#103b2c] hover:border-[#0f6a52]"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
