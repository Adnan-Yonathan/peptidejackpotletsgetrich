import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Layers, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle>My Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage your saved research plans.
            </p>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/plans" />}>
              View Plans <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>My Stacks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage your saved peptide stacks.
            </p>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/stacks" />}>
              View Stacks <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/quiz" />}>Take the Quiz</Button>
            <Button variant="outline" render={<Link href="/stack-builder" />}>Build a Stack</Button>
            <Button variant="outline" render={<Link href="/peptides" />}>Browse Peptides</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
