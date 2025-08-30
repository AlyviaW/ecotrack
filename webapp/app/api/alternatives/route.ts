import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { name: "Refurbished Item", note: "70% less CO₂" },
    { name: "Local Marketplace", note: "Pickup nearby" }
  ]);
}
