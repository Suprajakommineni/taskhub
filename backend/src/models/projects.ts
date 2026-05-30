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
      trim: true, // ✅ removes accidental spaces
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ ensures fast lookups by userId
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

// ✅ Index for user-specific queries
projectSchema.index({ userId: 1 });

const Project = mongoose.model<ProjectType>("Project", projectSchema);
export default Project;
