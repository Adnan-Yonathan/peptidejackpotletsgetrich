import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TOOL_CATEGORIES, TOOLS, getToolsByCategory, type ToolEntry } from "@/lib/tools";

export function ComingSoonPage({ tool }: { tool: ToolEntry }) {
  const Icon = tool.icon;
  const otherLiveTools = TOOLS.filter((t) => t.status === "live").slice(0, 3);

  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7]">
        <section className="bg-[#fbfaf7]">
          <div className="container mx-auto max-w-6xl px-4 pt-12 pb-12 md:pt-16 md:pb-16">
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#103b2c]/60">
              <span className="h-px w-6 bg-[#103b2c]/40" />
              Tools &middot; {TOOL_CATEGORIES.find((c) => c.id === tool.category)?.label}
            </p>

            <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f6a52]/10 text-[#0f6a52]">
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
                    Coming soon
                  </span>
                </div>

                <h1 className="font-extrabold leading-[1.05] tracking-[-0.03em] text-black text-[28px] sm:text-[36px] md:text-[44px]">
                  {tool.name}
                </h1>
                <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-[#103b2c]/70">
                  {tool.description}
                </p>

                <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#103b2c]/50">
                  In the meantime
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/tools"
                    className="inline-flex h-[44px] items-center gap-2 rounded-[10px] bg-[#103b2c] px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#0c3226]"
                  >
                    Browse all tools
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Link>
                  <Link
                    href="/quiz"
                    className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors hover:text-[#0f6a52]"
                  >
                    Or take the quiz
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>

              <aside className="rounded-[14px] border border-[#103b2c]/12 bg-white p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f6a52]">
                  Live now
                </p>
                <ul className="mt-3 divide-y divide-[#103b2c]/8">
                  {otherLiveTools.map((t) => {
                    const ToolIcon = t.icon;
                    return (
                      <li key={t.id}>
                        <Link
                          href={t.href}
                          className="group flex items-start gap-3 py-3 transition-colors"
                        >
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0f6a52]/10 text-[#0f6a52]">
                            <ToolIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-semibold text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                              {t.shortName}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] leading-[1.4] text-[#103b2c]/60">
                              {t.description}
                            </span>
                          </span>
                          <ArrowRight
                            className="mt-2 h-3 w-3 shrink-0 text-[#103b2c]/40 transition-all group-hover:translate-x-0.5 group-hover:text-[#0f6a52]"
                            strokeWidth={2.5}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-t border-[#103b2c]/8 bg-[#f4f1ea] py-12 md:py-14">
          <div className="container mx-auto max-w-6xl px-4">
            <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#103b2c]/55">
              All tools in this category
            </p>
            <div className="grid gap-px bg-[#103b2c]/10 sm:grid-cols-2 md:grid-cols-3">
              {getToolsByCategory(tool.category).map((t) => {
                const TIcon = t.icon;
                const isCurrent = t.id === tool.id;
                const isSoon = t.status === "coming-soon";
                return (
                  <Link
                    key={t.id}
                    href={t.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className="group flex flex-col bg-[#f4f1ea] p-5 transition-colors hover:bg-[#fbfaf7]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f6a52]/10 text-[#0f6a52]">
                      <TIcon className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                    <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-[#103b2c]">
                      {t.shortName}
                      {isSoon && (
                        <span className="rounded-full bg-[#103b2c]/8 px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.12em] text-[#103b2c]/55">
                          Soon
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-[1.5] text-[#103b2c]/60">
                      {t.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
