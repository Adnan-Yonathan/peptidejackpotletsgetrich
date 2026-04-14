import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Store, Settings2, Target, BarChart3 } from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  const cards = [
    { title: "Peptides", icon: FlaskConical, href: "/admin/peptides", description: "Manage peptide database" },
    { title: "Vendors", icon: Store, href: "/admin/vendors", description: "Manage vendor profiles" },
    { title: "Rules", icon: Settings2, href: "/admin/rules", description: "Recommendation rule engine" },
    { title: "Goals", icon: Target, href: "/admin/goals", description: "Manage research goals" },
    { title: "Analytics", icon: BarChart3, href: "/admin/analytics", description: "Affiliate click analytics" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-3">
                <card.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
