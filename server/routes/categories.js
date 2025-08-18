const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Adjust path
const authMiddleware = require('./auth'); // Use fixed middleware

// GET all categories for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const categories = await Category.find({ user: req.userId }).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST add new category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const category = new Category({
      user: req.userId,
      name,
      type,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

module.exports = router;
