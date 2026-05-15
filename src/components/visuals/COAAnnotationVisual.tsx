export interface COAAnnotationVisualProps {
  title?: string;
  compact?: boolean;
}

const annotations = [
  ["Batch ID", "Must match the exact product page or vial label."],
  ["Purity", "Look for a numeric purity result, not only 'lab tested' language."],
  ["Method", "HPLC is common for purity; MS helps confirm identity."],
  ["Date", "Recent tests are more useful than stale or reused reports."],
  ["Red flags", "Missing batch, cropped lab name, or generic PDF should slow the purchase."],
];

export function COAAnnotationVisual({ title = "How to read a COA before trusting a vendor", compact = false }: COAAnnotationVisualProps) {
  return (
    <section className="rounded-xl border border-[#103b2c]/12 bg-[#fbfaf7] p-5 text-[#103b2c]">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
        COA visual
      </p>
      <h2 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[-0.02em]">{title}</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-lg border border-[#103b2c]/12 bg-white p-4">
          <div className="border-b border-[#103b2c]/12 pb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45">
              Example certificate
            </p>
            <p className="mt-1 text-[15px] font-bold">Product purity and identity report</p>
          </div>
          <div className="mt-4 grid gap-2">
            {annotations.slice(0, compact ? 4 : annotations.length).map(([label, body]) => (
              <div key={label} className="grid grid-cols-[92px_1fr] gap-3 rounded-lg bg-[#fbfaf7] p-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f6a52]">
                  {label}
                </p>
                <p className="text-[13px] leading-5 text-[#103b2c]/72">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border border-amber-500/20 bg-amber-500/8 p-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">
            Trust rule
          </p>
          <p className="mt-2 text-[13.5px] leading-6 text-[#103b2c]/78">
            A COA is only useful when it connects a specific vendor product to a specific tested
            batch. If the report cannot be matched to the product being considered, treat the
            sourcing claim as unverified.
          </p>
        </aside>
      </div>
    </section>
  );
}
