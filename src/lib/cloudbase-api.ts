import {
  rankingsSeedSnapshot,
  type RankingsSnapshot,
  type RankingEntry,
} from "@/lib/sbti-data";

// 纯静态版本：榜单数据全部来自本地种子文件 src/data/rankings-seed.json，
// 不再请求任何服务端。保留原有函数签名，调用方（首页 Top3、榜单页、结果页入榜）无需改动。

export async function fetchRankings(): Promise<RankingsSnapshot> {
  return rankingsSeedSnapshot;
}

type SubmissionResponse =
  | { accepted: true; entry: RankingEntry }
  | { accepted: false; reason: "duplicate" | "invalid_payload" | "invalid_type" };

export async function submitRanking(
  _submissionId: string,
  finalTypeCode: string,
): Promise<SubmissionResponse> {
  const entry = rankingsSeedSnapshot.entries.find(
    (item) => item.typeCode === finalTypeCode,
  );

  if (!entry) {
    return { accepted: false, reason: "invalid_type" };
  }

  // 静态站点没有后端可写入，直接回显本地种子里的排名/人数，
  // 让结果页「已入榜 · 排名第 N 位」UI 维持原样。
  return { accepted: true, entry };
}
