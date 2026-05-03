import type { ResolvedVendorListing } from "@/data/vendor-listings";
import { getListingPriceLabel } from "@/data/vendor-listings";

export type ListingMatchStatus = "exact" | "alias" | "blend" | "format-caution";
export type NamingClarity = "clear" | "caution";
export type DocumentationStrength = "strong" | "solid" | "basic";
export type PriceVisibility = "visible" | "partial" | "unclear";

function getListingText(listing: ResolvedVendorListing) {
  return `${listing.productPageUrl} ${listing.typicalSkuFormat} ${listing.credibilityNote}`.toLowerCase();
}

export function getListingMatchStatus(listing: ResolvedVendorListing): ListingMatchStatus {
  const text = getListingText(listing);

  if (text.includes("blend") || text.includes("+")) {
    return "blend";
  }

  if (text.includes("mismatch") || text.includes("mapped back") || text.includes("vendor spelling") || text.includes("uses the spelling")) {
    return "alias";
  }

  if (text.includes("topical") || (text.includes("injectable") && text.includes("both")) || text.includes("verify current variants")) {
    return "format-caution";
  }

  return "exact";
}

export function getNamingClarity(listing: ResolvedVendorListing): NamingClarity {
  return getListingMatchStatus(listing) === "exact" ? "clear" : "caution";
}

export function getDocumentationStrength(listing: ResolvedVendorListing): DocumentationStrength {
  const coaText = listing.coaAccessModeLabel.toLowerCase();
  const qcText = listing.qcMethodsListed.toLowerCase();
  const hasStructuredCoa = coaText.includes("viewer") || coaText.includes("pdf") || coaText.includes("portal");
  const hasThirdPartyQc = qcText.includes("third-party") || qcText.includes("hplc") || qcText.includes("ms");

  if (hasStructuredCoa && hasThirdPartyQc) {
    return "strong";
  }

  if (hasStructuredCoa || hasThirdPartyQc) {
    return "solid";
  }

  return "basic";
}

export function getPriceVisibility(listing: ResolvedVendorListing): PriceVisibility {
  const text = getListingPriceLabel(listing).toLowerCase();

  if (text.includes("variant-dependent")) {
    return text.includes("$") || text.includes("€") ? "partial" : "unclear";
  }

  if (text.includes("$") || text.includes("€")) {
    return "visible";
  }

  return "unclear";
}

export function getMatchLabel(status: ListingMatchStatus) {
  switch (status) {
    case "exact":
      return "Exact product match";
    case "alias":
      return "Naming mismatch";
    case "blend":
      return "Blend or combo product";
    case "format-caution":
    default:
      return "Format needs review";
  }
}

export function getDecisionNote(listing: ResolvedVendorListing) {
  const matchStatus = getListingMatchStatus(listing);
  const documentation = getDocumentationStrength(listing);

  if (matchStatus === "blend") {
    return "This page is not a clean one-to-one match, so confirm the formula before you buy.";
  }

  if (matchStatus === "alias") {
    return "The product looks relevant, but naming differences mean you should verify the exact compound on-page.";
  }

  if (matchStatus === "format-caution") {
    return "The product format needs a closer look before purchase, especially if route matters to your decision.";
  }

  if (documentation === "strong") {
    return "The listing gives you a cleaner path to review documentation before clicking through.";
  }

  return "The product page is usable, but documentation still deserves a careful read before purchase.";
}
