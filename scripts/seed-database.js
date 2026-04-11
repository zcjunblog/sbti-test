/**
 * 数据库种子脚本
 *
 * 将 rankings-seed.json 中的排行榜数据导入到 CloudBase 云数据库。
 *
 * 使用方式：
 *   TCB_ENV_ID=你的环境ID node scripts/seed-database.js
 *
 * 前置条件：
 *   npm install @cloudbase/node-sdk（项目根目录下安装）
 */

const tcb = require("@cloudbase/node-sdk");
const fs = require("fs");
const path = require("path");

const ENV_ID = process.env.TCB_ENV_ID;
const SECRET_ID = process.env.TCB_SECRET_ID;
const SECRET_KEY = process.env.TCB_SECRET_KEY;

if (!ENV_ID) {
  console.error("请设置环境变量，例如：");
  console.error("  TCB_ENV_ID=xxx TCB_SECRET_ID=xxx TCB_SECRET_KEY=xxx node scripts/seed-database.js");
  process.exit(1);
}

const initOptions = { env: ENV_ID };
if (SECRET_ID && SECRET_KEY) {
  initOptions.secretId = SECRET_ID;
  initOptions.secretKey = SECRET_KEY;
}

const app = tcb.init(initOptions);
const db = app.database();

async function main() {
  const seedPath = path.join(__dirname, "../src/data/rankings-seed.json");
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

  console.log(`读取到 ${seed.entries.length} 条排行榜种子数据`);
  console.log(`总提交数：${seed.totalSubmissions}`);

  // Seed rankings collection
  console.log("\n正在写入 rankings 集合...");
  for (const entry of seed.entries) {
    try {
      await db.collection("sbti-rankings").doc(entry.typeCode).set({
        typeCode: entry.typeCode,
        slug: entry.slug,
        cn: entry.cn,
        count: entry.count,
      });
      console.log(`  ✓ ${entry.typeCode} (${entry.cn}) - ${entry.count} 人`);
    } catch (err) {
      console.error(`  ✗ ${entry.typeCode}: ${err.message}`);
    }
  }

  // Ensure submissions collection exists
  console.log("\n确保 submissions 集合存在...");
  try {
    await db.createCollection("sbti-submissions");
    console.log("  ✓ submissions 集合已创建");
  } catch (err) {
    if (err.message && err.message.includes("already exists")) {
      console.log("  ✓ submissions 集合已存在");
    } else {
      console.error(`  ✗ ${err.message}`);
    }
  }

  console.log("\n种子数据导入完成！");
}

main().catch((err) => {
  console.error("导入失败：", err);
  process.exit(1);
});
