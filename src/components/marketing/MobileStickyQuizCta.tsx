"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export function MobileStickyQuizCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("landing-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(!entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 transition-all duration-200 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto max-w-md rounded-[1.1rem] border border-[#103b2c]/10 bg-white/96 p-3 shadow-[0_18px_40px_rgba(16,59,44,0.18)] backdrop-blur">
        <Link
          href="/quiz"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[0.95rem] bg-[#0f6a52] px-5 text-[15px] font-extrabold text-white transition-colors hover:bg-[#0d5f49]"
        >
          Find Your Plan
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        <p className="mt-2 text-center text-[11px] font-medium text-[#103b2c]/58">
          Takes 2 min - No email required
        </p>
      </div>
    </div>
  );
}
