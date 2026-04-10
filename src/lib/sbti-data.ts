import rawData from "@/data/sbti-data.json";
import rawRankingsSeed from "@/data/rankings-seed.json";

export type Level = "L" | "M" | "H";

export type QuestionOption = {
  label: string;
  value: number;
};

export type Question = {
  id: string;
  dim?: string;
  text: string;
  options: QuestionOption[];
  special?: boolean;
  kind?: string;
};

export type CanonicalItem = {
  dim: string;
  level: Level;
  explanation: string;
};

export type SbtiType = {
  code: string;
  cn: string;
  intro: string;
  desc: string;
  slug: string;
  image: string;
  special: boolean;
  pattern?: string;
  canonicalItems: CanonicalItem[];
};

export type RankingEntry = {
  typeCode: string;
  slug: string;
  cn: string;
  count: number;
  rank: number;
  share: number;
};

export type RankingsSnapshot = {
  totalSubmissions: number;
  updatedAt: string;
  entries: RankingEntry[];
};

type DataShape = {
  dimensionOrder: string[];
  dimensionMeta: Record<string, { name: string; model: string }>;
  dimensionExplanations: Record<string, Record<Level, string>>;
  questions: Question[];
  specialQuestions: Question[];
  requiredQuestionCount: number;
  types: SbtiType[];
};

const data = rawData as DataShape;

export const dimensionOrder = data.dimensionOrder;
export const dimensionMeta = data.dimensionMeta;
export const dimensionExplanations = data.dimensionExplanations;
export const questions = data.questions;
export const specialQuestions = data.specialQuestions;
export const requiredQuestionCount = data.requiredQuestionCount;
export const standardQuestionCount = questions.length;
export const maxQuestionCount = questions.length + specialQuestions.length;
export const guaranteedQuestionCount = requiredQuestionCount;
export const types = data.types;
export const rankingsSeedSnapshot = rawRankingsSeed as RankingsSnapshot;

export const typeByCode = Object.fromEntries(
  types.map((type) => [type.code, type]),
) as Record<string, SbtiType>;

export const typeBySlug = Object.fromEntries(
  types.map((type) => [type.slug, type]),
) as Record<string, SbtiType>;

export const normalTypes = types.filter(
  (type): type is SbtiType & { pattern: string } =>
    !type.special && typeof type.pattern === "string",
);

export const featuredTypes = types.filter((type) => !type.special).slice(0, 6);
export const spotlightEntries = rankingsSeedSnapshot.entries.slice(0, 3);

const modelDescriptions: Record<string, string> = {
  自我模型: "看你对自己的评价是否稳定，认不认识自己，以及内心到底有没有特别要紧的东西。",
  情感模型: "看你在关系里容易焦虑还是安心，投入到什么程度，以及是否需要独立空间。",
  态度模型: "看你怎么看世界、规则和人生意义，是谨慎守序还是灵活冲动。",
  行动驱力模型: "看你做事更偏进攻还是规避，做决定果不果断，计划能不能落下来。",
  社交模型: "看你会不会主动靠近人、边界感强不强，以及在不同关系里有多真实。",
};

export const dimensionGroups = [
  "自我模型",
  "情感模型",
  "态度模型",
  "行动驱力模型",
  "社交模型",
].map((title) => ({
  title,
  description: modelDescriptions[title],
  dimensions: dimensionOrder.filter(
    (dim) => dimensionMeta[dim]?.model === title,
  ),
}));

export function getDisplayCode(code: string) {
  return code.toUpperCase();
}

export function getTypeBySlug(slug: string) {
  return typeBySlug[slug];
}

export function getSuggestedTypes(currentCode: string, limit = 3) {
  return types.filter((type) => type.code !== currentCode).slice(0, limit);
}
