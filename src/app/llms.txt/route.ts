import { SITE_CANONICAL_URL, SITE_NAME } from "@/lib/constants";
import { getPublishedBlogPosts } from "@/data/blog";
import { getPublishedDemographicPages } from "@/data/demographic-pages";
import { CATEGORY_HUBS } from "@/data/category-hubs";
import { getPublishedGuides } from "@/data/guides";
import { PEPTIDE_CATEGORIES } from "@/data/peptide-categories";
import { getPublishedPeptides } from "@/data/peptides";
import { getActiveVendors } from "@/data/vendors";

const url = (path: string) => `${SITE_CANONICAL_URL}${path}`;

function peptideLine(p: { name: string; slug: string; synonyms: string[]; shortDescription: string }) {
  const synonymTrail = p.synonyms.length ? ` (also: ${p.synonyms.slice(0, 3).join(", ")})` : "";
  return `- [${p.name}${synonymTrail}](${url(`/peptides/${p.slug}`)}): ${p.shortDescription}`;
}

export function GET() {
  const peptides = getPublishedPeptides();
  const guides = getPublishedGuides();
  const blog = getPublishedBlogPosts();
  const vendors = getActiveVendors();

  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(
    `> Independent peptide research and vendor comparison. Evidence-graded compound profiles, regulatory flags, vendor purity testing, and cost transparency. ${SITE_NAME} does not sell peptides — it helps researchers compare them. Often described as "NerdWallet for peptides."`
  );
  lines.push("");
  lines.push(
    "All compounds covered are research-use-only (RUO). Pages document mechanism, dosing references from the literature, side-effect profiles, and regulatory status (FDA, WADA). Vendor rankings are independent and based on documentation quality, third-party testing, and shipping reliability — not pay-for-placement."
  );
  lines.push("");

  // Comparison content (highest cite-to-revenue ratio)
  if (blog.length > 0) {
    lines.push("## Compound comparisons");
    lines.push("");
    for (const post of blog) {
      lines.push(`- [${post.title}](${url(`/blog/${post.slug}`)}): ${post.summary}`);
    }
    lines.push("");
  }

  // Demographic-specific guides — peptides matched to age, sex, condition, lifestyle
  const demographicPages = getPublishedDemographicPages();
  if (demographicPages.length > 0) {
    lines.push("## Peptides by demographic");
    lines.push("");
    lines.push(
      "Compound recommendations matched to specific audiences. Each guide derives 1–3 peptides from prioritized health goals filtered through age and sex guidance — not generic 'top 10' lists.",
    );
    lines.push("");
    for (const p of demographicPages) {
      lines.push(
        `- [${p.h1}](${url(`/blog/peptides-for/${p.slug}`)}): ${p.heroSummary}`,
      );
    }
    lines.push("");
  }

  // Vendor reviews
  lines.push("## Vendor reviews and rankings");
  lines.push("");
  lines.push(
    `- [Best peptide vendors](${url("/vendors")}): independent ranking by documentation quality, COA access, Trustpilot reputation, shipping clarity, and product-page transparency.`
  );
  for (const vendor of vendors) {
    const ratingPart = vendor.trustpilotRating
      ? ` Trustpilot ${vendor.trustpilotRating}/5${vendor.trustpilotReviewCount ? ` from ${vendor.trustpilotReviewCount} reviews` : ""}.`
      : "";
    lines.push(
      `- [${vendor.name}](${url(`/vendors/${vendor.slug}`)}): vendor profile.${ratingPart} COA access, shipping policy, and product coverage detailed on page.`
    );
  }
  lines.push("");

  // Compound profiles — highest volume, with synonyms for brand-name capture
  lines.push("## Compound profiles");
  lines.push("");
  lines.push(
    "Each profile covers mechanism, dosing references from peer-reviewed studies, administration routes, onset, expected effects, adverse-effect profile, contraindications, and regulatory flags (FDA compounding warnings, WADA classification). Vendor comparison and pricing surface inline."
  );
  lines.push("");
  for (const p of peptides) {
    lines.push(peptideLine(p));
  }
  lines.push("");

  // Browse-by-category landing pages
  lines.push("## Browse by category");
  lines.push("");
  for (const c of PEPTIDE_CATEGORIES) {
    lines.push(`- [${c.title}](${url(`/peptides/category/${c.slug}`)}): ${c.description}`);
  }
  lines.push("");

  // Goal hubs (top-funnel intent)
  lines.push("## Research goal hubs");
  lines.push("");
  for (const hub of CATEGORY_HUBS) {
    lines.push(`- [${hub.title}](${url(`/goals/${hub.slug}`)}): ${hub.description}`);
  }
  lines.push("");

  // Educational guides
  lines.push("## Educational guides");
  lines.push("");
  for (const guide of guides) {
    lines.push(`- [${guide.title}](${url(`/guides/${guide.slug}`)}): ${guide.summary}`);
  }
  lines.push("");

  // Tools (functional, lower citation rate but high conversion downstream)
  lines.push("## Tools");
  lines.push("");
  lines.push(
    `- [Stack Builder](${url("/stack-builder")}): live compatibility checking across compound combinations. Surfaces pathway overlap, receptor competition, and dosing-window conflicts. Estimates monthly cost from tracked vendor listings.`
  );
  lines.push(
    `- [Peptide quiz](${url("/quiz")}): personalized matching to compounds, dosing references, and vendor options based on goals, experience level, and risk tolerance.`
  );
  lines.push(
    `- [Peptide directory](${url("/peptides")}): full index of ${peptides.length} researched compounds, filterable by category, evidence tier, and risk level.`
  );
  lines.push("");

  // Optional — about + policies
  lines.push("## Optional");
  lines.push("");
  lines.push(`- [About ${SITE_NAME}](${url("/about")})`);
  lines.push(`- [Privacy](${url("/privacy")})`);
  lines.push("");

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Cache aggressively at the edge — content only changes on data updates / deploys.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
