
export type GuideCategoryId =
  | "basics"
  | "dosing-reconstitution"
  | "storage-handling"
  | "safety-quality"
  | "legal-regulatory";

export type GuideDifficulty = "beginner" | "intermediate" | "advanced";
export type GuideStatus = "published" | "draft";
export type GuideCalloutType = "note" | "warning" | "danger" | "compliance";

export interface GuideCategory {
  id: GuideCategoryId;
  title: string;
  description: string;
}

export interface GuideCallout {
  type: GuideCalloutType;
  title: string;
  body: string;
}

export interface GuideTable {
  columns: string[];
  rows: string[][];
  caption?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  checklist?: string[];
  callout?: GuideCallout;
  table?: GuideTable;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categoryId: GuideCategoryId;
  audience: string[];
  difficulty: GuideDifficulty;
  status: GuideStatus;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  whyItMatters: string[];
  keyTakeaways: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedGuideIds: string[];
  relatedPeptideIds: string[];
  relatedGoalIds: string[];
  featured?: boolean;
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "basics",
    title: "Basics",
    description: "Foundational concepts for people who are new to peptides, research use, and how this category works.",
  },
  {
    id: "dosing-reconstitution",
    title: "Dosing & Reconstitution",
    description: "Practical preparation guidance, dose math, and handling basics for injectable research peptides.",
  },
  {
    id: "storage-handling",
    title: "Storage & Handling",
    description: "How to store, refrigerate, transport, and protect peptides from contamination or degradation.",
  },
  {
    id: "safety-quality",
    title: "Safety & Quality",
    description: "How to evaluate COAs, lab methods, vendor documentation, and the warning signs behind weak listings.",
  },
  {
    id: "legal-regulatory",
    title: "Legal & Regulatory",
    description: "RUO labeling, FDA posture, and the compliance context that shapes how peptide products can be marketed.",
  },
];

export const GUIDES: GuideData[] = [
  {
    id: "what-are-peptides",
    slug: "what-are-peptides",
    title: "What Are Peptides?",
    summary:
      "A plain-language guide to what peptides are, how they are grouped, and why evidence quality matters before you research a compound.",
    categoryId: "basics",
    audience: ["beginner", "intermediate"],
    difficulty: "beginner",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "What Are Peptides? Beginner Guide",
    seoDescription:
      "Learn what peptides are, how research peptides differ from approved drugs, and how to think about categories, evidence, and risk.",
    heroEyebrow: "Basics",
    whyItMatters: [
      "Most people start with a goal, not a compound name.",
      "The peptide market spans approved drugs, investigational compounds, and low-evidence research products.",
      "You need a framework for evidence, risk, and product quality before listings start to blur together.",
    ],
    keyTakeaways: [
      "Peptides are short chains of amino acids that can influence signaling pathways, hormone systems, or tissue repair processes.",
      "The same market can include FDA-approved products, investigational agents, and products sold only as research-use material.",
      "A peptide name alone tells you almost nothing about quality, legal status, or how strong the human evidence is.",
      "Good research starts with category, mechanism, evidence, and risk instead of hype or before-and-after claims.",
    ],
    sections: [
      {
        id: "definition",
        title: "Start with the definition",
        paragraphs: [
          "Peptides are short chains of amino acids. Some are naturally occurring signaling molecules in the body. Others are synthetic analogs designed to extend half-life, change receptor selectivity, or make a compound more practical to manufacture.",
          "That broad definition is why the category can feel confusing so quickly. A GLP-1 analog like semaglutide may show up in the same conversations as BPC-157 or Semax, but the evidence quality, approval status, and risk are completely different.",
        ],
        callout: {
          type: "note",
          title: "Do not treat the category as uniform",
          body: "The peptide market mixes approved prescription products, investigational compounds, and low-transparency research listings. The goal is to help you tell those groups apart instead of treating them as the same thing.",
        },
      },
      {
        id: "buckets",
        title: "How to think about peptide buckets",
        bullets: [
          "Approved therapeutic peptides and analogs: drugs with formal clinical programs and regulatory labeling.",
          "Investigational peptides: compounds with some human or preclinical data but no full approval path completed.",
          "Research-only peptides: products marketed with RUO language and often sold outside a clinical framework.",
          "Peptide-adjacent compounds: products often discussed in the same circles but not always true peptides in the strict biochemical sense.",
        ],
      },
      {
        id: "evaluation",
        title: "A better evaluation framework",
        table: {
          columns: ["Question", "Why it matters"],
          rows: [
            ["What is the compound trying to do?", "Mechanism and use case should come before brand or vendor."],
            ["What human evidence exists?", "Tier A and Tier C should never be presented as interchangeable."],
            ["What is the regulatory posture?", "Approved, investigational, and RUO products carry different levels of scrutiny."],
            ["What quality proof is available?", "COAs, lab methods, and product-level documentation are essential if you want to judge a listing seriously."],
          ],
          caption: "This is the baseline screen every peptide should pass before users think about sourcing.",
        },
      },
    ],
    faqs: [
      {
        question: "Are all peptides experimental?",
        answer: "No. Some peptides or peptide analogs are approved prescription drugs. Others are investigational or sold only in research-only channels.",
      },
      {
        question: "Does peptide mean safe?",
        answer: "No. The word describes a molecular class, not a safety profile. Risk depends on mechanism, dose, route, evidence, and product quality.",
      },
    ],
    relatedGuideIds: ["ruo-vs-human-use", "peptide-safety-basics", "how-to-compare-peptide-vendors"],
    relatedPeptideIds: ["semaglutide", "bpc-157", "tesamorelin"],
    relatedGoalIds: ["fat_loss", "recovery", "gh_optimization"],
    featured: true,
  },
  {
    id: "ruo-vs-human-use",
    slug: "ruo-vs-human-use",
    title: "RUO vs Human Use",
    summary:
      "How to think about research-use-only products, approved drugs, and why RUO language does not make a listing trustworthy by itself.",
    categoryId: "legal-regulatory",
    audience: ["beginner", "intermediate"],
    difficulty: "beginner",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "RUO vs Human Use: Peptide Guide",
    seoDescription:
      "Understand what research-use-only means, how it differs from approved drug labeling, and why RUO language does not replace evidence or compliance.",
    heroEyebrow: "Legal & Regulatory",
    whyItMatters: [
      "RUO is one of the most misunderstood labels in the peptide market.",
      "Users often confuse a product disclaimer with proof of quality or legality.",
      "The difference between an approved drug and an RUO listing changes how you should read everything else on the page.",
    ],
    keyTakeaways: [
      "RUO means research use only. It does not mean clinically validated, pharmacy-grade, or safe for personal use.",
      "A polished product page can still be weak on actual documentation.",
      "Approved drugs and RUO listings live under very different regulatory expectations.",
      "The right question is not just what the label says, but whether the listing gives you enough real information to evaluate it properly.",
    ],
    sections: [
      {
        id: "ruo-definition",
        title: "What RUO actually means",
        paragraphs: [
          "Research-use-only labeling is meant to indicate that a product is not marketed as an approved therapeutic product. In practice, it is often used as a boundary marker in a market where many products are clearly not supported by formal approval pathways.",
          "That label matters, but it is not magic. RUO language does not tell you whether a product has good documentation, whether the sequence is correct, or whether the vendor has a credible track record.",
        ],
      },
      {
        id: "how-differs",
        title: "How RUO differs from approved drug labeling",
        table: {
          columns: ["Lane", "What to expect"],
          rows: [
            ["Approved drug", "Formal indication, dosing label, known manufacturing standards, regulatory oversight."],
            ["Investigational product", "A research or clinical-development context, but not a finished approved label."],
            ["RUO listing", "Limited product claims, variable documentation quality, and no consumer-facing therapeutic approval."],
          ],
          caption: "RUO is not the same thing as investigational medicine, and neither is the same as an approved drug label.",
        },
      },
      {
        id: "common-mistakes",
        title: "Common mistakes people make",
        bullets: [
          "Assuming RUO means the product is automatically safer because it avoids claims.",
          "Treating a COA screenshot as full quality validation when identity, purity, endotoxin, and lot traceability may still be unclear.",
          "Using RUO language as a reason to ignore FDA, WADA, or compounding-risk context.",
        ],
        callout: {
          type: "compliance",
          title: "House rule",
          body: "RUO language belongs in the trust and compliance discussion. It should never be used as a shortcut to imply suitability, treatment value, or safety certainty.",
        },
      },
    ],
    faqs: [
      {
        question: "If a product says RUO, does that make it legal everywhere?",
        answer: "No. Local laws, marketing conduct, import rules, and how a product is promoted all still matter.",
      },
      {
        question: "Is RUO the same as pharmacy compounding?",
        answer: "No. They are different categories with different quality and legal questions.",
      },
    ],
    relatedGuideIds: ["fda-regulatory-basics", "how-to-read-a-coa", "how-to-compare-peptide-vendors"],
    relatedPeptideIds: ["semaglutide", "tirzepatide", "bpc-157"],
    relatedGoalIds: ["fat_loss", "recovery"],
    featured: true,
  },
  {
    id: "how-to-reconstitute-peptides",
    slug: "how-to-reconstitute-peptides",
    title: "How to Reconstitute Peptides",
    summary:
      "A practical guide to reconstitution math, handling basics, and the mistakes that create contamination or dosing problems.",
    categoryId: "dosing-reconstitution",
    audience: ["beginner", "intermediate"],
    difficulty: "intermediate",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "How to Reconstitute Peptides Safely",
    seoDescription:
      "Learn the core math, handling steps, and contamination risks involved in peptide reconstitution without relying on vague forum shortcuts.",
    heroEyebrow: "Dosing & Reconstitution",
    whyItMatters: [
      "Reconstitution errors create bad dosing, waste product, and contamination risk.",
      "A lot of people memorize syringe numbers without understanding the math.",
      "Good handling habits matter as much as the final concentration.",
    ],
    keyTakeaways: [
      "Always understand the concentration you are creating, not just the amount of fluid you added.",
      "Gentle handling matters. Swirl instead of shaking unless a manufacturer explicitly says otherwise.",
      "A clean vial, clean stopper, and clean workspace are part of the process, not optional extras.",
      "If the product page does not clearly describe the form and amount in the vial, your math starts on bad footing.",
    ],
    sections: [
      {
        id: "core-math",
        title: "The only math you really need",
        paragraphs: [
          "Reconstitution math is concentration math. Divide the amount of peptide in the vial by the amount of diluent you add. That gives you the amount of compound per mL.",
          "Once you know concentration, you can convert to whatever measurement system you use downstream. The common mistake is memorizing syringe-unit examples without understanding the concentration underneath them.",
        ],
        table: {
          columns: ["Example vial", "Diluent added", "Resulting concentration"],
          rows: [
            ["5 mg vial", "1 mL", "5 mg/mL"],
            ["5 mg vial", "2 mL", "2.5 mg/mL"],
            ["10 mg vial", "2 mL", "5 mg/mL"],
          ],
          caption: "The exact amount per draw depends on the concentration you create.",
        },
      },
      {
        id: "process",
        title: "Preparation checklist",
        checklist: [
          "Confirm the peptide amount and product form before opening anything.",
          "Use a clean workspace and wipe vial stoppers before access.",
          "Add diluent slowly against the inside wall of the vial when possible.",
          "Swirl gently and let the powder dissolve. Avoid aggressive shaking.",
          "Label the vial with date and concentration so the math is not repeated from memory later.",
        ],
      },
      {
        id: "mistakes",
        title: "Mistakes that matter",
        bullets: [
          "Using the wrong vial strength because two similar products looked the same.",
          "Forgetting that a blend product changes the math and the interpretation.",
          "Treating a cloudy or unusual-looking solution as normal without checking vendor guidance.",
          "Using poor storage after reconstitution and assuming the concentration is the only variable that matters.",
        ],
        callout: {
          type: "warning",
          title: "This guide is educational, not dosing advice",
          body: "The purpose here is to explain concentration and handling logic so users can understand product preparation, not to provide individualized medical direction.",
        },
      },
    ],
    faqs: [
      {
        question: "Why does everyone talk in syringe units instead of mg per mL?",
        answer: "Because many people learn from examples, not principles. Concentration is the more durable concept because it survives changes in vial size and diluent volume.",
      },
      {
        question: "Should every peptide be handled the same way?",
        answer: "No. Reconstitution basics are similar, but stability, storage, and agitation sensitivity can differ by compound and formulation.",
      },
    ],
    relatedGuideIds: ["how-to-store-peptides", "peptide-safety-basics", "beginner-peptide-faq"],
    relatedPeptideIds: ["bpc-157", "ipamorelin", "semax"],
    relatedGoalIds: ["recovery", "gh_optimization", "cognitive"],
    featured: true,
  },
  {
    id: "how-to-store-peptides",
    slug: "how-to-store-peptides",
    title: "How to Store Peptides",
    summary:
      "A practical storage guide covering lyophilized vs reconstituted handling, light and heat sensitivity, and when a shipping problem becomes a trust problem.",
    categoryId: "storage-handling",
    audience: ["beginner", "intermediate"],
    difficulty: "beginner",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "How to Store Peptides Correctly",
    seoDescription:
      "Understand the storage basics for peptides before and after reconstitution, and what shipping or temperature problems should make you question a product.",
    heroEyebrow: "Storage & Handling",
    whyItMatters: [
      "Storage affects both stability and trust.",
      "A questionable shipping experience is often a quality signal, not just a logistics issue.",
      "People tend to obsess over dose math and ignore the condition of the product itself.",
    ],
    keyTakeaways: [
      "Lyophilized and reconstituted products should not automatically be treated the same way.",
      "Heat, light, and moisture are common enemies of peptide stability.",
      "Cold-chain or temperature-sensitive claims should line up with how the product is packed and documented.",
      "If a vendor is vague about storage, that is itself useful information.",
    ],
    sections: [
      {
        id: "two-states",
        title: "Think in two storage states",
        paragraphs: [
          "A dry lyophilized vial and a reconstituted vial are different storage problems. The dry vial is about protecting integrity before preparation. The reconstituted vial is about protecting both integrity and contamination risk after preparation.",
          "Users often compress these into one rule, then create bad habits around refrigeration, moisture exposure, or repeated handling.",
        ],
      },
      {
        id: "storage-table",
        title: "Baseline storage framework",
        table: {
          columns: ["State", "Primary concern", "Practical rule"],
          rows: [
            ["Lyophilized", "Heat, light, moisture", "Keep cool, dry, and protected from unnecessary temperature swings."],
            ["Reconstituted", "Stability plus contamination", "Refrigerate when appropriate and minimize repeated handling or exposure."],
            ["During shipping", "Transit heat and delay", "Treat poor packaging or unexplained temperature stress as a vendor-quality signal."],
          ],
        },
      },
      {
        id: "quality-signal",
        title: "Storage is also a vendor trust issue",
        bullets: [
          "Was the product packed in a way that matches its claimed handling needs?",
          "Does the vendor describe how to store the product before and after preparation?",
          "If shipping was delayed or the package arrived warm, does the vendor explain what that means?",
        ],
        callout: {
          type: "note",
          title: "Use storage problems as a signal",
          body: "A bad storage or shipping experience does not just threaten the product. It also tells you something about operational quality and documentation discipline.",
        },
      },
    ],
    faqs: [
      {
        question: "Does every warm shipment mean the product is unusable?",
        answer: "Not automatically. But vague vendor communication about temperature exposure is a reason to slow down and treat the listing more cautiously.",
      },
      {
        question: "Is refrigeration always required?",
        answer: "Not in every state and for every formulation. The key is whether the product state, vendor documentation, and stability expectations line up.",
      },
    ],
    relatedGuideIds: ["how-to-reconstitute-peptides", "how-to-compare-peptide-vendors", "peptide-safety-basics"],
    relatedPeptideIds: ["semaglutide", "bpc-157", "thymosin-alpha-1"],
    relatedGoalIds: ["fat_loss", "recovery", "immune"],
    featured: true,
  },
  {
    id: "how-to-read-a-coa",
    slug: "how-to-read-a-coa",
    title: "How to Read a COA",
    summary:
      "A COA can be useful, but only if you know which fields matter and where vendor screenshots stop being persuasive.",
    categoryId: "safety-quality",
    audience: ["beginner", "intermediate", "advanced"],
    difficulty: "intermediate",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "How to Read a Peptide COA",
    seoDescription:
      "Learn how to interpret peptide COAs, what HPLC and MS can and cannot tell you, and which missing details should lower confidence.",
    heroEyebrow: "Safety & Quality",
    whyItMatters: [
      "COAs are one of the few concrete pieces of evidence most shoppers can inspect for themselves.",
      "A product page can mention lab testing without giving enough detail to prove anything meaningful.",
      "Users need help separating real documentation from decorative documentation.",
    ],
    keyTakeaways: [
      "A COA is helpful only when it is specific, recent, and connected to a real lot or batch.",
      "Purity alone is not the whole story. Identity, method, date, and lab traceability matter too.",
      "A screenshot with no batch number or method context should lower confidence, not raise it.",
      "Third-party lab context is usually more persuasive than vague self-issued claims.",
    ],
    sections: [
      {
        id: "fields",
        title: "The fields that matter most",
        bullets: [
          "Lot or batch identifier that clearly connects the report to a product run.",
          "Test date so users know whether the report is current or recycled.",
          "Method information such as HPLC or MS instead of generic 'tested' language.",
          "Result values that match the claim being made on the product page.",
        ],
      },
      {
        id: "methods",
        title: "What common methods tell you",
        table: {
          columns: ["Method", "What it helps with", "What it does not solve by itself"],
          rows: [
            ["HPLC", "Purity profiling", "Does not fully replace identity confirmation or contamination screening."],
            ["Mass spectrometry", "Identity support and mass confirmation", "Does not automatically prove a clean finished product by itself."],
            ["Endotoxin testing", "Bioburden-related risk signal", "Only one part of a larger quality picture."],
          ],
          caption: "A better COA usually shows method clarity and batch specificity, not just a percentage number.",
        },
      },
      {
        id: "red-flags",
        title: "Red flags worth treating seriously",
        checklist: [
          "No clear lot number or batch reference.",
          "No method named, just a purity claim.",
          "Old documents reused across multiple supposedly current listings.",
          "COA image is too cropped, low-resolution, or disconnected from the product variant being sold.",
        ],
        callout: {
          type: "warning",
          title: "Do not confuse visibility with rigor",
          body: "A visible COA is better than no documentation, but a weak COA should still lower your confidence.",
        },
      },
    ],
    faqs: [
      {
        question: "Is a 99% purity number enough to trust a product?",
        answer: "No. You still want batch linkage, method context, recency, and ideally broader quality evidence around the listing.",
      },
      {
        question: "Is third-party always better than in-house?",
        answer: "Third-party testing usually carries more weight, but only if the report is specific, readable, and tied to the actual product variant.",
      },
    ],
    relatedGuideIds: ["lab-testing-explained", "how-to-compare-peptide-vendors", "peptide-safety-basics"],
    relatedPeptideIds: ["bpc-157", "ghk-cu", "thymosin-alpha-1"],
    relatedGoalIds: ["recovery", "skin_hair", "immune"],
    featured: true,
  },
  {
    id: "lab-testing-explained",
    slug: "lab-testing-explained",
    title: "Peptide Lab Testing Explained",
    summary:
      "A practical breakdown of the testing methods people see on product pages and what those methods can and cannot prove.",
    categoryId: "safety-quality",
    audience: ["intermediate", "advanced"],
    difficulty: "intermediate",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "Peptide Lab Testing Explained",
    seoDescription:
      "Understand common peptide testing methods, why test scope matters, and how to read lab references without over-trusting them.",
    heroEyebrow: "Safety & Quality",
    whyItMatters: [
      "Vendors often name testing methods without explaining what they actually cover.",
      "Users need to know when a method supports a claim and when it is just decoration.",
      "Testing language is one of the easiest places for weak listings to sound more credible than they are.",
    ],
    keyTakeaways: [
      "Method names should map to a real quality question such as identity, purity, or contamination.",
      "One method rarely answers every question a user should have.",
      "Method transparency is stronger when it appears in a batch-linked COA, not just in product copy.",
      "If the listing is vague about what was tested, assume the quality evidence is weaker than it sounds.",
    ],
    sections: [
      {
        id: "method-scope",
        title: "Method names need scope",
        paragraphs: [
          "Good vendors do not just say 'lab tested.' They show what was tested, how it was tested, and ideally when. That is what lets a user connect a claim to a specific quality dimension instead of guessing.",
        ],
      },
      {
        id: "comparison",
        title: "How to compare testing language",
        table: {
          columns: ["Listing language", "Confidence impact"],
          rows: [
            ["'Lab tested' with no document", "Weak"],
            ["Method names but no lot-linked COA", "Better than nothing, still limited"],
            ["Batch-linked COA with method and date", "Stronger"],
            ["Third-party batch-linked report with readable fields", "Strongest retail-facing signal"],
          ],
        },
      },
    ],
    faqs: [
      {
        question: "Why do some vendors emphasize HPLC so much?",
        answer: "Because purity is an easy claim to market. The better question is whether the documentation stops there or shows a fuller testing picture.",
      },
      {
        question: "Should I trust a product just because a lab name appears on the page?",
        answer: "Not without batch linkage and readable report details. The lab reference should connect to the actual product record.",
      },
    ],
    relatedGuideIds: ["how-to-read-a-coa", "how-to-compare-peptide-vendors"],
    relatedPeptideIds: ["ghk-cu", "mots-c", "thymosin-alpha-1"],
    relatedGoalIds: ["skin_hair", "fat_loss", "immune"],
  },
  {
    id: "peptide-safety-basics",
    slug: "peptide-safety-basics",
    title: "Peptide Safety Basics",
    summary:
      "A practical risk framework covering route, evidence, product quality, and the mistakes that make gray-market research products look safer than they are.",
    categoryId: "safety-quality",
    audience: ["beginner", "intermediate"],
    difficulty: "beginner",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "Peptide Safety Basics",
    seoDescription:
      "Learn the core safety framework for peptide research: evidence, route, product quality, and why category-level hype hides meaningful risk differences.",
    heroEyebrow: "Safety & Quality",
    whyItMatters: [
      "Safety discussions in this space are often too casual or too vague.",
      "A product can have an interesting mechanism and still be a bad research choice for most users.",
      "The site needs a consistent way to talk about risk without collapsing into hype or fearmongering.",
    ],
    keyTakeaways: [
      "Evidence quality and safety are related, but not identical. Strong evidence can still come with meaningful side effects, and weak evidence often means larger unknowns.",
      "Route matters. Injectable, oral, topical, and blended products raise different questions.",
      "Product quality is part of safety. Poor documentation and weak lot traceability are risk signals.",
      "You should always separate biological risk, compliance risk, and sourcing risk.",
    ],
    sections: [
      {
        id: "three-risks",
        title: "Think in three kinds of risk",
        bullets: [
          "Biological risk: side effects, contraindications, pathway overlap, and class-specific concerns.",
          "Documentation risk: weak COAs, poor batch linkage, bad shipping communication, vague product descriptions.",
          "Compliance risk: FDA posture, WADA status, and how aggressively a product is being marketed.",
        ],
      },
      {
        id: "common-traps",
        title: "The most common traps",
        bullets: [
          "Assuming a peptide discussed on forums is automatically well understood.",
          "Mistaking confident product copy for strong scientific evidence.",
          "Ignoring route-specific or stack-specific concerns because the category sounds familiar.",
        ],
        callout: {
          type: "danger",
          title: "If the documentation is weak, the risk is higher",
          body: "A vendor-quality problem is not separate from safety. It is part of the safety conversation because it changes what the user can trust about the product itself.",
        },
      },
    ],
    faqs: [
      {
        question: "Why are evidence tier and risk level shown separately?",
        answer: "Because they answer different questions. Evidence tier asks how well studied something is. Risk level asks how cautious the user should be with the compound and context.",
      },
      {
        question: "Can a lower-risk peptide still be a poor choice?",
        answer: "Yes. Fit still matters. A lower-risk option can still be the wrong match for your goal, your standards for evidence, or the kind of product you are trying to research.",
      },
    ],
    relatedGuideIds: ["what-are-peptides", "how-to-read-a-coa", "fda-regulatory-basics"],
    relatedPeptideIds: ["bpc-157", "semaglutide", "mk-677"],
    relatedGoalIds: ["fat_loss", "recovery", "gh_optimization"],
    featured: true,
  },
  {
    id: "fda-regulatory-basics",
    slug: "fda-regulatory-basics",
    title: "FDA & Regulatory Basics",
    summary:
      "A practical guide to the regulatory language users keep seeing—approved drugs, compounding risk, RUO listings, and why that context changes how products should be presented.",
    categoryId: "legal-regulatory",
    audience: ["intermediate", "advanced"],
    difficulty: "intermediate",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "FDA and Regulatory Basics for Peptides",
    seoDescription:
      "Learn how to interpret FDA posture, compounding risk signals, approved vs investigational status, and the compliance context around peptide listings.",
    heroEyebrow: "Legal & Regulatory",
    whyItMatters: [
      "Regulatory context changes how the same peptide should be talked about.",
      "A strong user experience still needs to be compliance-aware.",
      "People researching peptides often encounter FDA language without understanding what it means for sourcing, claims, or risk.",
    ],
    keyTakeaways: [
      "Approved, investigational, and research-only products should never be talked about as if they belong in the same category.",
      "FDA compounding-risk context is a meaningful signal for how carefully a compound should be handled in content and sourcing decisions.",
      "Regulatory posture is not the same thing as moral judgment. It is a context layer the user needs to understand.",
      "The more compliance-sensitive a compound is, the more careful the surrounding UI and language should be.",
    ],
    sections: [
      {
        id: "status-lane",
        title: "Status changes how you should read the product",
        table: {
          columns: ["Status", "What it means for users"],
          rows: [
            ["Approved", "Formal label, known indication, clearer manufacturing and safety expectations."],
            ["Investigational", "Some scientific context exists, but not a consumer-facing approved therapeutic label."],
            ["Not approved / RUO", "More uncertainty, more reliance on vendor documentation, and more care needed in how the product is discussed."],
          ],
        },
      },
      {
        id: "content-implications",
        title: "What this means for content design",
        bullets: [
          "Show regulatory flags near the top of peptide pages, not buried in footnotes.",
          "Use disclaimers as context, not as decoration.",
          "Be skeptical of treatment-style language when the compound does not have an approved therapeutic use.",
          "Use goal pages to educate users before they ever reach a vendor click.",
        ],
      },
      {
        id: "fda-risk",
        title: "Why compounding risk flags matter",
        paragraphs: [
          "When a compound sits in a higher-scrutiny regulatory context, the research experience should reflect that. That means stronger warning language, less casual vendor treatment, and cleaner separation between evidence, sourcing, and user fit.",
        ],
        callout: {
          type: "compliance",
          title: "Operational rule",
          body: "Regulatory signals should change how cautious you are. A higher-risk or more compliance-sensitive compound should be presented with more context and less sales pressure.",
        },
      },
    ],
    faqs: [
      {
        question: "Does approved mean low risk?",
        answer: "No. Approved means the product has gone through a formal regulatory process for a specific use case. It does not erase side effects or contraindications.",
      },
      {
        question: "Does not approved mean useless?",
        answer: "No. It means the user should treat the evidence, sourcing, and claims environment with more caution and context.",
      },
    ],
    relatedGuideIds: ["ruo-vs-human-use", "peptide-safety-basics", "how-to-compare-peptide-vendors"],
    relatedPeptideIds: ["semaglutide", "tirzepatide", "bpc-157"],
    relatedGoalIds: ["fat_loss", "recovery"],
    featured: true,
  },
  {
    id: "how-to-compare-peptide-vendors",
    slug: "how-to-compare-peptide-vendors",
    title: "How to Compare Peptide Vendors",
    summary:
      "A practical vendor comparison guide that helps you look past branding and focus on the details that actually matter.",
    categoryId: "safety-quality",
    audience: ["beginner", "intermediate", "advanced"],
    difficulty: "intermediate",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "How to Compare Peptide Vendors",
    seoDescription:
      "Compare peptide vendors by the details that matter most: product pages, COAs, shipping clarity, and overall transparency instead of shallow ratings.",
    heroEyebrow: "Safety & Quality",
    whyItMatters: [
      "Users need vendor comparison help without pretending there is a single perfect score.",
      "A flashy storefront can still have weak product-level documentation.",
      "The point is not to declare a winner. It is to help you ask better questions before you buy.",
    ],
    keyTakeaways: [
      "Compare vendors at the product-page level, not just the homepage level.",
      "Documentation posture matters more than marketing polish.",
      "Look for consistency in COA access, QC language, shipping clarity, and variant specificity.",
      "A vendor comparison system can be useful without turning into a fake five-star rating model.",
    ],
    sections: [
      {
        id: "framework",
        title: "Use this checklist first",
        checklist: [
          "Does the vendor have a peptide-specific product page, not just a generic collection page?",
          "Is there a readable COA or at least a clear path to batch documentation?",
          "Does the page disclose the actual product variant, blend, or naming mismatch?",
          "Are shipping, pricing, and product-form details specific enough to compare across listings?",
        ],
      },
      {
        id: "avoid-ratings",
        title: "Why we avoid simple vendor scores",
        paragraphs: [
          "A single score hides too much. Documentation quality, product specificity, affiliate availability, and regulatory sensitivity should be shown clearly so you can see the tradeoffs for yourself.",
        ],
      },
      {
        id: "what-to-show",
        title: "What you should look for first",
        bullets: [
          "COA access mode",
          "QC methods listed",
          "Price visibility or quote-only status",
          "Shipping-region clarity",
          "Credibility notes about naming mismatches or blend products",
        ],
      },
    ],
    faqs: [
      {
        question: "Why not just use a five-star vendor rating?",
        answer: "Because it hides the exact reasons a listing is stronger or weaker. Trust is better built through transparent signals than through vague scores.",
      },
      {
        question: "Should a strong affiliate program make a vendor look better?",
        answer: "No. Affiliate availability is an operational detail, not a quality signal. It should be disclosed, not treated as trust evidence.",
      },
    ],
    relatedGuideIds: ["how-to-read-a-coa", "lab-testing-explained", "ruo-vs-human-use"],
    relatedPeptideIds: ["bpc-157", "ghk-cu", "retatrutide"],
    relatedGoalIds: ["recovery", "skin_hair", "fat_loss"],
    featured: true,
  },
  {
    id: "beginner-peptide-faq",
    slug: "beginner-peptide-faq",
    title: "Beginner Peptide FAQ",
    summary:
      "The high-frequency questions new users ask before they understand compounds, sourcing, reconstitution, or why every peptide page looks so different.",
    categoryId: "basics",
    audience: ["beginner"],
    difficulty: "beginner",
    status: "published",
    updatedAt: "2026-04-15",
    seoTitle: "Beginner Peptide FAQ",
    seoDescription:
      "A beginner FAQ covering common first questions about peptides, quality, sourcing, safety, and how to use the research platform correctly.",
    heroEyebrow: "Basics",
    whyItMatters: [
      "Most new users do not need advanced protocols first. They need orientation.",
      "Good FAQ content lowers confusion without oversimplifying the subject.",
      "This page can absorb repeat beginner questions before they leak into every other page.",
    ],
    keyTakeaways: [
      "Start with goal, evidence, and risk instead of the loudest compound name you have seen online.",
      "Use guide pages to learn the framework before comparing vendor pages.",
      "If the product documentation is weak, slow down. That is part of the evaluation.",
      "The personalized plan can help, but the guides should still make sense on their own.",
    ],
    sections: [
      {
        id: "starter-questions",
        title: "Questions new users usually start with",
        bullets: [
          "What is a peptide?",
          "Are peptides the same as approved drugs?",
          "Why do some product pages say RUO?",
          "How do I know whether a vendor is taking documentation seriously?",
          "What does a COA actually prove?",
        ],
      },
      {
        id: "best-start",
        title: "The best way to use this site",
        checklist: [
          "Start with a guide page if the category is new to you.",
          "Use peptide pages to compare evidence, risk, and route.",
          "Use goal hubs to narrow the field by outcome.",
          "Use vendor pages only after you understand the kind of compound and listing you are looking at.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I start with the quiz or the guides?",
        answer: "If you are new to the category, start with the guides. If you already know the basic framework and want a faster path through the catalog, the quiz can help narrow the field.",
      },
      {
        question: "Why are some compounds shown with stronger warnings than others?",
        answer: "Because evidence, safety, and regulatory context should be obvious, not buried where people miss them.",
      },
    ],
    relatedGuideIds: ["what-are-peptides", "ruo-vs-human-use", "peptide-safety-basics"],
    relatedPeptideIds: ["bpc-157", "semaglutide", "pt-141"],
    relatedGoalIds: ["recovery", "fat_loss", "sexual_health"],
  },
];

export function getPublishedGuides(): GuideData[] {
  return GUIDES.filter((guide) => guide.status === "published");
}

export function getGuideBySlug(slug: string): GuideData | undefined {
  return GUIDES.find((guide) => guide.slug === slug && guide.status === "published");
}

export function getGuideById(id: string): GuideData | undefined {
  return GUIDES.find((guide) => guide.id === id && guide.status === "published");
}

export function getFeaturedGuides(): GuideData[] {
  return getPublishedGuides().filter((guide) => guide.featured);
}

export function getGuideCategoryById(id: GuideCategoryId): GuideCategory | undefined {
  return GUIDE_CATEGORIES.find((category) => category.id === id);
}

export function getGuidesByCategory(categoryId: GuideCategoryId): GuideData[] {
  return getPublishedGuides().filter((guide) => guide.categoryId === categoryId);
}

export function getGuidesForPeptide(peptideId: string): GuideData[] {
  return getPublishedGuides().filter((guide) => guide.relatedPeptideIds.includes(peptideId));
}

export function getGuidesForGoal(goalId: string): GuideData[] {
  return getPublishedGuides().filter((guide) => guide.relatedGoalIds.includes(goalId));
}



