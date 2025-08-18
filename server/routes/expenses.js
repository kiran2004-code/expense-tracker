const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense'); // Adjust path
const authMiddleware = require('./auth'); // Use fixed middleware

// GET all expenses for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expenses = await Expense.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST add new expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expense = new Expense({
      user: req.userId,
      title,
      amount,
      category,
      type,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

module.exports = router;
