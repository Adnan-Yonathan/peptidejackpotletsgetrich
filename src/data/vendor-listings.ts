import { getPeptideById, type PeptideData } from "@/data/peptides";
import { getVendorById, type VendorData } from "@/data/vendors";

export interface VendorListingData {
  peptideId: string;
  vendorId: string;
  vendorName: string;
  vendorTypeLabel: string;
  productPageUrl: string;
  country: string;
  typicalSkuFormat: string;
  coaAccessModeLabel: string;
  qcMethodsListed: string;
  typicalRetailPriceRangeUsd: string;
  captureDate: string;
  shippingRegions: string;
  regulatoryShippingFlags: string;
  affiliateProgramStatus: string;
  credibilityNote: string;
}

export interface ResolvedVendorListing extends VendorListingData {
  peptide: PeptideData | undefined;
  vendor: VendorData | undefined;
}

export const VENDOR_LISTINGS: VendorListingData[] = [
  {
    peptideId: "bpc-157",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/bpc-157",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "from ~$49.99 to ~$84.99 (variant-dependent)",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Consumer-facing vendor with on-page COA presentation. Product-level affiliate routing is available for this peptide.",
  },
  {
    peptideId: "tb-500",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/tb-500",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "from ~$49.99 to ~$89.99 (variant-dependent)",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Direct product page exists and is suitable for exact peptide-to-vendor routing rather than a homepage fallback.",
  },
  {
    peptideId: "cjc-1295",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/cjc-ipa-no-dac",
    country: "US",
    typicalSkuFormat: "blend product (CJC-1295 + ipamorelin, variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Amino Club's current CJC lane is a CJC-IPA NO DAC blend rather than a clean standalone CJC-1295 SKU. Keep that distinction visible in UI copy.",
  },
  {
    peptideId: "tesamorelin",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/tesamorlin",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Product page uses the vendor spelling 'Tesamorlin'. Deep-link mapping should stay tied to the canonical peptide ID tesamorelin.",
  },
  {
    peptideId: "ipamorelin",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/ipamorelin",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Standalone product page exists, so peptide recommendations can route to the exact Amino Club SKU rather than the vendor homepage.",
  },
  {
    peptideId: "aod-9604",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/aod-9604",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Direct product page verified. This is suitable for exact peptide-specific outbound routing.",
  },
  {
    peptideId: "pt-141",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/pt-141",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Exact PT-141 product page exists, which is the correct target for peptide-specific vendor CTAs.",
  },
  {
    peptideId: "semax",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/semax",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Standalone product page exists for direct Semax routing from peptide, goal, and vendor contexts.",
  },
  {
    peptideId: "selank",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/selank",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Direct product page verified. This can be used for exact Selank-specific outbound routing.",
  },
  {
    peptideId: "dsip",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/dsip",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Direct product page exists, so DSIP recommendations can route to a peptide-specific Amino Club page.",
  },
  {
    peptideId: "mots-c",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/mots-c",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "MOTS-c product page is verified and can be used for direct affiliate-aware peptide routing.",
  },
  {
    peptideId: "epitalon",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/epithalon",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Vendor page uses the spelling 'Epithalon'. The listing is mapped back to the canonical epitalon peptide record.",
  },
  {
    peptideId: "thymosin-alpha-1",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/thymosin-alpha-1",
    country: "US",
    typicalSkuFormat: "10 mg / 20 mg (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Exact product page verified. This supports direct vendor routing for Thymosin Alpha-1 research pages.",
  },
  {
    peptideId: "ghk-cu",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/ghk-cu",
    country: "US",
    typicalSkuFormat: "50 mg topical/serum-adjacent lane (verify current variants)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Direct GHK-Cu product page exists. Variant details should still be checked because topical and injectable research lanes are often conflated in the market.",
  },
  {
    peptideId: "kpv",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/kpv",
    country: "US",
    typicalSkuFormat: "10 mg",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "$39.99 shown",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Product-level page and COA presentation make this a good fit for exact peptide routing from peptide, goal, and vendor pages.",
  },
  {
    peptideId: "retatrutide",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/glp-3",
    country: "US",
    typicalSkuFormat: "GLP-3 product lane (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; compliance-sensitive marketing lane",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Amino Club's current retatrutide lane appears under the GLP-3 product page. Keep that naming mismatch visible so users are not shown a false standalone SKU.",
  },
];

export function getVendorListingsForPeptide(peptideId: string): ResolvedVendorListing[] {
  return VENDOR_LISTINGS.filter((listing) => listing.peptideId === peptideId).map(resolveListing);
}

export function getVendorListingsForVendor(vendorId: string): ResolvedVendorListing[] {
  return VENDOR_LISTINGS.filter((listing) => listing.vendorId === vendorId).map(resolveListing);
}

export function getVendorListingForPeptideAndVendor(peptideId: string, vendorId: string): ResolvedVendorListing | undefined {
  const listing = VENDOR_LISTINGS.find((item) => item.peptideId === peptideId && item.vendorId === vendorId);
  return listing ? resolveListing(listing) : undefined;
}

function resolveListing(listing: VendorListingData): ResolvedVendorListing {
  return {
    ...listing,
    peptide: getPeptideById(listing.peptideId),
    vendor: getVendorById(listing.vendorId),
  };
}
