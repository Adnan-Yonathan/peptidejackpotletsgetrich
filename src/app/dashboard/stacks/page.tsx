import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "My Stacks" };

export default function StacksPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Stacks</h1>
        <Button render={<Link href="/stack-builder" />}>New Stack</Button>
      </div>
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground mb-4">No saved stacks yet.</p>
          <Button variant="outline" render={<Link href="/stack-builder" />}>
            Build your first stack
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
