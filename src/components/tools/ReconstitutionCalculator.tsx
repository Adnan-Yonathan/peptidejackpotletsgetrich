"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Beaker } from "lucide-react";
import type { PeptideData } from "@/data/peptides";

const SYRINGE_OPTIONS = [
  { id: "u100", label: "U-100 (1 mL)", unitsPerMl: 100 },
  { id: "u100-half", label: "U-100 (0.5 mL)", unitsPerMl: 100 },
  { id: "u100-third", label: "U-100 (0.3 mL)", unitsPerMl: 100 },
  { id: "u40", label: "U-40 (1 mL)", unitsPerMl: 40 },
] as const;

type SyringeId = (typeof SYRINGE_OPTIONS)[number]["id"];

interface Props {
  peptide?: PeptideData;
}

export function ReconstitutionCalculator({ peptide }: Props) {
  const [vialMg, setVialMg] = useState<string>("5");
  const [bacMl, setBacMl] = useState<string>("2");
  const [doseMcg, setDoseMcg] = useState<string>("250");
  const [syringe, setSyringe] = useState<SyringeId>("u100");

  const result = useMemo(() => {
    const vial = parseFloat(vialMg);
    const bac = parseFloat(bacMl);
    const dose = parseFloat(doseMcg);
    const syringeOpt = SYRINGE_OPTIONS.find((s) => s.id === syringe)!;

    if (!Number.isFinite(vial) || !Number.isFinite(bac) || !Number.isFinite(dose)) return null;
    if (vial <= 0 || bac <= 0 || dose <= 0) return null;

    const concentrationMcgPerMl = (vial * 1000) / bac;
    const mlPerDose = dose / concentrationMcgPerMl;
    const units = mlPerDose * syringeOpt.unitsPerMl;
    const dosesPerVial = (vial * 1000) / dose;

    return {
      concentrationMcgPerMl,
      mlPerDose,
      units,
      dosesPerVial,
      syringeOpt,
    };
  }, [vialMg, bacMl, doseMcg, syringe]);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10">
      {/* Inputs */}
      <div className="rounded-[16px] border border-[#103b2c]/10 bg-white p-5 md:p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
          Inputs
        </p>

        <div className="mt-5 space-y-5">
          <Field
            label="Vial size"
            unit="mg"
            value={vialMg}
            onChange={setVialMg}
            quickValues={["2", "5", "10", "15"]}
          />
          <Field
            label="BAC water added"
            unit="mL"
            value={bacMl}
            onChange={setBacMl}
            quickValues={["1", "2", "3", "5"]}
          />
          <Field
            label="Target dose"
            unit="mcg"
            value={doseMcg}
            onChange={setDoseMcg}
            quickValues={["100", "250", "500", "1000"]}
          />

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
              Syringe type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SYRINGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSyringe(opt.id)}
                  className={`rounded-[8px] border px-3 py-2 text-[12.5px] font-semibold transition-colors ${
                    syringe === opt.id
                      ? "border-[#0f6a52] bg-[#0f6a52]/10 text-[#0f6a52]"
                      : "border-[#103b2c]/15 bg-[#fbfaf7] text-[#103b2c] hover:border-[#103b2c]/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {peptide && (
          <div className="mt-6 rounded-[10px] border border-[#103b2c]/10 bg-[#fbfaf7]/60 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/55">
              Reference dosing — {peptide.name}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[#103b2c]/72">
              {peptide.studyDoseRange}
            </p>
            <p className="mt-1.5 font-mono text-[10.5px] text-[#103b2c]/50">
              Routes: {peptide.administrationRoutes.join(", ") || "—"}
            </p>
          </div>
        )}
      </div>

      {/* Output */}
      <div className="rounded-[16px] border border-[#0f6a52]/30 bg-[#0f6a52]/5 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Beaker className="h-4 w-4 text-[#0f6a52]" strokeWidth={2.25} />
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
            Result
          </p>
        </div>

        {!result ? (
          <p className="mt-6 text-[14px] text-[#103b2c]/60">
            Enter all values to see the dose calculation.
          </p>
        ) : (
          <>
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/45">
                Draw on syringe
              </p>
              <p className="mt-2 text-[44px] font-extrabold leading-none tracking-[-0.03em] text-[#103b2c] md:text-[56px]">
                {result.units < 100
                  ? result.units.toFixed(1)
                  : Math.round(result.units).toString()}
                <span className="ml-2 text-[18px] font-semibold text-[#103b2c]/55 md:text-[22px]">
                  units
                </span>
              </p>
              <p className="mt-2 text-[12.5px] text-[#103b2c]/65">
                ({result.mlPerDose.toFixed(3)} mL on a {result.syringeOpt.label} syringe)
              </p>
            </div>

            <dl className="mt-6 grid gap-px border-y border-[#103b2c]/10 bg-[#103b2c]/10 sm:grid-cols-2">
              <div className="bg-[#0f6a52]/5 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                  Concentration
                </dt>
                <dd className="mt-1.5 text-[15px] font-semibold text-[#103b2c]">
                  {(result.concentrationMcgPerMl / 1000).toFixed(2)} mg/mL
                </dd>
                <dd className="text-[11.5px] text-[#103b2c]/55">
                  {Math.round(result.concentrationMcgPerMl)} mcg/mL
                </dd>
              </div>
              <div className="bg-[#0f6a52]/5 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                  Doses per vial
                </dt>
                <dd className="mt-1.5 text-[15px] font-semibold text-[#103b2c]">
                  ~ {Math.floor(result.dosesPerVial)} doses
                </dd>
                <dd className="text-[11.5px] text-[#103b2c]/55">
                  at {doseMcg} mcg per dose
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-[11.5px] leading-[1.55] text-[#103b2c]/55">
              Educational research math only. Verify all calculations against your vial label and
              syringe markings before use. Not medical advice.
            </p>
          </>
        )}

        {peptide && result && (
          <div className="mt-6 border-t border-[#103b2c]/10 pt-5">
            <Link
              href={`/peptides/${peptide.slug}`}
              className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors hover:text-[#0f6a52]"
            >
              Open {peptide.name} profile
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  quickValues,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  quickValues?: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] px-3 pr-12 text-[15px] font-semibold text-[#103b2c] outline-none transition-colors focus:border-[#0f6a52]"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#103b2c]/45">
          {unit}
        </span>
      </div>
      {quickValues && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickValues.map((qv) => (
            <button
              key={qv}
              type="button"
              onClick={() => onChange(qv)}
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-semibold transition-colors ${
                value === qv
                  ? "border-[#0f6a52] bg-[#0f6a52]/10 text-[#0f6a52]"
                  : "border-[#103b2c]/15 text-[#103b2c]/65 hover:border-[#103b2c]/30"
              }`}
            >
              {qv}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
