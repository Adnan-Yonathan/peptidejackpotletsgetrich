import { getGoalsForPeptide } from "@/data/goals";
import { getPublishedPeptides } from "@/data/peptides";

export type PairSlugs = { a: string; b: string };

export function canonicalPair(a: string, b: string): PairSlugs {
  return a < b ? { a, b } : { a: b, b: a };
}

export function pairKey(p: PairSlugs) {
  return `${p.a}-vs-${p.b}`;
}

const NON_INDEXABLE_COMPARISON_KEYS = new Set([
  "angiotensin-1-7-vs-vip",
]);

const PRIORITY_COMPARISON_NOTES: Record<
  string,
  {
    searchIntent: string;
    firstPickReason: string;
    useCase: string;
    faq: Array<{ question: string; answer: string }>;
  }
> = {
  "ipamorelin-vs-tirzepatide": {
    searchIntent: "People usually compare these when deciding between GH-axis support and incretin-class fat-loss support.",
    firstPickReason:
      "Tirzepatide is usually the clearer first research path when the primary goal is clinically meaningful fat loss or insulin-resistance support; ipamorelin is more relevant when the question is GH-secretagogue support, recovery, or sleep architecture.",
    useCase:
      "Use this pair for fat-loss versus recovery intent. If the user is choosing based on scale weight or metabolic markers, the incretin path is more direct; if they are choosing around sleep, recovery, or lean-mass support, the GH-axis path is the more relevant comparison.",
    faq: [
      {
        question: "Is ipamorelin a substitute for tirzepatide?",
        answer:
          "No. Ipamorelin and tirzepatide work through different pathways. Tirzepatide is an incretin-class medication used for metabolic outcomes, while ipamorelin is a GH secretagogue discussed around recovery, sleep, and body-composition support.",
      },
      {
        question: "Which one fits a weight-loss protocol first?",
        answer:
          "Tirzepatide is the more direct weight-loss research path. Ipamorelin may appear in body-composition stacks, but it should not be treated as a GLP-1/GIP replacement.",
      },
    ],
  },
  "hexarelin-vs-mgf": {
    searchIntent: "This is a performance and recovery comparison between a GH secretagogue and a localized repair/growth-factor style peptide.",
    firstPickReason:
      "MGF is the cleaner first research read for localized training or tissue-repair questions; hexarelin belongs in a higher-risk GH-secretagogue discussion because it is more systemic and has endocrine overlap.",
    useCase:
      "Use this pair for muscle and recovery intent. MGF is easier to frame around localized recovery questions, while hexarelin needs stronger caution around endocrine effects, appetite, prolactin/cortisol concerns, and stack overlap.",
    faq: [
      {
        question: "Is hexarelin stronger than MGF?",
        answer:
          "They are not interchangeable. Hexarelin is a GH secretagogue with systemic endocrine effects; MGF is usually discussed around localized repair and training adaptation.",
      },
      {
        question: "Which is better for recovery?",
        answer:
          "For a narrow tissue-repair question, MGF is usually the more specific comparison. For systemic GH-axis effects, hexarelin is more relevant but carries more monitoring burden.",
      },
    ],
  },
};

export function isComparisonIndexable(pair: PairSlugs | string): boolean {
  const key = typeof pair === "string" ? pair : pairKey(canonicalPair(pair.a, pair.b));
  return !NON_INDEXABLE_COMPARISON_KEYS.has(key);
}

export function getPriorityComparisonNote(pair: PairSlugs | string) {
  const key = typeof pair === "string" ? pair : pairKey(canonicalPair(pair.a, pair.b));
  return PRIORITY_COMPARISON_NOTES[key];
}

export function parsePairParam(param: string): PairSlugs | null {
  const idx = param.indexOf("-vs-");
  if (idx <= 0) return null;
  const a = param.slice(0, idx);
  const b = param.slice(idx + 4);
  if (!a || !b || a === b) return null;
  return { a, b };
}

export function getCuratedComparisonPairs(): PairSlugs[] {
  const peptides = getPublishedPeptides();
  const seen = new Set<string>();
  const pairs: PairSlugs[] = [];

  for (let i = 0; i < peptides.length; i++) {
    const p1 = peptides[i];
    const p1Goals = new Set(getGoalsForPeptide(p1.id).map((g) => g.id));
    for (let j = i + 1; j < peptides.length; j++) {
      const p2 = peptides[j];
      const sameCategory = p1.category === p2.category;
      const sharesGoal = getGoalsForPeptide(p2.id).some((g) => p1Goals.has(g.id));
      if (!sameCategory && !sharesGoal) continue;

      const pair = canonicalPair(p1.slug, p2.slug);
      const key = pairKey(pair);
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push(pair);
    }
  }

  return pairs;
}
