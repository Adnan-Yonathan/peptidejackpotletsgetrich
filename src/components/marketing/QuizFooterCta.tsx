import Link from "next/link";
import { ArrowRight } from "lucide-react";

type QuizFooterCtaProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
};

export function QuizFooterCta({
  eyebrow = "Personalized protocol routing",
  title = "Find the protocol path that fits your goal.",
  body = "Take the quiz before choosing a compound, vendor, or PDF. We match your goal, experience, budget, and monitoring comfort to the next best step in the funnel.",
  ctaLabel = "Take the quiz",
}: QuizFooterCtaProps) {
  return (
    <section className="relative overflow-hidden bg-[#0c3226] py-20 text-white md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #4ade80 0%, transparent 40%), radial-gradient(circle at 90% 80%, #4ade80 0%, transparent 35%)",
        }}
      />
      <div className="relative container mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] md:items-center">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
            <span className="h-px w-6 bg-white/40" />
            {eyebrow}
          </p>
          <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-[36px] sm:text-[44px] md:text-[52px]">
            {title}
          </h2>
          <p className="mt-6 max-w-[620px] text-[15.5px] leading-[1.65] text-white/65">
            {body}
          </p>
        </div>

        <div className="border-y border-white/15 py-6 md:border md:p-6">
          <ul className="space-y-3 text-[14px] leading-[1.55] text-white/75">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
              <span>Goal-matched compound and protocol recommendations.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
              <span>Budget and sourcing filters before you leave the site.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
              <span>PDF unlocks shown after your personalized result.</span>
            </li>
          </ul>
          <Link
            href="/quiz"
            className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-[12px] bg-white px-7 text-[15px] font-extrabold text-[#103b2c] shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
