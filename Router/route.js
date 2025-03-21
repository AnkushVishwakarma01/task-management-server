const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/authentication');
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('../Controllers/tasks');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

router.post('/auth/register', register);
router.post('/auth/login', login);

router.route('/tasks').get(verifyToken, getAllTasks).post(verifyToken, createTask);
router.route('/tasks/:id').get(verifyToken, getTaskById).put(verifyToken, updateTask).delete(verifyToken, deleteTask);

module.exports = router;