import type { PeptideData } from "@/data/peptides";

export interface EvidenceRiskMatrixProps {
  peptide: PeptideData;
  compact?: boolean;
  title?: string;
}

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/-/g, " ");
}

function evidenceTone(tier: PeptideData["evidenceTier"]) {
  if (tier === "A" || tier === "B") return "border-[#0f6a52]/25 bg-[#0f6a52]/8 text-[#0f6a52]";
  if (tier === "B-C" || tier === "C") return "border-amber-500/25 bg-amber-500/8 text-amber-800";
  return "border-red-500/20 bg-red-500/6 text-red-800";
}

function riskTone(risk: PeptideData["riskLevel"]) {
  if (risk === "low" || risk === "medium") return "border-[#0f6a52]/25 bg-[#0f6a52]/8 text-[#0f6a52]";
  if (risk === "med-high") return "border-amber-500/25 bg-amber-500/8 text-amber-800";
  return "border-red-500/20 bg-red-500/6 text-red-800";
}

function flagTone(value: string) {
  if (value === "none" || value === "rx_approved") {
    return "border-[#0f6a52]/25 bg-[#0f6a52]/8 text-[#0f6a52]";
  }
  if (value === "unknown" || value === "investigational" || value === "ruo_only") {
    return "border-amber-500/25 bg-amber-500/8 text-amber-800";
  }
  return "border-red-500/20 bg-red-500/6 text-red-800";
}

function MatrixCell({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className={`rounded-lg border p-3 ${className}`}>
      <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] opacity-70">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-bold capitalize leading-snug">{value}</p>
    </div>
  );
}

export function EvidenceRiskMatrix({ peptide, compact = false, title }: EvidenceRiskMatrixProps) {
  const primaryRoute = peptide.administrationRoutes[0] ?? "route varies";
  const interpretation =
    peptide.evidenceTier === "A" || peptide.evidenceTier === "B"
      ? "Higher-confidence evidence profile, but regulatory and sourcing checks still matter."
      : peptide.evidenceTier === "D"
        ? "Weak evidence profile. Treat claims conservatively and compare better-supported alternatives first."
        : "Mixed evidence profile. Useful for comparison, not a standalone protocol decision.";

  const cells = [
    { label: "Evidence", value: `Tier ${peptide.evidenceTier}`, tone: evidenceTone(peptide.evidenceTier) },
    { label: "Risk", value: formatLabel(peptide.riskLevel), tone: riskTone(peptide.riskLevel) },
    { label: "Regulatory", value: formatLabel(peptide.regulatoryStatus), tone: flagTone(peptide.regulatoryStatus) },
    { label: "WADA", value: formatLabel(peptide.wadaFlag), tone: flagTone(peptide.wadaFlag) },
    { label: "FDA", value: formatLabel(peptide.fdaCompoundingRiskFlag), tone: flagTone(peptide.fdaCompoundingRiskFlag) },
    { label: "Route", value: primaryRoute, tone: "border-[#103b2c]/12 bg-white text-[#103b2c]" },
  ];

  return (
    <section className="rounded-xl border border-[#103b2c]/12 bg-[#fbfaf7] p-4 text-[#103b2c]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
            Evidence visual
          </p>
          <h2 className="mt-1 text-[18px] font-extrabold leading-tight tracking-[-0.02em] text-[#103b2c]">
            {title ?? `${peptide.name} evidence and risk matrix`}
          </h2>
        </div>
        {!compact && (
          <p className="text-[12px] font-semibold capitalize text-[#103b2c]/55">
            {formatLabel(peptide.experienceLevel)} researcher fit
          </p>
        )}
      </div>
      <div className={`mt-4 grid gap-2 ${compact ? "grid-cols-2" : "sm:grid-cols-3"}`}>
        {cells.slice(0, compact ? 4 : cells.length).map((cell) => (
          <MatrixCell key={cell.label} label={cell.label} value={cell.value} className={cell.tone} />
        ))}
      </div>
      {!compact && (
        <p className="mt-4 rounded-lg border border-[#103b2c]/10 bg-white px-3 py-2 text-[13px] leading-6 text-[#103b2c]/72">
          {interpretation}
        </p>
      )}
    </section>
  );
}
