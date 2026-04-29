import { ShieldCheck } from "lucide-react";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";

export default function HomePage() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-[#f6f4ee]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,106,82,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(16,59,44,0.10),_transparent_30%)]" />
      <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl items-center justify-center px-4 py-12 md:px-8 md:py-16">
        <div className="relative max-w-2xl text-center">
          <h1 className="mt-8 text-4xl font-bold leading-[1.02] tracking-tight text-[#103b2c] sm:text-5xl md:text-6xl">
            The smarter way to
            <br />
            <span className="text-[#0f6a52]">research peptides.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 md:text-xl">
            Personalized plans, evidence-graded compounds, vendor comparison, and
            compatibility checking in one place. We&apos;re putting the finishing
            touches on the experience now.
          </p>

          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_80px_-42px_rgba(16,59,44,0.45)] backdrop-blur">
            <div className="flex items-start justify-center gap-3 text-left">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e7f4ee] text-[#0f6a52]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#103b2c]">
                  Coming soon
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Join the waitlist for launch access, early product updates, and
                  the first invite when the app opens.
                </p>
              </div>
            </div>

            <WaitlistForm className="mt-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
