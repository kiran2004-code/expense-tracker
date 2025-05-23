const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

// Middleware to extract userId from token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.userId;
    next();
  });
}

// Add Expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newExpense = new Expense({ ...req.body, userId: req.userId });
    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Expenses for User
router.get('/', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Expense by ID (and make sure it belongs to the user)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
