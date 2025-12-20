import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "db", "database.db");
const BACKUP_DIR = path.join(__dirname, "..", "db", "db_backup");

/**
 * Ensures the backup directory exists.
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
  }
}

/**
 * Generates a timestamped backup filename: YYYY_MM_DD_HH_MM_SS_database.db
 */
function getBackupFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}_database.db`;
}

/**
 * Performs a safe backup by checkpointing WAL and then copying the file.
 */
export async function performBackup() {
  console.log("🚀 Starting database backup...");

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("❌ Error opening database for backup:", err.message);
        return reject(err);
      }

      // 1. Checkpoint WAL to ensure all data is in the main .db file
      db.run("PRAGMA wal_checkpoint(TRUNCATE);", (err) => {
        if (err) {
          console.error("❌ Error check pointing WAL:", err.message);
          db.close();
          return reject(err);
        }

        console.log("✅ WAL checkpoint complete.");

        // 2. Close connection before copying to ensure no locks
        db.close((err) => {
          if (err) {
            console.error("❌ Error closing database:", err.message);
            return reject(err);
          }

          try {
            ensureBackupDir();
            const filename = getBackupFilename();
            const destination = path.join(BACKUP_DIR, filename);

            fs.copyFileSync(DB_PATH, destination);

            console.log(`✨ Backup successful! Saved to: ${destination}`);
            resolve(destination);
          } catch (copyErr) {
            console.error("❌ Error copying database file:", copyErr.message);
            reject(copyErr);
          }
        });
      });
    });
  });
}

// If run directly via node
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  performBackup().catch(() => process.exit(1));
}
