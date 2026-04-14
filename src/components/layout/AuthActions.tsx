"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

export function AuthActions({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { user, loading, signOut } = useUser();
  const router = useRouter();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size={mobile ? "default" : "sm"}
          render={<Link href="/login" onClick={onNavigate} />}
        >
          Log in
        </Button>
        <Button
          size={mobile ? "default" : "sm"}
          render={<Link href="/signup" onClick={onNavigate} />}
        >
          Sign up
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size={mobile ? "default" : "sm"}
        render={<Link href="/dashboard" onClick={onNavigate} />}
      >
        Dashboard
      </Button>
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        onClick={async () => {
          await signOut();
          onNavigate?.();
          router.replace("/");
          router.refresh();
        }}
      >
        Log out
      </Button>
    </>
  );
}
