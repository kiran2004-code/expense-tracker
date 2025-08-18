const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories'); 
const { seedCategories } = require('./utils/seedCategories');

const app = express();
const PORT = process.env.PORT; // Render requires this

// ✅ Middleware
app.use(cors({
  origin: 'https://personal-expensetrack.netlify.app', // frontend URL
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// ✅ MongoDB Connection + Seed Categories
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    try {
      await seedCategories(); // await ensures seeding completes
    } catch (err) {
      console.error('Error seeding categories:', err);
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
