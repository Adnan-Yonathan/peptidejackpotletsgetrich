export type DisclaimerVariant = "research" | "vendor" | "tool" | "comparison";

export interface SourceCitation {
  title: string;
  publisher: string;
  url: string;
  accessedAt?: string;
  note?: string;
}

export interface EditorialReview {
  authorName: string;
  reviewerName?: string;
  lastReviewedAt: string;
  methodologySummary: string;
  disclaimerVariant: DisclaimerVariant;
  sources: SourceCitation[];
}

export const EDITORIAL_AUTHOR = "PeptidePros Research Desk";
export const EDITORIAL_REVIEWER = "PeptidePros Compliance Review";

export const CORE_PEPTIDE_SOURCES: SourceCitation[] = [
  {
    title: "Certain Bulk Drug Substances for Use in Compounding that May Present Significant Safety Risks",
    publisher: "U.S. Food and Drug Administration",
    url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    accessedAt: "2026-05-15",
    note: "Used for FDA compounding-risk context and peptide safety flags.",
  },
  {
    title: "The Prohibited List",
    publisher: "World Anti-Doping Agency",
    url: "https://www.wada-ama.org/en/prohibited-list",
    accessedAt: "2026-05-15",
    note: "Used for athlete-facing WADA risk and peptide-class restrictions.",
  },
  {
    title: "Peptide therapeutics: current status and future directions",
    publisher: "PubMed / Nature Reviews Drug Discovery",
    url: "https://pubmed.ncbi.nlm.nih.gov/25692639/",
    accessedAt: "2026-05-15",
    note: "Used for broad peptide-therapeutics background and evidence framing.",
  },
];

export const VENDOR_REVIEW_SOURCES: SourceCitation[] = [
  {
    title: "PeptidePros vendor scoring methodology",
    publisher: "PeptidePros",
    url: "/methodology#vendor-scoring",
    note: "Explains documentation, reputation, operations, and affiliate-policy scoring.",
  },
  {
    title: "Trustpilot vendor review pages",
    publisher: "Trustpilot",
    url: "https://www.trustpilot.com/",
    accessedAt: "2026-05-15",
    note: "Used only where a vendor profile stores a public Trustpilot URL and review count.",
  },
];

export const TOOL_REVIEW_SOURCES: SourceCitation[] = [
  {
    title: "PeptidePros calculator methodology",
    publisher: "PeptidePros",
    url: "/methodology#tools",
    note: "Explains calculator assumptions, non-medical scope, and why outputs require label verification.",
  },
  ...CORE_PEPTIDE_SOURCES.slice(0, 2),
];

const disclaimerCopy: Record<DisclaimerVariant, string> = {
  research:
    "Educational research only. PeptidePros does not provide medical advice, prescribe compounds, or sell peptides. Review all decisions with a licensed clinician.",
  vendor:
    "Vendor pages are independent research aids and may include affiliate links. PeptidePros does not sell peptides and does not verify live inventory, current pricing, or product suitability at checkout.",
  tool:
    "Calculator outputs are math helpers, not dosing instructions. Always verify vial labels, concentration, sterility practices, and clinician guidance before acting on any result.",
  comparison:
    "Comparisons summarize research context and decision tradeoffs. They are not medical recommendations and should not be treated as instructions to use either compound.",
};

export function getDisclaimerCopy(variant: DisclaimerVariant) {
  return disclaimerCopy[variant];
}

export function buildEditorialReview({
  lastReviewedAt,
  methodologySummary,
  disclaimerVariant,
  sources,
  authorName = EDITORIAL_AUTHOR,
  reviewerName = EDITORIAL_REVIEWER,
}: {
  lastReviewedAt: string;
  methodologySummary: string;
  disclaimerVariant: DisclaimerVariant;
  sources: SourceCitation[];
  authorName?: string;
  reviewerName?: string;
}): EditorialReview {
  return {
    authorName,
    reviewerName,
    lastReviewedAt,
    methodologySummary,
    disclaimerVariant,
    sources,
  };
}

export function getDefaultPeptideReview(lastReviewedAt = "2026-05-15"): EditorialReview {
  return buildEditorialReview({
    lastReviewedAt,
    methodologySummary:
      "Evidence tier, regulatory status, WADA/FDA flags, study-dose language, contraindications, and vendor availability were reviewed together.",
    disclaimerVariant: "research",
    sources: CORE_PEPTIDE_SOURCES,
  });
}

export function getDefaultComparisonReview(lastReviewedAt = "2026-05-15"): EditorialReview {
  return buildEditorialReview({
    lastReviewedAt,
    methodologySummary:
      "Comparison factors are generated from the peptide evidence, risk, regulatory, cost, and vendor data layers, then framed for user intent.",
    disclaimerVariant: "comparison",
    sources: CORE_PEPTIDE_SOURCES,
  });
}

export function getDefaultVendorReview(lastReviewedAt = "2026-05-15"): EditorialReview {
  return buildEditorialReview({
    lastReviewedAt,
    methodologySummary:
      "Vendor profiles weigh documentation access, product-page specificity, reputation signals, shipping clarity, support visibility, and affiliate disclosure.",
    disclaimerVariant: "vendor",
    sources: VENDOR_REVIEW_SOURCES,
  });
}

export function getDefaultToolReview(lastReviewedAt = "2026-05-15"): EditorialReview {
  return buildEditorialReview({
    lastReviewedAt,
    methodologySummary:
      "Tool pages are reviewed for calculation scope, label-verification language, medical-boundary language, and links back to peptide risk context.",
    disclaimerVariant: "tool",
    sources: TOOL_REVIEW_SOURCES,
  });
}

export function getDefaultArticleReview(lastReviewedAt: string): EditorialReview {
  return buildEditorialReview({
    lastReviewedAt,
    methodologySummary:
      "Article claims are reviewed against the peptide data layer, regulatory context, safety language, and source quality before publication.",
    disclaimerVariant: "research",
    sources: CORE_PEPTIDE_SOURCES,
  });
}

export function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
