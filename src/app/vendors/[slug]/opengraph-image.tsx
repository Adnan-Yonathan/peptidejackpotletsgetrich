import { ImageResponse } from "next/og";
import { getVendorBySlug } from "@/data/vendors";
import { SITE_NAME } from "@/lib/constants";

export const alt = "PeptidePros vendor profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function VendorOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  const name = vendor?.name ?? "Vendor";
  const description = vendor?.description ?? "";
  const rating = vendor?.trustpilotRating;
  const reviews = vendor?.trustpilotReviewCount;

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
            "radial-gradient(circle at 92% 12%, rgba(125,211,167,0.34), transparent 38%), radial-gradient(circle at 4% 96%, rgba(15,106,82,0.16), transparent 42%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#0d3327" }}>
              {SITE_NAME}
            </div>
          </div>
          <div style={{ fontSize: 14, letterSpacing: 5, textTransform: "uppercase", color: "#0f6a52" }}>
            Vendor profile
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 110,
              lineHeight: 0.98,
              letterSpacing: -2.5,
              color: "#0d3327",
              display: "flex",
            }}
          >
            {name}
          </div>
          {description && (
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
              {description.length > 220 ? `${description.slice(0, 217)}…` : description}
            </div>
          )}
          {rating && (
            <div style={{ marginTop: 26, display: "flex", gap: 10 }}>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "#0d3327",
                  color: "#f1e9d4",
                  fontSize: 16,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                Trustpilot {rating} / 5
              </div>
              {reviews && (
                <div
                  style={{
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(13,51,39,0.35)",
                    color: "#0d3327",
                    fontSize: 16,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    display: "flex",
                  }}
                >
                  {reviews.toLocaleString()} reviews
                </div>
              )}
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
          <span>peptidepros.io · vendors</span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: 0,
              color: "rgba(13,51,39,0.7)",
            }}
          >
            Independent vendor research
          </span>
        </div>
      </div>
    ),
    size,
  );
}
