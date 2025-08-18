require('dotenv').config(); // load .env
const mongoose = require('mongoose');
const Category = require('../models/Category'); // adjust path


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
  mongoose.disconnect();
}

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => seedCategories())
.catch(err => console.log(err));
