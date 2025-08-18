const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('./auth');  // since it's in the same routes folder

// GET categories (global + this user's custom)
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find({
      $or: [{ scope: 'global' }, { scope: 'custom', userId }],
    }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a custom category for this user
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, kind = 'Expense' } = req.body;

    const cat = await Category.create({
      name: name.trim(),
      scope: 'custom',
      userId,
      kind,
    });

    res.json(cat);
  } catch (err) {
    // handle dup key nicely
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
