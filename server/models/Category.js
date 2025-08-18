const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Category name
  type: { type: String, enum: ["Expense", "Income"], required: true } // To separate Income/Expense
});

module.exports = mongoose.model("Category", CategorySchema);
