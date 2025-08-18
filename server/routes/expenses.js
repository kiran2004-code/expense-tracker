const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authMiddleware = require('./auth');

// Get all expenses for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;

    if (!title || !amount || !category || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const expense = new Expense({
      userId: req.userId, // Make sure this matches your Expense schema
      title,
      amount,
      category,
      type,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted', expense });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
