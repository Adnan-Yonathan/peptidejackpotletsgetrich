import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Edit Peptide" };

export default async function EditPeptidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Peptide</h1>
      <Card>
        <CardHeader>
          <CardTitle>Peptide Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Edit form for peptide ID: {id}. Pre-populated from database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
