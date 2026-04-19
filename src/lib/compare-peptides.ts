import type { PeptideData, RegulatoryStatus, FdaFlag, WadaFlag } from "@/data/peptides";
import { getGoalsForPeptide } from "@/data/goals";
import { getVendorListingsForPeptide } from "@/data/vendor-listings";

export function formatRegulatoryStatus(status: RegulatoryStatus) {
  switch (status) {
    case "rx_approved":
      return "Prescription-approved";
    case "investigational":
      return "Investigational";
    case "ruo_only":
      return "Research use only";
    case "not_approved":
    default:
      return "Not approved";
  }
}

export function formatFdaFlag(flag: FdaFlag) {
  switch (flag) {
    case "flagged":
      return "FDA compounding caution";
    case "unknown":
      return "FDA status unclear";
    case "none":
    default:
      return "No current flag noted";
  }
}

export function formatWadaFlag(flag: WadaFlag) {
  switch (flag) {
    case "none":
      return "Not listed";
    case "unknown":
      return "Status unclear";
    default:
      return `WADA ${flag}`;
  }
}

export function getGoalLabelsForPeptide(peptideId: string) {
  return getGoalsForPeptide(peptideId).map((goal) => goal.displayName);
}

export function getVendorCoverageCount(peptideId: string) {
  return getVendorListingsForPeptide(peptideId).length;
}

export function getPeptideSourcingNote(peptideId: string) {
  const listings = getVendorListingsForPeptide(peptideId);
  if (listings.length === 0) {
    return "No tracked product page yet, so sourcing takes more manual review.";
  }

  const listingText = listings
    .map((listing) => `${listing.typicalSkuFormat} ${listing.credibilityNote}`.toLowerCase())
    .join(" ");

  if (listingText.includes("blend")) {
    return "At least one listing is a blend rather than a clean standalone product, so review the product page carefully.";
  }

  if (listingText.includes("mismatch") || listingText.includes("mapped back") || listingText.includes("spelling")) {
    return "Tracked product pages exist, but naming differences mean the listing needs an extra read before purchase.";
  }

  if (listingText.includes("topical") || listingText.includes("injectable") || listingText.includes("verify")) {
    return "Product format varies by listing, so double-check route, concentration, and presentation.";
  }

  return "Tracked product pages are available, which makes it easier to review the listing before you click out.";
}

export function getPeptidePurchaseSummary(peptide: PeptideData) {
  const goals = getGoalLabelsForPeptide(peptide.id);
  const bestFor =
    goals.length === 0
      ? "niche research questions where route, evidence, and sourcing matter more than category labels"
      : goals.length === 1
        ? `${goals[0].toLowerCase()} research where you want a clear starting point`
        : `${goals.slice(0, 2).map((goal) => goal.toLowerCase()).join(" and ")} comparisons`;

  let tradeoff = "You still need to weigh route, sourcing, and safety details before making a purchase decision.";

  if (peptide.evidenceTier === "A" || peptide.evidenceTier === "B") {
    tradeoff = "Evidence is stronger than most compounds in this category, but route, side effects, and vendor fit still matter.";
  } else if (peptide.riskLevel === "high" || peptide.riskLevel === "extreme") {
    tradeoff = "Potential upside comes with much more safety and screening caution than lower-risk alternatives.";
  } else if (peptide.regulatoryStatus !== "rx_approved") {
    tradeoff = "Evidence and product availability can still be uneven, so documentation matters more than hype.";
  }

  return { bestFor, tradeoff };
}
