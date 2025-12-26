import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import jobsRouter from "./routes/jobs.js";
import usersRouter from "./routes/users.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { performBackup } from "./scripts/backup-db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://us.i.posthog.com",
          "https://us.posthog.com",
        ],
        "connect-src": [
          "'self'",
          "https://us.i.posthog.com",
          "https://us.posthog.com",
        ],
        "img-src": [
          "'self'",
          "data:",
          "https://us.i.posthog.com",
          "https://us.posthog.com",
        ],
      },
    },
  })
);

// Rate Limiting for Reads
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Stricter Rate Limiting for Writes
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message:
    "Too many write requests from this IP. Please try again after 15 minutes.",
});
app.use("/api/jobs", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow dev servers
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use("/api/jobs", jobsRouter);
app.use("/api/users", usersRouter);

// Static files for production
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Fallback for SPA (Vue Router)
app.get("*path", (req, res) => {
  if (req.path.startsWith("/api/"))
    return res.status(404).json({ error: "API route not found" });
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/jobs`);

  // Start automatic database backup every 24 hours (for testing/confirmation)
  // To change to 24 hours later: 24 * 60 * 60 * 1000
  const BACKUP_INTERVAL = 24 * 60 * 60 * 1000;
  setInterval(async () => {
    try {
      await performBackup();
    } catch (err) {
      console.error("❌ Automatic backup failed:", err.message);
    }
  }, BACKUP_INTERVAL);

  console.log(`🕒 Automatic backup scheduled every 24 hours.`);
});
