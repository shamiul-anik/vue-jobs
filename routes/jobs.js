import express from "express";
// const { body, param, validationResult } = require("express-validator");
import { body, param, validationResult } from "express-validator";
import db from "../db/database.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET all jobs with optional pagination
router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit) || null;
  const page = parseInt(req.query.page) || 1;
  const offset = limit ? (page - 1) * limit : 0;
  const search = req.query.q ? `%${req.query.q}%` : null;

  // Query to get total count
  let countQuery = "SELECT COUNT(*) as total FROM jobs";
  let countParams = [];

  // Query to get paginated jobs
  let jobsQuery = "SELECT * FROM jobs";
  let jobsParams = [];

  if (search) {
    const whereClause =
      " WHERE title LIKE ? OR description LIKE ? OR location LIKE ? OR company_name LIKE ? OR type LIKE ?";
    countQuery += whereClause;
    jobsQuery += whereClause;
    const searchParams = [search, search, search, search, search];
    countParams.push(...searchParams);
    jobsParams.push(...searchParams);
  }

  jobsQuery += " ORDER BY created_at DESC";

  if (limit) {
    jobsQuery += " LIMIT ? OFFSET ?";
    jobsParams.push(limit, offset);
  }

  db.get(countQuery, countParams, (err, countRow) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const total = countRow.total;

    db.all(jobsQuery, jobsParams, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // If no limit, return array for backward compatibility or the full object
      if (!limit && !req.query.page) {
        res.json(rows);
      } else {
        res.json({
          jobs: rows,
          total: total,
          limit: limit,
          page: page,
          totalPages: limit ? Math.ceil(total / limit) : 1,
        });
      }
    });
  });
});

// GET single job by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM jobs WHERE id = ?";

  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json(row);
  });
});

// Validation Rules
const jobValidationRules = [
  body("type")
    .trim()
    .isIn(["Full-Time", "Part-Time", "Remote", "Internship", "Contract"])
    .withMessage("Invalid job type"),
  body("title")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Title must be between 3 and 50 characters")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
    .escape(),
  body("salary")
    .trim()
    .notEmpty()
    .withMessage("Salary is required")
    .isLength({ max: 50 })
    .withMessage("Salary must be less than 50 characters")
    .escape(),
  body("location")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Location must be between 2 and 60 characters")
    .escape(),
  body("company_name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Company name must be between 3 and 50 characters")
    .escape(),
  body("contact_email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("contact_phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage("Invalid phone number format"),
];

// Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST create new job
router.post(
  "/",
  verifyToken,
  requireAdmin,
  jobValidationRules,
  validate,
  (req, res) => {
    const {
      type,
      title,
      description,
      salary,
      location,
      company_name,
      company_description,
      contact_email,
      contact_phone,
    } = req.body;

    const query = `
    INSERT INTO jobs (type, title, description, salary, location, company_name, company_description, contact_email, contact_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.run(
      query,
      [
        type,
        title,
        description,
        salary,
        location,
        company_name,
        company_description,
        contact_email,
        contact_phone,
      ],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res
          .status(201)
          .json({ id: this.lastID, message: "Job created successfully" });
      }
    );
  }
);

// PUT update job
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  jobValidationRules,
  validate,
  (req, res) => {
    const { id } = req.params;
    const {
      type,
      title,
      description,
      salary,
      location,
      company_name,
      company_description,
      contact_email,
      contact_phone,
    } = req.body;

    const query = `
    UPDATE jobs 
    SET type = ?, title = ?, description = ?, salary = ?, location = ?, 
        company_name = ?, company_description = ?, contact_email = ?, contact_phone = ?
    WHERE id = ?
  `;

    db.run(
      query,
      [
        type,
        title,
        description,
        salary,
        location,
        company_name,
        company_description,
        contact_email,
        contact_phone,
        id,
      ],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        if (this.changes === 0) {
          res.status(404).json({ error: "Job not found!" });
          return;
        }
        res.json({ message: "Job updated successfully!" });
      }
    );
  }
);

// DELETE job
router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM jobs WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Job not found!" });
      return;
    }
    res.json({ message: "Job deleted successfully!" });
  });
});

// module.exports = router;
export default router;
