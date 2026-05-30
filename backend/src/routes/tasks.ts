import express from "express";
import Task from "../models/task.js";
import verifyToken from "../middleware/auth.js";

const taskrouter = express.Router();

// ================= CREATE TASK =================
taskrouter.post("/", verifyToken, async (req, res) => {
  try {
    const { title, projectId, priority, dueDate } = req.body;

    const task = new Task({
      title,
      projectId,
      priority: priority || "Medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: false,
    });

    await task.save();

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ msg: "Failed to create task" });
  }
});

// ================= GET TASKS =================
taskrouter.get("/:projectId", verifyToken, async (req, res) => {
  try {
    // ✅ Use lean() for faster plain JSON results
    const tasks = await Task.find({ projectId: req.params.projectId }).lean();

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch tasks" });
  }
});

// ================= UPDATE TASK =================
// ================= UPDATE TASK =================
taskrouter.put("/:taskId", verifyToken, async (req, res) => {
  try {
    const { title, priority, completed, dueDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        ...(title !== undefined && { title }),
        ...(priority !== undefined && { priority }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate }),
      },
      { returnDocument: 'after' }   // ✅ replace new:true with this
    ).lean(); // lean for lighter response

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ msg: "Failed to update task" });
  }
});


// ================= DELETE TASK =================
taskrouter.delete("/:taskId", verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId).lean();

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    return res.status(200).json({ msg: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to delete task" });
  }
});

export default taskrouter;
