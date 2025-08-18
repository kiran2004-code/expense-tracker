const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authMiddleware } = require('./auth');

// GET categories (global + user custom)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find({
      $or: [{ scope: 'global' }, { scope: 'custom', userId }],
    }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
});

// POST add a custom category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, kind = 'Expense' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const cat = await Category.create({
      name: name.trim(),
      scope: 'custom',
      userId,
      kind,
    });

    res.json(cat);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Server error while creating category' });
  }
});

module.exports = router;
