import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Globe, ShieldCheck, Truck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AffiliateLink } from "@/components/shared/AffiliateLink";
import { EditorialTrustBlock } from "@/components/seo/EditorialTrustBlock";
import { SourceList } from "@/components/seo/SourceList";
import { VendorTrustRationale } from "@/components/vendors/VendorTrustRationale";
import { getPeptideBySlug } from "@/data/peptides";
import { getAffiliateUrlForVendor } from "@/data/affiliate-links";
import { getActiveVendors, type VendorData } from "@/data/vendors";
import {
  getVendorListingsForPeptide,
  getVendorListingsForVendor,
  type ResolvedVendorListing,
} from "@/data/vendor-listings";
import {
  getDecisionNote,
  getDocumentationStrength,
  getListingMatchStatus,
  getPriceVisibility,
} from "@/lib/compare-vendors";
import { getDefaultVendorReview } from "@/lib/editorial";
import { buildOutboundVendorHref } from "@/lib/outbound-vendors";
import { buildSeoMetadata } from "@/lib/seo-metadata";
import landingHeroImage from "../../../images/idktoomany.png";

const title = "Best Peptide Vendors and Trust Rankings";
const description =
  "Independent peptide vendor rankings based on trust signals, shipping clarity, documentation strength, COA access, and product-level coverage.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/vendors" },
  ...buildSeoMetadata({
    title,
    description,
    path: "/vendors",
  }),
};

type ComparedVendor = {
  vendor: VendorData;
  listing?: ResolvedVendorListing;
  listings: ResolvedVendorListing[];
  rankScore: number;
  rankLabel: string;
  headline: string;
  bestFor: string[];
  strengths: string[];
  considerations: string[];
};

const DOC_RANK = { basic: 1, solid: 2, strong: 3 } as const;
const PRICE_RANK = { unclear: 0, partial: 1, visible: 2 } as const;
const UPDATED_AT = "May 2026";

function getShippingLeadDays(value?: string) {
  if (!value) return null;
  const rangeMatch = value.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return Number(rangeMatch[1]);
  }

  const singleMatch = value.match(/(\d+)\s*(?:business )?day/);
  return singleMatch ? Number(singleMatch[1]) : null;
}

function getVendorHeadline(item: ComparedVendor) {
  if (item.listing) {
    const docs = getDocumentationStrength(item.listing);
    const match = getListingMatchStatus(item.listing);

    if (docs === "strong" && match === "exact") return "Most trusted listing";
    if (PRICE_RANK[getPriceVisibility(item.listing)] >= PRICE_RANK.visible) return "Best visible pricing";
    if (match !== "exact") return "Needs closer verification";
    return "Strong peptide-specific option";
  }

  if ((item.vendor.trustpilotReviewCount ?? 0) >= 75) return "Most established trust signal";
  const shippingLeadDays = getShippingLeadDays(item.vendor.shippingTimeframe);
  if (shippingLeadDays !== null && shippingLeadDays <= 2) return "Fast shipping profile";
  return "Vendor profile worth checking";
}

function getCoverageSummary(item: ComparedVendor) {
  if (item.listings.length > 0) {
    return `${item.listings.length}+ mapped listings`;
  }

  return `${item.vendor.peptideIds.length}+ tracked peptides`;
}

function getShippingSummary(item: ComparedVendor) {
  return item.vendor.shippingTimeframe ?? item.listing?.shippingRegions ?? "Verify on site";
}

function getRegionSummary(item: ComparedVendor) {
  return item.listing?.country ?? item.vendor.headquarters ?? "Global";
}

function getRatingText(vendor: VendorData) {
  if (!vendor.trustpilotRating) return "No Trustpilot data";
  return typeof vendor.trustpilotReviewCount === "number"
    ? `${vendor.trustpilotRating}/5 · ${vendor.trustpilotReviewCount} reviews`
    : `${vendor.trustpilotRating}/5`;
}

function getMethodologyPoints(peptideName?: string) {
  return [
    {
      eyebrow: "Documentation",
      body: peptideName
        ? `${peptideName} listing quality, COA access, and test visibility.`
        : "COA access, listing depth, and testing visibility.",
    },
    {
      eyebrow: "Reputation",
      body: "Trustpilot rating and review depth where available.",
    },
    {
      eyebrow: "Operations",
      body: "Shipping windows, order handling, and regional coverage.",
    },
    {
      eyebrow: "Confidence",
      body: "Exact product-page listings beat vague vendor-level routing.",
    },
  ];
}

function buildComparedVendors(vendors: VendorData[], listings: ResolvedVendorListing[], peptideSlug?: string): ComparedVendor[] {
  const items = vendors.map((vendor) => {
    const vendorListings = listings.filter((listing) => listing.vendorId === vendor.id);
    const listing = vendorListings[0];
    const trustRating = Number(vendor.trustpilotRating ?? 0);
    const trustReviews = vendor.trustpilotReviewCount ?? 0;
    const docsScore = listing ? DOC_RANK[getDocumentationStrength(listing)] : vendor.coaAccessMode === "public_pdf" ? 2 : 0;
    const priceScore = listing ? PRICE_RANK[getPriceVisibility(listing)] : 0;
    const matchPenalty = listing && getListingMatchStatus(listing) !== "exact" ? -20 : 0;
    const shippingBonus = (() => {
      const leadDays = getShippingLeadDays(listing?.shippingRegions ?? vendor.shippingTimeframe);
      if (leadDays === null) return 0;
      if (leadDays <= 2) return 20;
      if (leadDays <= 5) return 10;
      return 0;
    })();

    const bestFor = listing
      ? [
          peptideSlug ? `${listing.peptide?.name ?? peptideSlug} buyers` : "Product-specific buyers",
          listing.country === "US" ? "U.S.-based orders" : "International shoppers",
          "Direct product-page verification",
        ]
      : [
          "Vendor-level review",
          vendor.headquarters ?? "Global buyers",
          vendor.trustpilotRating ? "Trustpilot-led comparison" : "Manual due diligence",
        ];

    const strengths = [
      vendor.trustpilotRating
        ? `Trustpilot ${vendor.trustpilotRating}/5${trustReviews ? ` · ${trustReviews} reviews` : ""}`
        : "No Trustpilot data stored",
      listing ? `Docs: ${getDocumentationStrength(listing)}` : `COA access: ${vendor.coaAccessMode.replace(/_/g, " ")}`,
      listing ? `Shipping: ${listing.shippingRegions}` : `Shipping: ${vendor.shippingTimeframe ?? "verify on site"}`,
      listing ? listing.qcMethodsListed : vendor.qcMethods.join(", ") || "QC specifics not listed",
    ];

    const considerations = [
      listing ? getDecisionNote(listing) : "Peptide-specific listing not imported yet for every compound.",
      vendor.shippingNotes,
    ];

    return {
      vendor,
      listing,
      listings: vendorListings.length > 0 ? vendorListings : getVendorListingsForVendor(vendor.id),
      rankScore: trustRating * 20 + trustReviews * 0.3 + docsScore * 12 + priceScore * 8 + shippingBonus + matchPenalty,
      rankLabel: "",
      headline: getVendorHeadline({
        vendor,
        listing,
        listings: vendorListings,
        rankScore: 0,
        rankLabel: "",
        headline: "",
        bestFor: [],
        strengths: [],
        considerations: [],
      }),
      bestFor,
      strengths,
      considerations,
    };
  });

  const sorted = items.sort((a, b) => b.rankScore - a.rankScore);
  const fastestVendorId =
    [...sorted].sort(
      (a, b) =>
        (getShippingLeadDays(a.listing?.shippingRegions ?? a.vendor.shippingTimeframe) ?? Infinity) -
        (getShippingLeadDays(b.listing?.shippingRegions ?? b.vendor.shippingTimeframe) ?? Infinity)
    )[0]?.vendor.id;
  const strongestDocsVendorId =
    [...sorted].sort((a, b) => {
      const aScore = a.listing ? DOC_RANK[getDocumentationStrength(a.listing)] : a.vendor.coaAccessMode === "public_pdf" ? 2 : 0;
      const bScore = b.listing ? DOC_RANK[getDocumentationStrength(b.listing)] : b.vendor.coaAccessMode === "public_pdf" ? 2 : 0;
      return bScore - aScore;
    })[0]?.vendor.id;

  return sorted.map((item, index) => ({
    ...item,
    rankLabel:
      index === 0
        ? "Best overall"
        : item.vendor.id === strongestDocsVendorId
          ? "Best documentation"
          : item.vendor.id === fastestVendorId
            ? "Fastest shipping"
            : "Worth considering",
  }));
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ peptide?: string | string[] }>;
}) {
  const { peptide: peptideParam } = await searchParams;
  const peptideSlug = Array.isArray(peptideParam) ? peptideParam[0] : peptideParam;
  const peptide = peptideSlug ? getPeptideBySlug(peptideSlug) : undefined;
  const peptideListings = peptide ? getVendorListingsForPeptide(peptide.id) : [];
  const vendors = peptide
    ? peptideListings.map((listing) => listing.vendor).filter((vendor): vendor is VendorData => Boolean(vendor))
    : getActiveVendors();
  const comparedVendors = buildComparedVendors(vendors, peptideListings, peptide?.slug);
  const methodologyPoints = getMethodologyPoints(peptide?.name);
  const editorialReview = getDefaultVendorReview();
  const bestOverall = comparedVendors[0];
  const bestDocumentation = [...comparedVendors].sort((a, b) => {
    const aScore = a.listing ? DOC_RANK[getDocumentationStrength(a.listing)] : a.vendor.coaAccessMode === "public_pdf" ? 2 : 0;
    const bScore = b.listing ? DOC_RANK[getDocumentationStrength(b.listing)] : b.vendor.coaAccessMode === "public_pdf" ? 2 : 0;
    return bScore - aScore;
  })[0];
  const bestUs = comparedVendors.find((item) =>
    `${item.listing?.country ?? ""} ${item.vendor.headquarters ?? ""} ${item.vendor.shippingRegions ?? ""}`.includes("US") ||
    `${item.vendor.headquarters ?? ""} ${item.vendor.shippingRegions ?? ""}`.includes("United States")
  );
  const bestInternational = comparedVendors.find((item) => item.vendor.id !== bestUs?.vendor.id) ?? comparedVendors[1];
  const bestByNeed = [
    bestOverall && { label: "Best overall", item: bestOverall },
    bestDocumentation && { label: "Best documentation", item: bestDocumentation },
    bestUs && { label: "Best U.S. fit", item: bestUs },
    bestInternational && { label: "Best international fit", item: bestInternational },
  ].filter((entry): entry is { label: string; item: ComparedVendor } => Boolean(entry));

  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7]">
        {/* HERO */}
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-6 pb-5 md:pt-8 md:pb-6">
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] md:gap-8">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
                  <span className="h-px w-6 bg-[#103b2c]/40" />
                  Vendors &middot; Updated {UPDATED_AT}
                </p>
                <h1 className="max-w-[620px] font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[22px] sm:text-[28px] md:text-[32px]">
                  {peptide ? "Top-rated " : "The peptide vendors "}
                  <span className="relative inline-block italic text-[#0f6a52]">
                    <span className="relative z-10">
                      {peptide ? peptide.name : "actually worth"}
                    </span>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-1 left-0 h-[8px] w-full"
                      viewBox="0 0 120 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2,7 C25,3 55,8 80,5 C98,3 110,6 118,5"
                        stroke="#0f6a52"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{" "}
                  {peptide ? "providers." : "checking out."}
                </h1>
                <p className="mt-4 max-w-[480px] text-[16px] leading-[1.6] text-[#103b2c]/65">
                  Independent rankings based on documentation quality, trust signals, shipping clarity,
                  and real product coverage. Strongest options first.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[340px] md:mx-0">
                <Image
                  src={landingHeroImage}
                  alt="Doctor reviewing peptide vendor options"
                  priority
                  sizes="(min-width: 768px) 340px, 70vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#103b2c]/8 bg-[#fbfaf7] py-5">
          <div className="container mx-auto max-w-6xl px-4">
            <EditorialTrustBlock review={editorialReview} />
          </div>
        </section>

        {bestByNeed.length > 0 && (
          <section className="border-b border-[#103b2c]/8 bg-[#f4f1ea] py-10 md:py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f6a52]">
                Best by buying need
              </p>
              <div className="grid gap-px bg-[#103b2c]/10 sm:grid-cols-2 lg:grid-cols-4">
                {bestByNeed.map(({ label, item }) => (
                  <Link
                    key={`${label}-${item.vendor.id}`}
                    href={`/vendors/${item.vendor.slug}`}
                    className="group bg-[#f4f1ea] p-5 transition-colors hover:bg-white"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f6a52]">
                      {label}
                    </p>
                    <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-[#103b2c]">
                      {item.vendor.name}
                    </h2>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#103b2c]/65">
                      {item.headline}. {getCoverageSummary(item)}.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] group-hover:text-[#0f6a52]">
                      Review profile
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* VENDOR LIST */}
        <section className="bg-[#fbfaf7] py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            {comparedVendors.length === 0 ? (
              <div className="border-y border-[#103b2c]/15 px-6 py-16 text-center">
                <p className="text-[15px] font-semibold text-[#103b2c]">
                  No ranked vendors available yet.
                </p>
                <p className="mx-auto mt-2 max-w-[400px] text-[13.5px] leading-[1.6] text-[#103b2c]/60">
                  Review the vendor guide first or return to the peptide page.
                </p>
              </div>
            ) : (
              <ol className="border-t border-[#103b2c]/15">
                {comparedVendors.map((item, index) => {
                  const vendorVisitHref =
                    peptide && item.listing
                      ? buildOutboundVendorHref(item.vendor.slug, peptide.slug, "vendor-compare")
                      : getAffiliateUrlForVendor(item.vendor.id) ?? item.vendor.websiteUrl;
                  const ctaLabel =
                    peptide && item.listing ? `Visit ${item.vendor.name}` : `Visit ${item.vendor.name}`;
                  const isInternalOutbound = vendorVisitHref.startsWith("/");

                  return (
                    <li
                      key={item.vendor.id}
                      className="border-b border-[#103b2c]/15 py-8 md:py-10"
                    >
                      <div className="grid gap-8 md:grid-cols-[80px_minmax(0,1fr)_minmax(0,260px)] md:gap-10">
                        {/* Rank */}
                        <div>
                          <span className="font-mono text-[14px] font-medium tabular-nums text-[#103b2c]/40 md:text-[16px]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f6a52]">
                            {item.rankLabel}
                          </p>
                        </div>

                        {/* Body */}
                        <div>
                          <h2 className="font-extrabold leading-[1.05] tracking-[-0.02em] text-[#103b2c] text-[28px] md:text-[34px]">
                            {item.vendor.name}
                          </h2>
                          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#103b2c]/55">
                            {item.headline}
                          </p>
                          <p className="mt-4 max-w-[560px] text-[14.5px] leading-[1.6] text-[#103b2c]/70">
                            {item.vendor.description}
                          </p>

                          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                            {item.strengths.slice(0, 4).map((point) => (
                              <li
                                key={point}
                                className="flex items-start gap-2 text-[13px] leading-[1.5] text-[#103b2c]/72"
                              >
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0f6a52]" strokeWidth={2.5} />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Meta + CTA */}
                        <div className="flex flex-col">
                          <div className="border-t border-[#103b2c]/10 pt-4 md:border-0 md:pt-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/45">
                              Trust signal
                            </p>
                            <p className="mt-1.5 text-[28px] font-extrabold tracking-[-0.02em] text-[#103b2c]">
                              {item.vendor.trustpilotRating ?? "—"}
                              {item.vendor.trustpilotRating && (
                                <span className="ml-1 text-[14px] font-semibold text-[#103b2c]/50">/5</span>
                              )}
                            </p>
                            <p className="mt-0.5 text-[12px] text-[#103b2c]/55">
                              {getRatingText(item.vendor)}
                            </p>
                          </div>

                          <dl className="mt-5 space-y-2.5 text-[12.5px] text-[#103b2c]/72">
                            <div className="flex items-start gap-2">
                              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0f6a52]" strokeWidth={2.5} />
                              <span>{getCoverageSummary(item)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0f6a52]" strokeWidth={2.5} />
                              <span>{getRegionSummary(item)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0f6a52]" strokeWidth={2.5} />
                              <span>{getShippingSummary(item)}</span>
                            </div>
                          </dl>

                          <div className="mt-6 grid gap-2">
                            {isInternalOutbound ? (
                              <Link
                                href={vendorVisitHref}
                                className="group inline-flex items-center justify-between gap-2 rounded-[10px] border border-[#103b2c] bg-[#103b2c] px-4 py-3.5 text-[13.5px] font-bold text-white shadow-[0_10px_24px_rgba(16,59,44,0.16)] transition-colors hover:bg-[#0c3226]"
                              >
                                {ctaLabel}
                                <ArrowRight
                                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                  strokeWidth={2.5}
                                />
                              </Link>
                            ) : (
                              <AffiliateLink
                                href={vendorVisitHref}
                                vendorId={item.vendor.id}
                                sourcePage="vendors"
                                className="group inline-flex items-center justify-between gap-2 rounded-[10px] border border-[#103b2c] bg-[#103b2c] px-4 py-3.5 text-[13.5px] font-bold text-white shadow-[0_10px_24px_rgba(16,59,44,0.16)] transition-colors hover:bg-[#0c3226]"
                              >
                                {ctaLabel}
                                <ExternalLink
                                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                  strokeWidth={2.5}
                                />
                              </AffiliateLink>
                            )}
                            <Link
                              href={`/vendors/${item.vendor.slug}`}
                              className="inline-flex items-center justify-center rounded-[10px] border border-[#103b2c]/20 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#103b2c] transition-colors hover:border-[#103b2c]/45 hover:bg-[#f4f1ea]"
                            >
                              Read review
                            </Link>
                          </div>
                          <div className="mt-3">
                            <VendorTrustRationale
                              points={[
                                item.listing
                                  ? `Product-level listing for ${item.listing.peptide?.name ?? peptide?.name ?? "this peptide"} is available.`
                                  : `${item.listings.length} mapped listing${item.listings.length === 1 ? "" : "s"} inform this profile.`,
                                item.considerations[0],
                              ]}
                              affiliateStatus={item.listing?.affiliateProgramStatus}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>

        {/* METHODOLOGY */}
        <section className="border-y border-[#103b2c]/8 bg-[#f4f1ea] py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[640px]">
                <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
                  <span className="h-px w-6 bg-[#103b2c]/40" />
                  Methodology
                </p>
                <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-black text-[32px] sm:text-[40px] md:text-[44px]">
                  How these rankings are{" "}
                  <span className="relative inline-block italic text-[#0f6a52]">
                    <span className="relative z-10">built</span>
                  </span>
                  .
                </h2>
              </div>
              <p className="max-w-[380px] text-[14px] leading-[1.6] text-[#103b2c]/65 md:text-right">
                No pay-for-placement. Rankings are driven by documentation quality, reputation data,
                operational clarity, and whether the vendor exposes a useful product-level path.
              </p>
            </div>

            <ol className="grid gap-px border-t border-b border-[#103b2c]/15 bg-[#103b2c]/15 sm:grid-cols-2">
              {methodologyPoints.map((point, idx) => (
                <li key={point.eyebrow} className="bg-[#f4f1ea] p-6 md:p-7">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0f6a52]">
                    {String(idx + 1).padStart(2, "0")} &middot; {point.eyebrow}
                  </p>
                  <p className="mt-3 text-[15px] leading-[1.55] text-[#103b2c]/75">{point.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <Link
                href="/guides/how-to-compare-peptide-vendors"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[6px] transition-colors hover:text-[#0f6a52]"
              >
                Read the vendor guide
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="mt-8">
              <SourceList sources={editorialReview.sources} />
            </div>
          </div>
        </section>

        {/* QUIZ CTA DARK BAND */}
        <section className="relative overflow-hidden bg-[#0c3226] py-20 text-white md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 10%, #4ade80 0%, transparent 40%), radial-gradient(circle at 90% 80%, #4ade80 0%, transparent 35%)",
            }}
          />
          <div className="relative container mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] md:items-center">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                <span className="h-px w-6 bg-white/40" />
                Personalized vendor routing
              </p>
              <h2 className="font-extrabold leading-[1.04] tracking-[-0.03em] text-[36px] sm:text-[44px] md:text-[52px]">
                Find the vendor path that fits your protocol.
              </h2>
              <p className="mt-6 max-w-[620px] text-[15.5px] leading-[1.65] text-white/65">
                Take the quiz before picking a vendor. We match your goal, compound interest,
                budget, and monitoring comfort to the next best step in the funnel.
              </p>
            </div>

            <div className="border-y border-white/15 py-6 md:border md:p-6">
              <ul className="space-y-3 text-[14px] leading-[1.55] text-white/75">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
                  <span>Goal-matched compound and protocol recommendations.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
                  <span>Budget and sourcing filters before you leave the site.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
                  <span>PDF unlocks shown after your personalized result.</span>
                </li>
              </ul>
              <Link
                href="/quiz"
                className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-[12px] bg-white px-7 text-[15px] font-extrabold text-[#103b2c] shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
              >
                Take the quiz
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
