import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <FlaskConical className="h-5 w-5 text-primary" />
              PeptidePros
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              The trusted decision engine for peptide research. Compare, plan, and track with confidence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Research</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/peptides" className="hover:text-foreground transition-colors">Peptide Directory</Link></li>
              <li><Link href="/vendors" className="hover:text-foreground transition-colors">Vendor Comparison</Link></li>
              <li><Link href="/stack-builder" className="hover:text-foreground transition-colors">Stack Builder</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Get Started</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/quiz" className="hover:text-foreground transition-colors">Find Your Plan</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PeptidePros. All rights reserved.</p>
          <p>
            For educational and research purposes only. Not medical advice.
            See our{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              disclaimer
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
