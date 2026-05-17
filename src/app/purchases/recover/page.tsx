"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PurchaseRecoveryPage() {
  const [email, setEmail] = useState("");
  const [checkoutSessionId, setCheckoutSessionId] = useState("");
  const [links, setLinks] = useState<Array<{ productSlug: string; url: string }>>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setLinks([]);

    const response = await fetch("/api/purchases/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, checkoutSessionId }),
    });
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      links?: Array<{ productSlug: string; url: string }>;
    };

    setIsLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Unable to recover that purchase.");
      return;
    }

    setLinks(payload.links ?? []);
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center bg-[#fbfaf7] px-4 py-14">
        <Card className="w-full max-w-lg border-[#103b2c]/10">
          <CardContent className="space-y-5 pt-6">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f6a52]">
                Purchase recovery
              </p>
              <h1 className="mt-2 text-2xl font-bold text-[#103b2c]">Recover your protocol link</h1>
              <p className="mt-2 text-sm leading-6 text-[#103b2c]/68">
                Enter the email used at checkout and the Stripe session id from your purchase success page.
              </p>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Checkout email"
                autoComplete="email"
                required
              />
              <Input
                value={checkoutSessionId}
                onChange={(event) => setCheckoutSessionId(event.target.value)}
                placeholder="cs_test_..."
                required
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Checking..." : "Recover protocol"}
              </Button>
            </form>

            {message && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {message}
              </p>
            )}

            {links.length > 0 && (
              <div className="space-y-2 rounded-xl border border-[#103b2c]/10 bg-white p-3">
                {links.map((link) => (
                  <Button key={link.url} className="w-full" render={<Link href={link.url} />}>
                    Open {link.productSlug.replaceAll("-", " ")}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}

