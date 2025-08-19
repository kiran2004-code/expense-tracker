const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');


// ✅ Get all expenses for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    return res.json(expenses);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err);
    return res.status(500).json({ error: 'Server error while fetching expenses' });
  }
});

// ✅ Add a new expense/income
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;

    // Validation
    if (!title || !amount || !type) {
      return res.status(400).json({ error: 'Title, amount, and type are required' });
    }

    // Ensure type is either "Expense" or "Income"
    if (!['Expense', 'Income'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be "Expense" or "Income"' });
    }

    // For expenses, category is required
    if (type === 'Expense' && !category) {
      return res.status(400).json({ error: 'Category is required for expenses' });
    }

    const expense = new Expense({
      userId: req.userId,   // ✅ from auth middleware
      title: title.trim(),
      amount: Number(amount),
      category: type === 'Expense' ? category : undefined, // ✅ only for expenses
      type,
    });

    await expense.save();
    return res.status(201).json(expense);
  } catch (err) {
    console.error('❌ Error adding expense:', err);
    return res.status(500).json({ error: 'Server error while adding expense' });
  }
});

// ✅ Delete an expense by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or not authorized' });
    }

    return res.json({ message: 'Expense deleted successfully', expense });
  } catch (err) {
    console.error('❌ Error deleting expense:', err);
    return res.status(500).json({ error: 'Server error while deleting expense' });
  }
});

module.exports = router;
