"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Signup1Props {
  heading?: string;
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title?: string;
  };
  submitText?: string;
  googleText?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkUrl?: string;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  loading?: boolean;
  showGoogleButton?: boolean;
}

const defaultLogo = {
  url: "/",
  alt: "PeptidePros",
  title: "PeptidePros",
};

const Signup1 = ({
  heading,
  logo = defaultLogo,
  submitText = "Create an account",
  googleText = "Continue with Google",
  footerText = "Already have an account?",
  footerLinkText = "Login",
  footerLinkUrl = "/login",
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading = false,
  showGoogleButton = false,
}: Signup1Props) => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border border-muted bg-background px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-2 lg:justify-start">
              <Link href={logo.url} className="flex items-center gap-2">
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10 dark:invert"
                  />
                ) : (
                  <>
                    <FlaskConical className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold text-foreground">{logo.title ?? logo.alt}</span>
                  </>
                )}
              </Link>
            </div>
            {heading && <h1 className="text-3xl font-semibold text-center">{heading}</h1>}
          </div>
          <div className="flex w-full flex-col gap-8">
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  minLength={footerLinkUrl === "/login" ? undefined : 6}
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full" disabled={loading}>
                  {loading ? "Please wait..." : submitText}
                </Button>
                {showGoogleButton && (
                  <Button variant="outline" className="w-full" type="button" disabled>
                    <FcGoogle className="mr-2 size-5" />
                    {googleText}
                  </Button>
                )}
              </div>
            </form>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{footerText}</p>
            <Link href={footerLinkUrl} className="font-medium text-primary hover:underline">
              {footerLinkText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup1 };
