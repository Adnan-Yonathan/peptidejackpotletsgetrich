import { getGoalsForPeptide } from "@/data/goals";
import { getPublishedPeptides } from "@/data/peptides";

export type PairSlugs = { a: string; b: string };

export function canonicalPair(a: string, b: string): PairSlugs {
  return a < b ? { a, b } : { a: b, b: a };
}

export function pairKey(p: PairSlugs) {
  return `${p.a}-vs-${p.b}`;
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
