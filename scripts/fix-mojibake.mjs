import fs from "node:fs";
import path from "node:path";

const targetFiles = ["src/data/peptides.ts"];

const replacements = [
  ["Âµ", "µ"], // micro sign (most common, used in dosing like µg/kg)
  ["Î²", "β"], // beta
  ["Î±", "α"], // alpha
  ["Î³", "γ"], // gamma
  ["Î´", "δ"], // delta
  ["Îº", "κ"], // kappa (e.g., NF-κB)
  ["Î¼", "μ"], // mu (Greek)
  ["â€”", "—"], // em dash
  ["â€“", "–"], // en dash
  ["â€™", "’"], // right single quote
  ["â€˜", "‘"], // left single quote
  ["â€œ", "“"], // left double quote
  ["â€¦", "…"], // ellipsis
  ["Â°", "°"], // degree sign
  ["Â±", "±"], // plus-minus
];

const SUSPICIOUS = /[À-ÿ€]/;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const file of targetFiles) {
  const abs = path.resolve(file);
  let text = fs.readFileSync(abs, "utf8");
  const before = text.length;
  const counts = {};

  for (const [from, to] of replacements) {
    const re = new RegExp(escapeRegExp(from), "g");
    const n = (text.match(re) || []).length;
    if (n > 0) {
      text = text.replace(re, to);
      counts[`${from} → ${to}`] = n;
    }
  }

  fs.writeFileSync(abs, text, "utf8");
  console.log(`\n${file}`);
  console.log("  bytes:", before, "→", text.length);
  console.log("  replacements:", counts);

  // Re-scan
  const remaining = text.match(new RegExp(SUSPICIOUS, "g")) || [];
  console.log(`  remaining suspicious chars: ${remaining.length}`);
  if (remaining.length > 0) {
    const ctxs = new Set();
    text.split(/\r?\n/).forEach((line) => {
      const m = line.match(/.{0,15}[À-ÿ€][^\s]{0,4}.{0,15}/g);
      if (m) m.forEach((c) => ctxs.add(c));
    });
    [...ctxs].slice(0, 15).forEach((c) => console.log("    " + JSON.stringify(c)));
  }
}
