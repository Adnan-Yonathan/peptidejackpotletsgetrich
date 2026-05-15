import { ShieldCheck } from "lucide-react";

interface VendorTrustRationaleProps {
  title?: string;
  points: string[];
  affiliateStatus?: string;
}

export function VendorTrustRationale({
  title = "Why this vendor is shown",
  points,
  affiliateStatus,
}: VendorTrustRationaleProps) {
  return (
    <div className="rounded-lg border border-[#103b2c]/12 bg-[#fbfaf7] p-3">
      <div className="flex items-start gap-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0f6a52]" />
        <div>
          <p className="text-xs font-semibold text-[#103b2c]">{title}</p>
          <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-[#103b2c]/70">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {affiliateStatus && (
            <p className="mt-1.5 text-[10px] leading-relaxed text-[#103b2c]/55">
              Affiliate status: {affiliateStatus}. Rankings should still be checked against COA,
              shipping, and product-page details before leaving PeptidePros.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
