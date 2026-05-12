"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { TOOL_CATEGORIES, TOOLS, getToolsByCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

const HOVER_DELAY_MS = 80;
const CLOSE_DELAY_MS = 150;

export function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const isActive =
    pathname === "/tools" ||
    pathname.startsWith("/tools/") ||
    TOOLS.some((t) => pathname === t.href || pathname.startsWith(`${t.href}/`));

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function scheduleOpen() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (open) return;
    openTimer.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
  }

  function scheduleClose() {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-[#e7f4ee] text-[#0f6a52]"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        Tools
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          strokeWidth={2.5}
        />
      </button>

      {/* Dropdown panel */}
      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          "absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 transform",
          "w-[760px] max-w-[calc(100vw-2rem)]",
          "transition-all duration-150",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="rounded-[16px] border border-[#103b2c]/12 bg-[#fbfaf7] p-6 shadow-[0_24px_60px_-24px_rgba(16,59,44,0.25)]">
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
            {TOOL_CATEGORIES.map((cat) => {
              const tools = getToolsByCategory(cat.id);
              if (tools.length === 0) return null;
              return (
                <div key={cat.id}>
                  <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#0f6a52]">
                    {cat.label}
                  </p>
                  <ul className="space-y-2.5">
                    {tools.map((t) => {
                      const Icon = t.icon;
                      const isSoon = t.status === "coming-soon";
                      return (
                        <li key={t.id}>
                          <Link
                            href={t.href}
                            onClick={() => setOpen(false)}
                            className="group/item flex items-start gap-2.5 rounded-[8px] -mx-1 px-1 py-1 transition-colors hover:bg-white"
                          >
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0f6a52]/10 text-[#0f6a52]">
                              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5">
                                <span className="text-[13px] font-semibold leading-tight text-[#103b2c] transition-colors group-hover/item:text-[#0f6a52]">
                                  {t.shortName}
                                </span>
                                {isSoon && (
                                  <span className="rounded-full bg-[#103b2c]/8 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#103b2c]/55">
                                    Soon
                                  </span>
                                )}
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-[11.5px] leading-[1.4] text-[#103b2c]/55">
                                {t.description}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-[#103b2c]/8 pt-4">
            <Link
              href="/tools"
              onClick={() => setOpen(false)}
              className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] transition-colors hover:text-[#0f6a52]"
            >
              Browse all {TOOLS.length} tools
              <ArrowRight
                className="h-3 w-3 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
