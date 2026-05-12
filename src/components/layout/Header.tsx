"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, FlaskConical, Menu, X } from "lucide-react";
import { AuthActions } from "@/components/layout/AuthActions";
import { ToolsDropdown } from "@/components/layout/ToolsDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { TOOL_CATEGORIES, TOOLS, getToolsByCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const toolsActive =
    pathname === "/tools" ||
    pathname.startsWith("/tools/") ||
    TOOLS.some((t) => pathname === t.href || pathname.startsWith(`${t.href}/`));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#fbfaf7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fbfaf7]/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#103b2c]">
          <FlaskConical className="h-6 w-6 text-[#0f6a52]" />
          <span>PeptidePros</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link, idx) => {
            const node = (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-[#e7f4ee] text-[#0f6a52]"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            );
            // Insert the Tools dropdown after the first nav link (Peptides),
            // matching its previous Stack-Builder position.
            if (idx === 0) {
              return (
                <div key="peptides+tools" className="contents">
                  {node}
                  <ToolsDropdown />
                </div>
              );
            }
            return node;
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <AuthActions />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              {NAV_LINKS.slice(0, 1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    isActive(link.href) ? "text-[#0f6a52]" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Tools accordion */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileToolsOpen((v) => !v)}
                  aria-expanded={mobileToolsOpen}
                  className={cn(
                    "flex items-center justify-between text-lg font-medium transition-colors",
                    toolsActive ? "text-[#0f6a52]" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>Tools</span>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", mobileToolsOpen && "rotate-180")}
                  />
                </button>
                {mobileToolsOpen && (
                  <div className="mt-3 space-y-4 border-l border-[#103b2c]/15 pl-4">
                    {TOOL_CATEGORIES.map((cat) => {
                      const tools = getToolsByCategory(cat.id);
                      if (tools.length === 0) return null;
                      return (
                        <div key={cat.id}>
                          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f6a52]">
                            {cat.label}
                          </p>
                          <ul className="space-y-1.5">
                            {tools.map((t) => (
                              <li key={t.id}>
                                <Link
                                  href={t.href}
                                  onClick={() => setOpen(false)}
                                  className="flex items-center gap-2 text-[14px] text-[#103b2c]"
                                >
                                  <span>{t.shortName}</span>
                                  {t.status === "coming-soon" && (
                                    <span className="rounded-full bg-[#103b2c]/8 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#103b2c]/55">
                                      Soon
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    <Link
                      href="/tools"
                      onClick={() => setOpen(false)}
                      className="inline-flex text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[4px]"
                    >
                      Browse all tools
                    </Link>
                  </div>
                )}
              </div>

              {NAV_LINKS.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    isActive(link.href) ? "text-[#0f6a52]" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 border-t pt-4">
                <AuthActions mobile onNavigate={() => setOpen(false)} />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
