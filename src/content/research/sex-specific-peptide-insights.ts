export interface SexResearchCitation {
  id: string;
  note: string;
}

export interface SexResearchTable {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
}

export interface SexResearchSection {
  id: string;
  title: string;
  summary: string;
  tables?: SexResearchTable[];
  bullets?: string[];
}

export interface SexResearchArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  status: "draft" | "reviewed";
  lastReviewedAt: string;
  sections: SexResearchSection[];
  citations: SexResearchCitation[];
}

export const SEX_SPECIFIC_PEPTIDE_INSIGHTS: SexResearchArticle = {
  id: "sex-specific-peptide-insights",
  slug: "sex-specific-peptide-insights",
  title: "Sex- and Age-Specific Peptide Therapies",
  summary:
    "Working research brief covering sex-specific approval status, monitoring, reproductive cautions, and places where the evidence remains too weak to justify strong male/female recommendation logic.",
  tags: ["sex-specific", "pregnancy", "monitoring", "regulatory", "editorial-source"],
  status: "reviewed",
  lastReviewedAt: "2026-04-15",
  sections: [
    {
      id: "high-signal-findings",
      title: "High-signal findings worth extracting",
      summary:
        "Only a small part of the brief is strong enough for hard product logic. The rest belongs in editorial notes, not recommendation automation.",
      bullets: [
        "GLP-1 receptor agonists have the clearest human evidence and some data suggesting stronger average weight loss in women than men.",
        "PT-141 has the clearest sex-specific approval boundary: premenopausal women only, with no approved male indication.",
        "Pregnancy and lactation are the strongest sex-specific caution area across metabolic, GH-axis, and experimental peptides.",
        "Sex-specific lab follow-up is more defensible than sex-specific dosing for most of the catalog.",
      ],
    },
    {
      id: "peptide-profiles",
      title: "Peptide profiles with sex-specific notes",
      summary:
        "Most compounds still have weak or absent sex-disaggregated data. The table below captures where the brief found something concrete enough to retain.",
      tables: [
        {
          id: "sex-specific-peptide-table",
          title: "Sex-specific peptide highlights",
          columns: ["Compound", "Signal", "Use in product logic"],
          rows: [
            ["Semaglutide / tirzepatide", "Women may lose more weight on average than men in some analyses.", "Use as a cautious rationale note, not a hard sex-based filter."],
            ["PT-141", "Approved for premenopausal women with HSDD, not approved for men.", "Use as a clear sex-specific approval and caution rule."],
            ["Thymosin Alpha-1", "No strong sex split, but adult immune-support use cases remain reasonable in both sexes.", "Keep as mostly sex-neutral."],
            ["CJC-1295 / Ipamorelin / MK-677", "Very weak sex-specific evidence despite real endocrine implications.", "Keep as caution-only, not male/female recommendation logic."],
            ["BPC-157 / TB-500", "No meaningful sex-specific human data.", "Keep as sex-neutral, but apply reproductive cautions."],
          ],
        },
      ],
    },
    {
      id: "goal-and-sex",
      title: "Goals and sex",
      summary:
        "The brief contains some sex-by-goal framing, but most of it should stay editorial because the evidence is sparse or indirect.",
      bullets: [
        "Fat loss is the strongest area for practical sex-aware messaging because the GLP-1 literature is deeper than the rest of the peptide market.",
        "Sexual-health content is the strongest area for actual sex-specific rules because PT-141 has a female approval boundary.",
        "Muscle, cognition, sleep, and longevity use cases remain mostly sex-neutral at the level of current evidence, with caution notes instead of hard branching.",
      ],
    },
    {
      id: "monitoring",
      title: "Sex-specific monitoring and reproductive safety",
      summary:
        "The best operational use of this material is not sex-specific dosing. It is sex-specific safety context and follow-up.",
      bullets: [
        "Men: PSA and hematocrit context matter more once growth-axis or hormone-sensitive strategies are being considered.",
        "Women: pregnancy testing and reproductive status matter more when metabolic, GH-axis, or libido-related peptides are being discussed.",
        "Menopause and perimenopause are relevant context, but the brief does not justify strong automated protocol logic from that alone.",
      ],
    },
  ],
  citations: [
    {
      id: "glp1-sex-response",
      note: "The strongest usable sex-specific signal is that women may lose more weight than men on GLP-1 receptor agonists in some reviews.",
    },
    {
      id: "pt141-approval",
      note: "PT-141 has a real sex-specific approval boundary for premenopausal women, with no approved male indication.",
    },
    {
      id: "reproductive-caution",
      note: "Pregnancy and lactation remain the clearest sex-specific caution area across peptide use.",
    },
  ],
};
