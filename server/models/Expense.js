// models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: function () {
      return this.type === 'Expense';
    },
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    default: 'Expense'
  },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
