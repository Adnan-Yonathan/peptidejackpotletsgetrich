import { ArrowRight, CheckCircle2, Clock3, Dumbbell, HeartPulse, Shield, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import IPhoneMockup from "@/components/ui/iphone-mockup";

type PreviewVariant = "guides" | "stack-builder";

const WALLPAPERS: Record<PreviewVariant, string> = {
  guides:
    "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=900&q=80",
  "stack-builder":
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
};

const COPY: Record<
  PreviewVariant,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    chips: string[];
  }
> = {
  guides: {
    eyebrow: "Quick Match",
    title: "Best place to start",
    subtitle: "Beginner-safe education path built around your goals and current experience.",
    cta: "See Guides",
    chips: ["Fat Loss", "Safety", "Recovery"],
  },
  "stack-builder": {
    eyebrow: "Stack Preview",
    title: "Recovery + Growth",
    subtitle: "Balanced peptide stack with compatibility checks, cost range, and cycle guidance.",
    cta: "Load Stack",
    chips: ["BPC-157", "Ipamorelin", "TB-500"],
  },
};

export function CtaPhonePreview({ variant }: { variant: PreviewVariant }) {
  const copy = COPY[variant];

  return (
    <div className="flex items-center justify-center px-2 py-1">
      <IPhoneMockup
        model="15-pro"
        color="natural-titanium"
        scale={0.44}
        wallpaper={WALLPAPERS[variant]}
        wallpaperPosition="center"
        screenBg="#eff5f1"
        className="drop-shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <div className="relative flex h-full flex-col bg-[linear-gradient(180deg,rgba(247,249,246,0.72),rgba(247,249,246,0.94))] p-4 text-[#13201d]">
          <div className="mb-3 flex items-center justify-between text-[10px] font-semibold text-slate-600">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0f6a52]" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/88 p-3 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.4)] backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#e8f4ee] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f6a52]">
                {copy.eyebrow}
              </span>
              <Clock3 className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.03em]">{copy.title}</h3>
            <p className="mt-1 text-[11px] leading-5 text-slate-600">{copy.subtitle}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {copy.chips.map((chip, index) => (
                <span
                  key={chip}
                  className={cn(
                    "rounded-full px-2 py-1 text-[10px] font-semibold",
                    index === 0 ? "bg-[#0f6a52] text-white" : "bg-[#f2f4f1] text-slate-600"
                  )}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <div className="rounded-[20px] border border-white/70 bg-white/84 p-3 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#e8f4ee] text-[#0f6a52]">
                  {variant === "guides" ? <Sparkles className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-[11px] font-semibold">
                    {variant === "guides" ? "Recommended path" : "Primary stack"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {variant === "guides" ? "3 articles • 9 min total" : "3 peptides • 8-12 week cycle"}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  variant === "guides" ? "Start with peptide basics" : "BPC-157",
                  variant === "guides" ? "Review safety basics" : "Ipamorelin",
                  variant === "guides" ? "Take the plan quiz" : "TB-500",
                ].map((row) => (
                  <div key={row} className="flex items-center justify-between rounded-2xl bg-[#f6f8f5] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0f6a52]" />
                      <span className="text-[10px] font-medium text-slate-700">{row}</span>
                    </div>
                    {variant === "stack-builder" && (
                      <span className="rounded-full bg-[#fff3e2] px-1.5 py-0.5 text-[9px] font-semibold text-[#a86b18]">
                        Checked
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-white/70 bg-white/84 p-3 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#4969a8]">
                    {variant === "guides" ? <Shield className="h-4 w-4" /> : <HeartPulse className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold">
                      {variant === "guides" ? "Confidence score" : "Stack score"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {variant === "guides" ? "Updated weekly" : "Compatibility + cost"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#eaf7ef] px-2 py-1 text-[10px] font-semibold text-[#267c5a]">
                  <Zap className="h-3 w-3" />
                  {variant === "guides" ? "94%" : "Good"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-[22px] bg-[#0f6a52] px-4 py-3 text-white shadow-[0_18px_28px_-22px_rgba(15,106,82,0.65)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {variant === "guides" ? "Next Best Step" : "Ready To Run"}
                </p>
                <p className="mt-1 text-[13px] font-semibold">{copy.cta}</p>
              </div>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </IPhoneMockup>
    </div>
  );
}
