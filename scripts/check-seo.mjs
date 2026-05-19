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
  "/peptides",
  "/peptides/bpc-157",
  "/quiz",
  "/stack-builder",
  "/blog/tirzepatide-vs-semaglutide-fat-loss",
  "/guides/how-to-read-a-coa",
  "/vendors/amino-club",
  "/vendors/compare",
  "/goals/recovery-injury-support",
  "/tools/reconstitution/bpc-157",
  "/compare/peptides/semaglutide-vs-tirzepatide",
  "/about",
  "/privacy",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function fetchPage(path) {
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  const response = await fetch(url, { redirect: "follow" });
  assert(response.ok, `${url} returned ${response.status}`);
  return {
    html: await response.text(),
    finalUrl: response.url,
  };
}

async function fetchText(path) {
  return (await fetchPage(path)).html;
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

function pageTitleFor(html) {
  return html.match(/<title>([^<]+)<\/title>/)?.[1];
}

function metaDescriptionFor(html) {
  return html.match(/<meta name="description" content="([^"]+)"/)?.[1];
}

function decodeHtml(value) {
  return value
    ?.replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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
    const { html, finalUrl } = await fetchPage(path);
    const expectedPath = new URL(finalUrl).pathname;
    const canonical = canonicalFor(html);
    const ogTitle = decodeHtml(ogTitleFor(html));
    const pageTitle = decodeHtml(pageTitleFor(html));
    const metaDescription = decodeHtml(metaDescriptionFor(html));

    assert(canonical === `${canonicalBaseUrl}${expectedPath}`, `${path} canonical mismatch: ${canonical}`);
    assert(ogTitle && ogTitle !== "PeptidePros", `${path} has generic or missing og:title`);
    assert(pageTitle && pageTitle.length >= 35, `${path} title is too short: ${pageTitle}`);
    assert(
      metaDescription && metaDescription.length >= 120,
      `${path} meta description is too short: ${metaDescription}`,
    );
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
