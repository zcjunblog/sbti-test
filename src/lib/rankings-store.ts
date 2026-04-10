import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  rankingsSeedSnapshot,
  type RankingEntry,
  type RankingsSnapshot,
  typeByCode,
} from "@/lib/sbti-data";

type SubmissionRecord = {
  submittedAt: string;
  typeCode: string;
};

type RankingsStore = {
  snapshot: RankingsSnapshot;
  submissions: Record<string, SubmissionRecord>;
};

type SubmissionResponse =
  | {
      accepted: true;
      entry: RankingEntry;
    }
  | {
      accepted: false;
      reason: "duplicate" | "invalid_payload" | "invalid_type";
    };

const storeDirectory = path.join(process.cwd(), "data");
const storePath = path.join(storeDirectory, "rankings-store.json");
let writeQueue = Promise.resolve<unknown>(undefined);

function cloneSeedSnapshot(): RankingsSnapshot {
  return JSON.parse(JSON.stringify(rankingsSeedSnapshot)) as RankingsSnapshot;
}

async function ensureStoreFile() {
  await mkdir(storeDirectory, { recursive: true });
  try {
    await readFile(storePath, "utf8");
  } catch {
    const initialStore: RankingsStore = {
      snapshot: cloneSeedSnapshot(),
      submissions: {},
    };
    await writeFile(storePath, JSON.stringify(initialStore, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStoreFile();
  const raw = await readFile(storePath, "utf8");
  return JSON.parse(raw) as RankingsStore;
}

async function writeStore(store: RankingsStore) {
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

function rebuildSnapshot(entries: RankingEntry[]): RankingsSnapshot {
  const totalSubmissions = entries.reduce((sum, entry) => sum + entry.count, 0);
  const previousRanks = new Map(
    entries.map((entry, index) => [entry.typeCode, entry.rank || index + 1]),
  );

  const normalizedEntries = entries
    .map((entry) => ({
      ...entry,
      cn: typeByCode[entry.typeCode]?.cn ?? entry.cn,
      slug: typeByCode[entry.typeCode]?.slug ?? entry.slug,
    }))
    .sort((left, right) => {
      if (left.count !== right.count) {
        return right.count - left.count;
      }
      return (previousRanks.get(left.typeCode) ?? 999) -
        (previousRanks.get(right.typeCode) ?? 999);
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      share:
        totalSubmissions === 0
          ? 0
          : Number((entry.count / totalSubmissions).toFixed(4)),
    }));

  return {
    totalSubmissions,
    updatedAt: new Date().toISOString(),
    entries: normalizedEntries,
  };
}

export async function getRankingsSnapshot() {
  const store = await readStore();
  return store.snapshot;
}

export async function submitRankingSubmission(input: {
  submissionId?: string;
  finalTypeCode?: string;
}) {
  const nextJob = writeQueue.then(async () => {
    const submissionId = input.submissionId?.trim();
    const finalTypeCode = input.finalTypeCode?.trim();

    if (!submissionId || !finalTypeCode) {
      return {
        accepted: false,
        reason: "invalid_payload",
      } satisfies SubmissionResponse;
    }

    if (!typeByCode[finalTypeCode]) {
      return {
        accepted: false,
        reason: "invalid_type",
      } satisfies SubmissionResponse;
    }

    const store = await readStore();

    if (store.submissions[submissionId]) {
      return {
        accepted: false,
        reason: "duplicate",
      } satisfies SubmissionResponse;
    }

    const currentEntries = [...store.snapshot.entries];
    const currentEntry = currentEntries.find(
      (entry) => entry.typeCode === finalTypeCode,
    );

    if (currentEntry) {
      currentEntry.count += 1;
    } else {
      currentEntries.push({
        typeCode: finalTypeCode,
        slug: typeByCode[finalTypeCode].slug,
        cn: typeByCode[finalTypeCode].cn,
        count: 1,
        rank: currentEntries.length + 1,
        share: 0,
      });
    }

    const snapshot = rebuildSnapshot(currentEntries);
    store.snapshot = snapshot;
    store.submissions[submissionId] = {
      submittedAt: snapshot.updatedAt,
      typeCode: finalTypeCode,
    };

    await writeStore(store);

    const entry = snapshot.entries.find(
      (candidate) => candidate.typeCode === finalTypeCode,
    );

    return {
      accepted: true,
      entry: entry!,
    } satisfies SubmissionResponse;
  });

  writeQueue = nextJob.then(
    () => undefined,
    () => undefined,
  );

  return nextJob;
}
