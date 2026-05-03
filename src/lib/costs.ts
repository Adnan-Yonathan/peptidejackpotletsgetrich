import { getCostModelForPeptide, type CostUnit, type UsageModel } from "@/data/costs";
import {
  getListingCurrencyCode,
  getListingPriceBounds,
  getListingShopperRegion,
  getVendorListingsForPeptide,
  type ResolvedVendorListing,
} from "@/data/vendor-listings";
import { getCurrencySymbol, getShopperRegion, type CurrencyCode, type ShopperCountry, type ShopperRegion } from "@/lib/shopper-country";

export type CostConfidence = "high" | "medium" | "low" | "none";
export type CostEstimateSource = "tracked_listing";

export interface ListingCostEstimate {
  costPerUnitLow: number;
  costPerUnitHigh: number;
  cycleCostLow: number;
  cycleCostHigh: number;
  monthlyCostLow: number;
  monthlyCostHigh: number;
  confidence: CostConfidence;
  unit: CostUnit;
  currencyCode: CurrencyCode;
}

export interface PeptideCostEstimate extends ListingCostEstimate {
  cycleWeeks: number;
  cycleLabel: string;
  usageModel: UsageModel;
  amountPerCycleLow: number;
  amountPerCycleHigh: number;
  note: string;
  basedOnListings: number;
  estimateSource: CostEstimateSource;
  sourceLabel: string;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function formatCurrencyValue(value: number, currencyCode: CurrencyCode) {
  return `${getCurrencySymbol(currencyCode)}${value.toFixed(2)}`;
}

function classifyListingConfidence(listing: ResolvedVendorListing): CostConfidence {
  const bounds = getListingPriceBounds(listing);
  if (
    bounds &&
    listing.packSizeLowMg !== undefined &&
    listing.packSizeHighMg !== undefined
  ) {
    if (bounds.low === bounds.high && listing.packSizeLowMg === listing.packSizeHighMg) {
      return "high";
    }

    return "medium";
  }

  if (listing.packSizeLowMg !== undefined || listing.packSizeHighMg !== undefined) {
    return "low";
  }

  return "none";
}

export interface CostEstimateOptions {
  shopperCountry?: ShopperCountry;
  shopperRegion?: ShopperRegion;
  outputCurrency?: CurrencyCode;
}

const USD_CONVERSION_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.09,
};

export function convertCurrencyValue(value: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode) {
  if (fromCurrency === toCurrency) return value;

  const valueInUsd = value * USD_CONVERSION_RATES[fromCurrency];
  return valueInUsd / USD_CONVERSION_RATES[toCurrency];
}

function resolvePreferredRegion(options?: CostEstimateOptions): ShopperRegion | undefined {
  if (options?.shopperRegion) return options.shopperRegion;
  if (options?.shopperCountry) return getShopperRegion(options.shopperCountry);
  return undefined;
}

export function getListingCostEstimate(peptideId: string, listing: ResolvedVendorListing): ListingCostEstimate | undefined {
  const model = getCostModelForPeptide(peptideId);
  const bounds = getListingPriceBounds(listing);

  if (
    !model ||
    model.unit !== "mg" ||
    !bounds ||
    listing.packSizeLowMg === undefined ||
    listing.packSizeHighMg === undefined
  ) {
    return undefined;
  }

  const costPerUnitLow = bounds.low / listing.packSizeHighMg;
  const costPerUnitHigh = bounds.high / listing.packSizeLowMg;
  const cycleCostLow = costPerUnitLow * model.amountPerCycleLow;
  const cycleCostHigh = costPerUnitHigh * model.amountPerCycleHigh;
  const monthlyFactor = 4 / model.cycleWeeks;

  return {
    costPerUnitLow: roundCurrency(costPerUnitLow),
    costPerUnitHigh: roundCurrency(costPerUnitHigh),
    cycleCostLow: roundCurrency(cycleCostLow),
    cycleCostHigh: roundCurrency(cycleCostHigh),
    monthlyCostLow: roundCurrency(cycleCostLow * monthlyFactor),
    monthlyCostHigh: roundCurrency(cycleCostHigh * monthlyFactor),
    confidence: classifyListingConfidence(listing),
    unit: model.unit,
    currencyCode: bounds.currencyCode,
  };
}

export function getPeptideCostEstimate(
  peptideId: string,
  options?: CostEstimateOptions
): PeptideCostEstimate | undefined {
  const model = getCostModelForPeptide(peptideId);
  if (!model) {
    return undefined;
  }

  const preferredRegion = resolvePreferredRegion(options);
  const listings = getVendorListingsForPeptide(peptideId);
  const filteredListings = preferredRegion
    ? listings.filter((listing) => getListingShopperRegion(listing) === preferredRegion)
    : listings;
  const listingsToUse = filteredListings.length > 0 ? filteredListings : listings;
  const listingEstimates = listings
    .filter((listing) => listingsToUse.some((candidate) => candidate.vendorId === listing.vendorId && candidate.productPageUrl === listing.productPageUrl))
    .map((listing) => getListingCostEstimate(peptideId, listing))
    .filter((estimate): estimate is ListingCostEstimate => Boolean(estimate));

  if (listingEstimates.length === 0) return undefined;

  const currencyCode = listingEstimates[0].currencyCode;
  const sameCurrencyEstimates = listingEstimates.filter((estimate) => estimate.currencyCode === currencyCode);

  const cycleCostLow = Math.min(...sameCurrencyEstimates.map((estimate) => estimate.cycleCostLow));
  const cycleCostHigh = Math.max(...sameCurrencyEstimates.map((estimate) => estimate.cycleCostHigh));
  const monthlyCostLow = Math.min(...sameCurrencyEstimates.map((estimate) => estimate.monthlyCostLow));
  const monthlyCostHigh = Math.max(...sameCurrencyEstimates.map((estimate) => estimate.monthlyCostHigh));
  const costPerUnitLow = Math.min(...sameCurrencyEstimates.map((estimate) => estimate.costPerUnitLow));
  const costPerUnitHigh = Math.max(...sameCurrencyEstimates.map((estimate) => estimate.costPerUnitHigh));

  const confidence: CostConfidence =
    sameCurrencyEstimates.some((estimate) => estimate.confidence === "high")
      ? "high"
      : sameCurrencyEstimates.some((estimate) => estimate.confidence === "medium")
        ? "medium"
        : "low";

  const outputCurrency = options?.outputCurrency ?? currencyCode;

  return {
    cycleWeeks: model.cycleWeeks,
    cycleLabel: model.cycleLabel,
    usageModel: model.usageModel,
    amountPerCycleLow: model.amountPerCycleLow,
    amountPerCycleHigh: model.amountPerCycleHigh,
    note: model.note,
    basedOnListings: sameCurrencyEstimates.length,
    estimateSource: "tracked_listing",
    sourceLabel: `${sameCurrencyEstimates.length} tracked affiliated listing${sameCurrencyEstimates.length === 1 ? "" : "s"}`,
    costPerUnitLow: roundCurrency(convertCurrencyValue(costPerUnitLow, currencyCode, outputCurrency)),
    costPerUnitHigh: roundCurrency(convertCurrencyValue(costPerUnitHigh, currencyCode, outputCurrency)),
    cycleCostLow: roundCurrency(convertCurrencyValue(cycleCostLow, currencyCode, outputCurrency)),
    cycleCostHigh: roundCurrency(convertCurrencyValue(cycleCostHigh, currencyCode, outputCurrency)),
    monthlyCostLow: roundCurrency(convertCurrencyValue(monthlyCostLow, currencyCode, outputCurrency)),
    monthlyCostHigh: roundCurrency(convertCurrencyValue(monthlyCostHigh, currencyCode, outputCurrency)),
    confidence,
    unit: model.unit,
    currencyCode: outputCurrency,
  };
}

export function getStackCostEstimate(
  items: Array<{ peptideId: string; quantity?: number }>,
  options?: CostEstimateOptions
) {
  const estimates = items
    .map((item) => {
      const estimate = getPeptideCostEstimate(item.peptideId, options);
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
        currencyCode: estimate.currencyCode,
        estimateSource: estimate.estimateSource,
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
    hasBenchmarkFallback: false,
    currencyCode: estimates[0].currencyCode,
  };
}

export function formatCostRange(low: number, high: number, currencyCode: CurrencyCode = "USD") {
  if (Math.abs(low - high) < 0.01) {
    return formatCurrencyValue(low, currencyCode);
  }

  return `${formatCurrencyValue(low, currencyCode)}-${formatCurrencyValue(high, currencyCode)}`;
}

export function formatConfidenceLabel(confidence: CostConfidence) {
  switch (confidence) {
    case "high":
      return "High confidence";
    case "medium":
      return "Moderate confidence";
    case "low":
      return "Planning estimate";
    case "none":
    default:
      return "No estimate";
  }
}

export function formatCostUnit(unit: CostUnit, amount: number) {
  if (unit === "mL") {
    return `${amount} mL`;
  }

  return `${amount} mg`;
}

export function formatUsageModelLabel(usageModel: UsageModel) {
  switch (usageModel) {
    case "continuous":
      return "Continuous";
    case "phase_based":
      return "Phase-based";
    case "short_burst":
      return "Short burst";
    case "intermittent":
      return "Intermittent";
    case "insufficient_evidence":
    default:
      return "Insufficient evidence";
  }
}
