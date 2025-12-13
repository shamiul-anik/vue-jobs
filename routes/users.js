const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Validation Rules for Registration
const registerValidationRules = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /register
router.post("/register", registerValidationRules, validate, (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (row) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Insert new user (default role: 'user')
    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
    db.run(query, [name, email, hash], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "User registered successfully",
        userId: this.lastID,
      });
    });
  });
});

module.exports = router;
