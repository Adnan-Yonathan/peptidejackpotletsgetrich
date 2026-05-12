import { getGoalById } from "@/data/goals";
import { getPeptideById, type PeptideData } from "@/data/peptides";
import type { ProtocolPdfProduct } from "@/data/protocol-pdfs";

export type PdfAudience = "consumer" | "clinician";
export type PdfScheduleType = "approved_label" | "guardrailed_research" | "execution";

export interface PdfCompoundRecommendation {
  peptideId: string;
  role: string;
  fit: string;
  watch: string;
  scheduleType: PdfScheduleType;
}

export interface PdfScheduleRow {
  period: string;
  action: string;
  track: string;
  trigger: string;
  notes: string;
}

export interface PdfTrackingMetric {
  metric: string;
  frequency: string;
  targetUse: string;
  actionTrigger: string;
}

export interface ProtocolPdfContent {
  productSlug: string;
  audience: PdfAudience;
  title: string;
  positioning: string;
  tableOfContents: string[];
  goalSnapshot: string;
  timeline: string;
  primaryOutcome: string;
  compoundRecommendations: PdfCompoundRecommendation[];
  schedule: {
    baseline: string[];
    weeksOneToFour: string[];
    optimization: string[];
    maintenance: string[];
  };
  detailedSchedule: {
    dailyRhythm: PdfScheduleRow[];
    firstSevenDays: PdfScheduleRow[];
    weeklyPlan: PdfScheduleRow[];
    trackingMetrics: PdfTrackingMetric[];
    reviewRules: string[];
    adjustmentRules: string[];
  };
  monitoring: string[];
  redFlags: string[];
  clinicianPrompts: string[];
  executionChecklist: string[];
  references: string[];
  lastReviewed: string;
}

const LAST_REVIEWED = "May 10, 2026";

const GOAL_COMPOUNDS: Record<string, PdfCompoundRecommendation[]> = {
  fat_loss: [
    {
      peptideId: "semaglutide",
      role: "Approved GLP-1 anchor for appetite, satiety, and long-horizon weight management.",
      fit: "Best fit when the user wants a medically supervised fat-loss pathway with clear titration and safety monitoring.",
      watch: "GI tolerance, hydration, gallbladder symptoms, pancreatitis symptoms, pregnancy status, mood change, and medication absorption issues.",
      scheduleType: "approved_label",
    },
    {
      peptideId: "tirzepatide",
      role: "Approved incretin alternative for weight-management conversations where available and clinically appropriate.",
      fit: "Best fit when GLP-1/GIP discussion belongs in the clinician visit and the buyer wants an approved-care option map.",
      watch: "Class-like GI effects, contraindications, cost, sourcing, and duplicate incretin stacking.",
      scheduleType: "approved_label",
    },
    {
      peptideId: "aod-9604",
      role: "Speculative metabolic research compound for education-only comparison against approved incretin options.",
      fit: "Only fits as a watchlist item for buyers comparing market claims against the evidence base.",
      watch: "Weak efficacy support, regulatory uncertainty, and overpromising fat-loss speed.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "mots-c",
      role: "Mitochondrial/metabolic research compound discussed as an evidence watchlist item.",
      fit: "Best kept as a research note for longevity/metabolic readers, not a consumer protocol anchor.",
      watch: "Sparse human exposure data and anti-doping/platform risk.",
      scheduleType: "guardrailed_research",
    },
  ],
  muscle_growth: [
    {
      peptideId: "cjc-1295",
      role: "GH-axis research compound for recovery and body-composition discussions.",
      fit: "Only after training, protein, sleep, glucose risk, and endocrine context are addressed.",
      watch: "IGF-1 elevation, edema, glucose changes, headaches, BP/HR changes, and anti-doping exposure.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "ipamorelin",
      role: "Growth-hormone secretagogue research compound often paired with GH-axis planning.",
      fit: "Clinician-supervised users who need a cautious GH-axis discussion instead of a bodybuilding stack sheet.",
      watch: "FDA compounding concerns, glucose/cortisol axis uncertainty, edema, appetite, and WADA status.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "ghrp-6",
      role: "GH secretagogue with appetite and endocrine-spillover considerations.",
      fit: "Advanced-only education for buyers comparing secretagogues and monitoring burden.",
      watch: "Appetite rise, glucose effects, cortisol effects, edema, and anti-doping rules.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "igf-1-lr3",
      role: "Growth-factor market compound for high-risk comparison and exclusion screening.",
      fit: "Useful mainly to explain why aggressive growth-factor paths require stronger warnings.",
      watch: "Mitogenic risk, hypoglycemia risk, and cancer-history concerns.",
      scheduleType: "guardrailed_research",
    },
  ],
  recovery: [
    {
      peptideId: "bpc-157",
      role: "Popular tissue-repair research compound with strong market demand and weak human protocol certainty.",
      fit: "Buyer education around injury context, PT, load management, and research-only sourcing.",
      watch: "FDA compounding flag, WADA S0 status, lack of established human dosing, and masking injury progression.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "tb-500",
      role: "Thymosin beta-4 fragment market compound for soft-tissue recovery discussions.",
      fit: "Education-only comparison where sequence ambiguity and anti-doping risk are explained clearly.",
      watch: "Sequence ambiguity, quality risk, lack of validated human protocol, and WADA risk.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "thymosin-beta-4",
      role: "Better-defined thymosin reference point with narrower clinical context than broad recovery marketing suggests.",
      fit: "Useful to distinguish full-length thymosin beta-4 from TB-500-style product claims.",
      watch: "Route mismatch, systemic claim inflation, and anti-doping status.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "ghk-cu",
      role: "Cosmetic/skin-repair support compound for topical or appearance-adjacent recovery goals.",
      fit: "Best fit where skin quality, wound appearance, or topical support is the real goal.",
      watch: "Irritation, product formulation, and unrealistic tissue-healing claims.",
      scheduleType: "guardrailed_research",
    },
  ],
  anti_aging: [
    {
      peptideId: "mots-c",
      role: "Mitochondrial research compound for metabolic-resilience discussions.",
      fit: "Longevity buyers who need evidence sorting rather than a broad anti-aging promise.",
      watch: "Sparse human exposure data and claim inflation.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "epitalon",
      role: "Longevity-market peptide for telomere/sleep hypothesis review.",
      fit: "Readers comparing anti-aging claims against weak-to-moderate evidence.",
      watch: "Long-horizon uncertainty, weak endpoints, and overstacking.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "humanin",
      role: "Mitochondrial-derived peptide family reference for cellular-resilience research.",
      fit: "Education around emerging mitochondrial biology, not an outcome-guaranteed protocol.",
      watch: "Translation gap from mechanistic research to consumer outcomes.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "elamipretide",
      role: "Clinical-stage mitochondrial compound used as a benchmark for legitimate development paths.",
      fit: "Readers who need to separate clinical-stage therapeutics from generic vendor vials.",
      watch: "Modality, indication, and sourcing mismatch.",
      scheduleType: "guardrailed_research",
    },
  ],
  cognitive: [
    {
      peptideId: "semax",
      role: "CNS-active research peptide for focus and stress-resilience discussions.",
      fit: "Users tracking attention, fatigue, and sleep impact with conservative routines.",
      watch: "Stimulation, anxiety, sleep disruption, and psychiatric medication overlap.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "selank",
      role: "Anxiolytic/calm-focus research peptide with mood and sleep overlap.",
      fit: "Buyers whose cognitive complaints are tied to stress reactivity or sleep friction.",
      watch: "Medication overlap, sedation, paradoxical stimulation, and mood instability.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "dihexa",
      role: "High-risk neurotrophic research compound included for caution and comparison.",
      fit: "Advanced education only for readers attracted to aggressive nootropic claims.",
      watch: "Mitogenic/neurotrophic uncertainty and weak consumer safety data.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "cerebrolysin",
      role: "Clinical-context neuropeptide mixture for neurorecovery comparison.",
      fit: "Readers who need to understand why clinical provenance and route matter.",
      watch: "Sterility, route, product provenance, and medical supervision.",
      scheduleType: "guardrailed_research",
    },
  ],
  sleep: [
    {
      peptideId: "dsip",
      role: "Sleep-market peptide for circadian and sleep-quality research discussion.",
      fit: "Users willing to track sleep timing, caffeine, alcohol, and next-day function first.",
      watch: "Weak evidence, next-day effects, and ignoring sleep apnea or medication drivers.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "selank",
      role: "Calm-state support candidate when anxiety is the sleep bottleneck.",
      fit: "Readers with stress-linked sleep issues who need a low-complexity routine.",
      watch: "Psychiatric overlap, daytime sedation, and treating anxiety without support.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "epitalon",
      role: "Longevity/sleep crossover compound with long-horizon claims.",
      fit: "Education around sleep-adjacent anti-aging claims rather than a sleep-first protocol.",
      watch: "Weak endpoint certainty and unrealistic timeline expectations.",
      scheduleType: "guardrailed_research",
    },
  ],
  immune: [
    {
      peptideId: "thymosin-alpha-1",
      role: "Immune-modulating peptide with the strongest immune-support relevance in this catalog.",
      fit: "Clinician-discussion candidate for immune resilience context and cautious monitoring.",
      watch: "Autoimmune disease, active infection context, and medication overlap.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "kpv",
      role: "Anti-inflammatory peptide discussed for gut, skin, and immune-barrier contexts.",
      fit: "Buyers with inflammation-adjacent goals who need symptom tracking and referral triggers.",
      watch: "Treating undiagnosed disease symptoms with a vendor product.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "ll-37",
      role: "Antimicrobial peptide for high-caution immune discussions.",
      fit: "Advanced education only where infection context is medically supervised.",
      watch: "Immune activation, inflammation, and infection mismanagement.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "larazotide",
      role: "Gut-barrier investigational peptide for celiac/barrier research context.",
      fit: "Readers comparing gut-barrier evidence against general immune claims.",
      watch: "Indication specificity and overgeneralizing from celiac research.",
      scheduleType: "guardrailed_research",
    },
  ],
  skin_hair: [
    {
      peptideId: "ghk-cu",
      role: "Topical/cosmetic anchor for skin quality, collagen, and appearance routines.",
      fit: "Best fit for appearance tracking, routine consistency, and topical-first planning.",
      watch: "Irritation, formulation quality, and expecting fast hair-density changes.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "melanotan-1",
      role: "Melanocortin compound for pigmentation education and risk review.",
      fit: "Only for readers who need clear skin-cancer, mole-change, and photo-tracking warnings.",
      watch: "Pigment changes, mole/freckle changes, nausea, and skin-cancer history.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "melanotan-2",
      role: "Higher-friction melanocortin market compound with sexual-health overlap.",
      fit: "Education around why pigmentation/libido claims need stronger cautions.",
      watch: "Pigment changes, nausea, flushing, libido effects, and psychiatric/body-image risk.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "kpv",
      role: "Skin/gut inflammation support candidate for barrier-focused routines.",
      fit: "Users tracking flares, irritation, and routine changes before escalating.",
      watch: "Undiagnosed dermatologic disease and poor photo documentation.",
      scheduleType: "guardrailed_research",
    },
  ],
  sexual_health: [
    {
      peptideId: "pt-141",
      role: "Melanocortin arousal compound for on-demand sexual-health discussions.",
      fit: "Users screening cardiovascular, medication, nausea, and anxiety context first.",
      watch: "Blood pressure, nausea, flushing, psychiatric context, and relationship drivers.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "kisspeptin",
      role: "Reproductive-axis peptide for hormone and fertility-context education.",
      fit: "Clinician-discussion candidate when libido concerns overlap with reproductive hormones.",
      watch: "Fertility goals, endocrine disorders, and unmonitored hormone manipulation.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "oxytocin",
      role: "Bonding/social-context peptide for relationship and arousal-adjacent discussion.",
      fit: "Education where emotional context and communication are part of the goal.",
      watch: "Psychiatric context, unrealistic relationship claims, and route/formulation mismatch.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "melanotan-2",
      role: "Pigmentation/libido crossover compound with higher caution needs.",
      fit: "Only where the PDF clearly separates arousal claims from skin/pigment risks.",
      watch: "Pigmentation changes, nausea, flushing, and body-image pressure.",
      scheduleType: "guardrailed_research",
    },
  ],
  gh_optimization: [
    {
      peptideId: "cjc-1295",
      role: "Long-acting GHRH analog for GH-axis education and monitoring workflows.",
      fit: "Advanced users with clinician support, baseline labs, and clear stop criteria.",
      watch: "IGF-1 elevation, edema, glucose, headaches, BP/HR, and WADA rules.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "ipamorelin",
      role: "GHSR agonist often compared with other secretagogues for GH pulses.",
      fit: "Readers who need a clean one-variable-at-a-time GH-axis plan.",
      watch: "FDA compounding concerns, appetite, glucose, edema, and endocrine spillover.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "ghrp-6",
      role: "GH secretagogue with appetite and cortisol/glucose cautions.",
      fit: "Advanced comparison only, especially when appetite stimulation matters.",
      watch: "Glucose control, cortisol effects, appetite dysregulation, and WADA status.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "tesamorelin",
      role: "Approved GHRH analog for a narrow HIV-lipodystrophy indication and prescription-only comparison.",
      fit: "Readers who need to understand approved GH-axis context versus wellness claims.",
      watch: "Indication specificity, neoplasm warnings, glucose intolerance, and prescription sourcing.",
      scheduleType: "approved_label",
    },
  ],
  anxiety: [
    {
      peptideId: "selank",
      role: "Calm-focus research peptide for stress reactivity and anxiety-adjacent routines.",
      fit: "Users who can track mood, sleep, triggers, and medication overlap.",
      watch: "Psychiatric history, paradoxical stimulation, sedation, and medication interactions.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "semax",
      role: "Focus-oriented CNS peptide that can overlap with anxious activation.",
      fit: "Best when fatigue/focus is the main complaint and anxiety is monitored closely.",
      watch: "Stimulation, sleep disruption, irritability, and stacking nootropics.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "oxytocin",
      role: "Social/bonding peptide for relationship-context education.",
      fit: "Readers exploring social stress and connection alongside therapy-grade supports.",
      watch: "Psychiatric complexity, expectation inflation, and route/formulation issues.",
      scheduleType: "guardrailed_research",
    },
    {
      peptideId: "dsip",
      role: "Sleep-overlap peptide when poor sleep amplifies anxiety.",
      fit: "Users who need a sleep reset, caffeine controls, and next-day tracking.",
      watch: "Weak evidence, sleep apnea, medication drivers, and next-day impairment.",
      scheduleType: "guardrailed_research",
    },
  ],
};

const ADDON_EXECUTION: Record<string, string[]> = {
  fat_loss: ["Protein floor", "GI tolerance plan", "Hydration and fiber", "Rebound-prevention review"],
  muscle_growth: ["Training split", "Progressive overload", "Protein and calorie audit", "Deload rules"],
  recovery: ["Pain/function log", "Rehab phase", "Return-to-training criteria", "Specialist review triggers"],
  anti_aging: ["Sleep and strength anchors", "Quarterly biomarkers", "Cardio base", "Overstacking audit"],
  cognitive: ["Deep-work blocks", "Trigger tracking", "Sleep protection", "Stimulant review"],
  sleep: ["Wake time", "Light exposure", "Caffeine cutoff", "Evening downshift"],
  immune: ["Sleep debt", "Training load", "Infection-season plan", "Autoimmune caution"],
  skin_hair: ["AM/PM routine", "Photo tracking", "Irritation log", "Sun/pigment caution"],
  sexual_health: ["Hormone discussion", "Cardio fitness", "Stress and sleep", "Relationship context"],
  gh_optimization: ["Sleep-first plan", "Resistance training", "Glucose control", "Monthly lab discussion"],
  anxiety: ["Daily regulation", "Trigger log", "Caffeine reduction", "Support escalation"],
};

function compactPeptides(items: PdfCompoundRecommendation[]) {
  return items.filter((item) => getPeptideById(item.peptideId));
}

function getGoalCompounds(goalId: string | null) {
  if (!goalId) return compactPeptides(GOAL_COMPOUNDS.fat_loss);
  return compactPeptides(GOAL_COMPOUNDS[goalId] ?? GOAL_COMPOUNDS.fat_loss);
}

function scheduleFor(product: ProtocolPdfProduct) {
  const goalId = product.goalId ?? "fat_loss";
  const executionItems = ADDON_EXECUTION[goalId] ?? ADDON_EXECUTION.fat_loss;

  if (product.kind === "addon") {
    return {
      baseline: ["Record current routine, constraints, and the main adherence blocker.", "Choose the simplest weekly template before adding extra tactics.", ...executionItems.slice(0, 2)],
      weeksOneToFour: ["Run the plan for seven days without adding new variables.", "Score adherence, friction, sleep, energy, and the goal metric weekly.", "Adjust one execution lever at a time."],
      optimization: ["Tighten the routine only after adherence is stable.", "Use the primary protocol PDF when compound decisions or sourcing questions appear."],
      maintenance: ["Keep the minimum routine that preserves progress.", "Review the plan every four weeks and remove unnecessary complexity."],
    };
  }

  return {
    baseline: ["Confirm goal, contraindication context, medication list, and athlete status.", "Capture starting metric, routine capacity, and clinician questions.", "Choose approved, guardrailed, or education-only compound lane."],
    weeksOneToFour: ["Start with one primary compound path or one non-peptide foundation path.", "Use clinician-confirmed dose/route fields for any non-approved compound.", "Track response, side effects, adherence, and sourcing decisions weekly."],
    optimization: ["Escalate only when the goal metric, adherence, and safety feedback are clear.", "Change one variable at a time and document why the change is being made."],
    maintenance: ["Continue the lowest-complexity plan that still supports the goal.", "Reassess every 8-12 weeks, or sooner if red flags appear."],
  };
}

function getGoalScheduleProfile(goalId: string | null) {
  const id = goalId ?? "fat_loss";

  const profiles: Record<
    string,
    {
      coreMetric: string;
      dailyMetric: string;
      weeklyMetric: string;
      setupFocus: string;
      dayActions: string[];
      weekFocus: string[];
      tracking: PdfTrackingMetric[];
    }
  > = {
    fat_loss: {
      coreMetric: "Body weight trend, waist, appetite, protein, GI tolerance",
      dailyMetric: "morning weight, appetite, nausea/constipation, hydration, protein",
      weeklyMetric: "7-day weight average, waist, adherence, side effects, rebound risk",
      setupFocus: "baseline weight/waist, medication list, GLP-1 fit, food structure, vendor/clinical sourcing review",
      dayActions: [
        "Set baseline weight, waist, photos if desired, protein floor, hydration target, and clinician-confirmed medication fields.",
        "Run the first full tracking day without changing food aggressively; note appetite, GI tolerance, and meal completion.",
        "Check hydration, bowel pattern, and protein completion; adjust meal size before changing the compound plan.",
        "Review nausea, reflux, constipation, hunger, and missed meals; prepare clinician questions if tolerance is poor.",
        "Compare hunger and food noise to baseline; keep the same plan unless a red flag appears.",
        "Audit weekend routine risk: alcohol, late meals, low protein, dehydration, and missed movement.",
        "Calculate the first weekly score and decide hold, simplify, or clinician review.",
      ],
      weekFocus: [
        "Baseline and tolerance week; no stacking or extra variables.",
        "Stabilize meal structure and side-effect management before any escalation discussion.",
        "Confirm adherence is consistent enough to interpret the trend.",
        "Run a formal week-4 review: trend, tolerance, dose-field accuracy, and sourcing confidence.",
        "Optimization window: tighten protein, resistance training, hydration, and constipation prevention.",
        "Check for plateau causes before changing the protocol.",
        "Review body-composition protection: strength, steps, protein, and sleep.",
        "Decide whether the current path is effective enough to continue unchanged.",
        "Maintenance planning: missed-dose/process gaps, travel, refill timing, and rebound prevention.",
        "Review adverse effects and benefit-to-burden ratio.",
        "Prepare next 12-week cycle or off-ramp plan.",
        "Final 12-week review: continue, simplify, switch clinical path, or stop/refer.",
      ],
      tracking: [
        { metric: "Morning weight", frequency: "Daily, then review 7-day average", targetUse: "Trend quality, not day-to-day noise", actionTrigger: "No trend after 4+ adherent weeks or rapid loss with poor intake" },
        { metric: "GI tolerance", frequency: "Daily during titration or changes", targetUse: "Escalation readiness and hydration risk", actionTrigger: "Persistent vomiting, severe pain, dehydration, or constipation not improving" },
        { metric: "Protein and hydration", frequency: "Daily", targetUse: "Lean-mass and tolerance support", actionTrigger: "Repeated missed targets before any escalation" },
        { metric: "Waist and photos", frequency: "Weekly", targetUse: "Body-composition context", actionTrigger: "Weight plateau with waist change means hold and continue tracking" },
      ],
    },
    muscle_growth: {
      coreMetric: "Training performance, recovery, sleep, body weight, edema/glucose risk",
      dailyMetric: "sleep, readiness, training performance, appetite, edema/headache symptoms",
      weeklyMetric: "load progression, body weight, recovery score, side effects, glucose/lab discussion need",
      setupFocus: "training split, calories/protein, sleep baseline, GH-axis risk screen, athlete status",
      dayActions: [
        "Set training maxes or working loads, protein/calorie targets, sleep goal, and clinician-confirmed compound fields.",
        "Complete first training or readiness log; do not add volume because the protocol feels new.",
        "Check edema, headache, numbness/tingling, appetite, and glucose-risk symptoms.",
        "Review sleep quality and soreness; adjust training load before changing compound variables.",
        "Track performance and recovery; keep one-variable-at-a-time rule.",
        "Plan next training week from recovery data, not motivation.",
        "Score week 1: performance, recovery, side effects, and adherence.",
      ],
      weekFocus: [
        "Baseline training and recovery week; no aggressive stack changes.",
        "Confirm the training stimulus is sufficient before attributing results to compounds.",
        "Check sleep, appetite, edema, and glucose-risk signals.",
        "Week-4 review: performance trend, body weight, recovery, and clinician/lab discussion.",
        "Optimization: add volume only if recovery score supports it.",
        "Audit calories, protein, and sleep before escalating complexity.",
        "Review joint/tendon feedback and deload timing.",
        "Hold or simplify if side effects rise faster than performance.",
        "Maintenance: keep the minimum effective training and support routine.",
        "Review whether the compound lane is still needed or just adding monitoring burden.",
        "Prepare next block with one measurable strength/body-composition target.",
        "12-week decision: continue, deload, stop/refer, or change training block.",
      ],
      tracking: [
        { metric: "Training log", frequency: "Every session", targetUse: "Confirms progressive overload and fatigue", actionTrigger: "Performance drops for 2 weeks despite adherence" },
        { metric: "Recovery score", frequency: "Daily", targetUse: "Guides volume and deloads", actionTrigger: "Poor sleep/soreness/readiness for 3+ days" },
        { metric: "Edema/headache/glucose symptoms", frequency: "Daily if GH-axis compounds are considered", targetUse: "Safety and monitoring burden", actionTrigger: "Persistent edema, headaches, numbness, or hyperglycemia symptoms" },
        { metric: "Body weight and waist", frequency: "2-3x weekly", targetUse: "Lean-mass context", actionTrigger: "Rapid fat gain or no progress with good training" },
      ],
    },
    recovery: {
      coreMetric: "Pain, function, range of motion, swelling, return-to-training milestones",
      dailyMetric: "pain score, function score, swelling, rehab completion, load response",
      weeklyMetric: "pain trend, function trend, load tolerance, PT/referral need",
      setupFocus: "injury history, red flags, rehab phase, baseline pain/function, PT or sports-medicine plan",
      dayActions: [
        "Record injury baseline, pain/function scores, range of motion, swelling, and current rehab plan.",
        "Run only the lowest-risk rehab actions; note pain during and 24 hours after.",
        "Check swelling, sharp pain, instability, numbness, or function loss.",
        "Repeat rehab dose if response is stable; do not increase load yet.",
        "Review whether symptoms are improving, unchanged, or worse after activity.",
        "Plan next-week load using pain/function data, not impatience.",
        "Score week 1 and decide hold, progress, regress, or refer.",
      ],
      weekFocus: [
        "Baseline and protection week; reduce noise and identify red flags.",
        "Start controlled loading only if pain/function response is stable.",
        "Progress one load variable: range, reps, resistance, or frequency.",
        "Week-4 review: function milestone, pain trend, and referral need.",
        "Optimization: add sport-specific movement if criteria are met.",
        "Check whether compound interest is masking poor rehab progression.",
        "Progress return-to-training exposure cautiously.",
        "Hold if pain rises or function worsens.",
        "Maintenance: transition from rehab to performance base.",
        "Review recurrence risk and training modifications.",
        "Prepare return-to-full-training criteria.",
        "12-week decision: return, continue rehab, image/refer, or change plan.",
      ],
      tracking: [
        { metric: "Pain score", frequency: "Daily and after loading", targetUse: "Guides progression/regression", actionTrigger: "Pain rises >2 points or persists next day" },
        { metric: "Function score", frequency: "Daily", targetUse: "Confirms real recovery", actionTrigger: "Function worsens despite lower load" },
        { metric: "Swelling/redness/heat", frequency: "Daily early phase", targetUse: "Safety screen", actionTrigger: "Increasing swelling, redness, heat, fever, or instability" },
        { metric: "Return-to-training milestone", frequency: "Weekly", targetUse: "Prevents rushing", actionTrigger: "Milestone missed for 2 weeks or symptoms recur" },
      ],
    },
    sleep: {
      coreMetric: "Sleep timing, sleep quality, next-day energy, caffeine/alcohol timing",
      dailyMetric: "bedtime, wake time, caffeine cutoff, sleep quality, next-day grogginess",
      weeklyMetric: "average sleep duration, consistency, awakenings, daytime function",
      setupFocus: "wake time, light exposure, caffeine cutoff, sleep apnea/medication screen",
      dayActions: [
        "Set fixed wake time, caffeine cutoff, light exposure plan, and baseline sleep score.",
        "Run the routine once without adding rescue tactics.",
        "Check morning energy and next-day grogginess.",
        "Tighten evening routine and alcohol/late-meal control.",
        "Review whether anxiety, pain, or reflux is the real sleep blocker.",
        "Protect weekend wake time and light exposure.",
        "Score sleep consistency and decide hold, simplify, or refer.",
      ],
      weekFocus: [
        "Stabilize wake time and caffeine cutoff.",
        "Add evening downshift only after wake time is stable.",
        "Review next-day function and grogginess.",
        "Week-4 review: sleep trend and medical screen need.",
        "Optimization: adjust light, meals, alcohol, and wind-down timing.",
        "Check whether any compound is worsening sleep architecture or daytime function.",
        "Hold the routine if consistency is improving.",
        "Refer if sleep apnea, severe insomnia, or mood symptoms are likely.",
        "Maintenance: keep the minimum effective sleep anchors.",
        "Review travel/weekend disruption plan.",
        "Prepare relapse plan for stressful weeks.",
        "12-week decision: continue routine, refer, or change the sleep target.",
      ],
      tracking: [
        { metric: "Bed/wake time", frequency: "Daily", targetUse: "Circadian consistency", actionTrigger: "Wake time varies >60 minutes repeatedly" },
        { metric: "Sleep quality", frequency: "Daily", targetUse: "Primary subjective outcome", actionTrigger: "No improvement after 2-4 consistent weeks" },
        { metric: "Next-day energy", frequency: "Daily", targetUse: "Detects grogginess or poor recovery", actionTrigger: "Worse daytime function after changes" },
        { metric: "Caffeine/alcohol timing", frequency: "Daily", targetUse: "Removes confounders", actionTrigger: "Late use before judging protocol failure" },
      ],
    },
  };

  return profiles[id] ?? {
    coreMetric: "Goal metric, adherence, symptoms, routine friction, and weekly trend",
    dailyMetric: "goal metric, adherence, side effects, sleep, mood, energy",
    weeklyMetric: "trend, adherence, side effects, friction, next decision",
    setupFocus: "baseline goal metric, contraindication screen, compound lane, vendor quality gates, clinician questions",
    dayActions: [
      "Record baseline metrics, choose the primary lane, and fill clinician-confirmed compound fields.",
      "Run the first tracking day without adding extra variables.",
      "Check side effects, routine friction, and whether the schedule is realistic.",
      "Review adherence and remove one blocker.",
      "Compare early response to baseline without overreacting.",
      "Prepare the weekly review and next-week logistics.",
      "Score week 1 and decide hold, simplify, or clinician review.",
    ],
    weekFocus: [
      "Baseline and tolerance week.",
      "Stabilize the routine before changing the protocol.",
      "Confirm adherence is high enough to interpret results.",
      "Week-4 review: trend, side effects, and next adjustment.",
      "Optimization window: tighten the biggest bottleneck.",
      "Hold if progress is clear and side effects are acceptable.",
      "Simplify if adherence is below target.",
      "Review whether compound complexity is justified.",
      "Maintenance planning and refill/logistics review.",
      "Benefit-to-burden review.",
      "Prepare next cycle or off-ramp.",
      "12-week decision: continue, simplify, stop/refer, or change goal.",
    ],
    tracking: [
      { metric: "Primary goal metric", frequency: "Daily or weekly based on goal", targetUse: "Determines whether the protocol is working", actionTrigger: "No trend after 4 adherent weeks" },
      { metric: "Adherence", frequency: "Daily", targetUse: "Separates plan failure from execution failure", actionTrigger: "Below 80% before escalation" },
      { metric: "Side effects", frequency: "Daily during changes", targetUse: "Safety and tolerance", actionTrigger: "Persistent or worsening symptoms" },
      { metric: "Routine friction", frequency: "Weekly", targetUse: "Simplification decisions", actionTrigger: "Same blocker appears for 2 weeks" },
    ],
  };
}

function buildDetailedSchedule(product: ProtocolPdfProduct) {
  const profile = getGoalScheduleProfile(product.goalId);
  const isAddon = product.kind === "addon";
  const doseNote = isAddon
    ? "No compound dose field required unless paired with the primary protocol."
    : "Dose/route/timing stay blank until confirmed by a qualified clinician.";

  const dailyRhythm: PdfScheduleRow[] = [
    {
      period: "Morning",
      action: "Record the primary metric before the day gets noisy.",
      track: profile.dailyMetric,
      trigger: "If symptoms are severe or unusual, pause changes and review red flags.",
      notes: "Use the same measurement conditions whenever possible.",
    },
    {
      period: "Protocol window",
      action: isAddon ? "Complete the planned habit, training, recovery, or lifestyle action." : "Follow clinician-confirmed timing fields if a compound is being used.",
      track: "completion, timing, friction, and any immediate symptoms",
      trigger: "Missed window or unexpected reaction means log it; do not compensate by doubling up.",
      notes: doseNote,
    },
    {
      period: "Evening",
      action: "Complete the daily log and set up tomorrow's highest-friction item.",
      track: "adherence, side effects, sleep prep, and next-day risk",
      trigger: "If adherence is below target, simplify the routine before changing compound variables.",
      notes: "One sentence is enough: what worked, what blocked progress, what changes tomorrow.",
    },
  ];

  const firstSevenDays = profile.dayActions.map((action, index) => ({
    period: `Day ${index + 1}`,
    action,
    track: index === 0 ? profile.setupFocus : profile.dailyMetric,
    trigger:
      index === 6
        ? "Score the week: green = hold, yellow = simplify, red = pause/review."
        : "Do not add a new variable unless a safety issue requires a change.",
    notes:
      index === 0
        ? doseNote
        : "Keep the plan boring enough that the result is interpretable.",
  }));

  const weeklyPlan = profile.weekFocus.map((focus, index) => ({
    period: `Week ${index + 1}`,
    action: focus,
    track: index < 4 ? profile.weeklyMetric : `${profile.weeklyMetric}; compare against baseline`,
    trigger:
      index === 3
        ? "Formal week-4 keep/change/simplify decision."
        : index === 7
          ? "Formal week-8 benefit-to-burden review."
          : index === 11
            ? "Formal week-12 continuation/off-ramp decision."
            : "Hold unless the weekly score clearly says simplify or review.",
    notes: index % 4 === 3 ? "Write the decision and the reason before changing anything." : "Change one variable at a time.",
  }));

  return {
    dailyRhythm,
    firstSevenDays,
    weeklyPlan,
    trackingMetrics: profile.tracking,
    reviewRules: [
      "Green: adherence is 80% or better, side effects are acceptable, and the main trend is stable or improving. Keep the plan unchanged.",
      "Yellow: adherence is inconsistent, side effects are mild but annoying, or the trend is unclear. Simplify one blocker and hold compound variables steady.",
      "Red: symptoms are severe, contraindication concerns appear, athlete anti-doping risk is unresolved, or the plan requires guessing. Pause and involve a clinician.",
    ],
    adjustmentRules: [
      "Change only one variable per review cycle: timing, routine support, training load, nutrition anchor, or clinician-confirmed compound detail.",
      "Do not escalate because of impatience. Escalation requires interpretable tracking, acceptable tolerance, and no red flags.",
      "If the same problem appears two weeks in a row, fix the system around the protocol before adding another compound.",
      "If the plan works, hold it. Optimization means preserving results with the least complexity.",
    ],
  };
}

export function getProtocolPdfContent(product: ProtocolPdfProduct): ProtocolPdfContent {
  const goal = product.goalId ? getGoalById(product.goalId) : null;
  const goalName = goal?.displayName ?? product.name;
  const compounds = getGoalCompounds(product.goalId);
  const schedule = scheduleFor(product);
  const detailedSchedule = buildDetailedSchedule(product);

  return {
    productSlug: product.slug,
    audience: product.kind === "primary" ? "consumer" : "consumer",
    title: product.name,
    positioning:
      product.kind === "primary"
        ? `A goal-specific protocol guide for ${goalName.toLowerCase()} that ranks compounds by usefulness, safety burden, sourcing quality, and monitoring needs.`
        : `An execution guide that turns the ${goalName.toLowerCase()} protocol into weekly actions, tracking, and decision checkpoints.`,
    tableOfContents: [
      "Goal snapshot",
      "How to use this PDF",
      "Evidence-ranked compound map",
      "Recommended compound pages",
      "Affiliate/vendor research links",
      "Daily operating schedule",
      "First 7 days",
      "Week-by-week protocol calendar",
      "Monitoring and progress tracking",
      "Review and adjustment rules",
      "Red flags and clinician referral triggers",
      "Execution checklist",
      "FAQ and references",
    ],
    goalSnapshot:
      goal?.description ??
      "A focused protocol guide that helps the buyer choose the right path, remove bad-fit options, and run a simple review loop.",
    timeline:
      product.kind === "primary"
        ? "Expect early tolerance and adherence signals in weeks 1-4, stronger trend review by weeks 8-12, and maintenance decisions after the plan is stable."
        : "Expect the first seven days to establish baseline consistency, then use weekly reviews to tighten the routine.",
    primaryOutcome:
      product.kind === "primary"
        ? "A compound-aware protocol with safety guardrails, affiliate sourcing links, and clear weekly decisions."
        : "A repeatable execution system that supports the primary protocol without adding unnecessary complexity.",
    compoundRecommendations: compounds,
    schedule,
    detailedSchedule,
    monitoring: [
      "Goal metric and weekly trend",
      "Adherence percentage",
      "Side effects or symptom changes",
      "Sleep, appetite, mood, energy, and recovery",
      "Medication, pregnancy/fertility, cardiovascular, psychiatric, cancer-history, and athlete anti-doping flags when relevant",
    ],
    redFlags: [
      "Severe, persistent, or worsening symptoms",
      "Pressure to stack more compounds before the current plan is interpretable",
      "Any contraindication, pregnancy/fertility, psychiatric, cardiovascular, cancer-history, or athlete anti-doping concern",
      "A vendor or product page that implies human benefit while disclaiming human use",
    ],
    clinicianPrompts: [
      "Which compound lane is appropriate for my goal and medical history?",
      "What dose, route, timing, and monitoring are clinically appropriate if a compound is used?",
      "What symptoms should trigger stopping, delaying escalation, or changing the plan?",
      "Are any of my medications, conditions, sport rules, or lab results a reason to avoid this path?",
    ],
    executionChecklist:
      product.kind === "addon"
        ? schedule.baseline.concat(schedule.weeksOneToFour).slice(0, 6)
        : ["Pick one primary lane.", "Review compound page warnings.", "Open vendor links only after checking quality gates.", "Fill clinician-confirmed dose fields.", "Set weekly review day.", "Do not change more than one variable at a time."],
    references: [
      "FDA safety communications and prescription labels where applicable",
      "WADA/USADA anti-doping materials where applicable",
      "Published human studies, preclinical studies, and vendor quality documentation",
      "Internal PeptidePros peptide, vendor, and affiliate-link database",
    ],
    lastReviewed: LAST_REVIEWED,
  };
}

export function getScheduleLabel(type: PdfScheduleType) {
  if (type === "approved_label") return "Approved/label-aligned schedule";
  if (type === "execution") return "Execution schedule";
  return "Guardrailed research schedule";
}

export function getScheduleCopy(type: PdfScheduleType, peptide?: PeptideData) {
  if (type === "approved_label") {
    return "Use current prescribing information and clinician direction for dose, titration, missed-dose rules, contraindications, and monitoring.";
  }

  if (type === "execution") {
    return "Use routine timing, adherence targets, and weekly review checkpoints. No compound dose is required for this schedule.";
  }

  return `Track cadence, cycle window, response, and safety signals. Leave dose, route, and titration blank until confirmed by a qualified clinician${peptide?.regulatoryStatus === "ruo_only" ? " and do not treat RUO material as a human-use product" : ""}.`;
}
