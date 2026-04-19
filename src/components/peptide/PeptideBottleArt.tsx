"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PeptideCategory, RegulatoryStatus } from "@/data/peptides";

const PEPTIDE_IMAGE_SLUGS = new Set([
  "aod-9604",
  "angiotensin-1-7",
  "bpc-157",
  "cerebrolysin",
  "cjc-1295",
  "dihexa",
  "dsip",
  "elamipretide",
  "epitalon",
  "epithalon-variants",
  "follistatin",
  "foxo4-dri",
  "ghk-cu",
  "ghrp-2",
  "ghrp-6",
  "hexarelin",
  "humanin",
  "igf-1-lr3",
  "ipamorelin",
  "kisspeptin",
  "kpv",
  "larazotide",
  "liraglutide",
  "ll-37",
  "melanotan-1",
  "melanotan-2",
  "mgf",
  "mk-677",
  "mots-c",
  "nsi-189",
  "oxytocin",
  "peg-mgf",
  "pinealon",
  "pt-141",
  "retatrutide",
  "selank",
  "semaglutide",
  "semax",
  "sermorelin",
  "tb-500",
  "tesamorelin",
  "thymosin-alpha-1",
  "thymosin-beta-1",
  "thymosin-beta-4",
  "tirzepatide",
  "vip",
]);

const CATEGORY_STYLES: Record<
  PeptideCategory,
  {
    accent: string;
    accentSoft: string;
    cap: string;
  }
> = {
  tissue_repair: { accent: "#0f766e", accentSoft: "#ccfbf1", cap: "#134e4a" },
  gh_axis: { accent: "#1d4ed8", accentSoft: "#dbeafe", cap: "#1e3a8a" },
  melanocortin: { accent: "#c2410c", accentSoft: "#fed7aa", cap: "#9a3412" },
  neuroprotection: { accent: "#6d28d9", accentSoft: "#ede9fe", cap: "#4c1d95" },
  sleep: { accent: "#4338ca", accentSoft: "#e0e7ff", cap: "#312e81" },
  reproductive: { accent: "#be185d", accentSoft: "#fce7f3", cap: "#9d174d" },
  metabolic: { accent: "#0f766e", accentSoft: "#dcfce7", cap: "#166534" },
  longevity: { accent: "#a16207", accentSoft: "#fef3c7", cap: "#854d0e" },
  immune: { accent: "#b91c1c", accentSoft: "#fee2e2", cap: "#991b1b" },
  skin_cosmetic: { accent: "#c026d3", accentSoft: "#fae8ff", cap: "#86198f" },
  antimicrobial: { accent: "#b45309", accentSoft: "#fde68a", cap: "#92400e" },
  cognitive: { accent: "#7c3aed", accentSoft: "#ede9fe", cap: "#5b21b6" },
  mitochondrial: { accent: "#ea580c", accentSoft: "#ffedd5", cap: "#c2410c" },
  growth_factor: { accent: "#2563eb", accentSoft: "#dbeafe", cap: "#1d4ed8" },
  muscle_repair: { accent: "#15803d", accentSoft: "#dcfce7", cap: "#166534" },
};

const STATUS_LABELS: Record<RegulatoryStatus, string> = {
  rx_approved: "Rx",
  investigational: "Investigational",
  not_approved: "Research",
  ruo_only: "RUO",
};

function splitLabel(name: string) {
  const normalized = name.replace(/\s+/g, " ").trim();
  const compact = normalized.replace(/ - /g, "-");

  if (compact.length <= 14) {
    return [compact];
  }

  const parts = compact.split(/[\s/]+/).filter(Boolean);
  if (parts.length === 1) {
    const midpoint = Math.ceil(compact.length / 2);
    return [compact.slice(0, midpoint), compact.slice(midpoint)];
  }

  const halfway = Math.ceil(parts.length / 2);
  return [parts.slice(0, halfway).join(" "), parts.slice(halfway).join(" ")].slice(0, 2);
}

export function PeptideBottleArt({
  slug,
  name,
  category,
  regulatoryStatus,
  className,
}: {
  slug: string;
  name: string;
  category: PeptideCategory;
  regulatoryStatus: RegulatoryStatus;
  className?: string;
}) {
  if (PEPTIDE_IMAGE_SLUGS.has(slug)) {
    return (
      <div className={cn("relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden", className)}>
        <Image
          src={`/images/peptides/${slug}.png`}
          alt={`${name} bottle art`}
          width={1024}
          height={1024}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const lines = splitLabel(name);
  const { accent, accentSoft, cap } = CATEGORY_STYLES[category];
  const labelFontSize = lines.some((line) => line.length > 12) ? 14 : 16;
  const secondaryFontSize = lines.some((line) => line.length > 16) ? 10 : 11;

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_55%,#e2e8f0_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-6 top-4 h-24 rounded-full blur-2xl"
        style={{ backgroundColor: accentSoft }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 280 240"
        role="img"
        aria-label={`${name} placeholder PeptidePros bottle art`}
        className="relative z-10 h-full w-full"
      >
        <defs>
          <linearGradient id={`card-bg-${name}`} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={accentSoft} />
          </linearGradient>
          <linearGradient id={`glass-${name}`} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5e34" />
            <stop offset="45%" stopColor="#6b4423" />
            <stop offset="100%" stopColor="#3f2a16" />
          </linearGradient>
          <linearGradient id={`label-${name}`} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#fffdf8" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="280" height="240" rx="28" fill={`url(#card-bg-${name})`} />
        <ellipse cx="140" cy="213" rx="64" ry="11" fill="#0f172a" fillOpacity="0.12" />

        <rect x="108" y="30" width="64" height="18" rx="6" fill={cap} />
        <rect x="116" y="22" width="48" height="16" rx="5" fill="#1f2937" />
        <rect x="114" y="46" width="52" height="28" rx="10" fill={`url(#glass-${name})`} />
        <rect x="92" y="56" width="96" height="132" rx="22" fill={`url(#glass-${name})`} />
        <rect x="102" y="66" width="10" height="112" rx="5" fill="#f8fafc" fillOpacity="0.12" />
        <rect x="129" y="72" width="22" height="108" rx="11" fill="#111827" fillOpacity="0.08" />

        <rect x="104" y="88" width="72" height="78" rx="10" fill={`url(#label-${name})`} stroke="#cbd5e1" />
        <rect x="104" y="88" width="72" height="10" rx="10" fill={accent} />
        <text
          x="140"
          y="109"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          letterSpacing="1.8"
          fill="#334155"
        >
          PEPTIDEPROS
        </text>
        {lines.map((line, index) => (
          <text
            key={line}
            x="140"
            y={126 + index * 17}
            textAnchor="middle"
            fontSize={labelFontSize}
            fontWeight="800"
            fill="#0f172a"
          >
            {line}
          </text>
        ))}
        <text
          x="140"
          y="155"
          textAnchor="middle"
          fontSize={secondaryFontSize}
          fontWeight="600"
          letterSpacing="0.8"
          fill="#475569"
        >
          {STATUS_LABELS[regulatoryStatus]}
        </text>
        <rect x="116" y="160" width="48" height="2" rx="1" fill={accent} fillOpacity="0.8" />

        <path
          d="M84 58c10-18 24-28 56-34"
          stroke="#ffffff"
          strokeOpacity="0.22"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
