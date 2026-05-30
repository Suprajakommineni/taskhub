import express from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/login',
  [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // ✅ Use lean() for faster plain JSON result
      const user = await User.findOne({ email }).lean();

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // ✅ bcrypt.compare still works fine with lean() since we only need user.password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // ✅ Generate JWT
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1d' }
      );

      return res.json({ token, msg: 'Login successful' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
