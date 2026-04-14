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
    id: "sigma-aldrich",
    slug: "sigma-aldrich",
    name: "Sigma-Aldrich (Merck)",
    vendorType: "institutional_ruo",
    description: "Global life science supplier under Merck. Provides RUO-grade documentation including lot-linked COAs, assay/purity data, and shipping condition controls.",
    coaAccessMode: "lot_lookup",
    qcMethods: ["HPLC", "MS"],
    shippingNotes: "Wet ice shipment; store -20°C for peptides.",
    regulatoryNotes: "RUO. B2B procurement model.",
    peptideIds: ["bpc-157", "ipamorelin", "aod-9604"],
    status: "active",
  },
  {
    id: "cayman-chemical",
    slug: "cayman-chemical",
    name: "Cayman Chemical",
    vendorType: "institutional_ruo",
    description: "US-based life science reagents supplier with batch-document portal for COAs. Product inserts state batch-specific analytical results on each COA.",
    coaAccessMode: "batch_portal",
    qcMethods: ["HPLC", "MS"],
    shippingNotes: "Verify per product listing.",
    regulatoryNotes: "RUO. B2B distributor network.",
    peptideIds: ["bpc-157", "thymosin-beta-4", "cjc-1295", "ipamorelin", "sermorelin", "ghrp-6", "melanotan-2", "melanotan-1", "aod-9604"],
    status: "active",
  },
  {
    id: "medchemexpress",
    slug: "medchemexpress",
    name: "MedChemExpress",
    vendorType: "institutional_ruo",
    description: "Life science reagents supplier with downloadable COAs and method panels (RP-HPLC, MS). Some products also show NMR/LCMS documentation.",
    coaAccessMode: "public_pdf",
    qcMethods: ["RP-HPLC", "MS", "NMR", "LC-MS"],
    shippingNotes: "Verify per product; often quote/login required for pricing.",
    regulatoryNotes: "RUO. B2B; explore reseller/partner channels.",
    peptideIds: ["bpc-157", "tb-500", "melanotan-2", "melanotan-1", "pt-141", "semax", "selank", "dsip", "oxytocin", "kisspeptin", "mots-c", "epitalon", "foxo4-dri", "follistatin"],
    status: "active",
  },
  {
    id: "tocris",
    slug: "tocris",
    name: "Tocris Bioscience",
    vendorType: "institutional_ruo",
    description: "Bio-Techne brand providing product-specific documentation and lot-based COAs. Example COAs include HPLC purity, MS confirmation, and amino acid analysis.",
    coaAccessMode: "lot_lookup",
    qcMethods: ["HPLC", "MS", "AAA"],
    shippingNotes: "EMEA/ROW distributors available.",
    regulatoryNotes: "RUO. B2B distributor network.",
    peptideIds: ["melanotan-2"],
    status: "active",
  },
  {
    id: "genscript",
    slug: "genscript",
    name: "GenScript",
    vendorType: "institutional_ruo",
    description: "Biotech reagent manufacturer providing peptides/proteins with catalog and bulk purchasing options. Batch documentation typical.",
    coaAccessMode: "on_request",
    qcMethods: ["MS", "HPLC"],
    shippingNotes: "Verify per product.",
    regulatoryNotes: "RUO. Partnering via service contracts/distribution.",
    peptideIds: ["thymosin-beta-4", "igf-1-lr3"],
    status: "active",
  },
  {
    id: "bachem",
    slug: "bachem",
    name: "Bachem",
    vendorType: "institutional_ruo",
    description: "Peptide manufacturer and CDMO with broad peptide catalog. Positioned as manufacturer/service provider rather than consumer vendor.",
    coaAccessMode: "on_request",
    qcMethods: ["HPLC", "MS"],
    shippingNotes: "Verify per product.",
    regulatoryNotes: "CDMO/service contracts. Not consumer-facing.",
    peptideIds: [],
    status: "active",
  },
  {
    id: "boc-sciences",
    slug: "boc-sciences",
    name: "BOC Sciences",
    vendorType: "institutional_ruo",
    description: "Quote-first catalog and CDMO-style supplier with broad peptide listings. Public purity claims should be treated as preliminary until backed by a lot COA.",
    coaAccessMode: "on_request",
    qcMethods: ["HPLC"],
    shippingNotes: "Availability and logistics vary by destination and pack size.",
    regulatoryNotes: "RUO positioning typical; many products route through inquiry-based procurement.",
    peptideIds: ["peg-mgf", "mgf"],
    status: "active",
  },
  {
    id: "biosynth",
    slug: "biosynth",
    name: "Biosynth",
    vendorType: "institutional_ruo",
    description: "Life science reagents supplier with public pricing and example COA workflows (lot lookup/request).",
    coaAccessMode: "lot_lookup",
    qcMethods: ["HPLC"],
    shippingNotes: "May be controlled in some jurisdictions (vendor note).",
    regulatoryNotes: "RUO. Institutional ordering; regulatory varies by jurisdiction.",
    peptideIds: ["sermorelin"],
    status: "active",
  },
  {
    id: "lkt-laboratories",
    slug: "lkt-laboratories",
    name: "LKT Laboratories",
    vendorType: "institutional_ruo",
    description: "Laboratory reagents supplier listing RUO peptides with price tiers and shipping/storage notes.",
    coaAccessMode: "on_request",
    qcMethods: ["HPLC"],
    shippingNotes: "Ships ambient; store -20°C.",
    regulatoryNotes: "RUO.",
    peptideIds: ["ghrp-2"],
    status: "active",
  },
  {
    id: "aapptec-peptide-com",
    slug: "aapptec-peptide-com",
    name: "AAPPTec in Peptide.com channel",
    vendorType: "institutional_ruo",
    description: "AAPPTec-backed peptide procurement channel oriented around research reagent sales. Product records commonly reference RUO literature while QC specifics remain COA-driven.",
    coaAccessMode: "on_request",
    qcMethods: ["COA-referenced identity", "purity confirmation"],
    shippingNotes: "Verify region and pack-size availability per SKU.",
    regulatoryNotes: "RUO. Procurement-oriented supplier path rather than direct consumer checkout.",
    peptideIds: ["ghrp-2"],
    status: "active",
  },
  {
    id: "apollo",
    slug: "apollo",
    name: "Apollo Peptide Sciences",
    vendorType: "consumer_ruo",
    description: "Consumer-facing research peptide vendor with disclosed affiliate program. Publishes RUO-only positioning and purity claims (HPLC-based, third-party testing).",
    coaAccessMode: "on_request",
    qcMethods: ["HPLC", "third-party testing"],
    shippingNotes: "Verify per product.",
    regulatoryNotes: "Consumer RUO. Compliance-sensitive. Affiliate terms include compliance rules.",
    peptideIds: [],
    status: "active",
  },
  {
    id: "pure-lab",
    slug: "pure-lab",
    name: "Pure Lab Peptides",
    vendorType: "consumer_ruo",
    description: "Consumer-facing research peptide vendor with partner/affiliate program. Claims COA availability for products. Frames as RUO-only with no medical claims.",
    coaAccessMode: "on_request",
    qcMethods: ["HPLC", "MS"],
    shippingNotes: "Verify per product.",
    regulatoryNotes: "Consumer RUO. Compliance-sensitive.",
    peptideIds: ["cjc-1295", "aod-9604", "ipamorelin", "semax"],
    status: "active",
  },
  {
    id: "qkine",
    slug: "qkine",
    name: "Qkine",
    vendorType: "institutional_ruo",
    description: "Recombinant protein supplier focused on cell-culture consistency, activity validation, and endotoxin control. Best fit for protein-reagent workflows.",
    coaAccessMode: "public_pdf",
    qcMethods: ["SDS-PAGE", "bioactivity", "endotoxin"],
    shippingNotes: "EU/ROW fulfillment profile; verify destination-specific shipping details.",
    regulatoryNotes: "RUO. Protein reagent procurement rather than consumer peptide sales.",
    peptideIds: ["igf-1-lr3"],
    status: "active",
  },
  {
    id: "peptide-sciences",
    slug: "peptide-sciences",
    name: "Peptide Sciences",
    vendorType: "inactive",
    description: "Formerly a research peptide vendor. Has voluntarily shut down operations and warns that any claimed successors/affiliates are unauthorized and fraudulent.",
    coaAccessMode: "unknown",
    qcMethods: [],
    shippingNotes: "N/A — vendor inactive.",
    regulatoryNotes: "Shut down. Any claimed successors are unauthorized.",
    peptideIds: [],
    status: "inactive",
  },
  {
    id: "clinuvel",
    slug: "clinuvel",
    name: "Clinuvel Inc.",
    vendorType: "rx_manufacturer",
    description: "Manufacturer of SCENESSE (afamelanotide), an FDA-approved implant. Rx distribution only — administered by healthcare professionals.",
    coaAccessMode: "rx_label",
    qcMethods: [],
    shippingNotes: "Administered by healthcare professional.",
    regulatoryNotes: "Rx-only. Exclude from RUO affiliate.",
    peptideIds: ["melanotan-1"],
    status: "active",
  },
  {
    id: "vyleesi",
    slug: "vyleesi",
    name: "Vyleesi (AMAG Pharmaceuticals)",
    vendorType: "rx_manufacturer",
    description: "Manufacturer of Vyleesi (bremelanotide injection), an FDA-approved Rx product for HSDD in premenopausal women.",
    coaAccessMode: "rx_label",
    qcMethods: [],
    shippingNotes: "Rx distribution.",
    regulatoryNotes: "Rx-only. Exclude from RUO affiliate.",
    peptideIds: ["pt-141"],
    status: "active",
  },
  {
    id: "theratechnologies",
    slug: "theratechnologies",
    name: "Theratechnologies",
    vendorType: "rx_manufacturer",
    description: "Manufacturer of Egrifta WR (tesamorelin), an FDA-approved Rx product for HIV-associated lipodystrophy.",
    coaAccessMode: "rx_label",
    qcMethods: [],
    shippingNotes: "Rx distribution.",
    regulatoryNotes: "Rx-only. Exclude from RUO affiliate.",
    peptideIds: ["tesamorelin"],
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
