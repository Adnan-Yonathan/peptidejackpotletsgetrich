"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Microscope, ShieldAlert, XCircle } from "lucide-react";

type Severity = "ok" | "warn" | "fail";

interface Finding {
  severity: Severity;
  title: string;
  detail: string;
}

const SEVERITY_VISUAL: Record<Severity, { Icon: typeof CheckCircle2; pillClass: string; label: string }> = {
  ok: { Icon: CheckCircle2, pillClass: "bg-[#0f6a52]/10 text-[#0f6a52]", label: "OK" },
  warn: { Icon: ShieldAlert, pillClass: "bg-amber-500/10 text-amber-700", label: "Caution" },
  fail: { Icon: XCircle, pillClass: "bg-red-500/10 text-red-700", label: "Red flag" },
};

function lower(text: string) {
  return text.toLowerCase();
}

function analyze(coa: string, expectedName: string): Finding[] {
  const findings: Finding[] = [];
  if (coa.trim().length === 0) return findings;
  const t = lower(coa);

  // 1. Compound name match
  if (expectedName.trim().length > 0) {
    if (t.includes(lower(expectedName.trim()))) {
      findings.push({
        severity: "ok",
        title: "Compound name appears on the COA",
        detail: `Found "${expectedName}" in the document. Confirm exact spelling and any peptide variant naming with the vendor.`,
      });
    } else {
      findings.push({
        severity: "fail",
        title: "Compound name not found",
        detail: `"${expectedName}" was not found in the COA text. This is a major red flag — the COA should clearly identify the compound being tested.`,
      });
    }
  }

  // 2. Purity check
  const purityMatch = coa.match(/(\d{1,3}(?:\.\d+)?)\s*%/g);
  if (purityMatch) {
    const purityValues = purityMatch
      .map((m) => parseFloat(m.replace("%", "")))
      .filter((v) => v > 50 && v <= 100);
    const maxPurity = purityValues.length ? Math.max(...purityValues) : null;
    if (maxPurity !== null) {
      if (maxPurity >= 99) {
        findings.push({
          severity: "ok",
          title: `Purity ≥ 99% (${maxPurity}%)`,
          detail: "Excellent purity. Suggests rigorous synthesis and post-synthesis purification.",
        });
      } else if (maxPurity >= 98) {
        findings.push({
          severity: "ok",
          title: `Purity 98–99% (${maxPurity}%)`,
          detail: "Acceptable purity for research-grade peptides.",
        });
      } else if (maxPurity >= 95) {
        findings.push({
          severity: "warn",
          title: `Purity 95–98% (${maxPurity}%)`,
          detail: "Below typical research-grade threshold. Acceptable for some applications but verify the impurity profile.",
        });
      } else {
        findings.push({
          severity: "fail",
          title: `Purity below 95% (${maxPurity}%)`,
          detail: "Below the 95% threshold most reputable vendors target. Treat as a red flag.",
        });
      }
    }
  } else {
    findings.push({
      severity: "fail",
      title: "No purity percentage found",
      detail: "Every legitimate COA states a purity percentage. Missing purity = missing core test result.",
    });
  }

  // 3. Test methods
  const hasHplc = /\bhplc\b/i.test(coa) || /high[\s-]performance\s+liquid/i.test(coa);
  const hasMs = /\bms\b/i.test(coa) || /mass\s+spec/i.test(coa);

  if (hasHplc) {
    findings.push({
      severity: "ok",
      title: "HPLC test method present",
      detail: "High-Performance Liquid Chromatography is the standard purity assay for peptides.",
    });
  } else {
    findings.push({
      severity: "fail",
      title: "No HPLC method documented",
      detail: "HPLC is a baseline expectation. A COA without HPLC results is incomplete.",
    });
  }

  if (hasMs) {
    findings.push({
      severity: "ok",
      title: "Mass Spectrometry confirms identity",
      detail: "MS validates the molecular weight matches the expected peptide sequence.",
    });
  } else {
    findings.push({
      severity: "warn",
      title: "Mass Spec not documented",
      detail: "Without MS confirmation, the COA doesn't independently verify the peptide identity. HPLC alone proves purity, not identity.",
    });
  }

  // 4. Lot / batch identifier
  const hasLot =
    /\blot\b/i.test(coa) || /\bbatch\b/i.test(coa) || /\bbatch\s*#/i.test(coa) || /\blot\s*#/i.test(coa);
  if (hasLot) {
    findings.push({
      severity: "ok",
      title: "Lot or batch identifier present",
      detail: "A unique lot/batch ID lets you tie the COA to a specific production run and verify with the vendor.",
    });
  } else {
    findings.push({
      severity: "warn",
      title: "No lot/batch identifier visible",
      detail: "Without a lot number, the COA can't be tied to a specific production run.",
    });
  }

  // 5. Date
  const hasDate = /\d{4}|\d{1,2}\/\d{1,2}/.test(coa);
  if (hasDate) {
    findings.push({
      severity: "ok",
      title: "Date appears on the document",
      detail: "Confirm it matches the production or test date for the vial you received.",
    });
  } else {
    findings.push({
      severity: "warn",
      title: "No clear date visible",
      detail: "COAs should include a test or release date. A missing date is a documentation hygiene issue.",
    });
  }

  // 6. Third-party indicators
  const hasJanoshik = /janoshik/i.test(coa);
  const hasIndependent =
    /\bthird[-\s]party\b/i.test(coa) || /\bindependent\s+lab/i.test(coa);

  if (hasJanoshik) {
    findings.push({
      severity: "ok",
      title: "Third-party (Janoshik) testing referenced",
      detail: "Janoshik Analytical is a peptide-community-trusted independent lab. Verify the result on their public lookup if possible.",
    });
  } else if (hasIndependent) {
    findings.push({
      severity: "ok",
      title: "Third-party language present",
      detail: "Confirm the lab is genuinely independent and check for a verification link.",
    });
  } else {
    findings.push({
      severity: "warn",
      title: "No third-party verification visible",
      detail: "Vendor-internal QC is fine, but third-party-tested COAs (Janoshik, etc.) carry more weight.",
    });
  }

  return findings;
}

export function CoaCheck() {
  const [coaText, setCoaText] = useState<string>("");
  const [expectedName, setExpectedName] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const findings = useMemo(() => {
    if (!showResults) return [];
    return analyze(coaText, expectedName);
  }, [coaText, expectedName, showResults]);

  const counts = findings.reduce<Record<Severity, number>>(
    (acc, f) => ({ ...acc, [f.severity]: acc[f.severity] + 1 }),
    { ok: 0, warn: 0, fail: 0 }
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[16px] border border-[#103b2c]/10 bg-white p-5 md:p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
          Paste the COA
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
              Expected compound name (optional)
            </label>
            <input
              type="text"
              value={expectedName}
              onChange={(e) => setExpectedName(e.target.value)}
              placeholder="e.g. BPC-157"
              className="h-11 w-full rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3 text-[14px] font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52]"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
              COA text
            </label>
            <textarea
              value={coaText}
              onChange={(e) => setCoaText(e.target.value)}
              rows={10}
              placeholder="Paste the full text of the Certificate of Analysis here. The tool checks for purity, test methods (HPLC, MS), lot identifiers, dates, and third-party testing."
              className="w-full rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] p-3 font-mono text-[12.5px] leading-[1.5] text-[#103b2c] outline-none focus:border-[#0f6a52]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowResults(true)}
              disabled={coaText.trim().length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#103b2c] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0c3226] disabled:cursor-not-allowed disabled:bg-[#103b2c]/40"
            >
              <Microscope className="h-3.5 w-3.5" strokeWidth={2.25} />
              Run sanity check
            </button>
            {showResults && (
              <button
                type="button"
                onClick={() => {
                  setShowResults(false);
                  setCoaText("");
                  setExpectedName("");
                }}
                className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-5 text-[13px] font-semibold text-[#103b2c] transition-colors hover:border-[#103b2c]/30"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {showResults && findings.length > 0 && (
        <div className="rounded-[16px] border border-[#0f6a52]/30 bg-[#0f6a52]/5 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
              Findings &middot; {findings.length}
            </p>
            <span className="rounded-full bg-[#0f6a52]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f6a52]">
              {counts.ok} OK
            </span>
            {counts.warn > 0 && (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                {counts.warn} caution
              </span>
            )}
            {counts.fail > 0 && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-red-700">
                {counts.fail} red flag
              </span>
            )}
          </div>

          <ul className="mt-5 space-y-3">
            {findings.map((f, i) => {
              const v = SEVERITY_VISUAL[f.severity];
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-[10px] border border-[#103b2c]/10 bg-white p-4"
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${v.pillClass}`}>
                    <v.Icon className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-[1.3] text-[#103b2c]">
                      {f.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.55] text-[#103b2c]/65">
                      {f.detail}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] ${v.pillClass}`}>
                    {v.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 text-[11.5px] leading-[1.55] text-[#103b2c]/55">
            Heuristic check only. The tool scans for the standard things a legitimate peptide COA
            should include &mdash; purity, methods, lot, date, third-party verification. It does NOT
            validate the COA against the actual lab. Always verify lot numbers and lab links directly.
          </p>
        </div>
      )}
    </div>
  );
}
