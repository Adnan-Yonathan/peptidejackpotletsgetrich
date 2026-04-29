import Image from "next/image";
import { FlaskConical, ShieldCheck } from "lucide-react";
import heroImage from "../../../images/ChatGPT Image Apr 13, 2026, 10_55_43 PM.png";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";

export default function HomePage() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-[#f6f4ee]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,106,82,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(16,59,44,0.10),_transparent_30%)]" />
      <div className="mx-auto grid min-h-[100svh] w-full max-w-7xl items-center gap-14 px-4 py-12 md:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] md:px-8 md:py-16">
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0f6a52]/15 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f6a52] shadow-sm">
            <FlaskConical className="h-3.5 w-3.5" />
            PeptidePros
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-[1.02] tracking-tight text-[#103b2c] sm:text-5xl md:text-6xl">
            The smarter way to
            <br />
            <span className="text-[#0f6a52]">research peptides.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
            Personalized plans, evidence-graded compounds, vendor comparison, and
            compatibility checking in one place. We&apos;re putting the finishing
            touches on the experience now.
          </p>

          <div className="mt-10 max-w-xl rounded-[28px] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_80px_-42px_rgba(16,59,44,0.45)] backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e7f4ee] text-[#0f6a52]">
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

        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute inset-0 scale-95 rounded-[36px] bg-[#0f6a52]/12 blur-3xl" />
          <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/60 p-3 shadow-[0_36px_120px_-48px_rgba(16,59,44,0.55)] backdrop-blur">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#dfece6]">
              <div className="absolute left-5 top-5 z-10 rounded-full border border-white/70 bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0f6a52]">
                Research peptide guide
              </div>
              <div className="absolute bottom-5 right-5 z-10 rounded-full border border-white/70 bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#103b2c]">
                Launching soon
              </div>
              <Image
                src={heroImage}
                alt="PeptidePros hero artwork"
                fill
                priority
                sizes="(min-width: 768px) 460px, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#103b2c]/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
