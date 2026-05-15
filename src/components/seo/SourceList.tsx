import type { SourceCitation } from "@/lib/editorial";

interface SourceListProps {
  sources: SourceCitation[];
  title?: string;
}

export function SourceList({ sources, title = "Sources and review notes" }: SourceListProps) {
  if (sources.length === 0) return null;

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <ol className="mt-4 space-y-3">
        {sources.map((source) => (
          <li key={`${source.publisher}-${source.title}`} className="text-xs leading-relaxed text-muted-foreground">
            <a
              href={source.url}
              className="font-semibold text-foreground underline decoration-stone-300 underline-offset-2 hover:decoration-foreground"
              target={source.url.startsWith("http") ? "_blank" : undefined}
              rel={source.url.startsWith("http") ? "noreferrer" : undefined}
            >
              {source.title}
            </a>
            <span> - {source.publisher}</span>
            {source.accessedAt && <span> - accessed {source.accessedAt}</span>}
            {source.note && <p className="mt-0.5">{source.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
