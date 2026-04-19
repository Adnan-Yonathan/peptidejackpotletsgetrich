import { getCostModelForPeptide } from "@/data/costs";
import { getVendorListingsForPeptide, type ResolvedVendorListing } from "@/data/vendor-listings";

export type CostConfidence = "high" | "medium" | "low" | "none";

export interface ListingCostEstimate {
  costPerMgLow: number;
  costPerMgHigh: number;
  cycleCostLow: number;
  cycleCostHigh: number;
  monthlyCostLow: number;
  monthlyCostHigh: number;
  confidence: CostConfidence;
}

export interface PeptideCostEstimate extends ListingCostEstimate {
  cycleWeeks: number;
  amountPerCycleLow: number;
  amountPerCycleHigh: number;
  note: string;
  basedOnListings: number;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function formatCurrencyValue(value: number) {
  return `$${value.toFixed(2)}`;
}

function classifyListingConfidence(listing: ResolvedVendorListing): CostConfidence {
  if (
    listing.listedPriceLowUsd !== undefined &&
    listing.listedPriceHighUsd !== undefined &&
    listing.packSizeLowMg !== undefined &&
    listing.packSizeHighMg !== undefined
  ) {
    if (listing.listedPriceLowUsd === listing.listedPriceHighUsd && listing.packSizeLowMg === listing.packSizeHighMg) {
      return "high";
    }

    return "medium";
  }

  if (listing.packSizeLowMg !== undefined || listing.packSizeHighMg !== undefined) {
    return "low";
  }

  return "none";
}

export function getListingCostEstimate(peptideId: string, listing: ResolvedVendorListing): ListingCostEstimate | undefined {
  const model = getCostModelForPeptide(peptideId);

  if (
    !model ||
    listing.listedPriceLowUsd === undefined ||
    listing.listedPriceHighUsd === undefined ||
    listing.packSizeLowMg === undefined ||
    listing.packSizeHighMg === undefined
  ) {
    return undefined;
  }

  const costPerMgLow = listing.listedPriceLowUsd / listing.packSizeHighMg;
  const costPerMgHigh = listing.listedPriceHighUsd / listing.packSizeLowMg;
  const cycleCostLow = costPerMgLow * model.amountPerCycleLow;
  const cycleCostHigh = costPerMgHigh * model.amountPerCycleHigh;
  const monthlyFactor = 4 / model.cycleWeeks;

  return {
    costPerMgLow: roundCurrency(costPerMgLow),
    costPerMgHigh: roundCurrency(costPerMgHigh),
    cycleCostLow: roundCurrency(cycleCostLow),
    cycleCostHigh: roundCurrency(cycleCostHigh),
    monthlyCostLow: roundCurrency(cycleCostLow * monthlyFactor),
    monthlyCostHigh: roundCurrency(cycleCostHigh * monthlyFactor),
    confidence: classifyListingConfidence(listing),
  };
}

export function getPeptideCostEstimate(peptideId: string): PeptideCostEstimate | undefined {
  const model = getCostModelForPeptide(peptideId);
  if (!model) {
    return undefined;
  }

  const listingEstimates = getVendorListingsForPeptide(peptideId)
    .map((listing) => getListingCostEstimate(peptideId, listing))
    .filter((estimate): estimate is ListingCostEstimate => Boolean(estimate));

  if (listingEstimates.length === 0) {
    return undefined;
  }

  const cycleCostLow = Math.min(...listingEstimates.map((estimate) => estimate.cycleCostLow));
  const cycleCostHigh = Math.max(...listingEstimates.map((estimate) => estimate.cycleCostHigh));
  const monthlyCostLow = Math.min(...listingEstimates.map((estimate) => estimate.monthlyCostLow));
  const monthlyCostHigh = Math.max(...listingEstimates.map((estimate) => estimate.monthlyCostHigh));
  const costPerMgLow = Math.min(...listingEstimates.map((estimate) => estimate.costPerMgLow));
  const costPerMgHigh = Math.max(...listingEstimates.map((estimate) => estimate.costPerMgHigh));

  const confidence: CostConfidence =
    listingEstimates.some((estimate) => estimate.confidence === "high")
      ? "high"
      : listingEstimates.some((estimate) => estimate.confidence === "medium")
        ? "medium"
        : "low";

  return {
    cycleWeeks: model.cycleWeeks,
    amountPerCycleLow: model.amountPerCycleLow,
    amountPerCycleHigh: model.amountPerCycleHigh,
    note: model.note,
    basedOnListings: listingEstimates.length,
    costPerMgLow: roundCurrency(costPerMgLow),
    costPerMgHigh: roundCurrency(costPerMgHigh),
    cycleCostLow: roundCurrency(cycleCostLow),
    cycleCostHigh: roundCurrency(cycleCostHigh),
    monthlyCostLow: roundCurrency(monthlyCostLow),
    monthlyCostHigh: roundCurrency(monthlyCostHigh),
    confidence,
  };
}

export function getStackCostEstimate(
  items: Array<{ peptideId: string; quantity?: number }>
) {
  const estimates = items
    .map((item) => {
      const estimate = getPeptideCostEstimate(item.peptideId);
      if (!estimate) {
        return undefined;
      }

      const quantity = item.quantity ?? 1;
      return {
        peptideId: item.peptideId,
        quantity,
        cycleCostLow: roundCurrency(estimate.cycleCostLow * quantity),
        cycleCostHigh: roundCurrency(estimate.cycleCostHigh * quantity),
        monthlyCostLow: roundCurrency(estimate.monthlyCostLow * quantity),
        monthlyCostHigh: roundCurrency(estimate.monthlyCostHigh * quantity),
      };
    })
    .filter((estimate): estimate is NonNullable<typeof estimate> => Boolean(estimate));

  if (estimates.length === 0) {
    return undefined;
  }

  return {
    coveredItemCount: estimates.length,
    cycleCostLow: roundCurrency(estimates.reduce((sum, estimate) => sum + estimate.cycleCostLow, 0)),
    cycleCostHigh: roundCurrency(estimates.reduce((sum, estimate) => sum + estimate.cycleCostHigh, 0)),
    monthlyCostLow: roundCurrency(estimates.reduce((sum, estimate) => sum + estimate.monthlyCostLow, 0)),
    monthlyCostHigh: roundCurrency(estimates.reduce((sum, estimate) => sum + estimate.monthlyCostHigh, 0)),
    drivers: [...estimates].sort((a, b) => b.monthlyCostHigh - a.monthlyCostHigh).slice(0, 3),
  };
}

export function formatCostRange(low: number, high: number) {
  if (Math.abs(low - high) < 0.01) {
    return formatCurrencyValue(low);
  }

  return `${formatCurrencyValue(low)}-${formatCurrencyValue(high)}`;
}

export function formatConfidenceLabel(confidence: CostConfidence) {
  switch (confidence) {
    case "high":
      return "High confidence";
    case "medium":
      return "Moderate confidence";
    case "low":
      return "Low confidence";
    case "none":
    default:
      return "No estimate";
  }
}
