import mongoose from "mongoose";

export type TaskType = {
  _id: string;
  title: string;
  projectId: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
};

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // ✅ removes accidental spaces
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true, // ✅ ensures fast lookups by projectId
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false, // ✅ default handled at schema level
      index: true,    // ✅ speeds up queries filtering by completed status
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);


const Task = mongoose.model<TaskType>("Task", taskSchema);
export default Task;
