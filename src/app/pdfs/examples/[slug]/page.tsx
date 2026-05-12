import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, ExternalLink, ShieldAlert } from "lucide-react";
import { PrintButton } from "@/components/pdfs/PrintButton";
import { Button } from "@/components/ui/button";
import { getAffiliateUrlForVendor } from "@/data/affiliate-links";
import { getPeptideById, type PeptideData } from "@/data/peptides";
import {
  getProtocolPdfContent,
  getScheduleCopy,
  getScheduleLabel,
  type PdfCompoundRecommendation,
  type PdfScheduleRow,
  type PdfTrackingMetric,
  type ProtocolPdfContent,
} from "@/data/protocol-pdf-content";
import { PROTOCOL_PDF_PRODUCTS, getProtocolPdfProduct, type ProtocolPdfProduct } from "@/data/protocol-pdfs";
import { getVendorsForPeptide } from "@/data/vendors";

interface MapRow {
  compound: string;
  role: string;
  fit: string;
  schedule: string;
  evidence: string;
}

interface PageSpec {
  eyebrow: string;
  title: string;
  deck: string;
  blocks: Array<{
    heading: string;
    body?: string;
    items?: string[];
    columns?: Array<{ label: string; value: string }>;
    links?: Array<{ label: string; href: string; note: string }>;
    scheduleRows?: PdfScheduleRow[];
    trackingRows?: PdfTrackingMetric[];
    mapRows?: MapRow[];
    pullQuote?: string;
  }>;
}

export function generateStaticParams() {
  return PROTOCOL_PDF_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProtocolPdfProduct(slug);

  if (!product) {
    return { title: "PDF Example Not Found", robots: { index: false, follow: false } };
  }

  return {
    title: `${product.name} PDF Proof`,
    description: `Paginated export proof for ${product.name}.`,
    robots: { index: false, follow: false },
  };
}

function buildVendorLinks(peptide: PeptideData) {
  return getVendorsForPeptide(peptide.id)
    .map((vendor) => {
      const href = getAffiliateUrlForVendor(vendor.id, peptide.id);
      if (!href) return null;

      return {
        label: `${vendor.name} research link`,
        href,
        note: `${vendor.vendorType.replace(/_/g, " ")} - ${vendor.coaAccessMode.replace(/_/g, " ")} - ${vendor.regulatoryNotes}`,
      };
    })
    .filter((link): link is { label: string; href: string; note: string } => Boolean(link));
}

function compoundEvidenceLine(peptide: PeptideData) {
  return `Evidence ${peptide.evidenceTier} - ${peptide.regulatoryStatus.replace(/_/g, " ")} - FDA ${peptide.fdaCompoundingRiskFlag} - WADA ${peptide.wadaFlag}`;
}

function compoundColumns(peptide: PeptideData, recommendation: PdfCompoundRecommendation) {
  return [
    { label: "Protocol verdict", value: getScheduleLabel(recommendation.scheduleType) },
    { label: "Evidence and status", value: compoundEvidenceLine(peptide) },
    { label: "Typical route context", value: peptide.administrationRoutes.join(", ") || "Route not established" },
    { label: "Schedule rule", value: getScheduleCopy(recommendation.scheduleType, peptide) },
  ];
}

function buildCompoundPage(recommendation: PdfCompoundRecommendation, index: number): PageSpec | null {
  const peptide = getPeptideById(recommendation.peptideId);
  if (!peptide) return null;

  const links = buildVendorLinks(peptide);

  return {
    eyebrow: `Compound ${String(index + 1).padStart(2, "0")}`,
    title: peptide.name,
    deck: recommendation.role,
    blocks: [
      {
        heading: "Recommendation",
        body: recommendation.fit,
        columns: compoundColumns(peptide, recommendation),
      },
      {
        heading: "Watch Before Using",
        items: [
          recommendation.watch,
          peptide.adverseEffects,
          peptide.contraindications,
          peptide.interactionNotes,
        ],
      },
      {
        heading: "Personal Schedule",
        body: "Fill these fields after a clinician confirms your plan. Leave blank until then.",
        columns: [
          {
            label: "Typical route context",
            value: peptide.administrationRoutes.length
              ? peptide.administrationRoutes.join(", ")
              : "Route not established",
          },
          {
            label: "Schedule posture",
            value: getScheduleLabel(recommendation.scheduleType),
          },
          { label: "Your dose", value: "__write_in__" },
          { label: "Your route", value: "__write_in__" },
          { label: "Your timing", value: "__write_in__" },
          { label: "First review date", value: "__write_in__" },
        ],
      },
      {
        heading: "Affiliate Vendor Links",
        body: links.length
          ? "Open vendor links only after reviewing quality gates, RUO language, and whether the product is appropriate for the intended use."
          : "No mapped affiliate vendor link is available for this compound yet.",
        links,
      },
      {
        heading: "Quality Gates",
        items: peptide.qualityRequirements.length
          ? peptide.qualityRequirements
          : ["Identity confirmation", "Lot traceability", "Route-appropriate quality documentation"],
      },
    ],
  };
}

function buildPages(product: ProtocolPdfProduct, content: ProtocolPdfContent): PageSpec[] {
  const compoundPages = content.compoundRecommendations
    .map((recommendation, index) => buildCompoundPage(recommendation, index))
    .filter((page): page is PageSpec => Boolean(page));

  return [
    {
      eyebrow: "Prologue",
      title: "About This Compendium",
      deck: content.positioning,
      blocks: [
        {
          heading: "Edition Details",
          columns: [
            { label: "Format", value: product.kind === "primary" ? "Goal protocol" : "Execution add-on" },
            { label: "Price", value: product.priceLabel },
            { label: "Folio mark", value: `${product.pdfKey}.pdf` },
            { label: "Last reviewed", value: content.lastReviewed },
          ],
        },
        {
          heading: "Safety Posture",
          body: "Educational planning only. Approved medications require licensed clinical care. Non-approved or research-use compounds use guardrailed schedule fields rather than hard human-use dosing.",
          pullQuote:
            "Treat this compendium as a decision aid for conversations with a licensed clinician — not as a prescription, dosing chart, or sourcing manual.",
        },
        {
          heading: "How To Read This Compendium",
          items: [
            "Read the Goal Snapshot first to anchor expectations and timeline.",
            "Use the Compound Map to compare evidence and fit across lanes.",
            "Open individual compound folios only after the map narrows the choice.",
            "Schedule pages assume a clinician-confirmed dose has already been entered.",
            "Tracking and red-flag rules are part of the protocol — review weekly, not occasionally.",
          ],
        },
      ],
    },
    {
      eyebrow: "Contents",
      title: "Table Of Contents",
      deck: "This proof is paginated like the exportable PDF. Each section is built to survive print, checkout delivery, and future paid-download upload.",
      blocks: [
        {
          heading: "Sections",
          items: content.tableOfContents,
        },
        {
          heading: "Compound Pages Included",
          items: content.compoundRecommendations
            .map((recommendation) => getPeptideById(recommendation.peptideId)?.name)
            .filter((name): name is string => Boolean(name)),
        },
      ],
    },
    {
      eyebrow: "Goal",
      title: "Goal Snapshot",
      deck: content.goalSnapshot,
      blocks: [
        {
          heading: "Expected Timeline",
          body: content.timeline,
        },
        {
          heading: "How To Use This PDF",
          items: [
            "Read the goal snapshot and compound map first.",
            "Pick the simplest compound lane that fits the goal and risk profile.",
            "Use affiliate/vendor links only after checking sourcing and RUO boundaries.",
            "Fill dose and route fields only with clinician-confirmed details.",
            "Run the weekly scorecard before changing the protocol.",
          ],
        },
      ],
    },
    {
      eyebrow: "Map",
      title: "Evidence-Ranked Compound Map",
      deck: "The map recommends compounds by role and fit while making the schedule and safety posture explicit. Detail folios follow.",
      blocks: [
        {
          heading: "Compound Comparison",
          mapRows: content.compoundRecommendations.map((recommendation) => {
            const peptide = getPeptideById(recommendation.peptideId);
            return {
              compound: peptide?.name ?? recommendation.peptideId,
              role: recommendation.role,
              fit: recommendation.fit,
              schedule: getScheduleLabel(recommendation.scheduleType),
              evidence: peptide ? compoundEvidenceLine(peptide) : "Not mapped",
            };
          }),
        },
      ],
    },
    ...compoundPages,
    {
      eyebrow: "Schedule",
      title: "Daily Operating Schedule",
      deck: "This is the everyday rhythm for using the PDF. It tells the buyer when to act, what to track, and what should trigger a hold or review.",
      blocks: [
        {
          heading: "Daily Rhythm",
          scheduleRows: content.detailedSchedule.dailyRhythm,
        },
        {
          heading: "Operator Notes",
          items: [
            "Anchor the protocol to one stable daily window — do not move it after the first week.",
            "Track only what changes the next decision; everything else is noise.",
            "If a daily action is skipped twice in a row, log it as a review trigger.",
          ],
          pullQuote: "Consistency of timing matters more than precision of dose at this stage.",
        },
      ],
    },
    {
      eyebrow: "Schedule",
      title: "First 7 Days",
      deck: "The first week establishes baseline behavior and tolerance. It should not be used to stack extra variables.",
      blocks: [
        {
          heading: "Day-By-Day Launch",
          scheduleRows: content.detailedSchedule.firstSevenDays,
        },
        {
          heading: "Launch Week Rules",
          items: [
            "Change one variable at a time — protocol, training, or nutrition, not all three.",
            "Record sleep, appetite, mood, and any side effect on the same day it occurs.",
            "Do not adjust dose this week unless a red-flag rule is hit.",
          ],
        },
      ],
    },
    {
      eyebrow: "Schedule",
      title: "Weeks 1-4 Protocol Calendar",
      deck: "The first month decides whether the plan is interpretable. Hold changes unless the weekly score clearly points to simplify or review.",
      blocks: [
        {
          heading: "Weeks 1-4",
          scheduleRows: content.detailedSchedule.weeklyPlan.slice(0, 4),
        },
        {
          heading: "Month One Focus",
          items: [
            "Use the weekly scorecard before changing anything.",
            "Hold the plan unchanged unless a trigger column says otherwise.",
            "Confirm sourcing, lot, and storage are stable before week 4.",
          ],
        },
      ],
    },
    {
      eyebrow: "Schedule",
      title: "Weeks 5-8 Optimization Calendar",
      deck: "Optimization starts only after the baseline plan is stable enough to interpret.",
      blocks: [
        {
          heading: "Weeks 5-8",
          scheduleRows: content.detailedSchedule.weeklyPlan.slice(4, 8),
        },
        {
          heading: "Optimization Rules",
          items: [
            "Only optimize variables the scorecard says are interpretable.",
            "Do not stack a second compound this window without clinician confirmation.",
            "Reset the weekly scorecard if you change route, timing, or dose.",
          ],
        },
      ],
    },
    {
      eyebrow: "Schedule",
      title: "Weeks 9-12 Maintenance Calendar",
      deck: "The final month turns the protocol into a continuation, simplification, or off-ramp decision.",
      blocks: [
        {
          heading: "Weeks 9-12",
          scheduleRows: content.detailedSchedule.weeklyPlan.slice(8, 12),
        },
        {
          heading: "Off-Ramp Checklist",
          items: [
            "Decide: continue, simplify, or stop — and write the reason in plain language.",
            "Schedule the next clinician review before the protocol ends.",
            "Archive this folio with the final scorecard and any lab values.",
          ],
        },
      ],
    },
    {
      eyebrow: "Tracking",
      title: "Monitoring And Progress Scorecard",
      deck: "Track only the metrics that change the next decision. More data is not useful if it does not affect the protocol.",
      blocks: [
        {
          heading: "Progress Tracker",
          trackingRows: content.detailedSchedule.trackingMetrics,
        },
        {
          heading: "Decision Rule",
          items: content.detailedSchedule.reviewRules,
        },
        {
          heading: "Adjustment Rules",
          items: content.detailedSchedule.adjustmentRules,
        },
      ],
    },
    {
      eyebrow: "Safety",
      title: "Red Flags And Referral Triggers",
      deck: "These rules are part of the protocol, not fine print.",
      blocks: [
        {
          heading: "Stop And Review",
          items: content.redFlags,
        },
        {
          heading: "Clinician Discussion Prompts",
          items: content.clinicianPrompts,
        },
      ],
    },
    {
      eyebrow: "Action",
      title: "Execution Checklist",
      deck: "Use this page before starting, before ordering, and before changing the plan.",
      blocks: [
        {
          heading: "Checklist",
          items: content.executionChecklist,
        },
        {
          heading: "References",
          items: content.references,
        },
      ],
    },
  ];
}

function toRoman(num: number): string {
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let n = num;
  let out = "";
  for (const [value, sym] of map) {
    while (n >= value) {
      out += sym;
      n -= value;
    }
  }
  return out;
}

function Monogram({ size = 44, tone = "cream" }: { size?: number; tone?: "cream" | "forest" }) {
  const stroke = tone === "cream" ? "#f1e9d4" : "#103b2c";
  const accent = tone === "cream" ? "#7dd3a7" : "#0f6a52";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="30" stroke={stroke} strokeWidth="1.2" />
      <circle cx="32" cy="32" r="22" stroke={stroke} strokeWidth="0.6" opacity="0.55" />
      <path
        d="M32 12 C 22 22, 22 42, 32 52 C 42 42, 42 22, 32 12 Z"
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
      />
      <path d="M32 14 L 32 50" stroke={stroke} strokeWidth="0.8" />
      <path d="M22 28 Q 32 32, 42 28" stroke={stroke} strokeWidth="0.8" fill="none" />
      <path d="M22 36 Q 32 40, 42 36" stroke={stroke} strokeWidth="0.8" fill="none" />
      <text
        x="32"
        y="35.5"
        textAnchor="middle"
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="11"
        fontStyle="italic"
        fill={stroke}
      >
        PP
      </text>
    </svg>
  );
}

function OrnamentalRule({ tone = "forest" }: { tone?: "forest" | "cream" }) {
  const c = tone === "cream" ? "#f1e9d4" : "#103b2c";
  return (
    <svg viewBox="0 0 360 12" width="100%" height="12" aria-hidden className="block">
      <line x1="0" y1="6" x2="155" y2="6" stroke={c} strokeWidth="0.6" />
      <line x1="205" y1="6" x2="360" y2="6" stroke={c} strokeWidth="0.6" />
      <circle cx="180" cy="6" r="2.4" fill={c} />
      <circle cx="165" cy="6" r="1" fill={c} />
      <circle cx="195" cy="6" r="1" fill={c} />
    </svg>
  );
}

function CoverPage({
  product,
  content,
  total,
}: {
  product: ProtocolPdfProduct;
  content: ProtocolPdfContent;
  total: number;
}) {
  const compoundCount = content.compoundRecommendations.length;
  const editionYear = new Date(content.lastReviewed).getFullYear() || new Date().getFullYear();
  const subtitle = product.kind === "primary" ? "Goal Protocol Edition" : "Execution Companion";

  return (
    <section
      className="pdf-sheet pdf-cover relative mx-auto flex min-h-[11in] w-[8.5in] max-w-full flex-col overflow-hidden text-[#f1e9d4] shadow-[0_24px_90px_-58px_rgba(16,59,44,0.75)] print:mx-0 print:min-h-[10in] print:w-auto print:max-w-none print:break-after-page print:shadow-none"
      style={{
        backgroundColor: "#0d3327",
        backgroundImage: [
          "radial-gradient(circle at 18% 12%, rgba(125,211,167,0.22), transparent 40%)",
          "radial-gradient(circle at 88% 88%, rgba(125,211,167,0.14), transparent 45%)",
          "linear-gradient(180deg, rgba(241,233,212,0.04) 0%, transparent 30%, rgba(0,0,0,0.18) 100%)",
          "repeating-linear-gradient(0deg, rgba(241,233,212,0.045) 0px, rgba(241,233,212,0.045) 1px, transparent 1px, transparent 6px)",
        ].join(", "),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/><feColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.21 0 0 0 0 0.16 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>\")",
          mixBlendMode: "overlay",
          opacity: 0.4,
        }}
      />

      <div
        aria-hidden
        className="absolute inset-x-[0.6in] top-[0.55in] h-px"
        style={{ background: "linear-gradient(90deg, transparent, #f1e9d4 20%, #f1e9d4 80%, transparent)", opacity: 0.5 }}
      />
      <div
        aria-hidden
        className="absolute inset-x-[0.6in] bottom-[0.55in] h-px"
        style={{ background: "linear-gradient(90deg, transparent, #f1e9d4 20%, #f1e9d4 80%, transparent)", opacity: 0.5 }}
      />

      <div className="relative flex items-start justify-between px-[0.75in] pt-[0.7in]">
        <div className="flex items-center gap-3">
          <Monogram size={46} />
          <div>
            <p className="font-serif text-[13px] italic leading-none text-[#f1e9d4]">PeptidePros</p>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.32em] text-[#7dd3a7]">
              Pharmacopoeia of Protocols
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#f1e9d4]/70">Vol. {editionYear}</p>
          <p className="mt-1 font-serif text-[11px] italic text-[#f1e9d4]/85">No. {toRoman(total)}</p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-[0.75in]">
        <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-[#7dd3a7]">{subtitle}</p>
        <div className="mt-4 max-w-[6.6in]">
          <h1
            className="font-serif text-[#f1e9d4]"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 400,
              fontSize: "84px",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            <span className="italic">{content.title.split(" ").slice(0, 1).join(" ")}</span>{" "}
            <span>{content.title.split(" ").slice(1).join(" ")}</span>
          </h1>
        </div>

        <p className="mt-7 max-w-[5.6in] text-[13px] leading-[1.7] text-[#f1e9d4]/85">
          {content.positioning}
        </p>

        <div className="mt-8 max-w-[5.2in]">
          <OrnamentalRule tone="cream" />
        </div>

        <p className="mt-6 max-w-[5in] font-serif text-[15px] italic leading-[1.55] text-[#f1e9d4]/80">
          &ldquo;{content.primaryOutcome}&rdquo;
        </p>
      </div>

      <div className="relative grid grid-cols-4 gap-0 border-t border-[#f1e9d4]/25 px-[0.75in] py-7 text-[#f1e9d4]">
        <div className="border-r border-[#f1e9d4]/20 pr-5">
          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#7dd3a7]">Compounds</p>
          <p className="mt-2 font-serif text-[28px] leading-none">{String(compoundCount).padStart(2, "0")}</p>
          <p className="mt-1 text-[9px] text-[#f1e9d4]/65">Mapped &amp; ranked</p>
        </div>
        <div className="border-r border-[#f1e9d4]/20 px-5">
          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#7dd3a7]">Folios</p>
          <p className="mt-2 font-serif text-[28px] leading-none">{toRoman(total)}</p>
          <p className="mt-1 text-[9px] text-[#f1e9d4]/65">{total} letter pages</p>
        </div>
        <div className="border-r border-[#f1e9d4]/20 px-5">
          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#7dd3a7]">Edition</p>
          <p className="mt-2 font-serif text-[16px] leading-tight">{content.lastReviewed}</p>
          <p className="mt-1 text-[9px] text-[#f1e9d4]/65">Reviewed &amp; sealed</p>
        </div>
        <div className="pl-5">
          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#7dd3a7]">Folio Mark</p>
          <p className="mt-2 font-serif text-[16px] leading-tight">{product.pdfKey.toUpperCase()}</p>
          <p className="mt-1 text-[9px] text-[#f1e9d4]/65">{product.priceLabel} edition</p>
        </div>
      </div>

      <div className="relative flex items-end justify-between border-t border-[#f1e9d4]/25 px-[0.75in] py-5 text-[9px] uppercase tracking-[0.28em] text-[#f1e9d4]/55">
        <span>Educational research compendium</span>
        <span className="font-serif text-[11px] normal-case italic tracking-normal text-[#f1e9d4]/65">
          Not a substitute for licensed clinical care
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-[1.4in] top-[3in] select-none font-serif text-[18in] leading-none text-[#f1e9d4]/[0.05]"
        style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic" }}
      >
        I
      </div>
    </section>
  );
}

function ContentBlock({ block, accent }: { block: PageSpec["blocks"][number]; accent: string }) {
  return (
    <section
      className="pdf-block relative rounded-[0.16in] border border-[#103b2c]/15 bg-[#fbfaf7] p-3.5 print:break-inside-avoid"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(251,250,247,1))",
      }}
    >
      <div
        aria-hidden
        className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r"
        style={{ background: accent }}
      />
      <div className="flex items-baseline justify-between gap-3 pl-3">
        <h3
          className="text-[15px] font-black uppercase tracking-[0.06em] text-[#0d3327]"
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", letterSpacing: "0.01em" }}
        >
          {block.heading}
        </h3>
        <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#0f6a52]/70">§</span>
      </div>
      <div className="pl-3">
        {block.body && (
          <p className="mt-2.5 text-[11px] leading-[1.65] text-[#13201d]/80">{block.body}</p>
        )}
        {block.items && (
          <ul className="mt-3 grid gap-2">
            {block.items.map((item, i) => (
              <li key={`${item}-${i}`} className="grid grid-cols-[18px_1fr] gap-2 text-[11px] leading-[1.55] text-[#13201d]/80">
                <span
                  className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full font-serif text-[9px] font-bold italic"
                  style={{ background: "#103b2c", color: "#f1e9d4" }}
                >
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {block.columns && (
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {block.columns.map((column) => {
              const isWriteIn = column.value === "__write_in__";
              return (
                <div
                  key={`${block.heading}-${column.label}`}
                  className="rounded-[0.12in] border border-[#103b2c]/8 bg-white p-3"
                >
                  <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0f6a52]">
                    {column.label}
                  </p>
                  {isWriteIn ? (
                    <div className="mt-3 flex items-end gap-2">
                      <span
                        className="block h-px flex-1"
                        style={{ background: "#103b2c", opacity: 0.35 }}
                      />
                      <span className="text-[7.5px] font-bold uppercase tracking-[0.22em] text-[#103b2c]/40">
                        fill in
                      </span>
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[10.5px] font-medium leading-[1.5] text-[#13201d]/85">
                      {column.value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {block.scheduleRows && (
          <div className="mt-3 overflow-hidden rounded-[0.12in] border border-[#103b2c]/15 bg-white">
            <div className="grid grid-cols-[0.7fr_1.35fr_1.3fr_1.25fr_1.1fr] bg-[#0d3327] text-[8px] font-black uppercase tracking-[0.16em] text-[#f1e9d4]">
              <div className="px-2.5 py-2.5">Day / Week</div>
              <div className="px-2.5 py-2.5">Main Action</div>
              <div className="px-2.5 py-2.5">Track</div>
              <div className="px-2.5 py-2.5">Review Trigger</div>
              <div className="px-2.5 py-2.5">Notes</div>
            </div>
            {block.scheduleRows.map((row, i) => (
              <div
                key={`${block.heading}-${row.period}-${i}`}
                className="grid grid-cols-[0.7fr_1.35fr_1.3fr_1.25fr_1.1fr] border-t border-[#103b2c]/10 text-[9.5px] leading-[1.45] text-[#13201d]/80"
                style={{ background: i % 2 === 0 ? "#ffffff" : "rgba(125,211,167,0.06)" }}
              >
                <div className="px-2.5 py-2.5 font-serif text-[11px] italic font-semibold text-[#0d3327]">
                  {row.period}
                </div>
                <div className="px-2.5 py-2.5">{row.action}</div>
                <div className="px-2.5 py-2.5">{row.track}</div>
                <div className="px-2.5 py-2.5">{row.trigger}</div>
                <div className="px-2.5 py-2.5">{row.notes}</div>
              </div>
            ))}
          </div>
        )}
        {block.trackingRows && (
          <div className="mt-3 overflow-hidden rounded-[0.12in] border border-[#103b2c]/15 bg-white">
            <div className="grid grid-cols-[1fr_0.8fr_1.25fr_1.25fr] bg-[#0d3327] text-[8px] font-black uppercase tracking-[0.16em] text-[#f1e9d4]">
              <div className="px-2.5 py-2.5">Metric</div>
              <div className="px-2.5 py-2.5">Frequency</div>
              <div className="px-2.5 py-2.5">Use</div>
              <div className="px-2.5 py-2.5">Action Trigger</div>
            </div>
            {block.trackingRows.map((row, i) => (
              <div
                key={`${block.heading}-${row.metric}-${i}`}
                className="grid grid-cols-[1fr_0.8fr_1.25fr_1.25fr] border-t border-[#103b2c]/10 text-[9.5px] leading-[1.45] text-[#13201d]/80"
                style={{ background: i % 2 === 0 ? "#ffffff" : "rgba(125,211,167,0.06)" }}
              >
                <div className="px-2.5 py-2.5 font-serif text-[11px] italic font-semibold text-[#0d3327]">
                  {row.metric}
                </div>
                <div className="px-2.5 py-2.5">{row.frequency}</div>
                <div className="px-2.5 py-2.5">{row.targetUse}</div>
                <div className="px-2.5 py-2.5">{row.actionTrigger}</div>
              </div>
            ))}
          </div>
        )}
        {block.links && (
          <ul className="mt-2.5 grid gap-1">
            {block.links.map((link) => (
              <li
                key={link.href}
                className="flex items-baseline justify-between gap-3 border-b border-dashed border-[#103b2c]/15 pb-1 text-[10.5px] leading-[1.45]"
              >
                <span className="font-serif italic text-[#0d3327]">{link.label}</span>
                <a
                  href={link.href}
                  rel="noreferrer"
                  target="_blank"
                  className="shrink-0 text-[9px] font-black uppercase tracking-[0.22em] text-[#0f6a52] hover:underline"
                >
                  Get it here →
                </a>
              </li>
            ))}
          </ul>
        )}
        {block.mapRows && (
          <div className="mt-3 overflow-hidden rounded-[0.12in] border border-[#103b2c]/15 bg-white">
            <div className="grid grid-cols-[1.05fr_1.55fr_1.05fr_1.4fr] bg-[#0d3327] text-[8px] font-black uppercase tracking-[0.16em] text-[#f1e9d4]">
              <div className="px-2.5 py-2.5">Compound &amp; Role</div>
              <div className="px-2.5 py-2.5">Fit</div>
              <div className="px-2.5 py-2.5">Schedule</div>
              <div className="px-2.5 py-2.5">Evidence</div>
            </div>
            {block.mapRows.map((row, i) => (
              <div
                key={`${row.compound}-${i}`}
                className="grid grid-cols-[1.05fr_1.55fr_1.05fr_1.4fr] border-t border-[#103b2c]/10 text-[9.5px] leading-[1.4] text-[#13201d]/80"
                style={{ background: i % 2 === 0 ? "#ffffff" : "rgba(125,211,167,0.06)" }}
              >
                <div className="px-2.5 py-2.5">
                  <p className="font-serif text-[11.5px] italic font-semibold text-[#0d3327]">{row.compound}</p>
                  <p className="mt-0.5 text-[8.5px] leading-[1.4] text-[#13201d]/60">{row.role}</p>
                </div>
                <div className="px-2.5 py-2.5">{row.fit}</div>
                <div className="px-2.5 py-2.5 font-semibold text-[#0d3327]">{row.schedule}</div>
                <div className="px-2.5 py-2.5 text-[8.5px]">{row.evidence}</div>
              </div>
            ))}
          </div>
        )}
        {block.pullQuote && (
          <div className="mt-3 border-l-2 border-[#0f6a52] bg-white/60 py-1.5 pl-3">
            <p className="font-serif text-[12px] italic leading-[1.55] text-[#0d3327]">
              &ldquo;{block.pullQuote}&rdquo;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Page({
  page,
  index,
  total,
  productTitle,
}: {
  page: PageSpec;
  index: number;
  total: number;
  productTitle: string;
}) {
  const folio = toRoman(index + 1);
  const accents = ["#0f6a52", "#7dd3a7", "#103b2c"];

  return (
    <section className="pdf-sheet relative mx-auto flex min-h-[11in] w-[8.5in] max-w-full flex-col overflow-hidden bg-[#fbfaf7] text-[#13201d] shadow-[0_24px_90px_-58px_rgba(16,59,44,0.75)] print:mx-0 print:min-h-[10in] print:w-auto print:max-w-none print:break-after-page print:shadow-none">
      {/* paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4'/><feColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.23 0 0 0 0 0.17 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.18'/></svg>\")",
          opacity: 0.5,
        }}
      />

      {/* oversized faded folio numeral */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[0.5in] -bottom-[0.6in] select-none leading-none text-[#103b2c]/[0.05]"
        style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: "14in" }}
      >
        {folio}
      </div>

      {/* top band */}
      <div className="relative flex items-center justify-between border-b border-[#103b2c]/15 px-[0.55in] pt-[0.45in] pb-3">
        <div className="flex items-center gap-2.5">
          <Monogram size={22} tone="forest" />
          <p className="font-serif text-[11px] italic text-[#0d3327]">PeptidePros</p>
          <span className="h-3 w-px bg-[#103b2c]/30" />
          <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#0f6a52]">{page.eyebrow}</p>
        </div>
        <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#103b2c]/55">
          {productTitle}
        </p>
      </div>

      {/* body with side rail */}
      <div className="relative flex flex-1 gap-[0.3in] px-[0.55in] py-[0.35in]">
        {/* side rail */}
        <div className="relative flex w-[0.35in] flex-col items-center">
          <p
            className="mt-2 select-none whitespace-nowrap text-[8px] font-black uppercase tracking-[0.42em] text-[#0f6a52]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Folio {folio} &middot; {page.eyebrow}
          </p>
          <span className="mt-3 h-full w-px bg-gradient-to-b from-[#103b2c]/30 via-[#103b2c]/10 to-transparent" />
        </div>

        <div className="relative flex-1">
          <header className="pb-4">
            <div className="flex items-baseline justify-between gap-5">
              <h2
                className="text-[#0d3327]"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "38px",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                {page.title.split(" ").map((word, i, arr) => (
                  <span key={i} className={i === 0 ? "italic" : ""}>
                    {word}
                    {i < arr.length - 1 ? " " : ""}
                  </span>
                ))}
              </h2>
              <div className="shrink-0 text-right">
                <p className="font-serif text-[26px] italic leading-none text-[#0f6a52]">{folio}</p>
                <p className="mt-1 text-[7.5px] font-black uppercase tracking-[0.28em] text-[#103b2c]/55">
                  of {toRoman(total)}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <OrnamentalRule />
            </div>
            <p
              className="mt-3 max-w-[5.2in] font-serif text-[13px] italic leading-[1.55] text-[#13201d]/75"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {page.deck}
            </p>
          </header>

          <div className="pdf-body mt-3 grid gap-2.5">
            {page.blocks.map((block, i) => (
              <ContentBlock key={`${block.heading}-${i}`} block={block} accent={accents[i % accents.length]} />
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="relative flex items-center justify-between border-t border-[#103b2c]/15 px-[0.55in] pb-[0.4in] pt-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#103b2c]/55">
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-[#0f6a52]" />
          PeptidePros &middot; Protocol Compendium
        </span>
        <span className="font-serif text-[10px] normal-case italic tracking-normal text-[#103b2c]/65">
          Folio {folio} of {toRoman(total)}
        </span>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </footer>
    </section>
  );
}

export default async function PdfExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProtocolPdfProduct(slug);

  if (!product) {
    notFound();
  }

  const content = getProtocolPdfContent(product);
  const pages = buildPages(product, content);

  return (
    <main className="min-h-screen bg-[#ece7da] px-4 py-5 text-[#13201d] print:bg-white print:px-0 print:py-0">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap"
      />
      <style>{`
        .font-serif, .pdf-sheet h1, .pdf-sheet h2 { font-family: 'Fraunces', Georgia, serif; }
        .pdf-sheet { box-sizing: border-box; }
        @media print {
          @page { size: letter; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
          .no-print { display: none !important; }
          .pdf-proof { gap: 0 !important; }
          .pdf-sheet {
            width: 8.5in !important;
            height: 11in !important;
            min-height: 0 !important;
            max-height: 11in !important;
            margin: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            overflow: hidden !important;
            box-shadow: none !important;
            page-break-after: always;
            break-after: page;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .pdf-sheet:last-child { page-break-after: auto; break-after: auto; }
          .pdf-cover, .pdf-sheet, .pdf-sheet * {
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="no-print sticky top-0 z-20 mx-auto mb-5 flex max-w-[8.5in] flex-col gap-3 rounded-2xl border border-[#103b2c]/10 bg-white/95 p-3 shadow-[0_18px_70px_-50px_rgba(16,59,44,0.7)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" render={<Link href="/pdfs" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#103b2c]/65">
          <CalendarDays className="h-4 w-4 text-[#0f6a52]" />
          {pages.length} letter pages - export-ready proof
        </div>
        <PrintButton />
      </div>

      <div className="no-print mx-auto mb-5 max-w-[8.5in] rounded-2xl border border-[#103b2c]/10 bg-white p-4 text-sm text-[#103b2c]/70">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6a52]" />
          <p>
            This preview is laid out as letter-sized PDF pages. Use <strong>Export PDF</strong>,
            then choose Save as PDF in the browser print dialog to create the actual file.
          </p>
        </div>
      </div>

      <article className="pdf-proof grid gap-8 print:block">
        <CoverPage product={product} content={content} total={pages.length + 1} />
        {pages.map((page, index) => (
          <Page
            key={`${page.eyebrow}-${page.title}-${index}`}
            page={page}
            index={index + 1}
            total={pages.length + 1}
            productTitle={content.title}
          />
        ))}
      </article>
    </main>
  );
}
