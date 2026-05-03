import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Globe,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPeptideBySlug } from "@/data/peptides";
import { getActiveVendors, type VendorData } from "@/data/vendors";
import {
  getListingCurrencyCode,
  getListingPriceBounds,
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
import { buildOutboundVendorHref } from "@/lib/outbound-vendors";

export const metadata: Metadata = {
  title: "Vendor Comparison",
  description: "Compare peptide vendors by Trustpilot rating, shipping speed, documentation quality, and product coverage.",
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

function getShippingLeadDays(value?: string) {
  if (!value) return null;
  const rangeMatch = value.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return Number(rangeMatch[1]);
  }

  const singleMatch = value.match(/(\d+)\s*(?:business )?day/);
  return singleMatch ? Number(singleMatch[1]) : null;
}

function getCoverageText(item: ComparedVendor) {
  if (item.listing) {
    return item.listing.shippingRegions;
  }

  if (item.vendor.shippingRegions) {
    return item.vendor.shippingRegions;
  }

  return item.listings.length > 0
    ? item.listings.slice(0, 3).map((entry) => entry.peptide?.name ?? entry.peptideId).join(", ")
    : "Vendor profile available";
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
        ? `Trustpilot ${vendor.trustpilotRating}/5${trustReviews ? ` from ${trustReviews} reviews` : ""}`
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
  const comparableCurrency = sorted[0]?.listing ? getListingCurrencyCode(sorted[0].listing) : undefined;
  const bestValueVendorId =
    comparableCurrency
      ? sorted
          .filter((item) => item.listing && getListingCurrencyCode(item.listing) === comparableCurrency)
          .sort(
            (a, b) =>
              (a.listing ? getListingPriceBounds(a.listing)?.low ?? Infinity : Infinity) -
              (b.listing ? getListingPriceBounds(b.listing)?.low ?? Infinity : Infinity)
          )[0]?.vendor.id
      : undefined;
  const fastestVendorId =
    [...sorted].sort(
      (a, b) =>
        (getShippingLeadDays(a.listing?.shippingRegions ?? a.vendor.shippingTimeframe) ?? Infinity) -
        (getShippingLeadDays(b.listing?.shippingRegions ?? b.vendor.shippingTimeframe) ?? Infinity)
    )[0]?.vendor.id;

  return sorted.map((item, index) => ({
    ...item,
    rankLabel:
      index === 0 ? "Best overall" : bestValueVendorId && item.vendor.id === bestValueVendorId ? "Best value" : item.vendor.id === fastestVendorId ? "Fastest shipping" : "Worth considering",
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
  const vendors = peptide ? peptideListings.map((listing) => listing.vendor).filter((vendor): vendor is VendorData => Boolean(vendor)) : getActiveVendors();
  const comparedVendors = buildComparedVendors(vendors, peptideListings, peptide?.slug);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f6f8f6] px-4 py-12">
        <div className="container mx-auto max-w-7xl">
          <section className="grid gap-6 rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm lg:grid-cols-[1.25fr_0.75fr] lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Vendor Comparison</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {peptide ? `Best ${peptide.name} vendors in 2026` : "Best peptide vendors in 2026"}
              </h1>
              <p className="mt-2 text-3xl font-medium tracking-tight text-emerald-800">
                Tested, ranked & reviewed
              </p>
              <p className="mt-5 max-w-3xl text-lg text-slate-600">
                We compare vendor trust signals, shipping speed, documentation quality, and product coverage so you do not have to guess who to trust.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <ClipboardCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-slate-900">Evidence-based</p>
                    <p className="text-sm text-slate-600">COAs, testing notes, and exact listing context.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <Star className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-slate-900">Trustpilot highlighted</p>
                    <p className="text-sm text-slate-600">Third-party reputation is visible on every vendor card.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-slate-900">Quality shipping</p>
                    <p className="text-sm text-slate-600">We prioritize vendors with clear delivery windows and reliable fulfillment notes.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-slate-900">Updated regularly</p>
                    <p className="text-sm text-slate-600">Shipping, pricing, and listing quality are reviewed often.</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-emerald-100 bg-[#f2f8f4] shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-emerald-600/10 p-4 text-emerald-700">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">What Vendors We Rank</p>
                    <p className="mt-2 text-sm text-slate-600">We focus on vendors that clear baseline trust and operations checks before they make this page.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <span className="flex items-center gap-2"><Star className="h-4 w-4 text-emerald-700" /> Minimum 4.0-star Trustpilot profile</span>
                    <span className="font-semibold">Required</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <span className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-emerald-700" /> COA access and testing visibility</span>
                    <span className="font-semibold">Required</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-emerald-700" /> Clear shipping windows and regional coverage</span>
                    <span className="font-semibold">Required</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <span className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-emerald-700" /> Transparent pricing and product coverage</span>
                    <span className="font-semibold">Required</span>
                  </div>
                </div>

                <Button className="mt-6 w-full" variant="outline" render={<Link href="/guides/how-to-compare-peptide-vendors" />}>
                  Learn our process <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="mt-10">
            <div className="mb-5 flex items-center gap-3">
              <Star className="h-5 w-5 text-emerald-700" />
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                {peptide ? `Top vendors for ${peptide.name}` : "Top vendors"}
              </h2>
            </div>

            {comparedVendors.length === 0 ? (
              <Card className="rounded-[1.75rem] border border-emerald-100 bg-white p-8 shadow-none">
                <CardContent className="p-0 text-sm text-slate-600">
                  No vendor cards are available for this peptide yet. Go back to the peptide page or review the vendor guide before clicking through.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 xl:grid-cols-2">
                {comparedVendors.map((item, index) => {
                  const targetHref =
                    peptide && item.listing
                      ? buildOutboundVendorHref(item.vendor.slug, peptide.slug, "vendor-compare")
                      : `/vendors/${item.vendor.slug}`;

                  return (
                    <Card key={item.vendor.id} className="rounded-[1.75rem] border border-emerald-100 bg-white shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">#{index + 1}</Badge>
                              <Badge variant="outline" className="border-emerald-200 text-emerald-800">
                                {item.rankLabel}
                              </Badge>
                            </div>
                            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{item.vendor.name}</h3>
                            <p className="text-lg font-medium text-emerald-800">{item.headline}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Trustpilot</p>
                            <p className="text-3xl font-bold tracking-tight text-slate-900">
                              {item.vendor.trustpilotRating ?? "N/A"}
                              <span className="text-base font-medium text-slate-500">/5</span>
                            </p>
                            {typeof item.vendor.trustpilotReviewCount === "number" ? (
                              <p className="text-xs text-slate-500">{item.vendor.trustpilotReviewCount} reviews</p>
                            ) : null}
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-600">{item.vendor.description}</p>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl bg-emerald-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Best for</p>
                            <div className="mt-3 space-y-2 text-sm text-slate-700">
                              {item.bestFor.map((point) => (
                                <p key={point} className="flex gap-2">
                                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                                  <span>{point}</span>
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">Strengths</p>
                            <div className="mt-3 space-y-2 text-sm text-slate-700">
                              {item.strengths.map((point) => (
                                <p key={point} className="flex gap-2">
                                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                                  <span>{point}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Considerations</p>
                          <div className="mt-3 space-y-2 text-sm text-slate-700">
                            {item.considerations.map((point) => (
                              <p key={point} className="flex gap-2">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                                <span>{point}</span>
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Coverage</p>
                            <p className="mt-2 text-sm font-medium text-slate-900">{getCoverageText(item)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Region</p>
                            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900">
                              <Globe className="h-4 w-4 text-emerald-700" />
                              {item.listing?.country ?? item.vendor.headquarters ?? "Global"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Shipping window</p>
                            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900">
                              <Truck className="h-4 w-4 text-emerald-700" />
                              {item.vendor.shippingTimeframe ?? item.listing?.shippingRegions ?? "Verify on site"}
                            </p>
                          </div>
                        </div>

                        <Button className="mt-6 w-full" render={<Link href={targetHref} />}>
                          {peptide && item.listing ? "View Products & Deals" : "View Vendor Profile"} <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
