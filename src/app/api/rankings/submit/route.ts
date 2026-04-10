import { NextResponse } from "next/server";
import { submitRankingSubmission } from "@/lib/rankings-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      submissionId?: string;
      finalTypeCode?: string;
    };

    const result = await submitRankingSubmission(body);

    if (!result.accepted && result.reason !== "duplicate") {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        accepted: false,
        reason: "invalid_payload",
      },
      { status: 400 },
    );
  }
}
