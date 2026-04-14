import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Add Peptide" };

export default function NewPeptidePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Add Peptide</h1>
      <Card>
        <CardHeader>
          <CardTitle>Peptide Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Peptide creation form with fields for name, slug, description, category,
            experience level, risk level, dosing, cycle length, budget tier, and price range.
            Form will submit to /api/admin/peptides.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
