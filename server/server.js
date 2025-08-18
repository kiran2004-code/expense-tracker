const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories'); // Category routes
const { seedCategories } = require('./utils/seedCategories'); // <-- import seed script

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: 'https://personal-expensetrack.netlify.app', // frontend Netlify URL
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// ✅ MongoDB Connection + Seed Categories
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    // Seed default categories
    seedCategories();
  })
  .catch(err => console.log(err));

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
