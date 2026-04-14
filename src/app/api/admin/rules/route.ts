import { NextResponse } from "next/server";

export async function GET() {
  // TODO: replace with real DB once backend is connected
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ id: crypto.randomUUID(), ...body }, { status: 201 });
}
