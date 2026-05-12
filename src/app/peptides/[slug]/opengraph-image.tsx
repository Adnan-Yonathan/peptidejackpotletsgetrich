import { ImageResponse } from "next/og";
import { getPeptideBySlug } from "@/data/peptides";
import { SITE_NAME } from "@/lib/constants";

export const alt = "PeptidePros peptide profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PeptideOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  const name = peptide?.name ?? "Peptide";
  const synonyms = peptide?.synonyms?.slice(0, 2).join(" · ") ?? "";
  const description = peptide?.shortDescription ?? "";
  const tier = peptide ? `Tier ${peptide.evidenceTier}` : "";
  const risk = peptide ? `${peptide.riskLevel.replace("-", "–")} risk` : "";
  const route = peptide?.administrationRoutes?.[0] ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 84px",
          color: "#f1e9d4",
          backgroundColor: "#0d3327",
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(125,211,167,0.32), transparent 40%), radial-gradient(circle at 92% 88%, rgba(125,211,167,0.18), transparent 46%)",
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
                color: "#f1e9d4",
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
          <div
            style={{
              fontSize: 14,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#7dd3a7",
            }}
          >
            Compound profile
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 110,
              lineHeight: 0.98,
              letterSpacing: -2.5,
              display: "flex",
            }}
          >
            {name}
          </div>
          {synonyms && (
            <div
              style={{
                marginTop: 14,
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(241,233,212,0.6)",
                display: "flex",
              }}
            >
              Also known as {synonyms}
            </div>
          )}
          {description && (
            <div
              style={{
                marginTop: 28,
                maxWidth: 980,
                fontSize: 22,
                lineHeight: 1.5,
                color: "rgba(241,233,212,0.78)",
                display: "flex",
              }}
            >
              {description.length > 220 ? `${description.slice(0, 217)}…` : description}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            paddingTop: 22,
            borderTop: "1px solid rgba(241,233,212,0.25)",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {[tier, risk, route].filter(Boolean).map((label) => (
              <div
                key={label}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(241,233,212,0.4)",
                  color: "#f1e9d4",
                  fontSize: 16,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(241,233,212,0.7)",
              display: "flex",
            }}
          >
            peptidepros.io
          </div>
        </div>
      </div>
    ),
    size,
  );
}
