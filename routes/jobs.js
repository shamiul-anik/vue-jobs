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

// POST create new job
router.post("/", (req, res) => {
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

  // Validation
  if (!type || !title || !location || !contact_email) {
    res
      .status(400)
      .json({
        error: "Missing required fields: type, title, location, contact_email",
      });
    return;
  }

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
router.put("/:id", (req, res) => {
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
