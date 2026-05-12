# PeptidePros Design System

## Overview

**PeptidePros** is a research-grade decision platform for peptide compounds. It helps users identify which peptides best match their health and fitness goals — providing personalized plans, evidence-graded compound profiles, vendor comparisons, stack building with compatibility checking, and educational guides. It is explicitly **not a retailer**.

**Positioning**: "The trusted decision engine for peptide research. Compare, plan, and track with confidence."

### Products / Surfaces
1. **Marketing Website** — homepage, about, pricing, privacy. Next.js App Router, `/src/app/(marketing)/`.
2. **Web App** — quiz, peptide directory, stack builder, vendor comparison, guides, dashboard. Core user tool.
3. **Admin Panel** — internal CMS for peptides, vendors, rules, goals, analytics. `/src/app/admin/`.

### Source
- **Codebase**: `github.com/Adnan-Yonathan/peptidejackpotletsgetrich` (Next.js 15, TypeScript, Tailwind v4, shadcn/ui base-ui, Supabase)
- No Figma link provided.

---

## CONTENT FUNDAMENTALS

**Tone**: Clinical-adjacent, trustworthy, education-first. The brand positions itself as an *advisor*, not a seller. Think NerdWallet for peptides — transparent, tool-forward, not hyped.

**Voice**: Direct and declarative. Short punchy sentences. Evidence-grounded statements. Willingness to say "we don't know" via evidence tiers.

**Casing**: Sentence case throughout (body, CTAs, nav). ALL CAPS used sparingly for mono labels ("STEP 01", "RESEARCH PEPTIDE GUIDE"). Title case only for product section headers (e.g. "Evidence-Graded Directory").

**POV**: "You" (user-centric). First person plural ("We don't sell peptides. We help you…").

**Copy patterns**:
- Short declarative headlines: *"The smarter way to research peptides."*, *"Education first. Not a store."*
- Two-clause rhythm: "Compare, plan, and track with confidence."
- Quantified claims: "6 quick questions", "Answer 6 questions. Get matched…"
- Safety language always present — disclaimers surfaced, not buried.

**Emoji**: Never used. Not part of the brand.

**No hype**: Evidence tiers (A–D) are foregrounded. Regulatory flags are disclosed upfront, not in footnotes. Stack contradictions are *blocked*, not suggested.

**Examples**:
- `"Your personalized plan is 2 minutes away."`
- `"From question to plan in three steps."`
- `"Evidence-Graded Directory — Every compound rated Tier A through D based on clinical evidence."`
- `"Not for diagnosing, treating, curing, or preventing disease."`

---

## VISUAL FOUNDATIONS

### Colors
**Palette**: Forest green primary on a warm white/cream background with near-black text.
- **Primary**: `oklch(0.52 0.11 164)` → deep teal-green (~`#0f6a52`)
- **Primary Light**: `oklch(0.62 0.11 164)` → medium green (ring, dark mode primary)
- **Brand Dark**: `#103b2c` → very dark forest green (logo text)
- **Active Nav BG**: `#e7f4ee` → pale mint
- **Background**: `oklch(1 0 0)` white; marketing pages use `#fbfaf7` (warm cream/off-white)
- **Card**: `oklch(1 0 0)` white
- **Muted**: `oklch(0.97 0 0)` very light cool gray
- **Muted Foreground**: `oklch(0.556 0 0)` medium gray
- **Border**: `oklch(0.922 0 0)` light gray
- **Foreground**: `oklch(0.145 0 0)` near-black
- **Destructive**: `oklch(0.577 0.245 27.325)` red
- **Dark mode**: inverted background/foreground; primary lightens to `oklch(0.62 0.12 164)`

### Typography
- **Font**: Manrope (Google Fonts) — used for *both* body and headings. No serif. No decorative display face.
- **Mono**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` — used for step labels, mono callouts
- **Scale**: h1 = 4xl–6xl / font-bold / tracking-tight / leading-[1.1]. h2 = 3xl–4xl / font-bold. h3 = lg / font-semibold. Body = sm–base / leading-relaxed.
- **Note**: Manrope loaded via Google Fonts (Next.js `next/font/google`). No font files in repo.

### Spacing & Layout
- Container: `max-w-6xl` or `max-w-7xl`, `mx-auto`, `px-4`
- Section padding: `py-20 md:py-28`
- Card gap: `gap-6` or `gap-8`
- Grid: mostly 2–4 column on md+
- Fixed elements: sticky header at `z-50`, `h-16`

### Backgrounds & Textures
- Hero: subtle radial gradient to `primary/5` + grid pattern (34px × 34px lines, masked with gradient fade)
- Alternating muted sections: `bg-muted/20` or `bg-muted/10` every other section for rhythm
- No full-bleed photography backgrounds. No heavy gradients. No patterns outside of the hero grid.
- Hero panel uses a `dna-hero-panel` gradient + backdrop-blur card with a glow orb (`dna-hero-glow`)

### Cards
- `rounded-xl` (≈12px)
- `ring-1 ring-foreground/10` border via box ring (not border property)
- `bg-card` (white) background
- `hover:shadow-md` on hover — subtle lift
- Card footer: `bg-muted/50` with top border
- Icon containers within cards: `rounded-xl` or `rounded-lg`, `bg-primary/10`, `w-10 h-10`

### Buttons
- Radius: `rounded-lg` (not rounded-full)
- Default height: `h-8`. Large CTAs: `h-12`
- Primary: `bg-primary text-primary-foreground`. 
- Ghost: `hover:bg-muted`
- Outline: `border-border bg-background hover:bg-muted`
- Press state: `active:translate-y-px` (micro-shift down)
- Transitions: `transition-all` on all buttons

### Badges
- `rounded-4xl` (fully pill-shaped)
- `h-5`, `text-xs`, `font-medium`
- Variants: default (primary fill), secondary (muted bg), outline (border only), destructive

### Borders
- All borders use `oklch(0.922 0 0)` (light gray)
- Cards use ring-1 ring-foreground/10 (slightly dark transparent ring)
- Dark mode borders: `oklch(1 0 0 / 10%)` white at 10% opacity

### Shadows
- Hero card: `shadow-[0_28px_90px_-40px_rgba(15,23,42,0.45)]`
- Cards on hover: `shadow-md`
- No heavy drop shadows in flat UI areas

### Corner Radii Scale
- `--radius`: 0.625rem (10px base)
- sm: ×0.6 = 6px, md: ×0.8 = 8px, lg: 10px, xl: 14px, 2xl: 18px, 3xl: 22px, 4xl: 26px

### Animation
- Float (hero image): `8s ease-in-out infinite`, scale 1.02→1.05 + translateY 0→-10px
- Glow drift: `7s ease-in-out infinite`, opacity 0.45→0.7, slight translate + scale
- UI transitions: `transition-colors`, `transition-shadow`, `transition-all` — all fast (Tailwind default 150ms)
- No bouncy/spring animations. Smooth and subtle only.

### Iconography (see ICONOGRAPHY section)
- Lucide React — stroke-style, consistent weight
- No icon fonts. No emoji. No unicode chars as icons.

### Imagery
- One hero photo (AI-generated, peptide/science themed) used on homepage
- Goal hub category images (URLs from data layer)
- Photo color vibe: cool-to-neutral, scientific aesthetic
- No illustrations. No hand-drawn elements.

### Hover / Press States
- Links: `hover:text-foreground transition-colors`
- Buttons: variant-specific bg-opacity change; ghost → `hover:bg-muted`
- Nav pills: `hover:text-slate-900`; active → `bg-[#e7f4ee] text-[#0f6a52]`
- Cards: `hover:shadow-md`
- Press: `active:translate-y-px` on buttons

### Transparency & Blur
- Header: `bg-[#fbfaf7]/95 backdrop-blur` — frosted glass on scroll
- Hero panel: `bg-background/75 backdrop-blur-sm`
- Section overlays: `/10`, `/20`, `/30` opacity variants of muted/primary

### Use of Color in UI
- Green (primary) reserved for: CTAs, active states, icon containers, check marks, key highlights in text
- Never used as a background at full saturation — always at `/5`–`/15` opacity
- Warning flags: yellow (`yellow-500/10` bg, `yellow-600` text)
- Error flags: red (`red-500/5`–`/20` bg, `red-500`–`red-600` text)

---

## ICONOGRAPHY

**Icon library**: Lucide React — all icons are stroke-based, thin-to-medium weight, consistent 24px viewBox.

**Usage in codebase**:
- `FlaskConical` — primary brand/logo icon
- `ArrowRight` — CTA arrows, navigation
- `Shield` — safety/regulatory flags
- `BarChart3` — analytics, vendor comparison
- `BookOpen` — guides, education
- `Layers` — stack builder
- `AlertTriangle` — warning/danger flags
- `CheckCircle2` — feature lists, trust indicators
- `ChevronRight` — inline navigation
- `Menu` / `X` — mobile nav toggle
- `Check` — pricing feature lists

**CDN**: `https://unpkg.com/lucide@latest` or via `lucide-react` npm. For HTML artifacts, use the CDN:
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```
Then call `lucide.createIcons()` after DOM render.

**No SVG illustrations**. No emoji. No PNG icons. No unicode symbols used as icons.

---

## FILE INDEX

```
README.md                    — This file: design system overview
SKILL.md                     — Agent skill definition
colors_and_type.css          — CSS custom properties for colors, type, spacing
assets/                      — Brand assets
  logo.svg                   — PeptidePros wordmark + flask icon (SVG)
preview/                     — Design System tab cards
  colors-primary.html
  colors-neutral.html
  colors-semantic.html
  type-scale.html
  type-specimens.html
  spacing-tokens.html
  radii-shadows.html
  components-buttons.html
  components-badges.html
  components-cards.html
  components-inputs.html
  components-nav.html
  brand-logo.html
ui_kits/
  web/
    README.md
    index.html               — Marketing homepage prototype
    Header.jsx
    Footer.jsx
    PeptideCard.jsx
    QuizFlow.jsx
    StackBuilder.jsx
```
