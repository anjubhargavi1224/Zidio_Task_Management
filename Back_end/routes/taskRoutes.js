const express = require("express");
const Task = require ("../models/Task.js");
const { verifyToken, isAdmin } =  require("../middleware/auth.js"); // Middleware for authentication

const router = express.Router();

// ✅ Admin creates and assigns a task
router.post("/create", verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, description, startDate, endDate, assignedTo } = req.body;

        const newTask = new Task({
            title,
            description,
            startDate,
            endDate,
            createdBy: req.user.id,
            assignedTo: assignedTo || null, // If assignedTo is provided, it's assigned; otherwise, it's unassigned.
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ User creates a task for themselves
router.post("/create/self", verifyToken, async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body;

        const newTask = new Task({
            title,
            description,
            startDate,
            endDate,
            createdBy: req.user.id,
            assignedTo: req.user.id, // Assign the task to the user who created it
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all tasks (Admin can see all, users see only their tasks)
router.get("/", verifyToken, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find().populate("createdBy assignedTo", "username email");
        } else {
            tasks = await Task.find({ assignedTo: req.user.id }).populate("createdBy assignedTo", "username email");
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update task status
router.put("/update/status/:taskId", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.taskId);

        if (!task) return res.status(404).json({ error: "Task not found" });

        // Only the assigned user or admin can update status
        if (req.user.id !== task.assignedTo.toString() && req.user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized to update this task" });
        }

        task.status = status;
        await task.save();

        res.status(200).json({ message: "Task status updated", task });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a task (only admin or task creator can delete)
router.delete("/delete/:taskId", verifyToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        // Only admin or the creator can delete
        if (req.user.role !== "admin" && req.user.id !== task.createdBy.toString()) {
            return res.status(403).json({ error: "Unauthorized to delete this task" });
        }

        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/update/:taskId", verifyToken, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, startDate, endDate, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, startDate, endDate, status },
            { new: true } // Return updated task
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
});

module.exports= router;
