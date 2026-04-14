import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">About PeptidePros</h1>
      <div className="prose prose-neutral max-w-none space-y-4 text-muted-foreground">
        <p>
          PeptidePros is the trusted decision engine for people researching peptides, stacks, and vendors.
          We turn scattered information into structured workflows that reduce decision fatigue and increase confidence.
        </p>
        <p>
          Our platform combines personalized plan generation, transparent vendor comparisons, and a powerful
          stack builder to help you go from overwhelmed to organized.
        </p>
        <p>
          PeptidePros is for educational and research purposes only. We do not diagnose, prescribe, or
          provide medical advice.
        </p>
      </div>
    </div>
  );
}
