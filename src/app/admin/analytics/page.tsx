import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Analytics" };

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Affiliate Analytics</h1>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Clicks", value: "0" },
          { label: "Clicks This Week", value: "0" },
          { label: "Top Vendor", value: "--" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Click Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Charts will render here using recharts once affiliate event data is collected.
            Breakdowns by vendor, peptide, source page, and time period.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
