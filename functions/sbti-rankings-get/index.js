const tcb = require("@cloudbase/node-sdk");

const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const db = app.database();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

exports.main = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  try {
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

    const snapshot = {
      totalSubmissions,
      updatedAt: new Date().toISOString(),
      entries: rankedEntries,
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(snapshot),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
