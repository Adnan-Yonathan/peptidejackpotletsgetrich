import { ImageResponse } from "next/og";
import { getCategoryHubBySlug } from "@/data/category-hubs";
import { SITE_NAME } from "@/lib/constants";

export const alt = "PeptidePros goal hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function GoalHubOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = getCategoryHubBySlug(slug);
  const title = hub?.title ?? "Goal hub";
  const description = hub?.description ?? "";

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
          color: "#f1e9d4",
          backgroundColor: "#0d3327",
          backgroundImage:
            "radial-gradient(circle at 12% 14%, rgba(125,211,167,0.3), transparent 42%), radial-gradient(circle at 92% 90%, rgba(125,211,167,0.16), transparent 48%)",
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
            Goal hub
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#7dd3a7",
              marginBottom: 18,
              display: "flex",
            }}
          >
            Research by goal
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: title.length > 28 ? 84 : 104,
              lineHeight: 0.98,
              letterSpacing: -2.5,
              display: "flex",
            }}
          >
            <span style={{ fontStyle: "italic" }}>{title.split(" ")[0]}&nbsp;</span>
            <span>{title.split(" ").slice(1).join(" ")}</span>
          </div>
          {description && (
            <div
              style={{
                marginTop: 26,
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
            paddingTop: 22,
            borderTop: "1px solid rgba(241,233,212,0.25)",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(241,233,212,0.6)",
          }}
        >
          <span>peptidepros.io · goals</span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: 0,
              color: "rgba(241,233,212,0.75)",
            }}
          >
            Compounds matched to outcomes
          </span>
        </div>
      </div>
    ),
    size,
  );
}
