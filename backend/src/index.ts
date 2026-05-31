import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/users.js";
import loginRouter from "./routes/login.js";
import projectrouter from "./routes/project.js";
import taskrouter from "./routes/tasks.js";




mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(async () => {
    console.log("Connected to MongoDB");
    
  })
  .catch((err) => console.error(" Could not connect to MongoDB", err));


const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
}));


app.use(express.urlencoded({extended: true}));


app.use("/users", router);
app.use("/users", loginRouter);
app.use("/projects", projectrouter);
app.use("/tasks", taskrouter);
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


app.listen(5000, () => {
  console.log("Server is running on port 5000");
}
);
export default app;