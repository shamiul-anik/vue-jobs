# Database Security Guide for Vue Jobs Application

## Overview

This guide provides comprehensive security measures to protect your SQLite database and API endpoints.

## 1. Environment Variables & Configuration

### Create `.env` file

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
DB_PATH=./db/database.db

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-session-secret-change-this
API_RATE_LIMIT=100

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Install required packages

```bash
npm install dotenv helmet express-rate-limit express-validator jsonwebtoken bcryptjs
```

## 2. SQL Injection Prevention

**✅ GOOD - Your current code already uses parameterized queries:**

```javascript
// db/database.js - Already secure!
stmt.run(
  job.type,
  job.title,
  job.description
  // ... parameters
);
```

**❌ BAD - Never do this:**

```javascript
// NEVER concatenate user input directly
db.run(`INSERT INTO jobs VALUES ('${userInput}')`); // VULNERABLE!
```

## 3. Input Validation & Sanitization

### Update `routes/jobs.js` with validation:

```javascript
const { body, param, validationResult } = require("express-validator");

// Validation middleware
const validateJob = [
  body("type").trim().isIn(["Full-Time", "Part-Time", "Remote", "Internship"]),
  body("title").trim().isLength({ min: 3, max: 100 }).escape(),
  body("description").trim().isLength({ min: 10, max: 5000 }).escape(),
  body("salary").trim().isLength({ max: 50 }),
  body("location").trim().isLength({ min: 2, max: 100 }).escape(),
  body("company_name").trim().isLength({ min: 2, max: 100 }).escape(),
  body("contact_email").trim().isEmail().normalizeEmail(),
  body("contact_phone")
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/),
];

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Apply to routes
router.post("/", validateJob, checkValidation, (req, res) => {
  // Your existing code
});
```

## 4. Authentication & Authorization

### Create User Authentication System

#### Add users table to `db/database.js`:

```javascript
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
```

#### Create `middleware/auth.js`:

```javascript
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role && req.user.role !== "admin") {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticateToken, requireRole };
```

## 5. Rate Limiting

### Update `server.js`:

```javascript
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

// Stricter limit for POST/PUT/DELETE
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

app.use("/api/jobs", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return strictLimiter(req, res, next);
  }
  next();
});
```

## 6. CORS Configuration

### Secure CORS in `server.js`:

```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

## 7. File Permissions & Database Location

### Secure database file permissions (Linux/Mac):

```bash
chmod 600 db/database.db
chmod 700 db/
```

### Windows (PowerShell):

```powershell
icacls "db\database.db" /inheritance:r /grant:r "%USERNAME%:(R,W)"
```

### Move database outside web root in production:

```javascript
// db/database.js
const dbPath =
  process.env.DB_PATH ||
  path.join(__dirname, "..", "..", "data", "database.db");
```

## 8. Backup Strategy

### Create `scripts/backup-db.js`:

```javascript
const fs = require("fs");
const path = require("path");

const backupDatabase = () => {
  const dbPath = path.join(__dirname, "..", "db", "database.db");
  const backupDir = path.join(__dirname, "..", "backups");
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const backupPath = path.join(backupDir, `database-${timestamp}.db`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  fs.copyFileSync(dbPath, backupPath);
  console.log(`Database backed up to: ${backupPath}`);

  // Keep only last 7 backups
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith("database-"))
    .sort()
    .reverse();

  files.slice(7).forEach((f) => {
    fs.unlinkSync(path.join(backupDir, f));
  });
};

backupDatabase();
```

### Add to `package.json`:

```json
{
  "scripts": {
    "backup": "node scripts/backup-db.js"
  }
}
```

## 9. Logging & Monitoring

### Create `middleware/logger.js`:

```javascript
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "logs", "access.log");

const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${
    req.ip
  }\n`;

  fs.appendFile(logFile, log, (err) => {
    if (err) console.error("Logging error:", err);
  });

  next();
};

module.exports = logger;
```

## 10. Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Enable rate limiting
- [ ] Implement authentication for sensitive endpoints
- [ ] Regular database backups (automated)
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Use prepared statements (already doing ✅)
- [ ] Validate all user inputs
- [ ] Set proper file permissions
- [ ] Never commit `.env` to git (add to `.gitignore`)
- [ ] Use environment variables for secrets
- [ ] Implement request logging
- [ ] Add database encryption at rest (for sensitive data)

## 11. Additional Security Measures

### Add to `.gitignore`:

```
.env
*.db
backups/
logs/
node_modules/
```

### Helmet.js Security Headers:

```javascript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);
```

## 12. Database Encryption (Optional)

For highly sensitive data, consider using SQLCipher:

```bash
npm install @journeyapps/sqlcipher
```

```javascript
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const db = new sqlite3.Database(dbPath);
db.run(`PRAGMA key = '${process.env.DB_ENCRYPTION_KEY}'`);
```

## Summary

Your current implementation already has **good SQL injection protection** through parameterized queries. The main improvements needed are:

1. ✅ **Input validation** - Validate and sanitize all user inputs
2. ✅ **Authentication** - Add JWT-based authentication
3. ✅ **Rate limiting** - Prevent abuse
4. ✅ **Environment variables** - Secure configuration
5. ✅ **Backups** - Regular automated backups
6. ✅ **Logging** - Monitor access and errors
7. ✅ **File permissions** - Restrict database file access
8. ✅ **HTTPS** - Use in production

Start with input validation and rate limiting as your immediate priorities!
