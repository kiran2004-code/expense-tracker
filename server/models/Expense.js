const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
  type: String,
    required: function () {
      return this.type === 'Expense'; // Only required if it's an Expense
    },
  },
  type: { type: String, enum: ['Income', 'Expense'], default: 'Expense' }, // 🆕 Add this
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
