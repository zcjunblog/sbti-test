import type { RankingsSnapshot, RankingEntry } from "@/lib/sbti-data";

const ENV_ID = process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID ?? "";
const BASE_URL = ENV_ID
  ? `https://${ENV_ID}.service.tcloudbase.com`
  : "";

export async function fetchRankings(): Promise<RankingsSnapshot> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_CLOUDBASE_ENV_ID is not configured");
  }

  const response = await fetch(`${BASE_URL}/sbti-rankings-get`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rankings: ${response.status}`);
  }

  return response.json() as Promise<RankingsSnapshot>;
}

type SubmissionResponse =
  | { accepted: true; entry: RankingEntry }
  | { accepted: false; reason: "duplicate" | "invalid_payload" | "invalid_type" };

export async function submitRanking(
  submissionId: string,
  finalTypeCode: string,
): Promise<SubmissionResponse> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_CLOUDBASE_ENV_ID is not configured");
  }

  const response = await fetch(`${BASE_URL}/sbti-rankings-submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissionId, finalTypeCode }),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error(`Submit failed: ${response.status}`);
  }

  return response.json() as Promise<SubmissionResponse>;
}
