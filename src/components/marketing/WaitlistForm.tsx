"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  className?: string;
};

type SubmissionState = "idle" | "success" | "error";

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState(
    "Be first to know when we open access."
  );
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { message?: string; error?: string }
          | null;

        if (!response.ok) {
          setState("error");
          setMessage(payload?.error ?? "Could not save your email right now.");
          return;
        }

        setEmail("");
        setState("success");
        setMessage(payload?.message ?? "You're on the list.");
      } catch {
        setState("error");
        setMessage("Could not save your email right now.");
      }
    });
  }

  return (
    <form className={cn("space-y-3", className)} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          aria-label="Email address"
          className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-base"
        />
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="h-12 rounded-2xl bg-[#0f6a52] px-6 text-base text-white hover:bg-[#103b2c]"
        >
          {isPending ? "Joining..." : "Join waitlist"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p
        className={cn(
          "text-sm",
          state === "error" ? "text-red-600" : "text-slate-500"
        )}
      >
        {message}
      </p>
    </form>
  );
}
