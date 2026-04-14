import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "My Plans" };

export default function PlansPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Plans</h1>
        <Button render={<Link href="/quiz" />}>New Plan</Button>
      </div>
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground mb-4">No saved plans yet.</p>
          <Button variant="outline" render={<Link href="/quiz" />}>
            Take the quiz to generate your first plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
