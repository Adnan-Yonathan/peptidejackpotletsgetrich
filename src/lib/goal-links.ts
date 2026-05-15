import { CATEGORY_HUBS } from "@/data/category-hubs";

export function getGoalHref(goalId: string) {
  const hub = CATEGORY_HUBS.find((item) => item.goalIds.includes(goalId));
  return hub ? `/goals/${hub.slug}` : `/peptides?goal=${encodeURIComponent(goalId)}`;
}
