const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    process.env[key] = value;
  }
}

loadEnv();

async function main() {
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "tvrepair";

  console.log(`Connecting to ${host}:${port}/${database}...`);
  const conn = await mysql.createConnection({ host, port, user, password, database });

  console.log("\n--- Checking current settings ---");
  const [settings] = await conn.execute("SELECT setting_key, setting_value FROM settings");
  for (const s of settings) {
    if (s.setting_value && (s.setting_value.includes("India") || s.setting_key.includes("title") || s.setting_key.includes("business.name"))) {
      console.log(`Setting: ${s.setting_key} = ${s.setting_value}`);
    }
  }

  console.log("\n--- Updating settings ---");
  // Replace India LED TV Repair Center / India LED TV Repair with Abhishek LED TV Repair
  await conn.execute("UPDATE settings SET setting_value = REPLACE(setting_value, 'India LED TV Repair Center', 'Abhishek LED TV Repair') WHERE setting_value LIKE '%India LED TV Repair Center%'");
  await conn.execute("UPDATE settings SET setting_value = REPLACE(setting_value, 'India LED TV Repair', 'Abhishek LED TV Repair') WHERE setting_value LIKE '%India LED TV Repair%'");
  await conn.execute("UPDATE settings SET setting_value = REPLACE(setting_value, 'INDIA LED TV REPAIR', 'Abhishek LED TV Repair') WHERE setting_value LIKE '%INDIA LED TV REPAIR%'");

  // Ensure business.name is Abhishek LED TV Repair
  await conn.execute("UPDATE settings SET setting_value = 'Abhishek LED TV Repair' WHERE setting_key = 'business.name'");

  console.log("\n--- Updating seo_metadata ---");
  const [seoBefore] = await conn.execute("SELECT id, seo_title, og_title, twitter_title FROM seo_metadata WHERE seo_title LIKE '%India%' OR og_title LIKE '%India%' OR twitter_title LIKE '%India%'");
  console.log(`Found ${seoBefore.length} seo_metadata rows to update.`);
  for (const row of seoBefore) {
    console.log(`SEO row ${row.id}: ${row.seo_title}`);
  }

  await conn.execute("UPDATE seo_metadata SET seo_title = REPLACE(seo_title, 'India LED TV Repair Center', 'Abhishek LED TV Repair') WHERE seo_title LIKE '%India LED TV Repair Center%'");
  await conn.execute("UPDATE seo_metadata SET seo_title = REPLACE(seo_title, 'India LED TV Repair', 'Abhishek LED TV Repair') WHERE seo_title LIKE '%India LED TV Repair%'");
  await conn.execute("UPDATE seo_metadata SET seo_title = REPLACE(seo_title, 'INDIA LED TV REPAIR', 'Abhishek LED TV Repair') WHERE seo_title LIKE '%INDIA LED TV REPAIR%'");

  await conn.execute("UPDATE seo_metadata SET og_title = REPLACE(og_title, 'India LED TV Repair Center', 'Abhishek LED TV Repair') WHERE og_title LIKE '%India LED TV Repair Center%'");
  await conn.execute("UPDATE seo_metadata SET og_title = REPLACE(og_title, 'India LED TV Repair', 'Abhishek LED TV Repair') WHERE og_title LIKE '%India LED TV Repair%'");

  await conn.execute("UPDATE seo_metadata SET twitter_title = REPLACE(twitter_title, 'India LED TV Repair Center', 'Abhishek LED TV Repair') WHERE twitter_title LIKE '%India LED TV Repair Center%'");
  await conn.execute("UPDATE seo_metadata SET twitter_title = REPLACE(twitter_title, 'India LED TV Repair', 'Abhishek LED TV Repair') WHERE twitter_title LIKE '%India LED TV Repair%'");

  console.log("\n--- Updating pages titles ---");
  await conn.execute("UPDATE pages SET title = REPLACE(title, 'India LED TV Repair Center', 'Abhishek LED TV Repair'), excerpt = REPLACE(excerpt, 'India LED TV Repair Center', 'Abhishek LED TV Repair')");
  await conn.execute("UPDATE pages SET title = REPLACE(title, 'India LED TV Repair', 'Abhishek LED TV Repair'), excerpt = REPLACE(excerpt, 'India LED TV Repair', 'Abhishek LED TV Repair')");

  console.log("\n--- Updating page_sections content ---");
  await conn.execute("UPDATE page_sections SET content = REPLACE(content, 'India LED TV Repair Center', 'Abhishek LED TV Repair')");
  await conn.execute("UPDATE page_sections SET content = REPLACE(content, 'India LED TV Repair', 'Abhishek LED TV Repair')");
  await conn.execute("UPDATE page_sections SET content = REPLACE(content, 'INDIA LED TV REPAIR CENTER', 'ABHISHEK LED TV REPAIR')");
  await conn.execute("UPDATE page_sections SET content = REPLACE(content, 'INDIA LED TV REPAIR', 'ABHISHEK LED TV REPAIR')");

  console.log("\n--- Verification after update ---");
  const [seoAfter] = await conn.execute("SELECT id, seo_title FROM seo_metadata LIMIT 10");
  console.log("Sample SEO titles after update:");
  console.table(seoAfter);

  const [settingsAfter] = await conn.execute("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('business.name', 'seo.default_title', 'footer.copyright')");
  console.log("Key settings after update:");
  console.table(settingsAfter);

  await conn.end();
  console.log("Successfully updated database titles to 'Abhishek LED TV Repair'!");
}

main().catch(console.error);
