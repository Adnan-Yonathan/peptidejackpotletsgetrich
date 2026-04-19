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
      "kpv",
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
    peptideIds: [],
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
