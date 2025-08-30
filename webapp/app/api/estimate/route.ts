import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { weightKg = 1, mode = "standard" } = await req.json();
  const g = mode === "express" ? weightKg * 500 : weightKg * 62;
  return NextResponse.json({ emissions_g: g });
}
