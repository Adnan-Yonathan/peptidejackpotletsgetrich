import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getActiveVendors } from "@/data/vendors";
import { getVendorListingsForVendor } from "@/data/vendor-listings";

export const metadata: Metadata = { title: "Vendor Comparison" };

export default function VendorsPage() {
  const vendors = getActiveVendors()
    .map((vendor) => ({
      vendor,
      listings: getVendorListingsForVendor(vendor.id),
    }))
    .filter((item) => item.listings.length > 0);

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Vendor Comparison</h1>
            <p className="text-muted-foreground">
              Compare suppliers by documentation quality, source links, shipping scope, and regulatory red flags from the imported snapshot.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map(({ vendor, listings }) => (
              <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex flex-col gap-2">
                    <span>{vendor.name}</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {vendor.vendorType.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {listings.length} listing{listings.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{vendor.description}</p>
                  <p className="text-xs text-muted-foreground">
                    COA: {vendor.coaAccessMode.replace(/_/g, " ")} &middot; QC: {vendor.qcMethods.join(", ") || "varies"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Coverage: {listings.slice(0, 3).map((listing) => listing.peptide?.name ?? listing.peptideId).join(", ")}
                    {listings.length > 3 ? ` +${listings.length - 3} more` : ""}
                  </p>
                  <Button variant="outline" size="sm" render={<Link href={`/vendors/${vendor.slug}`} />}>
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-8 border-t pt-4">
            These imported records may still show quote-only pricing, lot-gated COAs, or region-specific shipping details. Read the source links and credibility notes before treating two listings as interchangeable.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

