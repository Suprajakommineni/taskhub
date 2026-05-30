import express from "express";
import Project from "../models/projects.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

/**
 * CREATE PROJECT
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const project = new Project({
      name: req.body.name,
      userId,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
});

/**
 * GET ALL PROJECTS (USER SPECIFIC)
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    // ✅ Use lean() for faster plain JSON results
    const projects = await Project.find({ userId }).lean();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

/**
 * GET PROJECT BY ID
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    // ✅ Use lean() for faster lookup
    const project = await Project.findOne({
      _id: req.params.id,
      userId,
    }).lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project" });
  }
});

/**
 * UPDATE PROJECT
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId },
      { name: req.body.name },
      { new: true }
    ).lean(); // ✅ lean for lighter response

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project" });
  }
});

/**
 * DELETE PROJECT
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId,
    }).lean(); // ✅ lean for lighter response

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

export default router;
