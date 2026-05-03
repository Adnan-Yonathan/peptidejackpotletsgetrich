import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getVendorBySlug, getActiveVendors } from "@/data/vendors";
import { getAffiliateUrlForVendor } from "@/data/affiliate-links";
import { getVendorListingsForVendor } from "@/data/vendor-listings";
import { getGuideById } from "@/data/guides";
import { formatCostRange, getListingCostEstimate } from "@/lib/costs";
import { buildOutboundVendorHref } from "@/lib/outbound-vendors";

const SECTION_CARD =
  "rounded-xl border border-stone-200 bg-white/90 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]";
const DETAIL_CELL = "rounded-lg bg-stone-50 border border-stone-100 p-3";
const DETAIL_LABEL =
  "text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)] mb-1";

function HeroChip({
  children,
  tone = "ghost",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "ghost" | "yellow" | "red";
  className?: string;
}) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide";
  const tones: Record<string, string> = {
    ghost: "border-white/20 bg-white/[0.07] text-white/80",
    yellow: "border-yellow-300/50 bg-yellow-300/15 text-yellow-100",
    red: "border-red-400/50 bg-red-400/15 text-red-100",
  };
  return <span className={`${base} ${tones[tone]} ${className}`}>{children}</span>;
}

function StatCell({
  value,
  label,
  capitalize = false,
}: {
  value: string;
  label: string;
  capitalize?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`text-xl font-bold text-white leading-none ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
        {label}
      </div>
    </div>
  );
}

const VENDOR_TYPE_SHORT: Record<string, string> = {
  institutional_ruo: "Institutional",
  consumer_ruo: "Consumer",
  rx_manufacturer: "Rx",
  inactive: "Inactive",
};

const COA_SHORT: Record<string, string> = {
  public_pdf: "Public",
  lot_lookup: "Lookup",
  batch_portal: "Portal",
  on_request: "Request",
  rx_label: "Rx Label",
  unknown: "—",
};

export async function generateStaticParams() {
  return getActiveVendors().map((vendor) => ({ slug: vendor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  return { title: vendor?.name ?? "Vendor Not Found" };
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);

  if (!vendor) notFound();

  const listings = getVendorListingsForVendor(vendor.id);
  const vendorHref = getAffiliateUrlForVendor(vendor.id) ?? vendor.websiteUrl;
  const vendorGuides = [
    getGuideById("how-to-compare-peptide-vendors"),
    getGuideById("how-to-read-a-coa"),
    getGuideById("lab-testing-explained"),
    getGuideById("ruo-vs-human-use"),
  ].filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));

  const listingsStat = String(listings.length);
  const trustpilotStat = vendor.trustpilotRating ? `${vendor.trustpilotRating}/5` : "—";
  const coaStat = COA_SHORT[vendor.coaAccessMode] ?? "—";
  const typeStat = VENDOR_TYPE_SHORT[vendor.vendorType] ?? "—";

  const quickFacts: { label: string; value: string }[] = [];
  if (vendor.headquarters) quickFacts.push({ label: "Headquarters", value: vendor.headquarters });
  if (vendor.supportEmail) quickFacts.push({ label: "Support", value: vendor.supportEmail });
  if (vendor.orderProcessingTime)
    quickFacts.push({ label: "Processing time", value: vendor.orderProcessingTime });
  if (vendor.shippingRegions)
    quickFacts.push({ label: "Shipping regions", value: vendor.shippingRegions });
  if (vendor.shippingTimeframe)
    quickFacts.push({ label: "Shipping timeframe", value: vendor.shippingTimeframe });

  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #103b2c 0%, oklch(0.52 0.11 164) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-10">
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Vendors
            </Link>

            <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] md:items-end">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                  {vendor.name}
                </h1>
                {vendor.headquarters && (
                  <p className="mt-2 text-xs uppercase tracking-wider text-white/45">
                    Based in {vendor.headquarters}
                  </p>
                )}
                <p className="mt-3 max-w-[560px] text-sm text-white/65 leading-relaxed">
                  {vendor.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <HeroChip className="capitalize">
                    {vendor.vendorType.replace(/_/g, " ")}
                  </HeroChip>
                  <HeroChip>COA: {vendor.coaAccessMode.replace(/_/g, " ")}</HeroChip>
                  <HeroChip>{listings.length} listings</HeroChip>
                  {vendor.trustpilotRating && (
                    <HeroChip>
                      Trustpilot {vendor.trustpilotRating}
                      {typeof vendor.trustpilotReviewCount === "number"
                        ? ` (${vendor.trustpilotReviewCount})`
                        : ""}
                    </HeroChip>
                  )}
                  {vendor.vendorType === "rx_manufacturer" && (
                    <HeroChip tone="yellow">Rx Channel</HeroChip>
                  )}
                </div>
              </div>

              {/* Stats float panel */}
              <div className="rounded-xl border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <StatCell value={listingsStat} label="Listings" />
                  <StatCell value={trustpilotStat} label="Trustpilot" />
                  <StatCell value={coaStat} label="COA" capitalize />
                  <StatCell value={typeStat} label="Type" capitalize />
                </div>
                <div className="mt-4 flex gap-2 border-t border-white/12 pt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    render={<a href={vendorHref} target="_blank" rel="noreferrer" />}
                  >
                    Visit Site
                  </Button>
                  {vendor.trustpilotUrl ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                      render={<a href={vendor.trustpilotUrl} target="_blank" rel="noreferrer" />}
                    >
                      Reviews
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                      render={<Link href="/vendors" />}
                    >
                      Compare
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Two-col body ────────────────────────────────────── */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            {/* ── Main column ── */}
            <div className="flex flex-col gap-5">
              {/* Overview */}
              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {vendor.description}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>QC Methods</div>
                    <p className="text-sm text-foreground/80">
                      {vendor.qcMethods.length > 0
                        ? vendor.qcMethods.join(", ")
                        : "Varies by listing"}
                    </p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>COA Access</div>
                    <p className="text-sm text-foreground/80 capitalize">
                      {vendor.coaAccessMode.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Shipping Notes</div>
                    <p className="text-sm text-foreground/80">{vendor.shippingNotes}</p>
                  </div>
                  <div className={DETAIL_CELL}>
                    <div className={DETAIL_LABEL}>Regulatory Notes</div>
                    <p className="text-sm text-foreground/80">{vendor.regulatoryNotes}</p>
                  </div>
                </div>
              </div>

              {/* Imported Listings */}
              <div className={SECTION_CARD}>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Imported Product Listings
                </h2>
                {listings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No imported peptide-specific listings for this vendor yet.
                  </p>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {listings.map((listing) => {
                      const estimate = getListingCostEstimate(listing.peptideId, listing);
                      return (
                        <div
                          key={`${listing.peptideId}-${listing.productPageUrl}`}
                          className="py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">
                                {listing.peptide?.name ?? listing.peptideId}
                              </p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {listing.country} · {listing.vendorTypeLabel} ·{" "}
                                {listing.captureDate}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2.5 text-xs"
                                render={
                                  <Link
                                    href={`/vendors?peptide=${listing.peptide?.slug ?? listing.peptideId}`}
                                  />
                                }
                              >
                                Compare
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                render={
                                  <a
                                    href={buildOutboundVendorHref(
                                      vendor.slug,
                                      listing.peptide?.slug ?? listing.peptideId,
                                      "vendor-detail"
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                  />
                                }
                              >
                                Visit
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div className={DETAIL_CELL}>
                              <div className={DETAIL_LABEL}>SKU</div>
                              <p className="text-xs text-foreground/80">
                                {listing.typicalSkuFormat}
                              </p>
                            </div>
                            <div className={DETAIL_CELL}>
                              <div className={DETAIL_LABEL}>Price</div>
                              <p className="text-xs text-foreground/80">
                                {listing.typicalRetailPriceRangeUsd}
                              </p>
                            </div>
                            <div className={DETAIL_CELL}>
                              <div className={DETAIL_LABEL}>COA</div>
                              <p className="text-xs text-foreground/80">
                                {listing.coaAccessModeLabel}
                              </p>
                            </div>
                            <div className={DETAIL_CELL}>
                              <div className={DETAIL_LABEL}>Shipping</div>
                              <p className="text-xs text-foreground/80">
                                {listing.shippingRegions}
                              </p>
                            </div>
                            {estimate && (
                              <>
                                <div className={DETAIL_CELL}>
                                  <div className={DETAIL_LABEL}>Cycle Cost</div>
                                  <p className="text-xs text-foreground/80">
                                    {formatCostRange(
                                      estimate.cycleCostLow,
                                      estimate.cycleCostHigh,
                                      estimate.currencyCode
                                    )}
                                  </p>
                                </div>
                                <div className={DETAIL_CELL}>
                                  <div className={DETAIL_LABEL}>Monthly Cost</div>
                                  <p className="text-xs text-foreground/80">
                                    {formatCostRange(
                                      estimate.monthlyCostLow,
                                      estimate.monthlyCostHigh,
                                      estimate.currencyCode
                                    )}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            QC: {listing.qcMethodsListed}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Flags: {listing.regulatoryShippingFlags}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Affiliate: {listing.affiliateProgramStatus}
                          </p>
                          {listing.credibilityNote && (
                            <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                              {listing.credibilityNote}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Sticky right rail ── */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
              {/* Quick facts */}
              {quickFacts.length > 0 && (
                <div className={SECTION_CARD.replace("p-6", "p-5")}>
                  <h3 className="text-base font-semibold text-foreground mb-3">Quick facts</h3>
                  <div className="divide-y divide-stone-100">
                    {quickFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {fact.label}
                        </p>
                        <p className="text-xs text-foreground/90 text-right break-words min-w-0">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read before choosing */}
              {vendorGuides.length > 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: "oklch(0.52 0.11 164 / 0.2)",
                    background: "oklch(0.52 0.11 164 / 0.05)",
                  }}
                >
                  <p className="text-sm font-semibold text-[color:var(--primary)] mb-1">
                    Read before you choose a vendor
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    COA caveats, lab-test methods, and what a weak vendor listing actually looks
                    like.
                  </p>
                  <ul className="space-y-1.5">
                    {vendorGuides.map((guide) => (
                      <li key={guide.id}>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="group flex items-start gap-1.5 text-xs text-foreground/90 hover:text-[color:var(--primary)]"
                        >
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--primary)]/60" />
                          <span className="underline decoration-transparent group-hover:decoration-current underline-offset-2">
                            {guide.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
