import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Promisified SQLite Database Wrapper
 */
class AsyncDatabase {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

async function migrate() {
  const sourcePathArg = process.argv[2];
  const destPath = path.join(__dirname, "..", "db", "database.db");

  if (!sourcePathArg) {
    console.error("Usage: npm run db:import <path-to-source-db>");
    process.exit(1);
  }

  const absoluteSourcePath = path.isAbsolute(sourcePathArg)
    ? sourcePathArg
    : path.resolve(process.cwd(), sourcePathArg);

  if (!fs.existsSync(absoluteSourcePath)) {
    console.error(`Error: Source database not found at ${absoluteSourcePath}`);
    process.exit(1);
  }

  console.log(`🚀 Starting Migration: `);
  console.log(`Source: ${absoluteSourcePath}`);
  console.log(`Destination: ${destPath}\n`);

  const sourceDb = new AsyncDatabase(absoluteSourcePath);
  const destDb = new AsyncDatabase(destPath);

  const tables = ["users", "jobs"];

  try {
    for (const table of tables) {
      console.log(`⏳ Processing Table: '${table}'...`);

      const rows = await sourceDb.all(`SELECT * FROM ${table}`).catch((err) => {
        if (err.message.includes("no such table")) {
          console.warn(`⚠️  Skipping table '${table}': Not found in source.`);
          return null;
        }
        throw err;
      });

      if (!rows) continue;

      if (rows.length === 0) {
        console.log(`ℹ️  Table '${table}' is empty in source.`);
        continue;
      }

      console.log(
        `📦 Found ${rows.length} records in '${table}'. Migrating...`
      );

      let importedCount = 0;
      let skippedCount = 0;

      // Use a transaction for each table to ensure atomicity
      await destDb.run("BEGIN TRANSACTION");

      try {
        for (const row of rows) {
          const keys = Object.keys(row);
          const columns = keys.join(", ");
          const placeholders = keys.map(() => "?").join(", ");
          const values = Object.values(row);

          const query = `INSERT OR IGNORE INTO ${table} (${columns}) VALUES (${placeholders})`;
          const result = await destDb.run(query, values);

          if (result.changes > 0) {
            importedCount++;
          } else {
            skippedCount++;
          }
        }
        await destDb.run("COMMIT");
        console.log(
          `✅ Table '${table}' complete: ${importedCount} imported, ${skippedCount} skipped (duplicates).\n`
        );
      } catch (err) {
        await destDb.run("ROLLBACK");
        console.error(`❌ Failed to migrate table '${table}':`, err.message);
        throw err;
      }
    }

    console.log("✨ Migration process finished successfully.");
  } catch (error) {
    console.error("\n❌ Global migration error:", error.message);
    process.exit(1);
  } finally {
    await sourceDb.close();
    await destDb.close();
  }
}

migrate();
