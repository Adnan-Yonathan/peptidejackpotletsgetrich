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
          </div>

          <Card className="mb-8">
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{vendor.description}</p>
              <p>QC methods: {vendor.qcMethods.join(", ") || "varies by listing"}</p>
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
                          size="sm"
                          render={
                            <Link
                              href={buildOutboundVendorHref(vendor.slug, listing.peptide?.slug ?? listing.peptideId, "vendor-detail")}
                              target="_blank"
                              rel="noreferrer"
                            />
                          }
                        >
                          Visit Product
                        </Button>
                        <Button variant="outline" size="sm" render={<Link href={listing.productPageUrl} target="_blank" rel="noreferrer" />}>
                          Source
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                      <p>SKU: {listing.typicalSkuFormat}</p>
                      <p>Price: {listing.typicalRetailPriceRangeUsd}</p>
                      <p>COA: {listing.coaAccessModeLabel}</p>
                      <p>Shipping: {listing.shippingRegions}</p>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
