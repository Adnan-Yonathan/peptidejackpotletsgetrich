export type ShopperCountry =
  | "us"
  | "ca"
  | "uk"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "nl"
  | "ie"
  | "au"
  | "nz"
  | "sg"
  | "other_international";

export type ShopperRegion = "us" | "international";
export type CurrencyCode = "USD" | "EUR";

export function getShopperRegion(country?: ShopperCountry): ShopperRegion {
  return country === "us" ? "us" : "international";
}

export function getCurrencySymbol(currencyCode: CurrencyCode) {
  return currencyCode === "EUR" ? "€" : "$";
}
