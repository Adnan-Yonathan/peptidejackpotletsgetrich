"use client";

import { trackAffiliateClick } from "@/lib/affiliate";

interface AffiliateLinkProps {
  href: string;
  peptideId?: string;
  vendorId?: string;
  sourcePage: string;
  planId?: string;
  children: React.ReactNode;
  className?: string;
}

export function AffiliateLink({
  href,
  peptideId,
  vendorId,
  sourcePage,
  planId,
  children,
  className,
}: AffiliateLinkProps) {
  const handleClick = () => {
    trackAffiliateClick({ peptideId, vendorId, sourcePage, planId });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
