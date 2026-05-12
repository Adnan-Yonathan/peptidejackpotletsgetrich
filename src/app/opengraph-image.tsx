import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const alt =
  "PeptidePros — Independent peptide research and vendor comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#f1e9d4",
          backgroundColor: "#0d3327",
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(125,211,167,0.28), transparent 42%), radial-gradient(circle at 88% 92%, rgba(125,211,167,0.18), transparent 48%), linear-gradient(180deg, rgba(241,233,212,0.04), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              border: "1.5px solid #f1e9d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f1e9d4",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 22,
            }}
          >
            PP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 26 }}>
              {SITE_NAME}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#7dd3a7",
              }}
            >
              Pharmacopoeia of Protocols
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#7dd3a7",
            }}
          >
            Independent peptide research
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: "Georgia, serif",
              fontSize: 86,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#f1e9d4",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontStyle: "italic" }}>NerdWallet&nbsp;</span>
            <span>for peptides.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 880,
              fontSize: 26,
              lineHeight: 1.45,
              color: "rgba(241,233,212,0.82)",
            }}
          >
            Evidence-graded compound profiles, regulatory flags, and vendor purity testing. We
            don&apos;t sell peptides — we help researchers compare them.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 22,
            borderTop: "1px solid rgba(241,233,212,0.25)",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(241,233,212,0.6)",
          }}
        >
          <span>peptidepros.io</span>
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>
            Research compendium &middot; 2026
          </span>
        </div>
      </div>
    ),
    size,
  );
}
