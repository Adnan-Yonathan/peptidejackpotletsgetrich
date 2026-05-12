export type BlogCategoryId =
  | "metabolic"
  | "aesthetic"
  | "recovery"
  | "vibe"
  | "logistics"
  | "trust"
  | "buying"
  | "comparisons";

export type BlogStatus = "published" | "draft";
export type BlogCalloutType = "note" | "warning" | "danger" | "compliance";

export interface BlogCategory {
  id: BlogCategoryId;
  title: string;
  description: string;
}

export interface BlogCallout {
  type: BlogCalloutType;
  title: string;
  body: string;
}

export interface BlogTable {
  columns: string[];
  rows: string[][];
  caption?: string;
}

export interface BlogSection {
  id: string;
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  checklist?: string[];
  callout?: BlogCallout;
  table?: BlogTable;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** 40–50 word "answer-first" lead used for AI Overview / Position Zero extraction. */
  answerFirst: string;
  categoryId: BlogCategoryId;
  audience: string[];
  status: BlogStatus;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  /** Primary keyword/intent for internal tracking. */
  primaryKeyword: string;
  whyItMatters: string[];
  keyTakeaways: string[];
  sections: BlogSection[];
  faqs: BlogFaq[];
  relatedPostIds: string[];
  relatedPeptideIds: string[];
  relatedGoalIds: string[];
  /** Whether this post should show the quiz CTA in its hero/right rail. Defaults to true. */
  showQuizCta?: boolean;
  featured?: boolean;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "metabolic",
    title: "Metabolic & Weight",
    description: "GLP-1, GIP, fat loss, body recomposition, and appetite-regulating compounds.",
  },
  {
    id: "aesthetic",
    title: "Aesthetic & Looksmaxxing",
    description: "Skin quality, hair density, and sculpted-physique research peptides.",
  },
  {
    id: "recovery",
    title: "Recovery & Healing",
    description: "Soft-tissue, tendon, and post-surgery recovery — including the BPC-157 + TB-500 stack.",
  },
  {
    id: "vibe",
    title: "Vibe & Performance",
    description: "Cognition, mood, sleep, and libido peptides.",
  },
  {
    id: "logistics",
    title: "Dosing & Logistics",
    description: "Reconstitution math, injection sites, storage, shelf life, and travel.",
  },
  {
    id: "trust",
    title: "Trust & Safety",
    description: "Reading COAs, Janoshik testing, vendor purity verification, and side-effect literacy.",
  },
  {
    id: "buying",
    title: "Buying Guides",
    description: "Cost, vendor comparisons, and where to research peptides safely.",
  },
  {
    id: "comparisons",
    title: "Head-to-Head Comparisons",
    description: "Compound-vs-compound and stack-vs-stack breakdowns.",
  },
];

export const BLOG_POSTS: BlogPostData[] = [
  {
    id: "tirzepatide-vs-semaglutide-fat-loss",
    slug: "tirzepatide-vs-semaglutide-fat-loss",
    title: "Tirzepatide vs. Semaglutide for Fat Loss",
    summary:
      "How tirzepatide and semaglutide actually differ on weight outcomes, side effects, dosing, and cost — and which one researchers tend to pick first.",
    answerFirst:
      "Tirzepatide (Mounjaro / Zepbound) is a dual GLP-1 + GIP agonist and produces ~22% body-weight loss in trials versus ~15% for semaglutide (Ozempic / Wegovy). Tirzepatide tends to outperform on fat loss but is newer, more expensive, and has a similar side-effect profile.",
    categoryId: "metabolic",
    audience: ["beginner", "intermediate"],
    status: "published",
    publishedAt: "2026-04-29",
    updatedAt: "2026-04-29",
    seoTitle: "Tirzepatide vs. Semaglutide for Fat Loss (2026)",
    seoDescription:
      "Side-by-side comparison of tirzepatide vs. semaglutide: weight-loss results, side effects, dosing, cost, and which to choose for fat loss.",
    heroEyebrow: "Metabolic",
    primaryKeyword: "tirzepatide vs semaglutide",
    whyItMatters: [
      "These are the two most-searched GLP-1 compounds in 2026 and the most common starting point for fat-loss research.",
      "Both compounds work, but they differ on average outcomes, side-effect intensity, dose escalation, and price.",
      "Choosing between them without understanding the trade-offs leads to the wrong starting point and unnecessary side effects.",
    ],
    keyTakeaways: [
      "Tirzepatide produced ~22% body-weight loss in SURMOUNT-1 vs. ~15% for semaglutide in STEP-1 — meaningful gap, but with overlap.",
      "Both share the same GI side-effect profile (nausea, constipation, reflux); titration speed matters more than compound choice.",
      "Tirzepatide is dual-action (GLP-1 + GIP), semaglutide is GLP-1 only — the dual mechanism is the leading hypothesis for the gap.",
      "Cost-per-month is meaningfully higher for tirzepatide, especially at maintenance dosing.",
    ],
    sections: [
      {
        id: "results",
        title: "Weight loss results",
        intro:
          "The cleanest comparison comes from each compound's pivotal trial. Both used a similar patient profile, both ran 68–72 weeks.",
        bullets: [
          "Tirzepatide (SURMOUNT-1, 15 mg): ~22.5% mean body-weight reduction at 72 weeks.",
          "Semaglutide (STEP-1, 2.4 mg): ~14.9% mean body-weight reduction at 68 weeks.",
          "Both compounds beat placebo by a wide margin (~3% on placebo).",
        ],
        callout: {
          type: "note",
          title: "Trial caveat",
          body: "These are mean values with high individual variance. A meaningful share of participants in each trial lost less than the average, and a smaller share lost more.",
        },
      },
      {
        id: "side-effects",
        title: "Side effects",
        paragraphs: [
          "Both compounds share the same GI side-effect profile because the GLP-1 mechanism dominates upper-GI motility. The most common: nausea, constipation, diarrhea, reflux, and early satiety.",
          "Side-effect intensity is mostly driven by titration speed, not compound choice. Skipping titration steps is the single biggest predictor of dropout in both populations.",
        ],
      },
      {
        id: "dosing",
        title: "Dosing & titration",
        intro: "Both compounds are once-weekly subcutaneous injections with stepped escalation.",
        table: {
          columns: ["Compound", "Starting dose", "Maintenance dose", "Titration interval"],
          rows: [
            ["Semaglutide", "0.25 mg/wk", "1.7 – 2.4 mg/wk", "Step every 4 weeks"],
            ["Tirzepatide", "2.5 mg/wk", "5 – 15 mg/wk", "Step every 4 weeks"],
          ],
        },
      },
      {
        id: "cost",
        title: "Cost",
        paragraphs: [
          "Tirzepatide's monthly cost typically runs higher than semaglutide at equivalent therapeutic doses, though pricing varies widely by source and region.",
          "Compounded versions of both compounds have shifted the cost picture — but compounded supply is regulatorily fragile, and consumers should verify their source's licensing and testing practices.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which one loses more weight?",
        answer:
          "On trial averages, tirzepatide leads by roughly 7 percentage points. Individual response varies and either compound can outperform the other for a specific person.",
      },
      {
        question: "Are the side effects different?",
        answer:
          "Effectively the same profile. Tirzepatide has slightly higher reported GI events at top doses, but titration discipline matters more than compound choice.",
      },
      {
        question: "Can you switch between them?",
        answer:
          "Yes. Many researchers start on semaglutide and switch to tirzepatide if response plateaus, or move from tirzepatide to semaglutide for cost reasons at maintenance.",
      },
      {
        question: "Which has the longer track record?",
        answer:
          "Semaglutide. It was first approved in 2017 (Ozempic) and 2021 for chronic weight management (Wegovy). Tirzepatide is newer (2022 / 2023).",
      },
    ],
    relatedPostIds: [],
    relatedPeptideIds: [],
    relatedGoalIds: ["fat_loss"],
    showQuizCta: true,
    featured: true,
  },
];

export function getPublishedBlogPosts(): BlogPostData[] {
  return BLOG_POSTS.filter((post) => post.status === "published");
}

export function getBlogPostBySlug(slug: string): BlogPostData | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostById(id: string): BlogPostData | undefined {
  return BLOG_POSTS.find((post) => post.id === id);
}

export function getBlogCategoryById(id: BlogCategoryId): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((category) => category.id === id);
}

export function getBlogPostsByCategory(categoryId: BlogCategoryId): BlogPostData[] {
  return getPublishedBlogPosts().filter((post) => post.categoryId === categoryId);
}
