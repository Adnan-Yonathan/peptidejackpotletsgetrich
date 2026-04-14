import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Compare Vendors" };

export default function VendorComparePage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">Compare Vendors</h1>
          <p className="text-muted-foreground mb-8">
            Side-by-side comparison of peptide vendors on the metrics that matter.
          </p>

          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Lab Testing</TableHead>
                    <TableHead>COA</TableHead>
                    <TableHead>Shipping</TableHead>
                    <TableHead>Price Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["Vendor A", "Vendor B", "Vendor C"].map((vendor) => (
                    <TableRow key={vendor}>
                      <TableCell className="font-medium">{vendor}</TableCell>
                      <TableCell><Badge variant="secondary">8.5</Badge></TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>3-5 days</TableCell>
                      <TableCell>$30-$80</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground mt-6">
            Data will be populated from the vendor database. Affiliate links may be present.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
