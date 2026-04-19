# Peptide Bottle Prompts

This prompt pack is for generating consistent `PeptidePros` bottle art for all 46 published compounds.

Files:
- CSV batch manifest: [peptide-bottle-prompts.csv](/C:/Users/alemi/peptidejackpotletsgetrich/docs/peptide-bottle-prompts.csv)

## Short Prompt Template

```text
Create a premium photoreal ecommerce product mockup for a fictional peptide brand called PeptidePros.

Show exactly one front-facing amber glass peptide vial or bottle with a dark cap on a soft light studio background. Minimalist, clinical, polished, high-end, realistic reflections, soft shadow, centered square composition.

Label requirements:
- top brand text: PeptidePros
- main text: {{COMPOUND_NAME}}
- secondary text: {{STATUS_LABEL}}
- clean white medical-style label
- one subtle accent stripe in {{CATEGORY_COLOR}}

Constraints:
- spell PeptidePros exactly
- spell {{COMPOUND_NAME}} exactly
- no extra text beyond brand, compound name, and {{STATUS_LABEL}}
- no dosage numbers
- no marketing claims
- no watermark
- no hands, people, pills, syringes, molecules, lab gear, or product box
```

## Category Color Map

| Category | Color |
| --- | --- |
| `tissue_repair` | `deep teal` |
| `gh_axis` | `royal blue` |
| `melanocortin` | `burnt orange` |
| `neuroprotection` | `violet` |
| `sleep` | `indigo` |
| `reproductive` | `rose magenta` |
| `metabolic` | `emerald green` |
| `longevity` | `antique gold` |
| `immune` | `clinical red` |
| `skin_cosmetic` | `orchid` |
| `antimicrobial` | `amber gold` |
| `cognitive` | `violet purple` |
| `mitochondrial` | `sunset orange` |
| `growth_factor` | `signal blue` |
| `muscle_repair` | `forest green` |

## Status Label Map

| Regulatory Status | Label |
| --- | --- |
| `rx_approved` | `Rx` |
| `investigational` | `Investigational` |
| `not_approved` | `Research` |
| `ruo_only` | `RUO` |

## Notes

- The CSV contains one full prompt per published compound.
- For strict batch generation, keep the product framing identical and vary only the label text and accent stripe color.
- If your generator struggles with long names like `Vasoactive Intestinal Peptide`, use a two-line label layout rather than abbreviating.
