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
      "igf-1-lr3": "https://www.aminoclub.com/us/products/igf-1-lr3?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "melanotan-1": "https://www.aminoclub.com/us/products/melanotan-i?utm_source=affiliate_marketing&code=PEPTIDEPROS",
      "melanotan-2": "https://www.aminoclub.com/us/products/melanotan-ii?utm_source=affiliate_marketing&code=PEPTIDEPROS",
    },
    notes:
      "Base affiliate link is confirmed. Add compound-specific deep links here once vendor product URLs are available so peptide pages can route directly to the matching SKU.",
  },
  {
    vendorId: "xl-peptides",
    vendorName: "XL Peptides",
    partnerDomain: "xlpeptides.com",
    defaultAffiliateUrl: "https://xlpeptides.com/?aff=70",
    peptideAffiliateUrls: {
      "aod-9604": "https://xlpeptides.com/product/aod-9604/?aff=70",
      "bpc-157": "https://xlpeptides.com/product/bpc-157-5mg/?aff=70",
      "cjc-1295": "https://xlpeptides.com/product/cjc-1295-5mg/?aff=70",
      dsip: "https://xlpeptides.com/product/dsip/?aff=70",
      epitalon: "https://xlpeptides.com/product/epitalon-10mg/?aff=70",
      "foxo4-dri": "https://xlpeptides.com/product/foxo4-dri/?aff=70",
      "ghk-cu": "https://xlpeptides.com/product/ghk-cu-50mg/?aff=70",
      "ghrp-6": "https://xlpeptides.com/product/ghrp-6-10mg/?aff=70",
      "igf-1-lr3": "https://xlpeptides.com/product/igf-1-lr3-1mg/?aff=70",
      ipamorelin: "https://xlpeptides.com/product/ipamorelin/?aff=70",
      kpv: "https://xlpeptides.com/product/kpv-10mg/?aff=70",
      "mots-c": "https://xlpeptides.com/product/mots-c-10mg/?aff=70",
      "melanotan-1": "https://xlpeptides.com/product/melanotan-1-10mg/?aff=70",
      "melanotan-2": "https://xlpeptides.com/product/melanotan-2-10mg/?aff=70",
      oxytocin: "https://xlpeptides.com/product/oxytocin-2mg/?aff=70",
      "pt-141": "https://xlpeptides.com/product/pt-141-10mg/?aff=70",
      selank: "https://xlpeptides.com/product/selank-10mg/?aff=70",
      semax: "https://xlpeptides.com/product/semax-10mg/?aff=70",
      elamipretide: "https://xlpeptides.com/product/ss-31-10mg/?aff=70",
      "tb-500": "https://xlpeptides.com/product/tb-500-5mg/?aff=70",
      tesamorelin: "https://xlpeptides.com/product/tesamorelin-5mg/?aff=70",
    },
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
