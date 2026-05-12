import { ImageResponse } from "next/og";
import { getPeptideBySlug } from "@/data/peptides";
import { SITE_NAME } from "@/lib/constants";

export const alt = "PeptidePros head-to-head comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function parsePair(pair: string): [string, string] | null {
  const i = pair.indexOf("-vs-");
  if (i < 0) return null;
  return [pair.slice(0, i), pair.slice(i + "-vs-".length)];
}

export default async function ComparePairOgImage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const slugs = parsePair(pair);
  const a = slugs ? getPeptideBySlug(slugs[0]) : null;
  const b = slugs ? getPeptideBySlug(slugs[1]) : null;
  const aName = a?.name ?? "Peptide A";
  const bName = b?.name ?? "Peptide B";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "62px 72px",
          color: "#f1e9d4",
          backgroundColor: "#0d3327",
          backgroundImage:
            "radial-gradient(circle at 22% 30%, rgba(125,211,167,0.22), transparent 38%), radial-gradient(circle at 80% 78%, rgba(125,211,167,0.18), transparent 42%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 9999,
                border: "1.5px solid #f1e9d4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
              }}
            >
              PP
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 22 }}>
              {SITE_NAME}
            </div>
          </div>
          <div style={{ fontSize: 14, letterSpacing: 5, textTransform: "uppercase", color: "#7dd3a7" }}>
            Head-to-head comparison
          </div>
        </div>

        <div
          style={{
            marginTop: 60,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: aName.length > 14 ? 76 : 96,
              lineHeight: 0.95,
              letterSpacing: -2,
              color: "#f1e9d4",
            }}
          >
            {aName}
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 120,
              color: "#7dd3a7",
              lineHeight: 1,
              display: "flex",
            }}
          >
            vs
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              textAlign: "right",
              fontFamily: "Georgia, serif",
              fontSize: bName.length > 14 ? 76 : 96,
              lineHeight: 0.95,
              letterSpacing: -2,
              color: "#f1e9d4",
            }}
          >
            {bName}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 22,
            borderTop: "1px solid rgba(241,233,212,0.25)",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(241,233,212,0.6)",
          }}
        >
          <span>peptidepros.io · compare</span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: 0,
              color: "rgba(241,233,212,0.75)",
            }}
          >
            Evidence, risk, dosing &amp; cost — side by side
          </span>
        </div>
      </div>
    ),
    size,
  );
}
