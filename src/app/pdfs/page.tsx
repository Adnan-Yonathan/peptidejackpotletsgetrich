import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Layers } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROTOCOL_PDF_PRODUCTS, type ProtocolPdfProduct } from "@/data/protocol-pdfs";

export const metadata: Metadata = {
  title: "PDF Proof Sandbox",
  description: "Paginated export proofs for designing and reviewing PeptidePros protocol PDFs before publishing.",
  robots: { index: false, follow: false },
};

const primaryProducts = PROTOCOL_PDF_PRODUCTS.filter((product) => product.kind === "primary");
const addonProducts = PROTOCOL_PDF_PRODUCTS.filter((product) => product.kind === "addon");

function ProductPreview({ product, index }: { product: ProtocolPdfProduct; index: number }) {
  const eyebrow =
    product.kind === "primary"
      ? "Goal Protocol"
      : "Execution Add-On";

  return (
    <article className="grid gap-5 rounded-[1.5rem] border border-[#103b2c]/10 bg-white p-4 shadow-[0_18px_60px_-46px_rgba(16,59,44,0.45)] lg:grid-cols-[0.78fr_1fr]">
      <div className="relative min-h-[420px] overflow-hidden rounded-[1.15rem] border border-[#103b2c]/10 bg-[#fbfaf7] p-5">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(15,106,82,0.16), transparent 28%), radial-gradient(circle at 85% 20%, rgba(125,211,167,0.2), transparent 26%), linear-gradient(135deg, rgba(16,59,44,0.08), transparent 42%)",
          }}
        />
        <div className="relative flex h-full min-h-[380px] flex-col justify-between rounded-[0.95rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_50px_-40px_rgba(16,59,44,0.55)] backdrop-blur">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#103b2c] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                {eyebrow}
              </span>
              <span className="text-xs font-semibold text-[#0f6a52]">{product.priceLabel}</span>
            </div>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
              PeptidePros Protocol
            </p>
            <h2 className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.06em] text-[#13201d]">
              {product.name}
            </h2>
            <p className="mt-4 max-w-[24rem] text-sm leading-6 text-[#103b2c]/68">
              {product.description}
            </p>
          </div>

          <div>
            <div className="grid grid-cols-3 gap-2 border-y border-[#103b2c]/10 py-4">
              {["Map", "Plan", "Track"].map((label) => (
                <div key={label} className="rounded-xl bg-[#f1f4ef] px-3 py-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f6a52]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#103b2c]/42">
              Draft {String(index + 1).padStart(2, "0")} / Sandbox Preview
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5 p-1">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#0f6a52] text-white hover:bg-[#0f6a52]">{product.kind}</Badge>
            {product.badge && <Badge variant="outline">{product.badge}</Badge>}
            <Badge variant="secondary">{product.pdfKey}.pdf</Badge>
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#13201d]">{product.shortName}</h3>
          <p className="mt-2 text-sm leading-6 text-[#103b2c]/65">{product.description}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[#103b2c]">
                <FileText className="h-4 w-4 text-[#0f6a52]" />
                Selling Bullets
              </p>
              <ul className="space-y-2">
                {product.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm leading-5 text-[#103b2c]/70">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#103b2c]/10 bg-[#fbfaf7] p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[#103b2c]">
                <Layers className="h-4 w-4 text-[#0f6a52]" />
                Draft Sections
              </p>
              <ul className="space-y-2">
                {product.includes.map((item) => (
                  <li key={item} className="text-sm leading-5 text-[#103b2c]/70">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#103b2c]/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f6a52]">Checkout target</p>
            <p className="mt-1 break-all text-sm text-[#103b2c]/68">/checkout/{product.slug}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" render={<Link href={`/pdfs/examples/${product.slug}`} />}>
              View PDF proof
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" render={<Link href={`/checkout/${product.slug}`} />}>
              Test flow
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductSection({
  title,
  description,
  products,
}: {
  title: string;
  description: string;
  products: ProtocolPdfProduct[];
}) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#13201d]">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#103b2c]/60">{description}</p>
        </div>
        <span className="text-sm font-semibold text-[#0f6a52]">{products.length} drafts</span>
      </div>
      <div className="grid gap-6">
        {products.map((product, index) => (
          <ProductPreview key={product.slug} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

export default function PdfSandboxPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#fbfaf7]">
        <section className="relative overflow-hidden border-b border-[#103b2c]/10 bg-[#103b2c] px-4 py-14 text-white">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(circle at 20% 20%, rgba(125,211,167,0.24), transparent 28%)",
              backgroundSize: "34px 34px, 34px 34px, auto",
            }}
          />
          <div className="relative mx-auto max-w-6xl">
            <Badge className="bg-[#7dd3a7] text-[#103b2c] hover:bg-[#7dd3a7]">
              Internal sandbox
            </Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.06em] md:text-6xl">
              Protocol PDF design sandbox
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/68 md:text-base">
              Use this page to review the product lineup and open paginated, export-ready PDF proofs
              before the final files are uploaded to paid delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/[0.07] px-4 py-3">
                <p className="text-2xl font-bold">{primaryProducts.length}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Core protocols</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/[0.07] px-4 py-3">
                <p className="text-2xl font-bold">{addonProducts.length}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Add-ons</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/[0.07] px-4 py-3">
                <p className="text-2xl font-bold">{primaryProducts.length + addonProducts.length}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">Example docs</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10">
          <ProductSection
            title="Core Protocol PDFs"
            description="Primary paid protocol files attached to goal hubs and routed from quiz results."
            products={primaryProducts}
          />

          <ProductSection
            title="Add-On PDFs"
            description="Optional execution plans that can become upsells, bundles, or post-purchase add-ons later."
            products={addonProducts}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
