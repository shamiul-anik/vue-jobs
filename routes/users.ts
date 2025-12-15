import express, { Request, Response, NextFunction, Router } from "express";
import db from "../db/database.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123"; // Fallback for dev

interface UserRegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface UserLoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

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
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /register
router.post(
  "/register",
  registerValidationRules,
  validate,
  (req: UserRegisterRequest, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    db.get(
      "SELECT id FROM users WHERE email = ?",
      [email],
      (err: Error | null, row: any) => {
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
        db.run(
          query,
          [name, email, hash],
          function (this: any, err: Error | null) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
              message: "User registered successfully",
              userId: this.lastID,
            });
          }
        );
      }
    );
  }
);

// POST /login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").exists()],
  validate,
  (req: UserLoginRequest, res: Response) => {
    const { email, password } = req.body;

    // Find user
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err: Error | null, user: any) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
          return res.status(400).json({ error: "Invalid credentials" }); // Generic error for security
        }

        // Compare password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate Token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  }
);

export default router;
