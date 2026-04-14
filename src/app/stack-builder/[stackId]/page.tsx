import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Edit Stack" };

export default async function EditStackPage({
  params,
}: {
  params: Promise<{ stackId: string }>;
}) {
  const { stackId } = await params;

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">Edit Stack</h1>
          <p className="text-muted-foreground">
            Stack ID: {stackId}. The full stack builder with saved data will load here.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
