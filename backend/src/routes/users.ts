import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : error });
  }
});

// ✅ Register new user
router.post(
  "/register",
  [
    check("firstName", "First name is required").isString().notEmpty(),
    check("lastName", "Last name is required").isString().notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req:express.Request, res:express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      let user = await User.findOne({ email: req.body.email }).lean();
      if (user) return res.status(400).json({ msg: "User already exists" });

      const newUser = new User(req.body);
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.status(201).json({ token, msg: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
  }
);

export default router;
