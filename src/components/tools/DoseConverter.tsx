"use client";

import { useMemo, useState } from "react";
import { Repeat } from "lucide-react";

type Direction = "mcg-mg" | "mg-iu" | "ml-units";

const DIRECTIONS: { id: Direction; label: string; description: string }[] = [
  { id: "mcg-mg", label: "mcg ↔ mg", description: "Microgram ↔ milligram (×1000)." },
  { id: "mg-iu", label: "mg ↔ IU", description: "For HGH (1 mg ≈ 3 IU). Override for other compounds." },
  { id: "ml-units", label: "mL ↔ syringe units", description: "U-100 (100 u/mL) and U-40 (40 u/mL) syringes." },
];

export function DoseConverter() {
  const [direction, setDirection] = useState<Direction>("mcg-mg");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {DIRECTIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDirection(d.id)}
            className={`rounded-[8px] border px-4 py-2 text-[13px] font-semibold transition-colors ${
              direction === d.id
                ? "border-[#0f6a52] bg-[#0f6a52]/10 text-[#0f6a52]"
                : "border-[#103b2c]/15 bg-[#fbfaf7] text-[#103b2c] hover:border-[#103b2c]/30"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="text-[13px] leading-[1.55] text-[#103b2c]/65">
        {DIRECTIONS.find((d) => d.id === direction)?.description}
      </p>

      <div className="rounded-[16px] border border-[#0f6a52]/30 bg-[#0f6a52]/5 p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Repeat className="h-4 w-4 text-[#0f6a52]" strokeWidth={2.25} />
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
            Convert
          </p>
        </div>
        {direction === "mcg-mg" && <McgMgPanel />}
        {direction === "mg-iu" && <MgIuPanel />}
        {direction === "ml-units" && <MlUnitsPanel />}
      </div>
    </div>
  );
}

function McgMgPanel() {
  const [mcg, setMcg] = useState<string>("250");
  const mg = useMemo(() => {
    const v = parseFloat(mcg);
    if (!Number.isFinite(v)) return null;
    return v / 1000;
  }, [mcg]);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <NumberCell
        label="Micrograms"
        unit="mcg"
        value={mcg}
        onChange={setMcg}
        big
      />
      <ResultCell label="Milligrams" unit="mg" value={mg !== null ? mg.toFixed(4) : "—"} />
    </div>
  );
}

function MgIuPanel() {
  const [mg, setMg] = useState<string>("1");
  const [ratio, setRatio] = useState<string>("3");
  const result = useMemo(() => {
    const m = parseFloat(mg);
    const r = parseFloat(ratio);
    if (!Number.isFinite(m) || !Number.isFinite(r) || r <= 0) return null;
    return m * r;
  }, [mg, ratio]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberCell label="Milligrams" unit="mg" value={mg} onChange={setMg} big />
        <ResultCell
          label="International units"
          unit="IU"
          value={result !== null ? result.toFixed(2) : "—"}
        />
      </div>
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-[#103b2c]">
          Conversion ratio (IU per mg)
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { v: "3", label: "HGH (3 IU/mg)" },
            { v: "2.7", label: "HGH alt (2.7 IU/mg)" },
            { v: "1", label: "Generic (1:1)" },
          ].map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setRatio(opt.v)}
              className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold transition-colors ${
                ratio === opt.v
                  ? "border-[#0f6a52] bg-[#0f6a52]/10 text-[#0f6a52]"
                  : "border-[#103b2c]/15 text-[#103b2c]/65 hover:border-[#103b2c]/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="h-8 w-24 rounded-full border border-[#103b2c]/15 bg-[#fbfaf7] px-3 text-[12px] font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52]"
          />
        </div>
        <p className="mt-2 text-[11.5px] text-[#103b2c]/55">
          IU is biological-activity defined and only meaningful for compounds with a published
          conversion (e.g., human growth hormone). Use 1:1 for compounds where IU = mg.
        </p>
      </div>
    </div>
  );
}

function MlUnitsPanel() {
  const [ml, setMl] = useState<string>("0.25");
  const [syringe, setSyringe] = useState<"u100" | "u40">("u100");
  const upm = syringe === "u100" ? 100 : 40;
  const units = useMemo(() => {
    const v = parseFloat(ml);
    if (!Number.isFinite(v)) return null;
    return v * upm;
  }, [ml, upm]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberCell label="Volume" unit="mL" value={ml} onChange={setMl} big />
        <ResultCell
          label={`Units on ${syringe === "u100" ? "U-100" : "U-40"} syringe`}
          unit="u"
          value={units !== null ? units.toFixed(1) : "—"}
        />
      </div>
      <div className="inline-flex rounded-[8px] border border-[#103b2c]/15 bg-[#fbfaf7] p-1 text-[12px] font-semibold">
        <button
          type="button"
          onClick={() => setSyringe("u100")}
          className={`rounded-[6px] px-4 py-1.5 transition-colors ${
            syringe === "u100" ? "bg-[#103b2c] text-white" : "text-[#103b2c]/65"
          }`}
        >
          U-100 (100 u/mL)
        </button>
        <button
          type="button"
          onClick={() => setSyringe("u40")}
          className={`rounded-[6px] px-4 py-1.5 transition-colors ${
            syringe === "u40" ? "bg-[#103b2c] text-white" : "text-[#103b2c]/65"
          }`}
        >
          U-40 (40 u/mL)
        </button>
      </div>
    </div>
  );
}

function NumberCell({
  label,
  unit,
  value,
  onChange,
  big,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  big?: boolean;
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
          className={`w-full rounded-[8px] border border-[#103b2c]/15 bg-white px-3 pr-14 font-semibold text-[#103b2c] outline-none focus:border-[#0f6a52] ${
            big ? "h-14 text-[24px]" : "h-11 text-[15px]"
          }`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#103b2c]/45">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ResultCell({
  label,
  unit,
  value,
}: {
  label: string;
  unit: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-[#103b2c]">{label}</p>
      <div className="flex h-14 items-end gap-2 border-b-2 border-[#0f6a52]/40 pb-1.5">
        <span className="text-[24px] font-extrabold leading-none tracking-[-0.02em] text-[#103b2c]">
          {value}
        </span>
        <span className="pb-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#103b2c]/55">
          {unit}
        </span>
      </div>
    </div>
  );
}
