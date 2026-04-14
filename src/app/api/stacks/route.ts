import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const shareSlug = randomBytes(6).toString("hex");

    // TODO: replace with real DB once backend is connected
    return NextResponse.json({
      id: crypto.randomUUID(),
      name: body.name || "My Stack",
      share_slug: shareSlug,
      created_at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to save stack" }, { status: 500 });
  }
}

export async function DELETE() {
  // TODO: replace with real DB once backend is connected
  return NextResponse.json({ success: true });
}
