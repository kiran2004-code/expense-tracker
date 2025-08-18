// utils/seedCategories.js
const Category = require('../models/Category');

const DEFAULTS = [
  'Food', 'Shopping', 'Transport', 'Internet',
  'Utilities', 'Health', 'Entertainment', 'Rent'
];

async function seedCategories() {
  for (const name of DEFAULTS) {
    const exists = await Category.findOne({ name, scope: 'global', kind: 'Expense' });
    if (!exists) {
      await Category.create({ name, scope: 'global', userId: null, kind: 'Expense' });
    }
  }
  console.log('✅ Default global categories seeded');
}

module.exports = { seedCategories };
