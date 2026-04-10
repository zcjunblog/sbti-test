import { NextResponse } from "next/server";
import { getRankingsSnapshot } from "@/lib/rankings-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getRankingsSnapshot();
  return NextResponse.json(snapshot);
}
