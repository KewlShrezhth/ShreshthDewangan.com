import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Load .env.local first.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

const sql = readFileSync(path.join(__dirname, "schema.sql"), "utf8");

try {
  await pool.query(sql);
  console.log("Schema applied successfully.");
} catch (err) {
  console.error("Migration failed:", err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
