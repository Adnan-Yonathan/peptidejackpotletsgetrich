export interface ResearchCitation {
  id: string;
  note: string;
}

export interface ResearchTable {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
}

export interface ResearchSection {
  id: string;
  title: string;
  summary: string;
  tables?: ResearchTable[];
  bullets?: string[];
}

export interface ResearchArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  status: "draft" | "reviewed";
  lastReviewedAt: string;
  sections: ResearchSection[];
  citations: ResearchCitation[];
}

export const AGE_SPECIFIC_PEPTIDE_INSIGHTS: ResearchArticle = {
  id: "age-specific-peptide-insights",
  slug: "age-specific-peptide-insights",
  title: "Peptide Therapies and Age-Specific Insights",
  summary:
    "Working research brief covering peptide evidence, life-stage fit, decade-specific caution themes, stack ideas, and monitoring priorities. Use as editorial source material, not direct treatment guidance.",
  tags: ["aging", "monitoring", "safety", "stacks", "goal-fit", "editorial-source"],
  status: "reviewed",
  lastReviewedAt: "2026-04-15",
  sections: [
    {
      id: "key-peptides",
      title: "Key peptides and compounds",
      summary:
        "Approved metabolic peptides have the strongest human evidence. Popular recovery and anti-aging compounds still rely heavily on animal or mechanistic data.",
      tables: [
        {
          id: "key-peptides-table",
          title: "High-priority compounds from the brief",
          columns: [
            "Compound",
            "Main use case",
            "Evidence level",
            "Main risks",
            "Life-stage note",
          ],
          rows: [
            ["Semaglutide / tirzepatide", "Fat loss and metabolic health", "High", "GI effects, pancreatitis caution, thyroid-tumor class warning", "Adult use with strongest evidence in metabolic disease and obesity"],
            ["Epitalon", "Longevity and circadian support", "Low", "Unknown long-term safety", "Mostly older-adult anti-aging use cases"],
            ["GHK-Cu", "Skin, hair, wound support", "Low", "Systemic safety unclear outside topical use", "Cosmetic and repair-focused adult use"],
            ["BPC-157", "Soft-tissue and GI repair", "Very low", "Human evidence lacking, sourcing and regulatory risk", "No validated age range"],
            ["TB-500", "Recovery and wound repair", "Very low", "No human efficacy data, angiogenesis caution", "No validated age range"],
            ["Thymosin Alpha-1", "Immune support", "Moderate", "Autoimmune and cancer-context caution", "Most relevant in older or immunocompromised adults"],
            ["MK-677", "GH support, lean mass, sleep", "Low to moderate", "Edema, appetite, insulin resistance", "More caution with age, diabetes, or cancer history"],
            ["CJC-1295 / Ipamorelin", "GH-axis support", "Low", "Long-term GH/IGF safety unknown", "Bias toward midlife adult use if used at all"],
            ["PT-141", "Sexual function", "High", "Nausea, blood-pressure rise", "Strongest evidence in adult female HSDD"],
            ["Semax", "Cognitive support", "Low", "Limited human data outside Russia", "Adult cognitive and recovery contexts only"],
          ],
        },
      ],
    },
    {
      id: "goal-life-stage",
      title: "Goal and life-stage fit",
      summary:
        "The brief maps different goals to different peptides and shows how the preferred risk profile shifts by decade.",
      bullets: [
        "Muscle and body-composition use cases lean on GH-axis compounds and collagen-supported training, with more caution as age and cancer risk rise.",
        "Fat-loss and metabolic-health cases are dominated by GLP-1 therapies because they have the deepest human data.",
        "Skin and cosmetic use cases skew toward collagen support and GHK-Cu rather than injectable recovery compounds.",
        "Immune and longevity use cases become more conservative with age and rely more on immune support, collagen, and metabolic health than on aggressive GH stimulation.",
      ],
    },
    {
      id: "stacks-by-age",
      title: "Stacks by age and goal",
      summary:
        "The stack ideas are useful as editorial inspiration and for future templates, but most should not become hard recommendation logic without stronger validation.",
      bullets: [
        "20s guidance is mostly prevention-oriented and favors exercise, collagen, and avoiding unnecessary endocrine manipulation.",
        "30s to 50s guidance introduces metabolic and GH-axis tools more often, but with increasing emphasis on labs and conservative dosing.",
        "60s+ guidance heavily favors immune support, collagen, and lower-risk maintenance over stimulatory compounds.",
      ],
    },
    {
      id: "avoid-by-age",
      title: "Avoid or heavily caution by age",
      summary:
        "The clearest structured value in the brief is age-based avoidance of GH and growth-factor stimulation in younger adults, and stronger cancer-risk caution in older adults.",
      bullets: [
        "Young adults should generally avoid aggressive GH and IGF-style experimentation if there is no medical indication.",
        "Middle age raises concern around overstacking, insulin resistance, and unproven polypharmacy.",
        "Older adults require much tighter limits around GH-axis stimulation, cardiovascular burden, and cancer risk.",
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring and regulatory themes",
      summary:
        "The brief supports a monitoring layer built around baseline labs, quarterly reassessment for heavier compounds, and stricter oversight for GH-axis or metabolic therapies.",
      bullets: [
        "Baseline labs should often include CBC, CMP, fasting glucose or HbA1c, lipids, thyroid, and hormone context when relevant.",
        "GH-axis strategies justify IGF-1 tracking and more explicit cancer-risk caution.",
        "GLP-1 therapies justify metabolic follow-up and GI tolerance review.",
        "Regulatory status remains uneven; many wellness-marketed peptides are still not approved for human use.",
      ],
    },
  ],
  citations: [
    {
      id: "lifespan-review",
      note: "Approved metabolic peptides have the strongest RCT support, while many anti-aging and recovery peptides remain preclinical or lightly studied in humans.",
    },
    {
      id: "sports-medicine-review",
      note: "Sports-medicine and anti-aging reviews emphasize the lack of robust human data for BPC-157, TB-500, and related recovery compounds.",
    },
    {
      id: "monitoring-guidance",
      note: "The brief supports tighter baseline and follow-up lab monitoring for GH-axis, metabolic, and higher-risk compounds.",
    },
  ],
};
