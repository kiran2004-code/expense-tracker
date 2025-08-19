const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth"); // your auth

// Update theme
router.put("/theme", authMiddleware, async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.theme = theme;
    await user.save();

    res.json({ success: true, theme: user.theme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update theme" });
  }
});

module.exports = router;
