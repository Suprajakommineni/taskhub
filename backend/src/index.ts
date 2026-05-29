import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/users.ts";
import loginRouter from "./routes/login.ts";
import projectrouter from "./routes/project.ts";
import taskrouter from "./routes/tasks.ts";



mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));


app.use("/users", router);
app.use("/users", loginRouter);
app.use("/projects", projectrouter);
app.use("/tasks", taskrouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
}
);
export default app;