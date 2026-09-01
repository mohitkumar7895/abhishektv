const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    multipleStatements: true,
  });

  const tables = [
    "users",
    "settings",
    "media",
    "pages",
    "page_sections",
    "services",
    "service_faqs",
    "blog_categories",
    "blogs",
    "blog_tags",
    "blog_tag_map",
    "faqs",
    "testimonials",
    "gallery_images",
    "menus",
    "menu_items",
    "seo_metadata",
    "redirects",
    "leads",
  ];

  await conn.execute("SET FOREIGN_KEY_CHECKS = 0;");

  for (const t of tables) {
    try {
      const [rows] = await conn.execute(`SELECT * FROM \`tvrepair\`.\`${t}\``);
      if (rows.length > 0) {
        await conn.execute(`TRUNCATE TABLE \`abhishek tv\`.\`${t}\``);
        for (const row of rows) {
          const keys = Object.keys(row);
          const values = Object.values(row);
          const placeholders = keys.map(() => "?").join(",");
          const sql = `INSERT INTO \`abhishek tv\`.\`${t}\` (\`${keys.join("`,`")}\`) VALUES (${placeholders})`;
          await conn.execute(sql, values);
        }
      }
      console.log(`Synced table ${t}: ${rows.length} rows`);
    } catch (e) {
      console.error(`Error syncing table ${t}:`, e.message);
    }
  }

  await conn.execute("SET FOREIGN_KEY_CHECKS = 1;");
  await conn.end();
  console.log("Database sync complete!");
}

main().catch(console.error);
