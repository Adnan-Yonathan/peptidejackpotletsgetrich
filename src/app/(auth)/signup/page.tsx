"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Signup1 } from "@/components/ui/signup-1";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const initialEmail = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error("Supabase auth is not configured.");
      return;
    }

    setLoading(true);

    const signupResponse = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const signupPayload = (await signupResponse.json().catch(() => ({}))) as { error?: string };

    if (!signupResponse.ok) {
      setLoading(false);
      toast.error(signupPayload.error ?? "Unable to create account.");
      if (signupResponse.status === 409) {
        router.replace(`/login?redirectTo=${encodeURIComponent(redirectTo)}&email=${encodeURIComponent(email)}`);
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created");
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <Signup1
      heading="Create your account"
      submitText={loading ? "Creating account..." : "Create an account"}
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkUrl={`/login?redirectTo=${encodeURIComponent(redirectTo)}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSignup}
      loading={loading}
      showGoogleButton={false}
      passwordMinLength={6}
    />
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
