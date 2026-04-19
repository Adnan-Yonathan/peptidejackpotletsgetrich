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
  listedPriceLowUsd?: number;
  listedPriceHighUsd?: number;
  packSizeLowMg?: number;
  packSizeHighMg?: number;
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Consumer-facing vendor with on-page COA presentation. Product-level affiliate routing is available for this peptide.",
    listedPriceLowUsd: 49.99,
    listedPriceHighUsd: 84.99,
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated product page exists for this peptide, which makes it easier to review details before you buy.",
    listedPriceLowUsd: 49.99,
    listedPriceHighUsd: 89.99,
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Amino Club currently shows CJC in a CJC-IPA NO DAC blend rather than as a standalone CJC-1295 product, so compare that product carefully.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Product page uses the vendor spelling 'Tesamorlin'. Deep-link mapping should stay tied to the canonical peptide ID tesamorelin.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated Amino Club product page is available for this peptide instead of a generic vendor landing page.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated product page is available for this peptide and gives users a clearer place to review details.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated PT-141 product page is available for people who want to review this listing directly.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated Semax page is available, so users can go straight to the relevant listing.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated Selank page is available, so users can go straight to the relevant listing.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated DSIP page is available, so users can go straight to the relevant listing.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated MOTS-c page is available, which makes the listing easier to review directly.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Vendor page uses the spelling 'Epithalon'. The listing is mapped back to the canonical epitalon peptide record.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated Thymosin Alpha-1 page is available for direct review.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
  },
  {
    peptideId: "ghk-cu",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/ghk-cu",
    country: "US",
    typicalSkuFormat: "50 mg topical or serum-style product (verify current variants)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "A dedicated GHK-Cu page is available, but it is still important to check whether the product is being presented as topical, injectable, or both.",
    packSizeLowMg: 50,
    packSizeHighMg: 50,
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
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Product-level page and COA presentation make this a good fit for exact peptide routing from peptide, goal, and vendor pages.",
    listedPriceLowUsd: 39.99,
    listedPriceHighUsd: 39.99,
    packSizeLowMg: 10,
    packSizeHighMg: 10,
  },
  {
    peptideId: "retatrutide",
    vendorId: "amino-club",
    vendorName: "Amino Club",
    vendorTypeLabel: "consumer RUO",
    productPageUrl: "https://www.aminoclub.com/us/products/glp-3",
    country: "US",
    typicalSkuFormat: "GLP-3 product page (variant-dependent)",
    coaAccessModeLabel: "product page COA viewer",
    qcMethodsListed: "third-party purity testing; product-level COA on page",
    typicalRetailPriceRangeUsd: "variant-dependent on product page",
    captureDate: "2026-04-14",
    shippingRegions: "US/ROW (verify current policy)",
    regulatoryShippingFlags: "Consumer RUO; review product details carefully",
    affiliateProgramStatus: "affiliate: public program",
    credibilityNote:
      "Amino Club currently appears to place retatrutide under a GLP-3 product page, so that naming mismatch should be noticed before purchase.",
    packSizeLowMg: 10,
    packSizeHighMg: 20,
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

