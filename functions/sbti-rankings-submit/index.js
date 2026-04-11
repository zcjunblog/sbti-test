const tcb = require("@cloudbase/node-sdk");

const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const db = app.database();
const _ = db.command;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// All 27 valid type codes
const VALID_TYPES = new Set([
  "CTRL", "ATM-er", "Dior-s", "BOSS", "THAN-K", "OH-NO",
  "GOGO", "SEXY", "LOVE-R", "MUM", "FAKE", "OJBK",
  "MALO", "JOKE-R", "WOC!", "THIN-K", "SHIT", "ZZZZ",
  "POOR", "MONK", "IMSB", "SOLO", "FUCK", "DEAD",
  "IMFW", "HHHH", "DRUNK",
]);

exports.main = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  try {
    let body;
    try {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
    } catch {
      body = {};
    }

    const submissionId = (body.submissionId || "").trim();
    const finalTypeCode = (body.finalTypeCode || "").trim();

    if (!submissionId || !finalTypeCode) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ accepted: false, reason: "invalid_payload" }),
      };
    }

    if (!VALID_TYPES.has(finalTypeCode)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ accepted: false, reason: "invalid_type" }),
      };
    }

    // Dedup: use submissionId as _id, rely on unique constraint
    try {
      await db.collection("sbti-submissions").add({
        _id: submissionId,
        typeCode: finalTypeCode,
        submittedAt: new Date().toISOString(),
      });
    } catch (err) {
      // Duplicate _id means already submitted
      if (err.code === "DATABASE_DUPLICATE_KEY" || (err.message && err.message.includes("duplicate"))) {
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({ accepted: false, reason: "duplicate" }),
        };
      }
      throw err;
    }

    // Atomic increment
    await db
      .collection("sbti-rankings")
      .where({ typeCode: finalTypeCode })
      .update({ count: _.inc(1) });

    // Read back updated rankings to compute rank
    const { data: entries } = await db
      .collection("sbti-rankings")
      .orderBy("count", "desc")
      .limit(50)
      .get();

    const entry = entries.find((e) => e.typeCode === finalTypeCode);
    const rank = entries.findIndex((e) => e.typeCode === finalTypeCode) + 1;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        accepted: true,
        entry: {
          typeCode: finalTypeCode,
          slug: entry?.slug || "",
          cn: entry?.cn || "",
          count: entry?.count || 0,
          rank,
          share: 0,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ accepted: false, reason: "invalid_payload" }),
    };
  }
};
