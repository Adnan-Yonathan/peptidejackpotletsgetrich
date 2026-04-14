"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Signup1 } from "@/components/ui/signup-1";
import { SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${SITE_URL}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.session) {
      toast.success("Account created");
      router.replace(redirectTo);
      router.refresh();
      return;
    }

    toast.success("Check your email to confirm your account.");
    router.replace("/login");
  };

  return (
    <Signup1
      heading="Create your account"
      submitText={loading ? "Creating account..." : "Create an account"}
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkUrl="/login"
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSignup}
      loading={loading}
      showGoogleButton={false}
    />
  );
}
