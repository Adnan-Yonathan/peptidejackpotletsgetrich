import Link from "next/link";
import { ArrowRight, FileText, FlaskConical, ShieldCheck } from "lucide-react";

interface IntentCtaPanelProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
}

export function IntentCtaPanel({
  eyebrow = "Next best step",
  title = "Get a personalized peptide research path.",
  body = "Take the quiz first so compound, vendor, and protocol suggestions match your goal, experience, budget, and monitoring comfort.",
  secondaryHref,
  secondaryLabel,
  tertiaryHref,
  tertiaryLabel,
}: IntentCtaPanelProps) {
  return (
    <section className="rounded-xl border border-[#103b2c]/12 bg-[#f4f1ea] p-5 text-[#103b2c]">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-bold leading-tight tracking-[-0.01em]">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#103b2c]/70">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/quiz"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#103b2c] px-3 text-sm font-semibold text-white hover:bg-[#0c3226]"
        >
          Take the quiz
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#103b2c]/20 bg-white px-3 text-sm font-semibold text-[#103b2c] hover:border-[#0f6a52]"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {secondaryLabel}
          </Link>
        )}
        {tertiaryHref && tertiaryLabel && (
          <Link
            href={tertiaryHref}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#103b2c]/20 bg-white px-3 text-sm font-semibold text-[#103b2c] hover:border-[#0f6a52]"
          >
            {tertiaryHref.startsWith("/pdfs") ? <FileText className="h-3.5 w-3.5" /> : <FlaskConical className="h-3.5 w-3.5" />}
            {tertiaryLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
