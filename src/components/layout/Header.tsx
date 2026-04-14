"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { useUser } from "@/hooks/useUser";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <FlaskConical className="h-6 w-6 text-primary" />
          <span>PeptidePros</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <Button variant="outline" size="sm" render={<Link href="/dashboard" />}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                    Log in
                  </Button>
                  <Button size="sm" render={<Link href="/signup" />}>
                    Sign up
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-4 mt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-4 flex flex-col gap-2">
                {user ? (
                  <Button variant="outline" render={<Link href="/dashboard" onClick={() => setOpen(false)} />}>
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" render={<Link href="/login" onClick={() => setOpen(false)} />}>
                      Log in
                    </Button>
                    <Button render={<Link href="/signup" onClick={() => setOpen(false)} />}>
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
