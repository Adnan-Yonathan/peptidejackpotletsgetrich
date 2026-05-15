import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyQuizCta() {
  return (
    <div className="rounded-xl border border-[#dbeadf] bg-gradient-to-br from-[#fbfaf7] to-[#eff7f2] p-5 shadow-[0_16px_40px_-34px_rgba(15,106,82,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f6a52] text-white">
          <ClipboardCheck className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f6a52]">
        Personalized Quiz
      </p>
      <p className="mt-1 text-base font-semibold leading-tight tracking-[-0.01em] text-[#13201d]">
        Find the right protocol path
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Answer a few questions about your goal, experience, budget, and monitoring comfort so the
        next step matches your profile instead of sending you straight to checkout.
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-4">
        {[
          "Goal-matched peptide and protocol recommendations",
          "Budget, timeline, and safety-fit filtering",
          "PDF unlocks shown after your quiz result",
        ].map((item) => (
          <li key={item} className="text-[11px] leading-relaxed text-foreground/80 marker:text-[#0f6a52]">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Button
          size="sm"
          className="h-9 w-full rounded-xl bg-[#0f6a52] px-3 text-xs font-semibold text-white hover:bg-[#0c5944]"
          render={<Link href="/quiz" />}
        >
          Take the quiz <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-500">
        Takes 2 min - free stack preview
      </p>
    </div>
  );
}
