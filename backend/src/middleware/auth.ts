import express from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string };

    // ✅ FIX HERE
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyToken;