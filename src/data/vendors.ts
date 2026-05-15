import { buildEditorialReview, type EditorialReview } from "@/lib/editorial";

export type VendorType = "institutional_ruo" | "consumer_ruo" | "rx_manufacturer" | "inactive";
export type CoaAccessMode = "public_pdf" | "lot_lookup" | "batch_portal" | "on_request" | "rx_label" | "unknown";

export interface VendorData {
  id: string;
  slug: string;
  name: string;
  websiteUrl: string;
  trustpilotUrl?: string;
  trustpilotRating?: string;
  trustpilotReviewCount?: number;
  vendorType: VendorType;
  description: string;
  coaAccessMode: CoaAccessMode;
  qcMethods: string[];
  headquarters?: string;
  supportEmail?: string;
  orderProcessingTime?: string;
  shippingRegions?: string;
  shippingTimeframe?: string;
  shippingNotes: string;
  regulatoryNotes: string;
  scoringRationale?: string[];
  trustCaveats?: string[];
  refundSupportNotes?: string;
  affiliateDisclosure?: string;
  editorialReview?: EditorialReview;
  peptideIds: string[];
  status: "active" | "inactive";
}

export const VENDORS: VendorData[] = [
  {
    id: "amino-club",
    slug: "amino-club",
    name: "Amino Club",
    websiteUrl: "https://www.aminoclub.com/",
    trustpilotUrl: "https://www.trustpilot.com/review/aminoclub.com",
    trustpilotRating: "4.5",
    trustpilotReviewCount: 81,
    vendorType: "consumer_ruo",
    description:
      "Consumer-facing research peptide vendor with affiliate partnership. Product-specific outbound links should resolve directly to the matching peptide page when available.",
    coaAccessMode: "public_pdf",
    qcMethods: ["HPLC", "Mass spectrometry", "Endotoxin testing", "Sterility verification"],
    headquarters: "United States",
    supportEmail: "support@aminoclub.com",
    orderProcessingTime: "0-2 business days; orders before 2 PM EST may ship the same day.",
    shippingRegions: "All 50 U.S. states, including Alaska and Hawaii; PO Boxes and APO/FPO supported for standard shipping.",
    shippingTimeframe: "Standard: 5-7 business days. 2-Day and Overnight options available at checkout.",
    shippingNotes:
      "Amino Club states that every order includes tracking and shipment protection. Lyophilized products ship in discreet, insulated packaging, with ice packs used when needed for temperature-sensitive items.",
    regulatoryNotes: "Consumer RUO. Compliance-sensitive; keep outbound routing anchored to exact product pages instead of broad marketing pages.",
    scoringRationale: [
      "Public COA posture is stronger than vendors that rely only on request-based documentation.",
      "Product-specific outbound mappings exist for many tracked peptides, which lowers mismatch risk.",
      "U.S. shipping coverage and stated same-day processing windows make this the clearest U.S.-fit vendor currently tracked.",
    ],
    trustCaveats: [
      "Trustpilot count is useful but still a third-party reputation signal, not a product-quality guarantee.",
      "Current COA, lot, and label details must be checked on the vendor page before any purchase decision.",
    ],
    refundSupportNotes:
      "Support email and shipment-protection language are visible; refund and reship terms should still be reviewed at checkout.",
    affiliateDisclosure:
      "PeptidePros may earn a commission from Amino Club links. That does not change the requirement to verify COA, label, and regulatory context before leaving this site.",
    peptideIds: [
      "bpc-157",
      "tb-500",
      "cjc-1295",
      "tesamorelin",
      "ipamorelin",
      "aod-9604",
      "pt-141",
      "semax",
      "selank",
      "dsip",
      "mots-c",
      "epitalon",
      "thymosin-alpha-1",
      "ghk-cu",
      "igf-1-lr3",
      "kpv",
      "melanotan-1",
      "melanotan-2",
      "retatrutide",
    ],
    status: "active",
  },
  {
    id: "xl-peptides",
    slug: "xl-peptides",
    name: "XL Peptides",
    websiteUrl: "https://xlpeptides.com/",
    trustpilotUrl: "https://www.trustpilot.com/review/xlpeptides.com",
    trustpilotRating: "4.5",
    trustpilotReviewCount: 49,
    vendorType: "consumer_ruo",
    description:
      "Consumer-facing research peptide vendor with an affiliate partnership. Product-level deep links are not mapped yet, so outbound routing should currently use the vendor-level affiliate URL.",
    coaAccessMode: "unknown",
    qcMethods: ["Testing reports listed on product pages"],
    headquarters: "Foxhall Business Centre, 2 King Street, Nottingham NG1 2AS, United Kingdom",
    supportEmail: "info@xlpeptides.com",
    orderProcessingTime: "Typically 1-2 business days after payment clears.",
    shippingRegions: "United Kingdom, Europe, and rest of world via Royal Mail or DPD options.",
    shippingTimeframe: "UK: 1-3 business days. Europe: 3-7 business days. Rest of world: 5-10 business days.",
    shippingNotes:
      "XL Peptides says lyophilized products are packaged to protect against environmental factors and direct sunlight. Product pages and FAQs consistently state dispatch within 1-2 working days, with tracking sent after shipment.",
    regulatoryNotes: "Consumer RUO. Until peptide-specific listings are mapped, treat this as a vendor-level outbound destination rather than an exact product-page route.",
    scoringRationale: [
      "International shipping coverage is broader than the U.S.-focused vendor currently tracked.",
      "Trustpilot rating and review count provide a useful starting reputation signal.",
      "Vendor-level routing is useful for discovery, but weaker than exact peptide product-page routing.",
    ],
    trustCaveats: [
      "COA access is not normalized in the PeptidePros data layer yet, so documentation should be rechecked product by product.",
      "Import rules and delivery reliability vary by destination country and can change after this profile is updated.",
    ],
    refundSupportNotes:
      "Support email and dispatch windows are listed; refund, customs, and reship policies should be checked before ordering internationally.",
    affiliateDisclosure:
      "PeptidePros may earn a commission from XL Peptides links. Vendor ranking still depends on documentation, reputation, shipping, and product-page fit.",
    peptideIds: [
      "aod-9604",
      "bpc-157",
      "cjc-1295",
      "dsip",
      "elamipretide",
      "epitalon",
      "foxo4-dri",
      "ghk-cu",
      "ghrp-6",
      "igf-1-lr3",
      "ipamorelin",
      "kpv",
      "melanotan-1",
      "melanotan-2",
      "mots-c",
      "oxytocin",
      "pt-141",
      "selank",
      "semax",
      "tb-500",
      "tesamorelin",
    ],
    status: "active",
  },
  {
    id: "ignite-peptides",
    slug: "ignite-peptides",
    name: "Ignite Peptides",
    websiteUrl: "https://ignitepeptides.com/",
    trustpilotUrl: "https://ca.trustpilot.com/review/ignitepeptides.com",
    trustpilotRating: "4.1",
    trustpilotReviewCount: 22,
    vendorType: "consumer_ruo",
    description:
      "U.S.-based consumer RUO vendor with a new affiliate partnership. Treat as a conservative, documentation-check-first option until more third-party review history accumulates.",
    coaAccessMode: "on_request",
    qcMethods: ["Third-party testing", "COA with order", "Product-page test reports where available"],
    headquarters: "Owatonna, Minnesota, United States",
    supportEmail: "contact@ignitepeptides.com",
    orderProcessingTime:
      "Orders may require an additional 24-48 hours for payment processing and dispatch; weekend orders ship the next business day.",
    shippingRegions: "U.S. domestic territories only.",
    shippingTimeframe:
      "USPS Standard: 3-6 business days after dispatch. USPS Express: 2-4 business days after dispatch.",
    shippingNotes:
      "Ignite states that it ships only within U.S. domestic territories and sends tracking after dispatch. Product pages and checkout should still be checked for current inventory, temperature handling, and COA availability.",
    regulatoryNotes:
      "Consumer RUO. Ignite states products are laboratory research materials only, not for human or veterinary consumption, and not FDA-approved for medical, therapeutic, diagnostic, or disease-related use.",
    scoringRationale: [
      "Direct product-level affiliate routing is available for several high-intent peptides, including TB-500 and KPV.",
      "Trustpilot shows a public profile, but the review count is still small enough that reputation should be treated as an early signal.",
      "U.S.-only shipping makes Ignite a possible domestic alternative on peptide and quiz-result vendor surfaces.",
    ],
    trustCaveats: [
      "COA language is vendor-claimed and should be verified on the exact product page or order documentation before checkout.",
      "Trustpilot includes shipping and packaging complaints, so do not describe Ignite as best-in-class or top-rated.",
      "Some Ignite product names use vendor-specific shorthand, so only verified single-compound mappings are routed directly in v1.",
    ],
    refundSupportNotes:
      "Ignite states that all sales are final and non-refundable except vendor-determined exceptions; missing, wrong, damaged, or defective item claims require timely documentation.",
    affiliateDisclosure:
      "PeptidePros may earn a commission from Ignite Peptides links. This does not remove the need to verify COA, product naming, shipping, and RUO context before leaving PeptidePros.",
    editorialReview: buildEditorialReview({
      lastReviewedAt: "2026-05-15",
      methodologySummary:
        "Ignite was reviewed from PeptidesFinder, Trustpilot, live product pages, shipping terms, disclaimer language, and affiliate-link behavior before being added as a conservative U.S. vendor option.",
      disclaimerVariant: "vendor",
      sources: [
        {
          title: "Ignite Peptides Review 2026: Quality, Shipping & Trust Score",
          publisher: "PeptidesFinder",
          url: "https://peptidesfinder.com/vendors/0a8ed77f-0df7-4c1d-b9d9-55ef809eecfd",
          accessedAt: "2026-05-15",
          note: "Used as a third-party vendor review reference.",
        },
        {
          title: "Ignitepeptides Reviews",
          publisher: "Trustpilot",
          url: "https://ca.trustpilot.com/review/ignitepeptides.com",
          accessedAt: "2026-05-15",
          note: "Used for public rating and review-count signal.",
        },
        {
          title: "Research Peptides | 99% Pure, COA-Verified",
          publisher: "Ignite Peptides",
          url: "https://ignitepeptides.com/",
          accessedAt: "2026-05-15",
          note: "Used for vendor-claimed headquarters, catalog, purity, COA, and RUO positioning.",
        },
        {
          title: "Shipping & Returns",
          publisher: "Ignite Peptides",
          url: "https://ignitepeptides.com/shipping-and-returns/",
          accessedAt: "2026-05-15",
          note: "Used for U.S. shipping, processing, cancellation, refund, and reshipment policy notes.",
        },
        {
          title: "Disclaimer",
          publisher: "Ignite Peptides",
          url: "https://ignitepeptides.com/disclaimer/",
          accessedAt: "2026-05-15",
          note: "Used for research-only and no-medical-use compliance language.",
        },
      ],
    }),
    peptideIds: [
      "bpc-157",
      "thymosin-beta-4",
      "tb-500",
      "cjc-1295",
      "ipamorelin",
      "sermorelin",
      "tesamorelin",
      "mots-c",
      "epitalon",
      "ghk-cu",
      "kpv",
      "pt-141",
      "semax",
      "dsip",
      "semaglutide",
      "tirzepatide",
      "selank",
      "retatrutide",
      "melanotan-2",
    ],
    status: "active",
  },
];

export function getVendorBySlug(slug: string): VendorData | undefined {
  return VENDORS.find((v) => v.slug === slug);
}

export function getVendorById(id: string): VendorData | undefined {
  return VENDORS.find((v) => v.id === id);
}

export function getActiveVendors(): VendorData[] {
  return VENDORS.filter((v) => v.status === "active");
}

export function getVendorsForPeptide(peptideId: string): VendorData[] {
  return VENDORS.filter((v) => v.peptideIds.includes(peptideId) && v.status === "active");
}

export function getRuoVendors(): VendorData[] {
  return VENDORS.filter(
    (v) => (v.vendorType === "institutional_ruo" || v.vendorType === "consumer_ruo") && v.status === "active"
  );
}
