import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = process.argv[2];
const destPath = path.join(__dirname, "..", "db", "database.db");

if (!sourcePath) {
  console.error("Usage: npm run db:import <path-to-source-db>");
  process.exit(1);
}

const absoluteSourcePath = path.isAbsolute(sourcePath)
  ? sourcePath
  : path.resolve(process.cwd(), sourcePath);

if (!fs.existsSync(absoluteSourcePath)) {
  console.error(`Error: Source database not found at ${absoluteSourcePath}`);
  process.exit(1);
}

console.log(`🚀 Starting migration:`);
console.log(`Source: ${absoluteSourcePath}`);
console.log(`Destination: ${destPath}`);

const sourceDb = new sqlite3.Database(absoluteSourcePath);
const destDb = new sqlite3.Database(destPath);

const tables = ["users", "jobs"];

destDb.serialize(() => {
  tables.forEach((table) => {
    sourceDb.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) {
        if (err.message.includes("no such table")) {
          console.warn(`⚠️  Skipping table '${table}': Not found in source.`);
        } else {
          console.error(`❌ Error reading from ${table}:`, err.message);
        }
        return;
      }

      if (rows.length === 0) {
        console.log(`ℹ️  Table '${table}' is empty in source.`);
        return;
      }

      console.log(
        `📦 Found ${rows.length} records in '${table}'. Migrating...`
      );

      rows.forEach((row) => {
        const columns = Object.keys(row).join(", ");
        const placeholders = Object.keys(row)
          .map(() => "?")
          .join(", ");
        const values = Object.values(row);

        // Usage of IGNORE to skip duplicates based on UNIQUE constraints (like email) or Primary Keys
        const query = `INSERT OR IGNORE INTO ${table} (${columns}) VALUES (${placeholders})`;

        destDb.run(query, values, (err) => {
          if (err) {
            console.error(`❌ Error inserting into ${table}:`, err.message);
          }
        });
      });

      console.log(`✅ Finished processing '${table}'.`);
    });
  });
});

// Close connections after a short delay to allow async operations to finish
// In a production script we'd use promises/async-await for better control
setTimeout(() => {
  sourceDb.close();
  destDb.close();
  console.log("\n✨ Migration process complete.");
}, 2000);
