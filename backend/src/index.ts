import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import loginRouter from "./routes/login.js";
import projectRouter from "./routes/project.js";
import taskRouter from "./routes/tasks.js";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Could not connect to MongoDB", err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS: allow all vercel.app subdomains
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// ✅ Mount routers
app.use("/users", usersRouter);
app.use("/users", loginRouter);
app.use("/projects", projectRouter);
app.use("/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});

export default app;
