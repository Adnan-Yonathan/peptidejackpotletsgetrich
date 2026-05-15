import type { Metadata } from "next";
import { SITE_CANONICAL_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

type SeoMetadataInput = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  imageAlt?: string;
  type?: "website" | "article";
};

function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_CANONICAL_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildSeoMetadata({
  title,
  description,
  path,
  imagePath,
  imageAlt,
  type = "website",
}: SeoMetadataInput): Pick<Metadata, "openGraph" | "twitter"> {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath ?? "/opengraph-image");
  const alt = imageAlt ?? `${SITE_NAME} - ${title}`;

  return {
    openGraph: {
      type,
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt }],
    },
  };
}

export const defaultSeoMetadata = buildSeoMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
  imageAlt: `${SITE_NAME} - Independent peptide research and vendor comparison`,
});
