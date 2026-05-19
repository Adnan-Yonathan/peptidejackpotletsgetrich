import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function loadLocalEnv() {
  const envPath = resolve(".env.local");
  if (!existsSync(envPath)) return;

  const env = readFileSync(envPath, "utf8");
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [name, ...valueParts] = trimmed.split("=");
    if (!process.env[name]) {
      process.env[name] = valueParts.join("=").trim();
    }
  }
}

loadLocalEnv();

const key = (process.env.BING_WEBMASTER_KEY || process.env.INDEXNOW_KEY)?.trim();
const outputPath = key ? resolve(`public/${key}.txt`) : resolve("public/indexnow-key.txt");

if (!key) {
  if (existsSync(outputPath)) {
    rmSync(outputPath);
  }
  console.warn("BING_WEBMASTER_KEY or INDEXNOW_KEY is not set; skipping public/indexnow-key.txt generation.");
  process.exit(0);
}

if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  throw new Error("INDEXNOW_KEY must be 8-128 characters using only letters, numbers, and dashes.");
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${key}\n`, { encoding: "utf8" });

console.log(`Wrote UTF-8 IndexNow key file to public/${key}.txt.`);
