export interface AffiliateVendorLinkData {
  vendorId: string;
  vendorName: string;
  partnerDomain: string;
  defaultAffiliateUrl: string;
  peptideAffiliateUrls?: Record<string, string>;
  notes?: string;
}

export const AFFILIATE_VENDOR_LINKS: AffiliateVendorLinkData[] = [
  {
    vendorId: "amino-club",
    vendorName: "Amino Club",
    partnerDomain: "aminoclub.com",
    defaultAffiliateUrl: "https://aminoclub.com?utm_source=affiliate_marketing&code=PEPTIDEPROS",
    peptideAffiliateUrls: {
      "bpc-157": "https://www.aminoclub.com/us/products/bpc-157?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "tb-500": "https://www.aminoclub.com/us/products/tb-500?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "cjc-1295": "https://www.aminoclub.com/us/products/cjc-ipa-no-dac?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      tesamorelin: "https://www.aminoclub.com/us/products/tesamorlin?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      ipamorelin: "https://www.aminoclub.com/us/products/ipamorelin?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "aod-9604": "https://www.aminoclub.com/us/products/aod-9604?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "pt-141": "https://www.aminoclub.com/us/products/pt-141?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      semax: "https://www.aminoclub.com/us/products/semax?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      selank: "https://www.aminoclub.com/us/products/selank?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      dsip: "https://www.aminoclub.com/us/products/dsip?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "mots-c": "https://www.aminoclub.com/us/products/mots-c?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      epitalon: "https://www.aminoclub.com/us/products/epithalon?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "thymosin-alpha-1": "https://www.aminoclub.com/us/products/thymosin-alpha-1?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "ghk-cu": "https://www.aminoclub.com/us/products/ghk-cu?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "kpv": "https://www.aminoclub.com/us/products/kpv?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      retatrutide: "https://www.aminoclub.com/us/products/glp-3?utm_source=affiliate_marketing&code=PEPTIDEPROS",
    },
    notes:
      "Base affiliate link is confirmed. Add compound-specific deep links here once vendor product URLs are available so peptide pages can route directly to the matching SKU.",
  },
  {
    vendorId: "xl-peptides",
    vendorName: "XL Peptides",
    partnerDomain: "xlpeptides.com",
    defaultAffiliateUrl: "https://xlpeptides.com/?aff=70",
    notes:
      "Base affiliate link is confirmed. Add peptide-specific deep links later if you want outbound routing to land on exact product pages instead of the vendor homepage.",
  },
];

export function getAffiliateVendorLinkByVendorId(vendorId: string): AffiliateVendorLinkData | undefined {
  return AFFILIATE_VENDOR_LINKS.find((link) => link.vendorId === vendorId);
}

export function getAffiliateUrlForVendor(vendorId: string, peptideId?: string): string | null {
  const vendor = getAffiliateVendorLinkByVendorId(vendorId);
  if (!vendor) return null;

  if (peptideId && vendor.peptideAffiliateUrls?.[peptideId]) {
    return vendor.peptideAffiliateUrls[peptideId];
  }

  return vendor.defaultAffiliateUrl;
}

export function doesAffiliateUrlMatchPartnerDomain(url: string, partnerDomain: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === partnerDomain || parsed.hostname.endsWith(`.${partnerDomain}`);
  } catch {
    return false;
  }
}
