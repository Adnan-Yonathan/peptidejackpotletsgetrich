"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Signup1 } from "@/components/ui/signup-1";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error("Supabase auth is not configured.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(
        error.message.toLowerCase().includes("email not confirmed")
          ? "This email is not confirmed yet. Create a new account through the quiz signup flow or use the confirmation link from Supabase."
          : error.message
      );
      return;
    }

    toast.success("Logged in");
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <Signup1
      heading="Log in to continue"
      submitText={loading ? "Logging in..." : "Log in"}
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkUrl={`/signup?redirectTo=${encodeURIComponent(redirectTo)}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      loading={loading}
      showGoogleButton={false}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
