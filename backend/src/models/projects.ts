import mongoose from "mongoose";

export type ProjectType = {
  _id: string;
  name: string;
  userId: string;
};

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Project = mongoose.model<ProjectType>(
  "Project",
  projectSchema
);

export default Project;