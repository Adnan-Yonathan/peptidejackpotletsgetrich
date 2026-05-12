"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProtocolPdfProduct } from "@/data/protocol-pdfs";

interface PdfPaywallProps {
  primaryProtocol: ProtocolPdfProduct | undefined;
  addonProtocol?: ProtocolPdfProduct;
  protocolName: string;
}

export function PdfPaywall({
  primaryProtocol,
  addonProtocol: _addonProtocol,
  protocolName,
}: PdfPaywallProps) {
  const checkoutHref = primaryProtocol ? `/checkout/${primaryProtocol.slug}` : undefined;
  const priceLabel = primaryProtocol?.priceLabel ?? "$49";

  return (
    <div className="flex flex-col gap-5">
      <BonusReceipt protocolName={protocolName} />
      <BigPriceBlock priceLabel={priceLabel} checkoutHref={checkoutHref} />
      <ComparisonTable priceLabel={priceLabel} />
      <PaywallFAQ />
      <FinalCta
        checkoutHref={checkoutHref}
        protocolName={protocolName}
        priceLabel={priceLabel}
      />
      <p className="text-center text-[11.5px] leading-[1.55] text-[#103b2c]/55">
        PeptidePros is an educational platform. Not medical advice. Not for diagnosing, treating,
        curing, or preventing disease.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Bonus stack — receipt / apothecary price-sheet layout           */
/* ────────────────────────────────────────────────────────────── */

interface BonusRow {
  tag: string;
  title: string;
  desc: string;
  value: number; // dollar value, used for totals math
  free?: boolean;
}

function BonusReceipt({ protocolName }: { protocolName: string }) {
  const rows: BonusRow[] = [
    {
      tag: "MAIN",
      title: `${protocolName}`,
      desc: "Full PDF — 12-week, 3-phase plan with compounds, doses, scheduling, and taper logic.",
      value: 200,
    },
    {
      tag: "BONUS 01",
      title: "Circadian Optimization Plan",
      desc: "Light, meal-timing, and temperature protocol. Pairs with your stack.",
      value: 40,
      free: true,
    },
    {
      tag: "BONUS 02",
      title: "Vendor Watchlist (live updates)",
      desc: "Compliance-checked sources. Emailed when a vendor's status changes.",
      value: 60,
      free: true,
    },
    {
      tag: "BONUS 03",
      title: "Interaction Checker access",
      desc: "Web tool — paste any compound, see conflicts with your protocol.",
      value: 45,
      free: true,
    },
    {
      tag: "BONUS 04",
      title: "12-week Tracking Workbook",
      desc: "Lab markers, sleep-stage targets, weekly check-in templates.",
      value: 25,
      free: true,
    },
  ];

  const totalValue = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <section
      aria-labelledby="bonus-stack-heading"
      className="overflow-hidden rounded-[18px] border border-[#103b2c]/12 bg-[#fbfaf7] shadow-[0_18px_60px_-46px_rgba(16,59,44,0.55)]"
    >
      {/* Header */}
      <header className="relative border-b border-dashed border-[#103b2c]/18 bg-white px-5 py-5 md:px-7 md:py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#0f6a52]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.3} />
            Limited-release bonuses unlocked
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[#103b2c]/40 sm:inline">
            Receipt &middot; today only
          </span>
        </div>
        <h2
          id="bonus-stack-heading"
          className="mt-2 text-[1.6rem] font-extrabold tracking-[-0.025em] text-black md:text-[1.85rem]"
        >
          Everything you get today
        </h2>
        <p className="mt-1.5 max-w-[44ch] text-[13px] leading-[1.55] text-[#103b2c]/65">
          Five items in your unlock — one main PDF and four limited-release bonuses, priced
          line-by-line below.
        </p>
      </header>

      {/* Rows */}
      <ul className="divide-y divide-dashed divide-[#103b2c]/15">
        {rows.map((row, i) => (
          <li
            key={row.title}
            className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 gap-y-1 px-5 py-4 md:px-7 md:py-4"
          >
            {/* Tag chip */}
            <span
              className={`row-span-2 inline-flex h-[24px] items-center self-start rounded-[6px] px-2.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.06em] ${
                row.free
                  ? "bg-[#e7f4ee] text-[#0f6a52] ring-1 ring-inset ring-[#0f6a52]/15"
                  : "bg-[#103b2c] text-[#f1e9d4]"
              }`}
            >
              <span className="opacity-55">{String(i + 1).padStart(2, "0")}</span>
              <span className="mx-1.5 h-3 w-px bg-current opacity-30" />
              {row.tag}
            </span>

            {/* Title + dot leader */}
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="truncate text-[14.5px] font-bold tracking-tight text-[#0d3327]">
                {row.title}
              </span>
              <span
                aria-hidden
                className="hidden flex-1 translate-y-[-3px] self-end border-b border-dotted border-[#103b2c]/30 md:block"
              />
            </div>

            {/* Value */}
            <div className="shrink-0 text-right tabular-nums">
              {row.free ? (
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-[12.5px] text-[#103b2c]/45 line-through">${row.value}</span>
                  <span className="text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#0f6a52]">
                    FREE
                  </span>
                </div>
              ) : (
                <span className="text-[15px] font-extrabold text-[#0d3327]">${row.value}</span>
              )}
            </div>

            {/* Desc row */}
            <p className="col-start-2 -mt-0.5 text-[12px] leading-[1.5] text-[#103b2c]/60">
              {row.desc}
            </p>
          </li>
        ))}
      </ul>

      {/* Totals — double rule + total value only */}
      <div className="bg-white px-5 pb-5 pt-4 md:px-7 md:pb-6 md:pt-5">
        <div className="mb-3 flex flex-col gap-[2px]">
          <span className="h-px w-full bg-[#103b2c]/30" />
          <span className="h-px w-full bg-[#103b2c]/30" />
        </div>

        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0d3327]">
            Total value
          </span>
          <span className="font-mono text-[28px] font-extrabold tracking-[-0.02em] tabular-nums text-[#0d3327]">
            ${totalValue}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Big ecom-style price block (countdown removed — banner handles) */
/* ────────────────────────────────────────────────────────────── */

function BigPriceBlock({
  priceLabel,
  checkoutHref,
}: {
  priceLabel: string;
  checkoutHref: string | undefined;
}) {
  return (
    <section className="overflow-hidden rounded-[18px] bg-[#0f6a52] text-white shadow-[0_24px_64px_-24px_rgba(15,106,82,0.5)]">
      <div className="px-5 py-6 md:px-8 md:py-7">
        <div className="grid items-center gap-6 md:grid-cols-[1.15fr_1fr] md:gap-7">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Total value &middot; $370
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="text-[22px] font-semibold leading-none text-white/55 line-through">
                $370
              </span>
              <span className="text-[64px] font-extrabold leading-none tracking-[-0.05em] md:text-[72px]">
                {priceLabel}
              </span>
              <span className="inline-flex h-[24px] items-center rounded-full bg-[#f0c95a] px-2.5 text-[11.5px] font-bold uppercase tracking-[0.04em] text-[#5a4108]">
                Save 86%
              </span>
            </div>
            <p className="mt-3 max-w-[34ch] text-[13px] leading-[1.55] text-white/85">
              Limited-release price &mdash; held for the next 100 protocols (84 claimed). Same compound research a clinician charges $300+ to deliver, plus 4 bonuses.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="h-[60px] w-full rounded-[12px] bg-white text-[15.5px] font-extrabold tracking-tight text-[#0f6a52] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.3)] hover:bg-white/95"
              disabled={!checkoutHref}
              {...(checkoutHref ? { render: <Link href={checkoutHref} /> } : {})}
            >
              {checkoutHref ? `Unlock my protocol — ${priceLabel}` : "Protocol coming soon"}
              {checkoutHref && <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.6} />}
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-white/70">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" strokeWidth={2.4} />
                Stripe secure
              </span>
              <span>&middot;</span>
              <span>Instant PDF</span>
              <span>&middot;</span>
              <span>All sales final</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Comparison table                                                */
/* ────────────────────────────────────────────────────────────── */

function ComparisonTable({ priceLabel }: { priceLabel: string }) {
  const headers = ["", "PeptidePros", "Functional med consult", "DIY research"];
  const rows: string[][] = [
    ["Cost", priceLabel, "$300–$500", "Free · 8+ hrs"],
    ["Personalized to your quiz", "✓", "✓", "—"],
    ["Evidence tier grading", "A–D, per compound", "Varies", "You research"],
    ["Vendor compliance check", "✓ live updates", "—", "—"],
    ["Updates as evidence shifts", "Free, forever", "Next visit ($)", "Re-do yourself"],
    ["Turnaround", "30 seconds", "1–3 weeks", "Days–weeks"],
  ];
  return (
    <section className="flex flex-col gap-3">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
          Why {priceLabel}
        </p>
        <h2 className="mt-1.5 text-[1.4rem] font-bold tracking-[-0.02em] text-black md:text-[1.55rem]">
          Compared to your alternatives
        </h2>
      </div>
      <div className="overflow-hidden rounded-[14px] border border-[#103b2c]/10 bg-white">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr] border-b border-[#103b2c]/10 md:grid">
          {headers.map((h, i) => (
            <div
              key={i}
              className={`px-4 py-3 text-[12px] font-bold ${
                i === 0
                  ? "text-left text-[#103b2c]"
                  : i === 1
                    ? "text-center bg-[#e7f4ee] text-[#0f6a52]"
                    : "text-center text-[#103b2c]"
              }`}
            >
              {h || " "}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-[#103b2c]/10 md:hidden">
          {[" ", "PeptidePros", "Alternatives"].map((h, i) => (
            <div
              key={i}
              className={`px-3 py-2 text-[11px] font-bold ${
                i === 1 ? "bg-[#e7f4ee] text-center text-[#0f6a52]" : "text-[#103b2c] text-center"
              } ${i === 0 ? "text-left" : ""}`}
            >
              {h}
            </div>
          ))}
        </div>
        {rows.map((row, ri) => (
          <div key={ri}>
            <div
              className={`hidden grid-cols-[1.4fr_1fr_1fr_1fr] text-[12.5px] md:grid ${
                ri === 0 ? "" : "border-t border-[#103b2c]/10"
              }`}
            >
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  className={`px-4 py-2.5 ${
                    ci === 0
                      ? "text-left font-semibold text-[#103b2c]"
                      : ci === 1
                        ? "bg-[#e7f4ee] text-center font-semibold text-[#0f6a52]"
                        : "text-center text-[#103b2c]/80"
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>
            <div
              className={`grid grid-cols-[1.2fr_1fr_1fr] text-[12px] md:hidden ${
                ri === 0 ? "" : "border-t border-[#103b2c]/10"
              }`}
            >
              <div className="px-3 py-2 text-left font-semibold text-[#103b2c]">{row[0]}</div>
              <div className="bg-[#e7f4ee] px-3 py-2 text-center font-semibold text-[#0f6a52]">
                {row[1]}
              </div>
              <div className="px-3 py-2 text-center text-[#103b2c]/75">
                {row[2]}
                {row[3] ? (
                  <span className="block text-[10.5px] text-[#103b2c]/55">{row[3]}</span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* FAQ                                                              */
/* ────────────────────────────────────────────────────────────── */

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Is this medical advice?",
    a: "No. PeptidePros is an education and research tool. We don't prescribe, sell peptides, or diagnose conditions. Your protocol is a research framework — discuss it with a licensed clinician before starting.",
  },
  {
    q: "Why $49 instead of a $400 functional medicine consult?",
    a: "We're a software platform, not a one-on-one practice. Your protocol is generated from the same evidence base — peer-reviewed studies graded A–D — that a good clinician would use. We just made it queryable. We are not a replacement for clinician oversight; we are a starting point.",
  },
  {
    q: "All sales are final — what protection do I have?",
    a: "Every protocol comes with lifetime access and free updates when the underlying evidence changes. You also get one free re-quiz if your goals shift in the next 12 months. You're paying for a living document, not a one-time PDF.",
  },
  {
    q: "Do I need a prescription?",
    a: "Peptide regulation varies by jurisdiction and compound. We flag every compound in your protocol with its current regulatory status — and we link only to vendors that operate within their stated frameworks. We never tell you to obtain anything illegally.",
  },
  {
    q: "How is the protocol personalized?",
    a: "Your quiz answers map across dozens of compatibility checks: goal, demographics, comorbidities, prior experience, time horizon, and risk tolerance. The output is a phased plan with dosing, scheduling, lab markers to watch, and a taper.",
  },
  {
    q: "What if the science changes?",
    a: "It will. Your protocol versions over time — we email you when a Tier B compound moves to Tier A (or to C), when a vendor's compliance status changes, or when a new study moves a dose recommendation. Free, forever.",
  },
];

function PaywallFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[1.4rem] font-bold tracking-[-0.02em] text-black md:text-[1.55rem]">
        Last objections, handled
      </h2>
      <ul className="flex flex-col gap-2">
        {FAQ_ITEMS.map((it, i) => {
          const isOpen = open === i;
          return (
            <li
              key={i}
              className="overflow-hidden rounded-[12px] border border-[#103b2c]/10 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-[14px] font-semibold text-[#103b2c]">{it.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#103b2c]/55 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-[13px] leading-[1.6] text-[#103b2c]/72">
                  {it.a}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Final dark CTA                                                  */
/* ────────────────────────────────────────────────────────────── */

function FinalCta({
  checkoutHref,
  protocolName,
  priceLabel,
}: {
  checkoutHref: string | undefined;
  protocolName: string;
  priceLabel: string;
}) {
  return (
    <section className="rounded-[18px] bg-[#103b2c] px-6 py-7 text-center text-white md:px-8 md:py-9">
      <h2 className="text-[1.55rem] font-extrabold tracking-[-0.025em] md:text-[1.85rem]">
        Your protocol is one click away.
      </h2>
      <p className="mt-2 text-[13.5px] text-white/70">
        {priceLabel} &middot; lifetime access &middot; 4 bonuses unlocked at checkout
      </p>
      <div className="mt-5 flex justify-center">
        <Button
          size="lg"
          className="h-12 rounded-[10px] bg-white px-6 text-[14.5px] font-bold text-[#103b2c] hover:bg-white/95"
          disabled={!checkoutHref}
          {...(checkoutHref ? { render: <Link href={checkoutHref} /> } : {})}
        >
          {checkoutHref ? `Unlock my ${protocolName}` : "Protocol coming soon"}
          {checkoutHref && <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.4} />}
        </Button>
      </div>
    </section>
  );
}
