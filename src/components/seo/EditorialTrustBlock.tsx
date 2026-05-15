import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import {
  formatReviewDate,
  getDisclaimerCopy,
  type EditorialReview,
} from "@/lib/editorial";

interface EditorialTrustBlockProps {
  review: EditorialReview;
  compact?: boolean;
}

export function EditorialTrustBlock({ review, compact = false }: EditorialTrustBlockProps) {
  return (
    <aside className="rounded-xl border border-[#103b2c]/12 bg-white/80 p-5 text-[#103b2c] shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0f6a52]/10 text-[#0f6a52]">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
            Reviewed for evidence and compliance
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#103b2c]/75">
            By {review.authorName}
            {review.reviewerName ? `; reviewed by ${review.reviewerName}` : ""}. Last reviewed{" "}
            {formatReviewDate(review.lastReviewedAt)}.
          </p>
        </div>
      </div>
      {!compact && (
        <>
          <div className="mt-4 grid gap-2 text-xs leading-relaxed text-[#103b2c]/72 sm:grid-cols-2">
            <p className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0f6a52]" />
              {review.methodologySummary}
            </p>
            <p className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0f6a52]" />
              {getDisclaimerCopy(review.disclaimerVariant)}
            </p>
          </div>
          <Link
            href="/methodology"
            className="mt-4 inline-flex text-xs font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-4 hover:text-[#0f6a52]"
          >
            Read the methodology
          </Link>
        </>
      )}
    </aside>
  );
}
