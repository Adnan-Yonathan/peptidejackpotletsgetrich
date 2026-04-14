import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-neutral max-w-none space-y-4 text-muted-foreground text-sm">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
        <p>We collect information you provide when creating an account, completing quizzes, and using our tools. This includes email, quiz responses, and saved plans/stacks.</p>
        <h2 className="text-lg font-semibold text-foreground">How We Use Your Information</h2>
        <p>We use your information to provide personalized recommendations, save your plans, and improve our platform.</p>
        <h2 className="text-lg font-semibold text-foreground">Affiliate Disclosure</h2>
        <p>PeptidePros earns commissions from vendor partners when users click affiliate links and make purchases. This does not affect our rankings or recommendations.</p>
        <h2 className="text-lg font-semibold text-foreground">Disclaimer</h2>
        <p>PeptidePros is for educational and research purposes only. Content on this platform does not constitute medical advice. Always consult a healthcare professional before starting any new protocol.</p>
      </div>
    </div>
  );
}
