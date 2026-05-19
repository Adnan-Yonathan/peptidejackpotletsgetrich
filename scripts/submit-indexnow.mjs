import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const dryRun = process.argv.includes("--dry-run");

function loadLocalEnv() {
  const envPath = resolve(".env.local");
  if (!existsSync(envPath)) return;

  const env = readFileSync(envPath, "utf8");
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [name, ...valueParts] = trimmed.split("=");
    if (!process.env[name]) {
      process.env[name] = valueParts.join("=").trim();
    }
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1])
    .map((url) => url.trim())
    .filter(Boolean);
}

loadLocalEnv();

const siteUrl = (process.env.SEO_CANONICAL_URL || "https://peptidepros.io").replace(/\/$/, "");
const sitemapUrl = process.env.INDEXNOW_SITEMAP_URL || `${siteUrl}/sitemap.xml`;
const endpoint = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const host = new URL(siteUrl).host;
const key = (process.env.BING_WEBMASTER_KEY || process.env.INDEXNOW_KEY)?.trim();
assert(key, "Missing BING_WEBMASTER_KEY or INDEXNOW_KEY. Add it to .env.local or your deployment environment.");

const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `${siteUrl}/${key}.txt`;

const sitemapResponse = await fetch(sitemapUrl, { redirect: "follow" });
assert(sitemapResponse.ok, `${sitemapUrl} returned ${sitemapResponse.status}`);

const urls = extractSitemapUrls(await sitemapResponse.text()).filter((url) => {
  try {
    return new URL(url).host === host;
  } catch {
    return false;
  }
});

assert(urls.length > 0, "No URLs found in sitemap.");
assert(urls.length <= 10000, `IndexNow accepts up to 10,000 URLs per request; found ${urls.length}.`);

const blocked = urls.filter((url) => {
  const pathname = new URL(url).pathname;
  return [
    "/admin/",
    "/api/",
    "/auth/",
    "/dashboard/",
    "/checkout/",
    "/pdfs/",
    "/out/",
    "/plan/",
    "/shared/",
  ].some((prefix) => pathname.startsWith(prefix));
});

assert(blocked.length === 0, `Refusing to submit blocked URLs: ${blocked.slice(0, 5).join(", ")}`);

const payload = {
  host,
  key,
  keyLocation,
  urlList: urls,
};

if (dryRun) {
  console.log(`IndexNow dry run: ${urls.length} URLs would be submitted to ${endpoint}.`);
  console.log(`Key location: ${keyLocation}`);
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

const body = await response.text();

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow submission failed with ${response.status}: ${body}`);
}

console.log(`IndexNow accepted ${urls.length} URLs with status ${response.status}.`);
