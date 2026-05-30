import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const router = express.Router();

router.post("/register", 
    [check("firstName", "First name is required").isString().notEmpty(),check("lastName", "Last name is required").isString().notEmpty(),check("email", "Please include a valid email").isEmail(),check("password", "Password must be at least 6 characters").isLength({ min: 6 })],
    async(req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    console.log("REGISTER ROUTE HIT");

    try{
        console.log("BODY:", req.body);

        let user = await User.findOne({
            email: req.body.email
        });

        console.log("AFTER FINDONE");

        if(user){
            return res.status(400).json({
                msg: "User already exists"
            });
        }

        user = new User(req.body);

        console.log("USER CREATED");

        await user.save();

        console.log("USER SAVED");

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "1d" }
        );

        console.log("TOKEN CREATED");

        return res.status(201).json({
            token,
            msg: "User registered successfully"
        });

    } catch (error) {
  console.log(" REGISTER ERROR:", error);

  return res.status(500).json({
    message: error instanceof Error ? error.message : error,
  });
}
});
export default router;