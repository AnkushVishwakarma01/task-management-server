const Task = require('../Models/tasks');
const mongoose = require('mongoose');
// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's information
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const lastTask = await Task.findOne().sort({ id: -1 });
    const incrementalId = lastTask ? lastTask.id + 1 : 1;
    const { title, description } = req.body;
    const newTask = await Task.create({ 
      userId: req.user.id, 
      id: incrementalId, 
      title, 
      description 
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.id },
      { title, description },
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ id: req.params.id });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};