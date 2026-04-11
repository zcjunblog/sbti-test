import type { Metadata } from "next";
import { RankingsContent } from "@/components/rankings-content";

export const metadata: Metadata = {
  title: "人气榜单",
  description: "查看当前 SBTI 人格结果排行榜与占比分布。",
};

export default function RankingsPage() {
  return <RankingsContent />;
}
