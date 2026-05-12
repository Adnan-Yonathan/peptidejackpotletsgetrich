import { ImageResponse } from "next/og";
import { getDemographicPageBySlug } from "@/data/demographic-pages";
import { SITE_NAME } from "@/lib/constants";

export const alt = "PeptidePros demographic guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function DemographicOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getDemographicPageBySlug(slug);
  const title = page?.h1 ?? SITE_NAME;
  const summary = page?.heroSummary ?? page?.tldr ?? "";
  const eyebrow = page?.heroEyebrow ?? "Demographic guide";
  const chips = page?.audienceChips?.slice(0, 3) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 84px",
          color: "#13201d",
          backgroundColor: "#fbfaf7",
          backgroundImage:
            "radial-gradient(circle at 8% 92%, rgba(15,106,82,0.22), transparent 42%), radial-gradient(circle at 95% 8%, rgba(125,211,167,0.32), transparent 38%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 9999,
                border: "1.5px solid #0d3327",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0d3327",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
              }}
            >
              PP
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 22,
                color: "#0d3327",
              }}
            >
              {SITE_NAME}
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#0f6a52",
              maxWidth: 560,
              textAlign: "right",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: title.length > 36 ? 78 : 96,
              lineHeight: 0.98,
              letterSpacing: -2,
              color: "#0d3327",
              display: "flex",
            }}
          >
            {title}
          </div>
          {summary && (
            <div
              style={{
                marginTop: 22,
                maxWidth: 980,
                fontSize: 22,
                lineHeight: 1.5,
                color: "rgba(19,32,29,0.7)",
                display: "flex",
              }}
            >
              {summary.length > 220 ? `${summary.slice(0, 217)}…` : summary}
            </div>
          )}
          {chips.length > 0 && (
            <div style={{ marginTop: 26, display: "flex", gap: 12 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(13,51,39,0.35)",
                    color: "#0d3327",
                    fontSize: 15,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    display: "flex",
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 22,
            borderTop: "1px solid rgba(13,51,39,0.18)",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(13,51,39,0.55)",
          }}
        >
          <span>peptidepros.io · blog</span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: 0,
              color: "rgba(13,51,39,0.65)",
            }}
          >
            Independent peptide research
          </span>
        </div>
      </div>
    ),
    size,
  );
}
