const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path if needed
const router = express.Router();

// =========================
// AUTH MIDDLEWARE
// =========================
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Expect 'Bearer <token>'
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId; // Set userId for other routes

    // Fetch user theme preference
    const user = await User.findById(req.userId).select('theme');
    req.userTheme = user ? user.theme || 'light' : 'light';

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// =========================
// REGISTER USER
// =========================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, theme } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      theme: theme || 'light',
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      theme: user.theme,
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =========================
// LOGIN USER
// =========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      theme: user.theme || 'light',
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =========================
// UPDATE USER THEME
// =========================
router.put('/theme', authMiddleware, async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { theme },
      { new: true, select: 'theme' }
    );
    res.status(200).json({ theme: user.theme });
  } catch (err) {
    console.error('Update Theme Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =========================
// EXPORTS
// =========================
module.exports = authMiddleware; // For protecting routes
module.exports.router = router;  // For /auth routes
