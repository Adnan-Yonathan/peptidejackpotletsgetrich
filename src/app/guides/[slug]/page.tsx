import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ShieldAlert, TriangleAlert } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getGuideById,
  getGuideBySlug,
  getGuideCategoryById,
  getPublishedGuides,
  type GuideCalloutType,
} from "@/data/guides";
import { getGoalById } from "@/data/goals";
import { getPeptideById } from "@/data/peptides";

function getCalloutClasses(type: GuideCalloutType) {
  if (type === "danger") return "border-red-500/30 bg-red-500/5";
  if (type === "warning") return "border-yellow-500/30 bg-yellow-500/5";
  if (type === "compliance") return "border-blue-500/30 bg-blue-500/5";
  return "border-primary/20 bg-primary/5";
}

function CalloutIcon({ type }: { type: GuideCalloutType }) {
  if (type === "danger" || type === "warning") {
    return <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />;
  }

  return <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />;
}

export async function generateStaticParams() {
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const category = getGuideCategoryById(guide.categoryId);
  const relatedGuides = guide.relatedGuideIds
    .map((guideId) => getGuideById(guideId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedPeptides = guide.relatedPeptideIds
    .map((peptideId) => getPeptideById(peptideId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedGoals = guide.relatedGoalIds
    .map((goalId) => getGoalById(goalId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <div className="relative container mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6 text-xs font-medium tracking-wide">
                {guide.heroEyebrow}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{guide.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{guide.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {guide.difficulty}
                </Badge>
                {category && (
                  <Badge variant="outline" className="capitalize">
                    {category.title}
                  </Badge>
                )}
                <Badge variant="outline">Updated {guide.updatedAt}</Badge>
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" render={<Link href="/peptides" />}>
                  Browse peptides <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" className="h-12 text-base" render={<Link href="/quiz" />}>
                  Build your plan
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="border bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl">Why this matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {guide.whyItMatters.map((item) => (
                    <p key={item} className="text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card className="border bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl">Key takeaways</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {guide.keyTakeaways.map((takeaway) => (
                    <div key={takeaway} className="rounded-xl border bg-muted/30 p-4 text-sm leading-relaxed">
                      {takeaway}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {guide.sections.map((section) => (
                <Card key={section.id} className="border bg-background">
                  <CardHeader>
                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {section.intro && <p className="text-sm leading-relaxed text-muted-foreground">{section.intro}</p>}

                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}

                    {section.bullets && (
                      <div className="grid gap-3">
                        {section.bullets.map((bullet) => (
                          <div key={bullet} className="rounded-xl border bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
                            {bullet}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.checklist && (
                      <div className="grid gap-3">
                        {section.checklist.map((item) => (
                          <div key={item} className="flex items-start gap-3 rounded-xl border p-4">
                            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.table && (
                      <Table>
                        {section.table.caption && <TableCaption>{section.table.caption}</TableCaption>}
                        <TableHeader>
                          <TableRow>
                            {section.table.columns.map((column) => (
                              <TableHead key={column}>{column}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.table.rows.map((row) => (
                            <TableRow key={row.join("-")}>
                              {row.map((cell) => (
                                <TableCell key={cell} className="whitespace-normal text-sm text-muted-foreground">
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}

                    {section.callout && (
                      <div className={`flex items-start gap-3 rounded-xl border p-4 ${getCalloutClasses(section.callout.type)}`}>
                        <CalloutIcon type={section.callout.type} />
                        <div>
                          <p className="text-sm font-medium">{section.callout.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.callout.body}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/20 py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <Card className="border bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl">Where to go next</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {relatedPeptides.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Peptides</p>
                      <div className="flex flex-wrap gap-2">
                        {relatedPeptides.map((peptide) => (
                          <Badge key={peptide.id} variant="secondary" className="text-xs">
                            <Link href={`/peptides/${peptide.slug}`}>{peptide.name}</Link>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {relatedGoals.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Goals</p>
                      <div className="flex flex-wrap gap-2">
                        {relatedGoals.map((goal) => (
                          <Badge key={goal.id} variant="outline" className="text-xs">
                            {goal.displayName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    Use these guides to build confidence first, then compare compounds, explore goal pages, and look at vendor options with better context.
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl">Related guides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedGuides.map((relatedGuide) => (
                    <div key={relatedGuide.id} className="rounded-xl border p-4">
                      <p className="font-medium">{relatedGuide.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{relatedGuide.summary}</p>
                      <Button className="mt-4" variant="outline" size="sm" render={<Link href={`/guides/${relatedGuide.slug}`} />}>
                        Read guide <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Frequently asked questions</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {guide.faqs.map((faq) => (
                <Card key={faq.question} className="border bg-background">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16 md:py-20">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Use this guide to make better decisions.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Start here, then compare compounds, review vendor documentation, and take the quiz if you want a plan that fits your goals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" render={<Link href="/peptides" />}>
                Browse compounds <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="lg" className="h-12 text-base" render={<Link href="/quiz" />}>
                Build your plan
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

