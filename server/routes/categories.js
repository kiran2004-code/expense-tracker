const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('./auth');

// Get all categories for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.userId });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    // Check for duplicates
    const existing = await Category.findOne({ user: req.userId, name });
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    const category = new Category({ name, user: req.userId });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
