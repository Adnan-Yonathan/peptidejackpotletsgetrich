export type VendorType = "institutional_ruo" | "consumer_ruo" | "rx_manufacturer" | "inactive";
export type CoaAccessMode = "public_pdf" | "lot_lookup" | "batch_portal" | "on_request" | "rx_label" | "unknown";

export interface VendorData {
  id: string;
  slug: string;
  name: string;
  vendorType: VendorType;
  description: string;
  coaAccessMode: CoaAccessMode;
  qcMethods: string[];
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
    vendorType: "consumer_ruo",
    description:
      "Consumer-facing research peptide vendor with affiliate partnership. Product-specific outbound links should resolve directly to the matching peptide page when available.",
    coaAccessMode: "unknown",
    qcMethods: [],
    shippingNotes: "Verify current shipping regions, turnaround, and temperature handling on a per-product basis.",
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
