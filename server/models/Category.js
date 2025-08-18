const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // 'global' = visible to everyone; 'custom' = visible only to the creator
    scope: { type: String, enum: ['global', 'custom'], default: 'custom' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // (optional) if later you want separate lists for Expense/Income
    kind: { type: String, enum: ['Expense', 'Income'], default: 'Expense' },
  },
  { timestamps: true }
);

// Avoid duplicates: same (name, scope, userId, kind)
categorySchema.index({ name: 1, scope: 1, userId: 1, kind: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
