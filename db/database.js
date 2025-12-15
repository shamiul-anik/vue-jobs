import sqlite3Module from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlite3 = sqlite3Module.verbose();
const dbPath = path.join(__dirname, "database.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");

    // Performance Optimizations
    db.run("PRAGMA journal_mode = WAL;"); // Enable Write-Ahead Logging for concurrency
    db.run("PRAGMA synchronous = NORMAL;"); // Reduce fsyncs for better write performance

    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Create Jobs Table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        salary TEXT,
        location TEXT NOT NULL,
        company_name TEXT,
        company_description TEXT,
        contact_email TEXT NOT NULL,
        contact_phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating jobs table:", err.message);
        } else {
          console.log("Jobs table ready");
        }
      }
    );

    // Create Users Table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating users table:", err.message);
        } else {
          console.log("Users table ready");
          insertAdminUser();
          insertTestUser();
        }
      }
    );

    // Create Index on created_at for faster sorting (ORDER BY created_at DESC)
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at)`,
      (err) => {
        if (err) {
          console.error("Error creating index:", err.message);
        } else {
          console.log("Index on created_at ready");
          insertSampleData();
        }
      }
    );
  });
}

// const bcrypt = require("bcryptjs");

function insertAdminUser() {
  const adminEmail = "admin@mail.com";
  db.get("SELECT id FROM users WHERE email = ?", [adminEmail], (err, row) => {
    if (err) {
      console.error("Error checking admin user:", err.message);
      return;
    }

    if (!row) {
      const password = "admin";
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Admin", adminEmail, hash, "admin"],
        (err) => {
          if (err) {
            console.error("Error creating admin user:", err.message);
          } else {
            console.log("Admin user created successfully");
          }
        }
      );
    }
  });
}

function insertTestUser() {
  const testEmail = "test@mail.com";
  db.get("SELECT id FROM users WHERE email = ?", [testEmail], (err, row) => {
    if (err) {
      console.error("Error checking test user:", err.message);
      return;
    }

    if (!row) {
      const password = "testuser";
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Test User", testEmail, hash, "user"],
        (err) => {
          if (err) {
            console.error("Error creating test user:", err.message);
          } else {
            console.log("Test user created successfully");
          }
        }
      );
    }
  });
}

// Insert sample data if table is empty
function insertSampleData() {
  db.get("SELECT COUNT(*) as count FROM jobs", (err, row) => {
    if (err) {
      console.error("Error checking data:", err.message);
      return;
    }

    if (row.count === 0) {
      const sampleJobs = [
        {
          type: "Full-Time",
          title: "Senior Vue Developer",
          description:
            "We are seeking a talented Front-End Developer to join our team in Boston, MA. The ideal candidate will have strong skills in HTML, CSS, and JavaScript, with expertise in Vue.js and modern web development practices.",
          salary: "$70K - $80K / Year",
          location: "Boston, MA",
          company_name: "NewTek Solutions",
          company_description:
            "NewTek Solutions is a leading technology company specializing in web development and digital solutions. We pride ourselves on creating innovative products and fostering a collaborative work environment.",
          contact_email: "contact@newteksolutions.com",
          contact_phone: "555-555-5555",
        },
        {
          type: "Remote",
          title: "Front-End Engineer (Vue)",
          description:
            "Join our team as a Front-End Developer in sunny Miami, FL. We are looking for a motivated individual with a passion for crafting beautiful and functional web applications.",
          salary: "$70K - $80K / Year",
          location: "Miami, FL",
          company_name: "Veneer Solutions",
          company_description:
            "Veneer Solutions is a creative agency focused on delivering exceptional digital experiences. Our team is dedicated to pushing the boundaries of web design and development.",
          contact_email: "contact@veneersolutions.com",
          contact_phone: "555-555-5556",
        },
        {
          type: "Remote",
          title: "Vue.js Developer",
          description:
            "Are you passionate about front-end development? Join our team in vibrant Brooklyn, NY, and work on exciting projects that make a difference.",
          salary: "$70K - $80K / Year",
          location: "Brooklyn, NY",
          company_name: "Dolor Cloud",
          company_description:
            "Dolor Cloud is an innovative startup specializing in cloud-based solutions. We offer a dynamic work environment where creativity and technical excellence thrive.",
          contact_email: "contact@dolorcloud.com",
          contact_phone: "555-555-5557",
        },
        {
          type: "Part-Time",
          title: "Vue Front-End Developer",
          description:
            "Join our team as a Part-Time Front-End Developer in beautiful Phoenix, AZ. We are looking for a self-motivated individual with a passion for creating engaging user interfaces.",
          salary: "$60K - $70K / Year",
          location: "Phoenix, AZ",
          company_name: "Alpha Elite",
          company_description:
            "Alpha Elite is a premier digital agency that partners with businesses to create powerful web solutions. We value innovation and professional growth.",
          contact_email: "contact@alphaelite.com",
          contact_phone: "555-555-5558",
        },
        {
          type: "Full-Time",
          title: "Full Stack Vue Developer",
          description:
            "Exciting opportunity for a Full-Time Front-End Developer in bustling Atlanta, GA. We are seeking a talented individual with expertise in Vue.js and full-stack development.",
          salary: "$90K - $100K / Year",
          location: "Atlanta, GA",
          company_name: "Browning Technologies",
          company_description:
            "Browning Technologies is a rapidly growing tech company focused on developing cutting-edge web applications. Join us to work on challenging projects with a talented team.",
          contact_email: "contact@browningtech.com",
          contact_phone: "555-555-5559",
        },
        {
          type: "Remote",
          title: "Vue Native Developer",
          description:
            "Join our team as a Front-End Developer in beautiful Portland, OR. We are looking for a skilled and enthusiastic individual to help build amazing mobile and web applications.",
          salary: "$100K - $110K / Year",
          location: "Portland, OR",
          company_name: "Port Solutions Inc.",
          company_description:
            "Port Solutions Inc. is a technology company specializing in cross-platform development. We believe in empowering our team members and fostering innovation.",
          contact_email: "contact@portsolutions.com",
          contact_phone: "555-555-5560",
        },
      ];

      const stmt = db.prepare(`
        INSERT INTO jobs (type, title, description, salary, location, company_name, company_description, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      sampleJobs.forEach((job) => {
        stmt.run(
          job.type,
          job.title,
          job.description,
          job.salary,
          job.location,
          job.company_name,
          job.company_description,
          job.contact_email,
          job.contact_phone
        );
      });

      stmt.finalize(() => {
        console.log("Sample data inserted successfully");
      });
    }
  });
}

export default db;
