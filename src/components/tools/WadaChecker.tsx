"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  getPeptideBySlug,
  getPublishedPeptides,
  type PeptideData,
  type WadaFlag,
} from "@/data/peptides";

interface Props {
  peptide?: PeptideData;
}

const ALL_PEPTIDES = getPublishedPeptides();

interface WadaInfo {
  label: string;
  category: string;
  summary: string;
  permittedInCompetition: boolean | "unknown";
  pillClass: string;
  Icon: typeof ShieldCheck;
}

const WADA_DETAILS: Record<WadaFlag, WadaInfo> = {
  none: {
    label: "Not on the WADA list",
    category: "—",
    summary:
      "This compound is not currently classified on the WADA Prohibited List. It may still trigger a positive screen indirectly; verify with your specific anti-doping authority before use.",
    permittedInCompetition: true,
    pillClass: "bg-[#0f6a52]/10 text-[#0f6a52]",
    Icon: ShieldCheck,
  },
  S0: {
    label: "WADA Class S0 — Non-Approved",
    category: "S0 Non-Approved Substances",
    summary:
      "Class S0 covers substances not approved for human therapeutic use. They are prohibited at all times, in and out of competition. Use will result in an Anti-Doping Rule Violation.",
    permittedInCompetition: false,
    pillClass: "bg-red-500/10 text-red-700",
    Icon: ShieldAlert,
  },
  S2: {
    label: "WADA Class S2 — Peptide Hormones",
    category: "S2 Peptide Hormones, Growth Factors, Related Substances",
    summary:
      "Class S2 covers peptide hormones, growth factors, related substances, and mimetics. Prohibited at all times, in and out of competition.",
    permittedInCompetition: false,
    pillClass: "bg-red-500/10 text-red-700",
    Icon: ShieldAlert,
  },
  unknown: {
    label: "Status unclear",
    category: "Unknown",
    summary:
      "We don&rsquo;t have a confirmed WADA classification on file for this compound. Treat as potentially restricted until you verify with the current WADA Prohibited List directly.",
    permittedInCompetition: "unknown",
    pillClass: "bg-amber-500/10 text-amber-700",
    Icon: ShieldAlert,
  },
};

export function WadaChecker({ peptide }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    peptide?.slug ?? ALL_PEPTIDES[0]?.slug ?? ""
  );
  const selected = peptide ?? getPeptideBySlug(selectedSlug);

  const info = useMemo(() => {
    if (!selected) return null;
    return WADA_DETAILS[selected.wadaFlag];
  }, [selected]);

  const sameClassPeptides = useMemo(() => {
    if (!selected) return [];
    return ALL_PEPTIDES.filter(
      (p) => p.id !== selected.id && p.wadaFlag === selected.wadaFlag && selected.wadaFlag !== "none"
    ).slice(0, 6);
  }, [selected]);

  return (
    <div className="space-y-8">
      {!peptide && (
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
            Select a compound
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="h-11 w-full max-w-md rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3 text-[14px] font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52]"
          >
            {ALL_PEPTIDES.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selected && info && (
        <>
          <div className="rounded-[16px] border border-[#103b2c]/10 bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${info.pillClass}`}
              >
                <info.Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                {info.label}
              </span>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                {info.category}
              </p>
            </div>

            <h2 className="mt-5 text-[24px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#103b2c] md:text-[32px]">
              {selected.name} &mdash;{" "}
              {info.permittedInCompetition === true
                ? "permitted"
                : info.permittedInCompetition === false
                  ? "prohibited"
                  : "verify before use"}
              .
            </h2>

            <p
              className="mt-4 max-w-[680px] text-[15px] leading-[1.65] text-[#103b2c]/72"
              dangerouslySetInnerHTML={{ __html: info.summary }}
            />

            <div className="mt-6 grid gap-px border-t border-b border-[#103b2c]/10 bg-[#103b2c]/10 sm:grid-cols-3">
              <div className="bg-white p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                  Compound
                </p>
                <p className="mt-1.5 text-[14px] font-semibold text-[#103b2c]">{selected.name}</p>
              </div>
              <div className="bg-white p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                  WADA flag
                </p>
                <p className="mt-1.5 text-[14px] font-semibold text-[#103b2c]">
                  {selected.wadaFlag === "none" ? "Not listed" : selected.wadaFlag}
                </p>
              </div>
              <div className="bg-white p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                  Regulatory
                </p>
                <p className="mt-1.5 text-[14px] font-semibold capitalize text-[#103b2c]">
                  {selected.regulatoryStatus.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            <p className="mt-5 text-[11.5px] leading-[1.55] text-[#103b2c]/55">
              The WADA Prohibited List is updated annually. This tool reflects our latest curated
              data &mdash; for binding athlete decisions, verify directly against the current list at
              wada-ama.org.
            </p>
          </div>

          {sameClassPeptides.length > 0 && (
            <div>
              <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
                Other compounds in the same WADA class
              </p>
              <div className="grid gap-px bg-[#103b2c]/10 sm:grid-cols-2 md:grid-cols-3">
                {sameClassPeptides.map((p) => (
                  <Link
                    key={p.id}
                    href={`/tools/wada-checker/${p.slug}`}
                    className="group flex flex-col bg-[#fbfaf7] p-5 transition-colors hover:bg-white"
                  >
                    <p className="text-[15px] font-semibold text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                      {p.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-[1.5] text-[#103b2c]/60">
                      {p.shortDescription}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#103b2c]/55 transition-colors group-hover:text-[#0f6a52]">
                      Check status
                      <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
