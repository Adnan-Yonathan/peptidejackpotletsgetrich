import { SITE_CANONICAL_URL } from "@/lib/constants";

// `undefined` is permitted in object/array values because JSON.stringify drops
// those keys at runtime — matching the schema-emission contract.
type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      // Schema.org JSON-LD content; we control the shape entirely.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE_CANONICAL_URL}${item.href}`,
    })),
  } as const;
}

export function BreadcrumbList({ items }: { items: BreadcrumbItem[] }) {
  return <JsonLd data={buildBreadcrumbList(items)} />;
}
