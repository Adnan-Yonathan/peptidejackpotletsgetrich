"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Signup1 } from "@/components/ui/signup-1";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error("Supabase auth is not configured.");
      return;
    }

    setLoading(true);

    const redirectTo =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirectTo") ?? "/dashboard"
        : "/dashboard";

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
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
      footerText="Don&apos;t have an account?"
      footerLinkText="Sign up"
      footerLinkUrl="/signup"
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
