import {
  dimensionExplanations,
  dimensionMeta,
  dimensionOrder,
  normalTypes,
  specialQuestions,
  typeByCode,
  typeBySlug,
  questions,
  type CanonicalItem,
  type Level,
  type Question,
  type SbtiType,
} from "@/lib/sbti-data";

export const RESULT_SNAPSHOT_KEY = "sbti:result-snapshot:v1";

export type QuizAnswers = Record<string, number>;

export type RankedType = SbtiType & {
  distance: number;
  exact: number;
  similarity: number;
};

export type ResultSnapshot = {
  submissionId: string;
  finalTypeCode: string;
  bestNormalCode: string;
  rawScores: Record<string, number>;
  levels: Record<string, Level>;
  similarity: number;
  exact: number;
  special: boolean;
  modeKicker: string;
  badge: string;
  sub: string;
  secondaryTypeCode?: string;
  rankingSubmission?: {
    submittedAt: string;
    count: number;
    rank: number;
  };
};

export type ComputedResult = {
  rawScores: Record<string, number>;
  levels: Record<string, Level>;
  ranked: RankedType[];
  bestNormal: RankedType;
  finalType: SbtiType;
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
  secondaryType?: RankedType;
};

function getNarrative(
  finalTypeCode: string,
  similarity: number,
  exact: number,
) {
  if (finalTypeCode === "DRUNK") {
    return {
      modeKicker: "隐藏人格已激活",
      badge: "匹配度 100% · 酒精异常因子已接管",
      sub: "乙醇亲和性过强，系统已直接跳过常规人格审判。",
    };
  }

  if (finalTypeCode === "HHHH") {
    return {
      modeKicker: "系统强制兜底",
      badge: `标准人格库最高匹配仅 ${similarity}%`,
      sub: "标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。",
    };
  }

  return {
    modeKicker: "你的主类型",
    badge: `匹配度 ${similarity}% · 精准命中 ${exact}/15 维`,
    sub: "维度命中度较高，当前结果可视为你的第一人格画像。",
  };
}

function scoreLevel(level: Level) {
  return { L: 1, M: 2, H: 3 }[level];
}

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export function buildQuestionDeck() {
  const shuffled = shuffle(questions);
  const insertIndex = Math.floor(Math.random() * shuffled.length) + 1;
  return [
    ...shuffled.slice(0, insertIndex),
    specialQuestions[0],
    ...shuffled.slice(insertIndex),
  ];
}

export function hydrateQuestionDeck(baseDeck: Question[], answers: QuizAnswers) {
  const deck = [...baseDeck];
  const [branchGate, branchFollowup] = specialQuestions;
  const branchIndex = deck.findIndex((question) => question.id === branchGate.id);

  if (branchIndex >= 0 && answers[branchGate.id] === 3) {
    deck.splice(branchIndex + 1, 0, branchFollowup);
  }

  return deck;
}

export function computeResult(answers: QuizAnswers): ComputedResult {
  const rawScores = Object.fromEntries(
    Object.keys(dimensionMeta).map((key) => [key, 0]),
  ) as Record<string, number>;

  for (const question of questions) {
    rawScores[question.dim ?? ""] += Number(answers[question.id] ?? 0);
  }

  const levels = Object.fromEntries(
    Object.entries(rawScores).map(([dimension, score]) => [
      dimension,
      score <= 3 ? "L" : score === 4 ? "M" : "H",
    ]),
  ) as Record<string, Level>;

  const levelScores = dimensionOrder.map((dimension) => scoreLevel(levels[dimension]));

  const ranked = normalTypes
    .map((type) => {
      const patternScores = type.pattern
        .replace(/-/g, "")
        .split("")
        .map((value) => scoreLevel(value as Level));

      let distance = 0;
      let exact = 0;

      for (let index = 0; index < patternScores.length; index += 1) {
        const diff = Math.abs(levelScores[index] - patternScores[index]);
        distance += diff;
        if (diff === 0) {
          exact += 1;
        }
      }

      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));

      return {
        ...type,
        distance,
        exact,
        similarity,
      };
    })
    .sort((left, right) => {
      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }
      if (left.exact !== right.exact) {
        return right.exact - left.exact;
      }
      return right.similarity - left.similarity;
    });

  const bestNormal = ranked[0];
  const drinkTriggered = answers[specialQuestions[1].id] === 2;

  let finalType = typeByCode[bestNormal.code];
  let special = false;
  let secondaryType: RankedType | undefined;

  if (drinkTriggered) {
    finalType = typeByCode.DRUNK;
    special = true;
    secondaryType = bestNormal;
  } else if (bestNormal.similarity < 60) {
    finalType = typeByCode.HHHH;
    special = true;
  }

  const narrative = getNarrative(finalType.code, bestNormal.similarity, bestNormal.exact);

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker: narrative.modeKicker,
    badge: narrative.badge,
    sub: narrative.sub,
    special,
    secondaryType,
  };
}

export function buildResultSnapshot(
  result: ComputedResult,
  submissionId: string,
): ResultSnapshot {
  return {
    submissionId,
    finalTypeCode: result.finalType.code,
    bestNormalCode: result.bestNormal.code,
    rawScores: result.rawScores,
    levels: result.levels,
    similarity: result.bestNormal.similarity,
    exact: result.bestNormal.exact,
    special: result.special,
    modeKicker: result.modeKicker,
    badge: result.badge,
    sub: result.sub,
    secondaryTypeCode: result.secondaryType?.code,
  };
}

export function getSnapshotNarrative(snapshot: ResultSnapshot) {
  return getNarrative(snapshot.finalTypeCode, snapshot.similarity, snapshot.exact);
}

export function getPersonalizedDimensionItems(snapshot: ResultSnapshot): CanonicalItem[] {
  return dimensionOrder.map((dimension) => ({
    dim: dimension,
    level: snapshot.levels[dimension],
    explanation: dimensionExplanations[dimension][snapshot.levels[dimension]],
  }));
}

export function createSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function readResultSnapshot() {
  try {
    const raw = window.localStorage.getItem(RESULT_SNAPSHOT_KEY);
    if (!raw) {
      return null;
    }
    const snapshot = JSON.parse(raw) as ResultSnapshot;
    if (!snapshot.finalTypeCode) {
      return null;
    }
    return snapshot;
  } catch {
    return null;
  }
}

export function writeResultSnapshot(snapshot: ResultSnapshot) {
  window.localStorage.setItem(RESULT_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function clearResultSnapshot() {
  window.localStorage.removeItem(RESULT_SNAPSHOT_KEY);
}

export function getCanonicalResultPath(slug: string) {
  return `/result/${slug}`;
}

export function getCanonicalType(code: string) {
  return typeByCode[code];
}

export function getCanonicalTypeBySlug(slug: string) {
  return typeBySlug[slug];
}
