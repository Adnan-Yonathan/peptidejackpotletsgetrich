"use client";

import { useState } from "react";
import type { Profile } from "@/types/database";

// Stub user hook — no backend required.
// Replace with real auth provider when ready.

export function useUser() {
  const [user] = useState<{ id: string; email: string } | null>(null);
  const [profile] = useState<Profile | null>(null);
  const loading = false;

  return { user, profile, loading };
}
