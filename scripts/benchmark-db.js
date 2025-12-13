const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "db", "benchmark.db");

// Remove existing benchmark db
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

const db = new sqlite3.Database(DB_PATH);

const ITERATIONS = 10000;

console.log(`Starting benchmark with ${ITERATIONS} iterations...`);

db.serialize(() => {
  // 1. Setup
  const startSetup = Date.now();
  db.run("PRAGMA journal_mode = WAL;");
  db.run("PRAGMA synchronous = NORMAL;");
  db.run(
    "CREATE TABLE test (id INTEGER PRIMARY KEY, value TEXT, created_at DATETIME)"
  );
  console.log(`Setup took: ${Date.now() - startSetup}ms`);

  // 2. Write Performance (Inserts)
  const startWrite = Date.now();
  db.run("BEGIN TRANSACTION");
  const stmt = db.prepare("INSERT INTO test (value, created_at) VALUES (?, ?)");
  for (let i = 0; i < ITERATIONS; i++) {
    stmt.run(`value-${i}`, new Date().toISOString());
  }
  stmt.finalize();
  db.run("COMMIT", () => {
    const writeTime = Date.now() - startWrite;
    console.log(`\nWRITE PERFORMANCE:`);
    console.log(`Inserted ${ITERATIONS} records in ${writeTime}ms`);
    console.log(`Ops/sec: ${Math.floor(ITERATIONS / (writeTime / 1000))}`);
  });

  // 3. Read Performance (Selects)
  db.all("SELECT * FROM test LIMIT 1000", [], (err, rows) => {
    const startRead = Date.now();
    let readCount = 0;

    // Simulate multiple read queries
    const readIterations = 1000;
    const readStmt = db.prepare("SELECT * FROM test WHERE id = ?");

    for (let i = 1; i <= readIterations; i++) {
      readStmt.get(Math.floor(Math.random() * ITERATIONS), (err, row) => {
        readCount++;
        if (readCount === readIterations) {
          const readTime = Date.now() - startRead;
          console.log(`\nREAD PERFORMANCE:`);
          console.log(
            `Performed ${readIterations} random reads in ${readTime}ms`
          );
          console.log(
            `Ops/sec: ${Math.floor(readIterations / (readTime / 1000))}`
          );

          // Cleanup
          readStmt.finalize();
          db.close();
          fs.unlinkSync(DB_PATH);
        }
      });
    }
  });
});
