import {
  PROTOCOL_PDF_PRODUCTS,
  getProtocolPdfProduct,
  type ProtocolPdfProduct,
} from "@/data/protocol-pdfs";

export type ProductSlug = (typeof PROTOCOL_PDF_PRODUCTS)[number]["slug"] | keyof typeof LEGACY_PRODUCT_ALIASES;

export interface PaidPdfProduct {
  slug: string;
  goalId: string | null;
  kind: ProtocolPdfProduct["kind"];
  name: string;
  shortName: string;
  description: string;
  priceLabel: string;
  priceEnvVar: string;
  pdfKey: string;
  badge?: string;
  bullets: string[];
  includes: string[];
}

const LEGACY_PRODUCT_ALIASES = {
  "glp1-fat-loss-protocol": "fat-loss-metabolism-protocol",
  "lean-muscle-protocol": "muscle-growth-strength-protocol",
  "wolverine-stack-protocol": "tissue-repair-recovery-protocol",
  "deep-sleep-stress-protocol": "sleep-relaxation-protocol",
  "focus-cognitive-edge-protocol": "cognitive-neuroprotection-protocol",
  "longevity-stack-protocol": "longevity-anti-aging-protocol",
  "looksmaxxing-protocol": "skin-hair-protocol",
  "libido-hormone-protocol": "sexual-health-libido-protocol",
} as const;

export const PAID_PDF_PRODUCTS: Record<string, PaidPdfProduct> = Object.fromEntries(
  PROTOCOL_PDF_PRODUCTS.map((product) => [product.slug, product])
);

export function getPaidPdfProduct(slug: string): PaidPdfProduct | null {
  const canonicalSlug = LEGACY_PRODUCT_ALIASES[slug as keyof typeof LEGACY_PRODUCT_ALIASES] ?? slug;
  return getProtocolPdfProduct(canonicalSlug) ?? null;
}

export function getStripePriceId(product: PaidPdfProduct) {
  const priceId = process.env[product.priceEnvVar];

  if (!priceId) {
    throw new Error(`Missing ${product.priceEnvVar}`);
  }

  return priceId;
}
