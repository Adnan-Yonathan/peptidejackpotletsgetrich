import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { getVendorBySlug, getActiveVendors } from "@/data/vendors";
import { getVendorListingsForVendor } from "@/data/vendor-listings";
import { getGuideById } from "@/data/guides";
import { formatCostRange, getListingCostEstimate } from "@/lib/costs";
import { buildOutboundVendorHref } from "@/lib/outbound-vendors";

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
  const vendorGuides = [
    getGuideById("how-to-compare-peptide-vendors"),
    getGuideById("how-to-read-a-coa"),
    getGuideById("lab-testing-explained"),
    getGuideById("ruo-vs-human-use"),
  ].filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <Button variant="ghost" className="mb-6" render={<Link href="/vendors" />}>
            <ArrowLeft className="mr-2 h-4 w-4" /> All Vendors
          </Button>

          <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="capitalize">{vendor.vendorType.replace(/_/g, " ")}</Badge>
            <Badge variant="outline">COA: {vendor.coaAccessMode.replace(/_/g, " ")}</Badge>
            <Badge variant="outline">{listings.length} imported listings</Badge>
            {vendor.trustpilotRating ? (
              <Badge variant="outline">
                Trustpilot: {vendor.trustpilotRating}/5
                {typeof vendor.trustpilotReviewCount === "number" ? ` (${vendor.trustpilotReviewCount})` : ""}
              </Badge>
            ) : null}
            {vendor.headquarters ? <Badge variant="outline">{vendor.headquarters}</Badge> : null}
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            <Button size="sm" render={<a href={vendor.websiteUrl} target="_blank" rel="noreferrer" />}>
              Visit Site
            </Button>
            {vendor.trustpilotUrl ? (
              <Button variant="outline" size="sm" render={<a href={vendor.trustpilotUrl} target="_blank" rel="noreferrer" />}>
                Trustpilot Reviews
              </Button>
            ) : null}
          </div>

          <Card className="mb-8">
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{vendor.description}</p>
              <p>QC methods: {vendor.qcMethods.join(", ") || "varies by listing"}</p>
              {vendor.supportEmail ? <p>Support: {vendor.supportEmail}</p> : null}
              {vendor.headquarters ? <p>Headquarters: {vendor.headquarters}</p> : null}
              {vendor.orderProcessingTime ? <p>Processing time: {vendor.orderProcessingTime}</p> : null}
              {vendor.shippingRegions ? <p>Shipping regions: {vendor.shippingRegions}</p> : null}
              {vendor.shippingTimeframe ? <p>Shipping timeframe: {vendor.shippingTimeframe}</p> : null}
              <p>Shipping notes: {vendor.shippingNotes}</p>
              <p>Regulatory notes: {vendor.regulatoryNotes}</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader><CardTitle>Imported Product Listings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {listings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No imported peptide-specific listings for this vendor yet.</p>
              ) : (
                listings.map((listing) => (
                  <div key={`${listing.peptideId}-${listing.productPageUrl}`} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{listing.peptide?.name ?? listing.peptideId}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {listing.country} &middot; {listing.vendorTypeLabel} &middot; {listing.captureDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          render={<Link href={`/vendors?peptide=${listing.peptide?.slug ?? listing.peptideId}`} />}
                        >
                          Compare
                        </Button>
                        <Button
                          size="sm"
                          render={
                            <a
                              href={buildOutboundVendorHref(vendor.slug, listing.peptide?.slug ?? listing.peptideId, "vendor-detail")}
                              target="_blank"
                              rel="noreferrer"
                            />
                          }
                        >
                          Visit Product
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                      <p>SKU: {listing.typicalSkuFormat}</p>
                      <p>Price: {listing.typicalRetailPriceRangeUsd}</p>
                      <p>COA: {listing.coaAccessModeLabel}</p>
                      <p>Shipping: {listing.shippingRegions}</p>
                      {(() => {
                        const estimate = getListingCostEstimate(listing.peptideId, listing);
                        if (!estimate) return null;

                        return (
                          <>
                            <p>Cycle cost: {formatCostRange(estimate.cycleCostLow, estimate.cycleCostHigh)}</p>
                            <p>Monthly cost: {formatCostRange(estimate.monthlyCostLow, estimate.monthlyCostHigh)}</p>
                          </>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">QC: {listing.qcMethodsListed}</p>
                    <p className="text-xs text-muted-foreground mt-1">Flags: {listing.regulatoryShippingFlags}</p>
                    <p className="text-xs text-muted-foreground mt-1">Affiliate: {listing.affiliateProgramStatus}</p>
                    <p className="text-sm mt-3">{listing.credibilityNote}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader><CardTitle>Read before you choose a vendor</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {vendorGuides.map((guide) => (
                <div key={guide.id} className="rounded-xl border p-4">
                  <p className="font-medium">{guide.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{guide.summary}</p>
                  <Button className="mt-4" variant="outline" size="sm" render={<Link href={`/guides/${guide.slug}`} />}>
                    Read guide
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

