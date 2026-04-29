import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!getSupabaseConfig()) {
      return NextResponse.json(
        { error: "Waitlist storage is not configured." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("waitlist_signups")
      .upsert(
        { email: normalizedEmail, source: "coming-soon" },
        { onConflict: "email" }
      );

    if (error) {
      return NextResponse.json(
        { error: "Could not save your email right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "You're on the list. We'll reach out when access opens.",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not save your email right now." },
      { status: 500 }
    );
  }
}
