import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert } from "lucide-react";
import { PrintButton } from "@/components/pdfs/PrintButton";
import { Button } from "@/components/ui/button";
import { formatDoseLane, formatDoseReferenceStatus } from "@/data/dosing-references";
import type { ProtocolPdfContent } from "@/data/protocol-pdf-content";
import type { PaidPdfProduct } from "@/lib/stripe/products";
import type { PersonalizedDoseReference, ProtocolProfileSnapshot } from "@/lib/personalized-protocol";
import type { PlannerRecommendation } from "@/types/planner";

const SECTION = "rounded-[18px] border border-[#103b2c]/10 bg-white p-5 shadow-sm print:break-inside-avoid print:shadow-none";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f6a52]";

function formatDate(value: string | null) {
  if (!value) return "recently";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function formatTitle(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function GeneratedProtocolView({
  product,
  content,
  purchasedAt,
  personalized,
  profile,
  recommendations,
  doseReferences,
  monitoringNotes,
  washoutNotes,
  dosingCoverageLabel,
  backHref,
  backLabel,
  fallbackCopy,
}: {
  product: PaidPdfProduct;
  content: ProtocolPdfContent;
  purchasedAt: string | null;
  personalized: boolean;
  profile: ProtocolProfileSnapshot[];
  recommendations: PlannerRecommendation[];
  doseReferences: PersonalizedDoseReference[];
  monitoringNotes: string[];
  washoutNotes: string[];
  dosingCoverageLabel: string;
  backHref: string;
  backLabel: string;
  fallbackCopy: string;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" render={<Link href={backHref} />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
        <PrintButton />
      </div>

      <article className="space-y-5 bg-[#fbfaf7] pb-12 text-[#103b2c] print:bg-white print:pb-0">
        <section className="rounded-[22px] border border-[#103b2c]/10 bg-[#103b2c] p-7 text-white print:border-[#103b2c]/30 print:bg-white print:text-[#103b2c]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 print:text-[#0f6a52]">
            Personalized generated protocol
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70 print:text-[#103b2c]/70">
            {content.positioning}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <HeroMetric label="Purchased" value={formatDate(purchasedAt)} />
            <HeroMetric label="Personalization" value={personalized ? "Quiz result applied" : "Generic template fallback"} />
            <HeroMetric label="Dosing data" value={dosingCoverageLabel} />
          </div>
        </section>

        {!personalized && (
          <section className="rounded-[18px] border border-amber-300 bg-amber-50 p-5 text-amber-950 print:break-inside-avoid">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Generic fallback protocol</p>
                <p className="mt-1 text-sm leading-6">{fallbackCopy}</p>
              </div>
            </div>
          </section>
        )}

        <section className={SECTION}>
          <p className={LABEL}>Profile snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {profile.map((item) => (
              <div key={item.label} className="rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#103b2c]/45">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#103b2c]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={SECTION}>
          <p className={LABEL}>Recommended stack</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em]">Why these compounds were selected</h2>
          <div className="mt-4 grid gap-3">
            {recommendations.map((recommendation) => (
              <div key={recommendation.peptide.id} className="rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-bold">{recommendation.peptide.name}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#103b2c]/45">
                      {formatTitle(recommendation.role)} - Evidence {recommendation.peptide.evidenceTier} - Risk {formatTitle(recommendation.peptide.riskLevel)}
                    </p>
                  </div>
                  <Link
                    href={`/peptides/${recommendation.peptide.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f6a52] underline underline-offset-4"
                  >
                    Compound profile <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#103b2c]/75">
                  {(recommendation.rationale.length ? recommendation.rationale : [recommendation.peptide.shortDescription]).map((point) => (
                    <li key={point}>- {point}</li>
                  ))}
                  {recommendation.cautions.slice(0, 2).map((point) => (
                    <li key={point} className="text-amber-800">- Caution: {point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={SECTION}>
          <p className={LABEL}>Dosing reference table</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em]">Reference ranges for discussion, not prescriptions</h2>
          <p className="mt-2 text-sm leading-6 text-[#103b2c]/68">
            These ranges are source-labeled planning references. They are not personalized medical instructions, not prescriptions, and not a replacement for clinician-confirmed dose, route, timing, titration, or stop criteria.
          </p>
          <div className="mt-5 space-y-4">
            {doseReferences.map((item) => (
              <div key={item.recommendation.peptide.id} className="rounded-xl border border-[#103b2c]/10">
                <div className="border-b border-[#103b2c]/10 bg-[#f4f1ea] p-4">
                  <p className="text-lg font-bold">{item.recommendation.peptide.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#0f6a52]">{formatDoseLane(item.lane)}</p>
                  <ul className="mt-2 grid gap-1 text-xs leading-5 text-[#103b2c]/65">
                    {item.laneReasons.map((reason) => (
                      <li key={reason}>- {reason}</li>
                    ))}
                  </ul>
                </div>
                {item.references.length === 0 ? (
                  <div className="p-4 text-sm text-[#103b2c]/70">
                    No dosing reference row is mapped yet. Treat this compound as insufficient data in generated protocols.
                  </div>
                ) : (
                  <div className="divide-y divide-[#103b2c]/10">
                    {item.references.map((reference) => (
                      <div key={reference.id} className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                        <div>
                          <p className="text-sm font-bold">
                            {reference.variantLabel ? `${reference.variantLabel} variant` : "Primary reference"}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[#103b2c]/72">{reference.standardRange}</p>
                          <p className="mt-2 inline-flex rounded-full border border-[#103b2c]/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#103b2c]/70">
                            {formatDoseReferenceStatus(reference.sourceStatus)}
                          </p>
                        </div>
                        <dl className="grid gap-2 text-xs leading-5 text-[#103b2c]/70 sm:grid-cols-2">
                          {reference.dailyEquivalent && <ReferenceMetric label="Daily" value={reference.dailyEquivalent} />}
                          {reference.weeklyEquivalent && <ReferenceMetric label="Weekly" value={reference.weeklyEquivalent} />}
                          {reference.monthlyEquivalent && <ReferenceMetric label="Monthly" value={reference.monthlyEquivalent} />}
                          <ReferenceMetric label="Timing" value={reference.frequencyTiming} />
                          <ReferenceMetric label="Cycle" value={reference.cycleDuration} />
                          <ReferenceMetric label="Washout" value={reference.washoutRule} />
                        </dl>
                        <div className="lg:col-span-2">
                          <p className="text-xs leading-5 text-[#103b2c]/65">{reference.personalizationNotes}</p>
                          <p className="mt-1 text-[11px] leading-5 text-[#103b2c]/50">
                            Source status: {reference.sourceNotes.join(" ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={SECTION}>
          <p className={LABEL}>Monitoring and washout</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <InfoList title="Monitoring checklist" items={monitoringNotes} />
            <InfoList title="Cycle and washout notes" items={washoutNotes} />
          </div>
        </section>

        <section className={SECTION}>
          <p className={LABEL}>Reconstitution and unit conversion</p>
          <h2 className="mt-2 text-xl font-bold">Use the calculator before converting vial labels into syringe units</h2>
          <p className="mt-2 text-sm leading-6 text-[#103b2c]/70">
            Vial mg, bac water volume, concentration, and syringe units change the actual amount delivered. This generated protocol does not hard-code syringe-unit instructions. Use the reconstitution calculator and verify the current vial label, concentration, sterility, and route before acting.
          </p>
          <Button className="mt-4 print:hidden" variant="outline" render={<Link href="/tools/reconstitution" />}>
            Open reconstitution calculator
          </Button>
        </section>

        <section className={SECTION}>
          <p className={LABEL}>Vendor and quality checks</p>
          <div className="mt-4 grid gap-3">
            {recommendations.map((recommendation) => (
              <div key={`${recommendation.peptide.id}-vendors`} className="rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4">
                <p className="font-bold">{recommendation.peptide.name}</p>
                <p className="mt-1 text-sm leading-6 text-[#103b2c]/65">
                  Check identity, lot/batch match, COA recency, route-appropriate documentation, and RUO or prescription status before leaving PeptidePros.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                  <Button size="sm" variant="outline" render={<Link href={`/vendors?peptide=${recommendation.peptide.slug}`} />}>
                    Compare vendors
                  </Button>
                  <Button size="sm" variant="outline" render={<Link href="/tools/coa-check" />}>
                    COA sanity check
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={SECTION}>
          <p className={LABEL}>Product template</p>
          <h2 className="mt-2 text-xl font-bold">Core protocol framework</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <InfoList title="Baseline" items={content.schedule.baseline} />
            <InfoList title="Weeks 1-4" items={content.schedule.weeksOneToFour} />
            <InfoList title="Optimization" items={content.schedule.optimization} />
            <InfoList title="Maintenance" items={content.schedule.maintenance} />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <InfoList title="Red flags" items={content.redFlags} />
            <InfoList title="Clinician prompts" items={content.clinicianPrompts} />
          </div>
        </section>
      </article>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 p-3 print:border-[#103b2c]/10 print:bg-[#fbfaf7]">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 print:text-[#103b2c]/50">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function ReferenceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#103b2c]/10 bg-white p-2">
      <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#103b2c]/45">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4">
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#103b2c]/72">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

