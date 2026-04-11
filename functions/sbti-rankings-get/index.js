const tcb = require("@cloudbase/node-sdk");

const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const db = app.database();

exports.main = async () => {
  const { data: entries } = await db
    .collection("sbti-rankings")
    .orderBy("count", "desc")
    .limit(50)
    .get();

  const totalSubmissions = entries.reduce(
    (sum, entry) => sum + (entry.count || 0),
    0
  );

  const rankedEntries = entries.map((entry, index) => ({
    typeCode: entry.typeCode,
    slug: entry.slug,
    cn: entry.cn,
    count: entry.count || 0,
    rank: index + 1,
    share:
      totalSubmissions === 0
        ? 0
        : Number(((entry.count || 0) / totalSubmissions).toFixed(4)),
  }));

  return {
    totalSubmissions,
    updatedAt: new Date().toISOString(),
    entries: rankedEntries,
  };
};
