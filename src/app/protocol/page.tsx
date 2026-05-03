"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  FlaskConical,
  Leaf,
  Lock,
  Notebook,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuizState } from "@/hooks/useQuizState";
import { useProtocolProgress } from "@/hooks/useProtocolProgress";
import {
  buildProtocolPlan,
  isoDate,
  type DoseSlot,
  type ProtocolPlan,
} from "@/lib/protocol-engine";
import { generatePlannerResult } from "@/lib/planner-engine";
import type { PlannerAnswers } from "@/types/planner";

type TabKey = "today" | "protocol" | "progress" | "upgrades";

const TAB_META: Array<{ key: TabKey; label: string; icon: typeof Sparkles }> = [
  { key: "today", label: "Today", icon: Sparkles },
  { key: "protocol", label: "Protocol", icon: FlaskConical },
  { key: "progress", label: "Progress", icon: TrendingUp },
  { key: "upgrades", label: "Upgrades", icon: Leaf },
];

const PLANNER_DEFAULTS: Partial<PlannerAnswers> = {
  secondaryGoalIds: [],
  topProblems: [],
  healthConditions: [],
  medications: [],
  reproductiveStatus: "none",
  femaleLifeStage: "not_applicable",
  maleHormoneContext: "not_applicable",
  notes: "",
  deliveryPreference: "flexible",
  stackingPreference: "basic_stack",
  routineConsistency: "medium",
  monitoringWillingness: "basic",
  planStyle: "balanced",
};

const SLOT_LABELS: Record<DoseSlot, string> = {
  morning: "Morning",
  midday: "Midday",
  evening: "Evening",
  pre_bed: "Pre-bed",
};

const CARD = "rounded-xl bg-white ring-1 ring-foreground/10";
const MONO_LABEL = "text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground";

function useTick(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatDateHeader(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatCountdown(targetIso: string | undefined, now: Date): string {
  if (!targetIso) return "—";
  const diff = new Date(targetIso).getTime() - now.getTime();
  if (diff <= 0) return "Due now";
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs > 24) {
    const days = Math.floor(hrs / 24);
    return `in ${days}d ${hrs % 24}h`;
  }
  if (hrs > 0) return `in ${hrs}h ${remMins}m`;
  return `in ${mins}m`;
}

function CycleRing({
  totalWeeks,
  currentWeek,
  todayCompleted,
  todayTotal,
}: {
  totalWeeks: number;
  currentWeek: number;
  todayCompleted: number;
  todayTotal: number;
}) {
  const size = 220;
  const stroke = 12;
  const outerR = (size - stroke) / 2;
  const innerR = outerR - stroke - 6;
  const outerCirc = 2 * Math.PI * outerR;
  const innerCirc = 2 * Math.PI * innerR;
  const cycleFrac = totalWeeks > 0 ? Math.min(1, currentWeek / totalWeeks) : 0;
  const todayFrac = todayTotal > 0 ? todayCompleted / todayTotal : 0;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerR}
          stroke="oklch(0.92 0 0)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerR}
          stroke="var(--brand-dark, #103b2c)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${cycleFrac * outerCirc} ${outerCirc}`}
          style={{ transition: "stroke-dasharray 600ms ease" }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerR}
          stroke="oklch(0.95 0.01 164)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerR}
          stroke="var(--color-primary, oklch(0.52 0.11 164))"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${todayFrac * innerCirc} ${innerCirc}`}
          style={{ transition: "stroke-dasharray 450ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={MONO_LABEL}>Cycle week</span>
        <span className="mt-1 text-5xl font-bold leading-none tracking-tight text-[#103b2c]">
          {currentWeek}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          of {totalWeeks} · {todayCompleted}/{todayTotal} today
        </span>
      </div>
    </div>
  );
}

function StatTile({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className={`${CARD} p-4`}>
      <div className={MONO_LABEL}>{label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function DoseRow({
  dose,
  completed,
  onToggle,
}: {
  dose: ProtocolPlan["todayDoses"][number];
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
        completed
          ? "border-[color:var(--primary)]/30 bg-[color:var(--primary)]/5"
          : "border-stone-200 bg-white hover:border-stone-300"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={completed ? `Mark ${dose.peptideName} incomplete` : `Mark ${dose.peptideName} complete`}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-all active:translate-y-px ${
          completed
            ? "bg-[color:var(--primary)] text-white"
            : "border border-stone-300 bg-white text-stone-400 hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
        }`}
      >
        <Check className={`h-5 w-5 transition-opacity ${completed ? "opacity-100" : "opacity-0"}`} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`${MONO_LABEL} text-[10px]`}>{SLOT_LABELS[dose.slot]} · {dose.timeLabel}</span>
        </div>
        <p
          className={`mt-0.5 text-[15px] font-semibold tracking-tight ${
            completed ? "text-[#103b2c] line-through decoration-[color:var(--primary)]/40 decoration-2" : "text-foreground"
          }`}
        >
          {dose.peptideName}
        </p>
        <p className="text-xs text-muted-foreground">{dose.doseSummary}</p>
      </div>
      <Link
        href={`/peptides/${dose.peptideSlug}`}
        className="shrink-0 text-[color:var(--primary)] transition-colors hover:text-[#103b2c]"
        aria-label={`Open ${dose.peptideName} reference`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}

function TabBar({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-stone-200 bg-[#fbfaf7]/95 backdrop-blur md:top-16 md:mx-0 md:rounded-xl md:border md:bg-white md:ring-1 md:ring-foreground/10">
      <div className="flex gap-1 overflow-x-auto px-4 py-2 md:px-2">
        {TAB_META.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all active:translate-y-px ${
                isActive
                  ? "bg-[#e7f4ee] text-[color:var(--primary)]"
                  : "text-muted-foreground hover:bg-stone-100 hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TodayTab({
  plan,
  now,
}: {
  plan: ProtocolPlan;
  now: Date;
}) {
  const toggleDose = useProtocolProgress((s) => s.toggleDose);
  const isComplete = useProtocolProgress((s) => s.isComplete);
  const completedToday = plan.todayDoses.filter((d) => isComplete(d.id, now)).length;
  const setNote = useProtocolProgress((s) => s.setNote);
  const getNote = useProtocolProgress((s) => s.getNote);
  const [draft, setDraft] = useState(() => getNote(now));
  const [savedPulse, setSavedPulse] = useState(false);

  useEffect(() => {
    setDraft(getNote(now));
  }, [getNote, now]);

  const countdown = formatCountdown(plan.nextDoseAt, now);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-4">
        <section className={`${CARD} overflow-hidden`}>
          <div className="dna-hero-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="relative grid items-center gap-4 p-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6 sm:p-6">
            <CycleRing
              totalWeeks={plan.totalWeeks}
              currentWeek={plan.currentWeek}
              todayCompleted={completedToday}
              todayTotal={plan.todayDoses.length}
            />
            <div>
              <div className={MONO_LABEL}>{plan.phaseSummary}</div>
              <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#103b2c] sm:text-3xl">
                {completedToday === plan.todayDoses.length && plan.todayDoses.length > 0
                  ? "You're on track for today."
                  : plan.todayDoses.length === 0
                    ? "Rest day — no doses scheduled."
                    : plan.nextDose
                      ? `Next: ${plan.nextDose.peptideName}`
                      : "Stay the course."}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {plan.nextDose ? (
                  <>
                    {plan.nextDose.doseSummary} · <span className="font-semibold text-foreground">{countdown}</span>{" "}
                    ({plan.nextDose.timeLabel})
                  </>
                ) : (
                  "No doses are scheduled for today. Take it easy and log how you feel below."
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="rounded-full border-transparent bg-[#e7f4ee] text-[color:var(--primary)] hover:bg-[#e7f4ee]">
                  Week {plan.currentWeek} of {plan.totalWeeks}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {plan.compounds.length} compound{plan.compounds.length === 1 ? "" : "s"} in stack
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {plan.todayDoses.length} dose{plan.todayDoses.length === 1 ? "" : "s"} today
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className={`${CARD} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Today's doses</h3>
            <span className="text-sm text-muted-foreground">
              {completedToday}/{plan.todayDoses.length} done
            </span>
          </div>
          {plan.todayDoses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50/60 p-6 text-center">
              <Leaf className="mx-auto h-6 w-6 text-[color:var(--primary)]" />
              <p className="mt-2 text-sm font-medium text-foreground">Scheduled rest day.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your protocol includes recovery windows. Use today to log how you feel and hydrate.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {plan.todayDoses.map((dose) => (
                <DoseRow
                  key={dose.id}
                  dose={dose}
                  completed={isComplete(dose.id, now)}
                  onToggle={() => toggleDose(dose.id, now)}
                />
              ))}
            </div>
          )}
        </section>

        <section className={`${CARD} p-5`}>
          <div className="mb-2 flex items-center gap-2">
            <Notebook className="h-4 w-4 text-[color:var(--primary)]" />
            <h3 className="text-lg font-semibold tracking-tight text-foreground">How did today feel?</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Optional · sleep quality, sides, pumps, workout notes — private, saved on this device.
          </p>
          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setSavedPulse(false);
            }}
            onBlur={() => {
              setNote(now, draft);
              setSavedPulse(true);
              setTimeout(() => setSavedPulse(false), 1400);
            }}
            rows={3}
            placeholder="Felt great. Slept 7.5h. Shoulder mobility noticeably better after TB-500 dose."
            className="mt-3 w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {draft.length} chars · autosaves on blur
            </span>
            <span
              className={`text-xs font-semibold text-[color:var(--primary)] transition-opacity ${
                savedPulse ? "opacity-100" : "opacity-0"
              }`}
            >
              Saved
            </span>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-4">
        <div className={`${CARD} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={MONO_LABEL}>Next dose</div>
              <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {plan.nextDose?.peptideName ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {plan.nextDose ? plan.nextDose.doseSummary : "No dose scheduled"}
              </p>
            </div>
            <div className="text-right">
              <div className={MONO_LABEL}>Countdown</div>
              <p className="mt-1 text-xl font-bold tracking-tight text-[color:var(--primary)]">
                {countdown}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled
              className="w-full cursor-not-allowed opacity-60"
              title="Available on paid tier"
            >
              <Bell className="mr-2 h-4 w-4" />
              Turn on reminders
              <Lock className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className={`${CARD} bg-[#103b2c] text-white ring-0 p-5`}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[color:var(--primary-subtle,#e7f4ee)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary-subtle,#e7f4ee)]">
              Execution upgrade
            </span>
          </div>
          <h4 className="mt-2 text-xl font-bold leading-tight tracking-tight">
            Don't just get a plan. Execute it correctly.
          </h4>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Unlock full protocol detail, adherence tracking, dose reminders, and a cycle-long progress log.
          </p>
          <Button
            className="mt-4 w-full bg-white text-[#103b2c] hover:bg-white/90"
            render={<Link href="/protocol?tab=upgrades" />}
          >
            See upgrade options
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProtocolTab({ plan }: { plan: ProtocolPlan }) {
  return (
    <div className="flex flex-col gap-4">
      <section className={`${CARD} p-5`}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className={MONO_LABEL}>Cycle timeline</div>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              {plan.totalWeeks}-week program · week {plan.currentWeek} active
            </h3>
          </div>
          <Badge variant="outline" className="rounded-full">
            {plan.phaseSummary}
          </Badge>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(36px,1fr))] gap-1.5">
          {plan.weeks.map((w) => {
            const isActive = w.index === plan.currentWeek;
            const isPast = w.index < plan.currentWeek;
            const phaseColor =
              w.phase === "ramp"
                ? "bg-[color:var(--primary)]/40"
                : w.phase === "taper"
                  ? "bg-stone-300"
                  : "bg-[color:var(--primary)]";
            return (
              <div key={w.index} className="flex flex-col items-center gap-1">
                <div
                  className={`h-10 w-full rounded-md transition-all ${
                    isActive
                      ? `${phaseColor} ring-2 ring-[#103b2c] ring-offset-1`
                      : isPast
                        ? phaseColor
                        : "bg-stone-200"
                  }`}
                  title={`Week ${w.index} · ${w.phaseLabel}`}
                />
                <span className={`text-[10px] font-medium ${isActive ? "text-[#103b2c]" : "text-muted-foreground"}`}>
                  {w.index}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[color:var(--primary)]/40" />
            Ramp-up
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[color:var(--primary)]" />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-stone-300" />
            Taper
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Compounds in your stack</h3>
          <span className="text-sm text-muted-foreground">{plan.compounds.length} active</span>
        </div>
        {plan.compounds.map((c) => (
          <div key={c.peptideId} className={`${CARD} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="rounded-full capitalize">
                    {c.role.replace("-", " ")}
                  </Badge>
                  <Badge variant="outline" className="rounded-full capitalize">
                    {c.usageModel.replace(/_/g, " ")}
                  </Badge>
                </div>
                <h4 className="mt-2 text-xl font-bold tracking-tight text-foreground">
                  {c.peptideName}
                </h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{c.rationale}</p>
              </div>
              <Link
                href={`/peptides/${c.peptideSlug}`}
                className="shrink-0 text-xs font-semibold text-[color:var(--primary)] hover:text-[#103b2c]"
              >
                Full guide →
              </Link>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <div className="rounded-lg border border-stone-100 bg-stone-50 p-3">
                <div className={MONO_LABEL}>Dose</div>
                <p className="mt-1 text-sm font-semibold text-foreground">{c.doseRange}</p>
              </div>
              <div className="rounded-lg border border-stone-100 bg-stone-50 p-3">
                <div className={MONO_LABEL}>Frequency</div>
                <p className="mt-1 text-sm font-semibold text-foreground">{c.frequencyLabel}</p>
              </div>
              <div className="rounded-lg border border-stone-100 bg-stone-50 p-3">
                <div className={MONO_LABEL}>Timing</div>
                <p className="mt-1 text-sm font-semibold text-foreground">{c.timingLabel}</p>
              </div>
              <div className="rounded-lg border border-stone-100 bg-stone-50 p-3">
                <div className={MONO_LABEL}>Route</div>
                <p className="mt-1 text-sm font-semibold capitalize text-foreground">{c.route}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Cycle length: <span className="font-semibold text-foreground">{c.cycleWeeks} weeks</span>
            </div>
          </div>
        ))}
      </section>

      <section className={`${CARD} border-dashed bg-[#fbfaf7] p-5 ring-dashed`}>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[color:var(--primary)]" />
          <span className={MONO_LABEL}>Paid tier preview</span>
        </div>
        <h4 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          Injection-site rotation map, PCT sequencing, and protocol adjustments
        </h4>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Paid protocols include a site-rotation grid, PCT/post-cycle sequencing, and weekly adjustments based on
          your logged adherence and notes.
        </p>
        <Button variant="outline" className="mt-3">
          Preview paid protocol
        </Button>
      </section>
    </div>
  );
}

function ProgressTab({
  plan,
  now,
}: {
  plan: ProtocolPlan;
  now: Date;
}) {
  const adherence = useProtocolProgress((s) => s.adherenceLastNDays);
  const streak = useProtocolProgress((s) => s.streak);
  const weeklyAdherence = useProtocolProgress((s) => s.weeklyAdherence);
  const notes = useProtocolProgress((s) => s.notes);
  const reset = useProtocolProgress((s) => s.reset);

  const expectedPerDay = plan.todayDoses.length;
  const cycleAdherence = adherence(now, Math.max(1, plan.daysIntoCycle + 1), expectedPerDay);
  const last7Adherence = adherence(now, 7, expectedPerDay);
  const streakDays = streak(now);
  const weekly = weeklyAdherence(now, Math.min(plan.currentWeek, 8), expectedPerDay);

  const noteEntries = Object.entries(notes)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile value={`${cycleAdherence}%`} label="Cycle adherence" sub={`${plan.daysIntoCycle + 1} days in`} />
        <StatTile value={`${last7Adherence}%`} label="Last 7 days" />
        <StatTile value={`${streakDays}`} label="Day streak" sub={streakDays === 1 ? "day" : "days"} />
        <StatTile
          value={`${plan.currentWeek}/${plan.totalWeeks}`}
          label="Weeks complete"
          sub={plan.phaseSummary}
        />
      </section>

      <section className={`${CARD} p-5`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className={MONO_LABEL}>Weekly adherence</div>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              You're {cycleAdherence}% on track this cycle
            </h3>
          </div>
        </div>
        <div className="flex h-32 items-end gap-2">
          {weekly.map((w) => (
            <div key={w.week} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-md bg-[color:var(--primary)] transition-all"
                  style={{ height: `${Math.max(4, w.adherence)}%` }}
                  title={`Week ${w.week}: ${w.adherence}%`}
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">W{w.week}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Bars show % of scheduled doses completed each week. Empty weeks were before your cycle start or had no
          scheduled doses.
        </p>
      </section>

      <section className={`${CARD} p-5`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Recent notes</h3>
          <Button variant="ghost" size="sm" onClick={() => reset()} className="text-muted-foreground">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset progress
          </Button>
        </div>
        {noteEntries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50/60 p-6 text-center text-sm text-muted-foreground">
            No notes yet. Log how you feel from the Today tab to start building a cycle journal.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {noteEntries.map(([date, text]) => (
              <div key={date} className="rounded-lg border border-stone-100 bg-stone-50 p-3">
                <div className={MONO_LABEL}>
                  {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <p className="mt-1 text-sm leading-6 text-foreground">{text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UpgradeCard({
  icon: Icon,
  title,
  description,
  price,
  features,
  disabledLabel,
}: {
  icon: typeof Dumbbell;
  title: string;
  description: string;
  price: string;
  features: string[];
  disabledLabel?: string;
}) {
  return (
    <div className={`${CARD} flex flex-col gap-4 p-5`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className={MONO_LABEL}>Add-on</div>
          <h4 className="text-lg font-semibold tracking-tight text-foreground">{title}</h4>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <ul className="flex flex-col gap-1.5 text-sm text-foreground/85">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-sm font-semibold text-[#103b2c]">{price}</span>
        <Button size="sm" variant="outline" disabled>
          {disabledLabel ?? "Join waitlist"}
        </Button>
      </div>
    </div>
  );
}

function UpgradesTab() {
  return (
    <div className="flex flex-col gap-4">
      <section className={`${CARD} bg-gradient-to-br from-[#103b2c] to-[color:var(--primary)] text-white ring-0 p-6`}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">Execution upgrade</span>
        </div>
        <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
          Turn your plan into a protocol you actually finish.
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
          The free tier shows you what to run. The Protocol plan unlocks full dosing detail, adherence tracking,
          reminders, and modular add-ons built around your goal.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button className="bg-white text-[#103b2c] hover:bg-white/90" disabled>
            Unlock Protocol — coming soon
          </Button>
          <span className="text-xs text-white/70 self-center">
            Launching in the next release · ungated during beta
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <UpgradeCard
          icon={FlaskConical}
          title="Protocol Core"
          description="Full dosing schedule, cycle timeline, adherence tracker, optional reminders."
          price="$14/mo"
          features={[
            "All compound timing + injection-site rotation",
            "Adherence + streak tracking",
            "Dose reminders via email/SMS",
            "Monthly protocol adjustments",
          ]}
          disabledLabel="Unlock soon"
        />
        <UpgradeCard
          icon={Dumbbell}
          title="Fitness Add-On"
          description="Simple 3- or 4-day training plan tied to your primary goal and peptide stack."
          price="+$9/mo"
          features={[
            "Goal-tuned training split",
            "Sets, reps, and progression in one screen",
            "Synced with your cycle phase",
          ]}
        />
        <UpgradeCard
          icon={Leaf}
          title="Diet Add-On"
          description="Macros and meal structure calibrated to the compound and goal you're running."
          price="+$9/mo"
          features={[
            "Protein, carb, fat targets per phase",
            "Sample meals + grocery template",
            "Intermittent-fasting window presets",
          ]}
        />
      </section>

      <section className={`${CARD} p-5`}>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[color:var(--primary)]" />
          <span className={MONO_LABEL}>Advanced protocols</span>
        </div>
        <h4 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          Optimized stacks with live adjustments
        </h4>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Advanced protocols re-tune weekly based on your logged adherence, side-effect notes, and goal
          progress. Currently in design — join the waitlist to shape it.
        </p>
        <Button variant="outline" className="mt-3" disabled>
          Join the waitlist
        </Button>
      </section>
    </div>
  );
}

function MissingPlanState() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e7f4ee] text-[color:var(--primary)]">
        <FlaskConical className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-[#103b2c]">Your protocol is 2 minutes away.</h1>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        Complete the 6-question intake so the planner can build a cycle tailored to your goal, experience, and
        risk tolerance. You'll land back here with a day-by-day execution plan.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" render={<Link href="/quiz" />}>
          Start the intake
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/peptides" />}>
          Browse compounds
        </Button>
      </div>
    </div>
  );
}

function EmptyStackState() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e7f4ee] text-[color:var(--primary)]">
        <Clock3 className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-[#103b2c]">No compounds currently scheduled.</h1>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        Your quiz answers were conservative enough that the planner didn't keep a stack. Retake the intake with
        looser constraints to generate an executable protocol.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" render={<Link href="/quiz" />}>
          Retake intake
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/peptides" />}>
          Browse compounds
        </Button>
      </div>
    </div>
  );
}

export default function ProtocolPage() {
  const router = useRouter();
  const now = useTick(60_000);
  const { answers, isComplete, reset: resetQuiz } = useQuizState();
  const ensureStarted = useProtocolProgress((s) => s.ensureStarted);
  const startedAtIso = useProtocolProgress((s) => s.startedAt);
  const [tab, setTab] = useState<TabKey>("today");

  useEffect(() => {
    ensureStarted(new Date());
  }, [ensureStarted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("tab") as TabKey | null;
    if (requested && ["today", "protocol", "progress", "upgrades"].includes(requested)) {
      setTab(requested);
    }
  }, []);

  const plan = useMemo(() => {
    if (!isComplete()) return null;
    const completed = { ...PLANNER_DEFAULTS, ...answers } as PlannerAnswers;
    const result = generatePlannerResult(completed);
    if (result.primary.length === 0) return null;
    const startedAt = startedAtIso ? new Date(startedAtIso) : new Date();
    return buildProtocolPlan({ plan: result, answers: completed, startedAt, now });
  }, [answers, isComplete, now, startedAtIso]);

  const hasQuizResult = isComplete();
  const hasStack = plan !== null;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#fbfaf7]">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12 md:pt-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <div className={MONO_LABEL}>PeptidePros +</div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#103b2c] md:text-4xl">
                {formatDateHeader(now)}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Ungated beta · progress saves to this device only.
              </p>
            </div>
            {hasQuizResult && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => {
                  resetQuiz();
                  router.push("/quiz");
                }}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Retake intake
              </Button>
            )}
          </div>

          {!hasQuizResult ? (
            <MissingPlanState />
          ) : !hasStack || !plan ? (
            <EmptyStackState />
          ) : (
            <>
              <TabBar active={tab} onChange={setTab} />
              <div className="mt-4">
                {tab === "today" && <TodayTab plan={plan} now={now} />}
                {tab === "protocol" && <ProtocolTab plan={plan} />}
                {tab === "progress" && <ProgressTab plan={plan} now={now} />}
                {tab === "upgrades" && <UpgradesTab />}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
