import express from "express";
import jwt from "jsonwebtoken";

const verifyToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // ✅ safer split

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string };

    // ✅ Attach user info to request
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
