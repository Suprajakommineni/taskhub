import mongoose from "mongoose";

export type ProjectType = {
  _id: string;
  name: string;
  userId: string;
};

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // ✅ removes extra spaces
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ speeds up queries by userId
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

// ✅ Index for faster lookups by userId


const Project = mongoose.model<ProjectType>("Project", projectSchema);

export default Project;
