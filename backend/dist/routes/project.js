import express from "express";
import Project from "../models/projects.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();
/**
 * CREATE PROJECT
 */
router.post("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const project = new Project({
            name: req.body.name,
            userId,
        });
        await project.save();
        res.status(201).json(project);
    }
    catch (error) {
        console.log("Error creating project:", error);
        res.status(500).json({ message: "Error creating project" });
    }
});
/**
 * GET ALL PROJECTS (USER SPECIFIC)
 */
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const projects = await Project.find({ userId });
        res.json(projects);
    }
    catch (error) {
        console.log("Error fetching projects:", error);
        res.status(500).json({ message: "Error fetching projects" });
    }
});
/**
 * GET PROJECT BY ID
 */
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const project = await Project.findOne({
            _id: req.params.id,
            userId,
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (error) {
        console.log("Error fetching project:", error);
        res.status(500).json({ message: "Error fetching project" });
    }
});
/**
 * UPDATE PROJECT
 */
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const project = await Project.findOneAndUpdate({ _id: req.params.id, userId }, { name: req.body.name }, { new: true });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (error) {
        console.log("Error updating project:", error);
        res.status(500).json({ message: "Error updating project" });
    }
});
/**
 * DELETE PROJECT
 */
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            userId,
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted successfully" });
    }
    catch (error) {
        console.log("Error deleting project:", error);
        res.status(500).json({ message: "Error deleting project" });
    }
});
export default router;
