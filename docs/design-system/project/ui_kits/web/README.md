# PeptidePros Web UI Kit

## Overview
High-fidelity interactive prototype of the PeptidePros web app. Built from the Next.js codebase at `github.com/Adnan-Yonathan/peptidejackpotletsgetrich`.

## Screens
| Screen | Route/Nav key | Notes |
|---|---|---|
| Home / Marketing | `home` | Hero, how-it-works, trust section, CTA |
| Peptide Directory | `peptides` | Filter by goal, search, compare tray, peptide cards |
| Quiz Flow | `quiz` | 5-step planner (identity → goals → health → constraints → style) |
| Quiz Results | `quiz-result` | Ranked compounds with match scores |
| Stack Builder | `stack-builder` | Add/remove compounds, compatibility rules, summary panel |

## Components
| File | What it contains |
|---|---|
| `Header.jsx` | Sticky nav with logo, pills, auth buttons |
| `Footer.jsx` | 4-column footer with links and disclaimer |
| `PeptideCard.jsx` | Full peptide directory card: bottle art, best-for/not-ideal, stats, compare |
| `QuizFlow.jsx` | Multi-step quiz with progress bar and option buttons |
| `index.html` | Root app — imports all components, manages page state via localStorage |

## Design source
- Primary color: `oklch(0.52 0.11 164)` (deep teal-green)
- Background: `#fbfaf7` (warm cream) for marketing; `#f6f7f5` for app pages
- Font: Manrope (Google Fonts)
- Icons: Lucide (inline SVG)
- Cards: `rounded-[22px]`, `shadow-[0_10px_30px_-20px_...]`, `border-slate-200`
- Peptide page CTA: `bg-emerald-900` = `#103b2c`

## Usage
Open `index.html` directly in a browser. Navigation state persists via `localStorage` key `pp_page`.
