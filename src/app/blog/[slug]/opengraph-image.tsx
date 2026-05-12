import { ImageResponse } from "next/og";
import { getBlogPostBySlug, getBlogCategoryById } from "@/data/blog";
import { SITE_NAME } from "@/lib/constants";

export const alt = "PeptidePros blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const category = post ? getBlogCategoryById(post.categoryId) : null;
  const title = post?.title ?? SITE_NAME;
  const summary = post?.summary ?? "";
  const eyebrow = category?.title ?? "Peptide research";

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
          color: "#13201d",
          backgroundColor: "#fbfaf7",
          backgroundImage:
            "radial-gradient(circle at 92% 8%, rgba(125,211,167,0.35), transparent 38%), radial-gradient(circle at 4% 96%, rgba(15,106,82,0.18), transparent 42%)",
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
          <div
            style={{
              fontSize: 14,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#0f6a52",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: title.length > 60 ? 64 : 78,
              lineHeight: 1.04,
              letterSpacing: -1.5,
              color: "#0d3327",
              display: "flex",
            }}
          >
            {title}
          </div>
          {summary && (
            <div
              style={{
                marginTop: 24,
                maxWidth: 980,
                fontSize: 24,
                lineHeight: 1.45,
                color: "rgba(19,32,29,0.7)",
                display: "flex",
              }}
            >
              {summary.length > 220 ? `${summary.slice(0, 217)}…` : summary}
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
