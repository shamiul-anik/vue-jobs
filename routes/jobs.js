const express = require("express");
const router = express.Router();
const db = require("../db/database");

// GET all jobs
router.get("/", (req, res) => {
  const query = "SELECT * FROM jobs ORDER BY created_at DESC";

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
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

const { body, param, validationResult } = require("express-validator");

// Validation Rules
const jobValidationRules = [
  body("type")
    .trim()
    .isIn(["Full-Time", "Part-Time", "Remote", "Internship", "Contract"])
    .withMessage("Invalid job type"),
  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
    .escape(),
  body("salary")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Salary must be less than 50 characters")
    .escape(),
  body("location")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters")
    .escape(),
  body("company_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters")
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
router.post("/", jobValidationRules, validate, (req, res) => {
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
});

// PUT update job
router.put("/:id", jobValidationRules, validate, (req, res) => {
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
        res.status(404).json({ error: "Job not found" });
        return;
      }
      res.json({ message: "Job updated successfully" });
    }
  );
});

// DELETE job
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM jobs WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json({ message: "Job deleted successfully" });
  });
});

module.exports = router;