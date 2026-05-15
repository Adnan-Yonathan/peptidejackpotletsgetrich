import Link from "next/link";

export interface ProtocolTimelineVisualProps {
  contextLabel?: string;
  title?: string;
  relatedPeptides?: Array<{ name: string; slug: string }>;
}

const steps = [
  ["Baseline", "Clarify goal, labs, contraindications, and sport/testing status."],
  ["Choose", "Pick one primary compound path before stacking extras."],
  ["Source", "Check vendor documentation, COA fit, and route constraints."],
  ["Monitor", "Track outcomes, adverse effects, and stop conditions."],
  ["Reassess", "Review whether the protocol still fits after the first cycle."],
];

export function ProtocolTimelineVisual({
  contextLabel = "Protocol visual",
  title = "A safer peptide decision moves in phases.",
  relatedPeptides = [],
}: ProtocolTimelineVisualProps) {
  return (
    <section className="rounded-xl border border-[#103b2c]/12 bg-white p-5 text-[#103b2c]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
            {contextLabel}
          </p>
          <h2 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[-0.02em]">{title}</h2>
        </div>
        {relatedPeptides.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {relatedPeptides.slice(0, 3).map((peptide) => (
              <Link
                key={peptide.slug}
                href={`/peptides/${peptide.slug}`}
                className="rounded-full border border-[#103b2c]/12 bg-[#fbfaf7] px-2.5 py-1 text-[11px] font-semibold text-[#103b2c]/70 hover:border-[#0f6a52]"
              >
                {peptide.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      <ol className="mt-5 grid gap-2 md:grid-cols-5">
        {steps.map(([label, body], index) => (
          <li key={label} className="rounded-lg border border-[#103b2c]/10 bg-[#fbfaf7] p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#103b2c] font-mono text-[10px] font-bold text-white">
                {index + 1}
              </span>
              <h3 className="text-[13px] font-bold">{label}</h3>
            </div>
            <p className="mt-2 text-[12.5px] leading-5 text-[#103b2c]/70">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
