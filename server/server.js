const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const { seedCategories } = require('./utils/seedCategories'); // seed script

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: 'https://personal-expensetrack.netlify.app', // frontend URL
  credentials: true,
}));
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// ✅ Connect to MongoDB and seed default categories
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedCategories(); // run seed automatically
  })
  .catch(err => console.log(err));

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
