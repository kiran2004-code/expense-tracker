const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { authMiddleware } = require('./auth');

// GET all expenses for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Server error while fetching expenses' });
  }
});

// POST add a new expense/income
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, category, type, date } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ error: 'Title, amount, and type are required' });
    }

    const entry = await Expense.create({
      title: title.trim(),
      amount,
      category,
      type,
      date: date || new Date(),
      userId,
    });

    res.json(entry);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Server error while creating expense' });
  }
});

module.exports = router;
