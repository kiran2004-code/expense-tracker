const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories'); // Category routes

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
app.use('/api/categories', categoryRoutes); // move here ✅

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
