import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Shield, TestTubeDiagonal } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GUIDE_CATEGORIES, getFeaturedGuides, getGuidesByCategory } from "@/data/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Foundational peptide guides on safety, reconstitution, storage, COAs, vendor comparison, and regulatory basics.",
};

export default function GuidesPage() {
  const featuredGuides = getFeaturedGuides().slice(0, 6);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <div className="relative container mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6 text-xs font-medium tracking-wide">
                Learn the basics
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Clear guides for safer, smarter peptide research.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Learn what peptides are, what RUO really means, how to read a COA, how to compare vendors,
                and how to avoid the mistakes that lead people into weak products and bad assumptions.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" render={<Link href={`/guides/${featuredGuides[0]?.slug ?? "what-are-peptides"}`} />}>
                  Start with the basics <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" className="h-12 text-base" render={<Link href="/peptides" />}>
                  Browse peptides
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Start with the most useful guides</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                These are the pages most people should read before comparing products or choosing where to buy.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredGuides.map((guide, index) => (
                <Card key={guide.id} className="border bg-background transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Badge variant="outline" className="capitalize">
                        {guide.categoryId.replace(/-/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Guide {index + 1}</span>
                    </div>
                    <CardTitle className="text-xl">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      {guide.keyTakeaways.slice(0, 2).map((takeaway) => (
                        <p key={takeaway}>- {takeaway}</p>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" render={<Link href={`/guides/${guide.slug}`} />}>
                      Read guide <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/20 py-20 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Browse guides by topic</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Each topic helps with a different part of the process, from learning the basics to comparing products more carefully.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {GUIDE_CATEGORIES.map((category) => {
                const guides = getGuidesByCategory(category.id);
                const Icon =
                  category.id === "basics" ? BookOpen : category.id === "safety-quality" ? Shield : TestTubeDiagonal;

                return (
                  <Card key={category.id} className="border bg-background">
                    <CardHeader className="pb-3">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {guides.map((guide) => (
                          <Badge key={guide.id} variant="secondary" className="text-[11px]">
                            {guide.title}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Learn first, then compare with confidence.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Start with the guides, move into peptide pages and vendor research, and use the quiz when you want a more personalized plan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" render={<Link href="/quiz" />}>
                Build your plan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="lg" className="h-12 text-base" render={<Link href="/vendors" />}>
                Review vendors
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}



