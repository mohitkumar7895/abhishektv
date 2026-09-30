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
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const SETTINGS = {
  "business.name": "Abhishek LED TV Repair",
  "business.phone": "9990115217",
  "business.whatsapp": "919990115217",
  "business.address": "Shop No 05, Gali No 15, Sector 47, Noida, Uttar Pradesh 201304",
  "business.city": "Noida",
  "business.pincode": "201304",
  "business.maps_url": "https://maps.google.com/?q=Shop+No+05,+Gali+No+15,+Sector+47,+Noida",
  "business.working_hours": "Open 24 hours",
  "contact.emergency": "9990115217",
  "seo.default_title": "Abhishek LED TV Repair | TV Repair in Noida",
  "footer.copyright": `© ${new Date().getFullYear()} Abhishek LED TV Repair. All rights reserved.`,
};

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "tvrepair",
  });

  for (const [key, value] of Object.entries(SETTINGS)) {
    await conn.execute("UPDATE settings SET setting_value = ? WHERE setting_key = ?", [value, key]);
  }

  await conn.execute(
    "UPDATE page_sections SET content = REPLACE(REPLACE(REPLACE(content, 'Helix TV Care', 'Abhishek LED TV Repair'), 'India LED TV Repair Center', 'Abhishek LED TV Repair'), 'tel:+919876543210', 'tel:08510951545')",
  );
  await conn.execute(
    "UPDATE page_sections SET content = REPLACE(content, 'Why households call Helix', 'Why households choose us')",
  );
  await conn.execute(
    "UPDATE pages SET title = REPLACE(REPLACE(title, 'Helix TV Care', 'Abhishek LED TV Repair'), 'India LED TV Repair Center', 'Abhishek LED TV Repair'), excerpt = REPLACE(REPLACE(excerpt, 'Helix TV Care', 'Abhishek LED TV Repair'), 'India LED TV Repair Center', 'Abhishek LED TV Repair')",
  );
  await conn.execute(
    "UPDATE seo_metadata SET seo_title = REPLACE(REPLACE(seo_title, 'Helix TV Care', 'Abhishek LED TV Repair'), 'India LED TV Repair Center', 'Abhishek LED TV Repair'), og_title = REPLACE(REPLACE(og_title, 'Helix TV Care', 'Abhishek LED TV Repair'), 'India LED TV Repair Center', 'Abhishek LED TV Repair')",
  );

  await conn.end();
  console.log("Business details updated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
