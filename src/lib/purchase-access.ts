import { createHash, randomBytes } from "crypto";

export function createPurchaseAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashPurchaseAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPurchaseAccessTokenMap(productSlugs: string[]) {
  return Object.fromEntries(
    productSlugs.map((slug) => [slug, createPurchaseAccessToken()])
  ) as Record<string, string>;
}

export function parsePurchaseAccessTokenMap(value: string | undefined) {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" &&
          typeof entry[1] === "string" &&
          entry[0].length > 0 &&
          entry[1].length > 0
      )
    );
  } catch {
    return {};
  }
}

