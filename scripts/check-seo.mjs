const baseUrl = (process.env.SEO_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const canonicalBaseUrl = (process.env.SEO_CANONICAL_URL || "https://peptidepros.io").replace(/\/$/, "");

const blockedPrefixes = [
  "/admin/",
  "/api/",
  "/auth/",
  "/dashboard/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/quiz/results",
  "/plan/",
  "/shared/",
  "/stack-builder/",
  "/checkout/",
  "/pdfs/",
  "/out/",
];

const representativePaths = [
  "/peptides/bpc-157",
  "/blog/tirzepatide-vs-semaglutide-fat-loss",
  "/guides/how-to-read-a-coa",
  "/vendors/amino-club",
  "/goals/recovery-injury-support",
  "/tools/reconstitution/bpc-157",
  "/compare/peptides/semaglutide-vs-tirzepatide",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function fetchText(path) {
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  const response = await fetch(url, { redirect: "follow" });
  assert(response.ok, `${url} returned ${response.status}`);
  return response.text();
}

function extractSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
}

function canonicalFor(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
}

function ogTitleFor(html) {
  return html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
}

async function main() {
  const robots = await fetchText("/robots.txt");
  assert(robots.includes("Sitemap:"), "robots.txt is missing Sitemap directive");

  const sitemap = await fetchText("/sitemap.xml");
  const urls = extractSitemapUrls(sitemap);
  assert(urls.length > 0, "sitemap has no URLs");

  for (const rawUrl of urls) {
    const path = new URL(rawUrl).pathname;
    const blocked = blockedPrefixes.find((prefix) => path.startsWith(prefix));
    assert(!blocked, `sitemap contains blocked path ${path} matching ${blocked}`);
  }

  for (const path of representativePaths) {
    const html = await fetchText(path);
    const canonical = canonicalFor(html);
    const ogTitle = ogTitleFor(html);

    assert(canonical === `${canonicalBaseUrl}${path}`, `${path} canonical mismatch: ${canonical}`);
    assert(ogTitle && ogTitle !== "PeptidePros", `${path} has generic or missing og:title`);
    assert(!html.includes('href="/goals/recovery"'), `${path} links to broken /goals/recovery`);
  }

  if (canonicalBaseUrl.includes("peptidepros.io")) {
    const wwwResponse = await fetch(`${canonicalBaseUrl.replace("://", "://www.")}/peptides/bpc-157`, {
      redirect: "manual",
    }).catch(() => null);
    assert(wwwResponse, "www host check failed to connect");
    assert(
      [301, 302, 307, 308].includes(wwwResponse.status) || wwwResponse.url === `${canonicalBaseUrl}/peptides/bpc-157`,
      "www host did not redirect to apex for /peptides/bpc-157",
    );
  }

  console.log(`SEO checks passed for ${baseUrl} (${urls.length} sitemap URLs checked).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
