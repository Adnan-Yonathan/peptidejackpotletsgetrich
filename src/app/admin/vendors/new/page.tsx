import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Add Vendor" };

export default function NewVendorPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Add Vendor</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vendor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vendor creation form with fields for name, slug, website, description,
            lab testing, COA, shipping, payment methods, trust score, and status.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
