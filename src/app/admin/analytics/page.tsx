import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Revenue Analytics" };
export const dynamic = "force-dynamic";

type RevenueRow = {
  event_type: string;
  source_page: string | null;
  vendor_slug: string | null;
  peptide_slug: string | null;
  product_slug: string | null;
  amount_total: number | null;
  created_at: string;
};

export default async function AdminAnalyticsPage() {
  const data = await getRevenueRows();
  const events = data.rows;
  const affiliateClicks = events.filter((event) => event.event_type === "affiliate_click");
  const checkoutCompletions = events.filter((event) => event.event_type === "checkout_completed");
  const revenueCents = checkoutCompletions.reduce((sum, event) => sum + (event.amount_total ?? 0), 0);

  const stats = [
    { label: "Quiz starts", value: count(events, "quiz_started") },
    { label: "Quiz completions", value: count(events, "quiz_completed") },
    { label: "Paywall views", value: count(events, "paywall_viewed") },
    { label: "Checkout starts", value: count(events, "checkout_started") },
    { label: "Checkout completions", value: checkoutCompletions.length },
    { label: "Affiliate clicks", value: affiliateClicks.length },
    { label: "Tracked PDF revenue", value: formatUsd(revenueCents) },
    { label: "Top vendor", value: topValue(affiliateClicks, "vendor_slug") ?? "--" },
  ];

  const topSources = groupRows(events, "source_page").slice(0, 8);
  const topVendors = groupRows(affiliateClicks, "vendor_slug").slice(0, 8);
  const topProducts = groupRows(checkoutCompletions, "product_slug").slice(0, 8);
  const leaks = buildLeakRows(events);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Revenue Analytics</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Funnel, checkout, and affiliate attribution from the last 30 days of tracked revenue events.
      </p>

      {data.error && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6 text-sm text-amber-900">{data.error}</CardContent>
        </Card>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RankedTable title="Top Affiliate Vendors" rows={topVendors} empty="No affiliate clicks tracked yet." />
        <RankedTable title="Top Checkout Products" rows={topProducts} empty="No completed checkout events tracked yet." />
        <RankedTable title="Top Source Pages" rows={topSources} empty="No source pages tracked yet." />
        <RankedTable title="Top Leaking Pages" rows={leaks} empty="No funnel leaks visible yet." />
      </div>
    </div>
  );
}

async function getRevenueRows(): Promise<{ rows: RevenueRow[]; error?: string }> {
  try {
    const supabase = createAdminClient();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("revenue_events")
      .select("event_type, source_page, vendor_slug, peptide_slug, product_slug, amount_total, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) return { rows: [], error: error.message };
    return { rows: (data ?? []) as RevenueRow[] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load revenue analytics.";
    return { rows: [], error: message };
  }
}

function count(rows: RevenueRow[], eventType: string) {
  return rows.filter((row) => row.event_type === eventType).length;
}

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function topValue(rows: RevenueRow[], key: keyof RevenueRow) {
  return groupRows(rows, key)[0]?.label;
}

function groupRows(rows: RevenueRow[], key: keyof RevenueRow) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const value = row[key];
    if (typeof value !== "string" || !value) continue;
    map.set(value, (map.get(value) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function buildLeakRows(rows: RevenueRow[]) {
  const bySource = new Map<string, { paywall: number; checkout: number; affiliate: number }>();

  for (const row of rows) {
    if (!row.source_page) continue;
    const current = bySource.get(row.source_page) ?? { paywall: 0, checkout: 0, affiliate: 0 };
    if (row.event_type === "paywall_viewed") current.paywall += 1;
    if (row.event_type === "checkout_started") current.checkout += 1;
    if (row.event_type === "affiliate_click") current.affiliate += 1;
    bySource.set(row.source_page, current);
  }

  return Array.from(bySource.entries())
    .map(([label, value]) => ({
      label,
      value: Math.max(value.paywall - value.checkout, 0) + Math.max(value.paywall - value.affiliate, 0),
    }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function RankedTable({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
  empty: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">Rank {index + 1}</p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-sm font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
