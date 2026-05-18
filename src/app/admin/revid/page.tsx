import type { Metadata } from "next";
import { RevidBeforeAfterGenerator } from "@/components/admin/RevidBeforeAfterGenerator";

export const metadata: Metadata = { title: "Revid Generator" };

export default function AdminRevidPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revid Generator</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Upload Suzette before/after images and two motion driver videos, then
          create Revid Pro motion-transfer clips without exposing the API key.
        </p>
      </div>
      <RevidBeforeAfterGenerator />
    </div>
  );
}
