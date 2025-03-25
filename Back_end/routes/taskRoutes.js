const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/authMiddleware');

// Get tasks of logged-in user
router.get('/mytasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new task for logged-in user
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;
    const newTask = new Task({
      userId: req.user.id,
      title,
      description,
      startDate,
      endDate,
      status
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Secure: Create task with userEmail from token
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({
      title,
      description,
      userEmail: req.user.email, // from token
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task (secure)
router.put('/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// Delete task (secure)
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
