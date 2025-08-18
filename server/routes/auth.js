// ✅ Updated Backend Route in auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("\u274C Register Error:", err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, theme: user.theme } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Theme
// PUT /api/auth/theme
router.put('/theme', async (req, res) => {
  const { userId, theme } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { theme });
    res.json({ message: 'Theme updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update theme' });
  }
});


module.exports = function (req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // adapt if your payload differs
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};



// ✅ Get user info by token
router.get('/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ name: user.name, email: user.email, theme: user.theme || 'light' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
