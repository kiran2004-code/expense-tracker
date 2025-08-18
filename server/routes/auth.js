const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to protect routes and attach userId & theme
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ error: 'Unauthorized: Invalid token' });

    const user = await User.findById(decoded.id).select('theme');
    if (!user) return res.status(401).json({ error: 'Unauthorized: User not found' });

    req.userId = user._id.toString();
    req.theme = user.theme || 'light'; // Default theme if not set
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Unauthorized: Token error' });
  }
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, theme } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const user = new User({ name, email, password, theme: theme || 'light' });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, theme: user.theme });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, theme: user.theme });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update theme
router.patch('/theme', authMiddleware, async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme) return res.status(400).json({ error: 'Theme is required' });

    const user = await User.findByIdAndUpdate(req.userId, { theme }, { new: true });
    res.json({ theme: user.theme });
  } catch (err) {
    console.error('Error updating theme:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = authMiddleware;
module.exports.authRoutes = router;
