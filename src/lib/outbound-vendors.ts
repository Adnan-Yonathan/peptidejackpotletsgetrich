import { getAffiliateUrlForVendor } from "@/data/affiliate-links";
import { getPeptideBySlug } from "@/data/peptides";
import {
  getListingShopperRegion,
  getVendorListingForPeptideAndVendor,
  getVendorListingsForPeptide,
} from "@/data/vendor-listings";
import { getVendorById, getVendorBySlug } from "@/data/vendors";
import { getShopperRegion, type ShopperCountry, type ShopperRegion } from "@/lib/shopper-country";

export interface OutboundVendorTarget {
  url: string;
  mode: "affiliate_product" | "affiliate_vendor" | "source_listing";
  vendorId: string;
  peptideId: string;
}

export function buildOutboundVendorHref(vendorSlug: string, peptideSlug: string, sourcePage: string, planId?: string) {
  const params = new URLSearchParams({ sourcePage });
  if (planId) params.set("planId", planId);
  return `/out/${vendorSlug}/${peptideSlug}?${params.toString()}`;
}

export function resolveOutboundVendorTarget(vendorId: string, peptideId: string): OutboundVendorTarget | null {
  const affiliateUrl = getAffiliateUrlForVendor(vendorId, peptideId);
  if (affiliateUrl) {
    return {
      url: affiliateUrl,
      mode: getAffiliateUrlForVendor(vendorId, peptideId) === getAffiliateUrlForVendor(vendorId) ? "affiliate_vendor" : "affiliate_product",
      vendorId,
      peptideId,
    };
  }

  const listing = getVendorListingForPeptideAndVendor(peptideId, vendorId);
  if (listing?.productPageUrl) {
    return {
      url: listing.productPageUrl,
      mode: "source_listing",
      vendorId,
      peptideId,
    };
  }

  return null;
}

export function resolveOutboundVendorTargetFromSlugs(vendorSlug: string, peptideSlug: string): OutboundVendorTarget | null {
  const vendor = getVendorBySlug(vendorSlug);
  const peptide = getPeptideBySlug(peptideSlug);
  if (!vendor || !peptide) return null;
  return resolveOutboundVendorTarget(vendor.id, peptide.id);
}

function resolvePreferredRegion(country?: ShopperCountry, shopperRegion?: ShopperRegion) {
  if (shopperRegion) return shopperRegion;
  if (country) return getShopperRegion(country);
  return undefined;
}

export function getPreferredVendorListingForPeptide(
  peptideId: string,
  options?: { shopperCountry?: ShopperCountry; shopperRegion?: ShopperRegion }
) {
  const listings = getVendorListingsForPeptide(peptideId);
  const preferredRegion = resolvePreferredRegion(options?.shopperCountry, options?.shopperRegion);
  const filteredListings = preferredRegion
    ? listings.filter((listing) => getListingShopperRegion(listing) === preferredRegion)
    : listings;
  const listingsToUse = filteredListings.length > 0 ? filteredListings : listings;

  const scored = listingsToUse
    .map((listing) => {
      let score = 0;
      const target = resolveOutboundVendorTarget(listing.vendorId, peptideId);
      if (target?.mode === "affiliate_product") score += 100;
      if (target?.mode === "affiliate_vendor") score += 50;
      if (listing.affiliateProgramStatus.includes("affiliate")) score += 10;
      if (listing.vendor?.vendorType === "consumer_ruo") score += 5;
      return { listing, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.listing;
}

export function getPreferredVendorForPeptide(
  peptideId: string,
  options?: { shopperCountry?: ShopperCountry; shopperRegion?: ShopperRegion }
) {
  const listing = getPreferredVendorListingForPeptide(peptideId, options);
  if (!listing) return null;
  return {
    vendor: getVendorById(listing.vendorId),
    listing,
    target: resolveOutboundVendorTarget(listing.vendorId, peptideId),
  };
}

export function getRegionalVendorOptionsForPeptide(peptideId: string) {
  const listings = getVendorListingsForPeptide(peptideId);
  const hasUs = listings.some((listing) => getListingShopperRegion(listing) === "us");
  const hasInternational = listings.some(
    (listing) => getListingShopperRegion(listing) === "international"
  );
  const us = hasUs ? getPreferredVendorForPeptide(peptideId, { shopperRegion: "us" }) : null;
  const international = hasInternational
    ? getPreferredVendorForPeptide(peptideId, { shopperRegion: "international" })
    : null;
  return { us, international };
}
