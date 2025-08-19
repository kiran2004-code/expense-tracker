const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Only allow requests from your Netlify frontend
const allowedOrigins = ["https://personal-expensetrack.netlify.app"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Routes
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");
const expensesRouter = require("./routes/expenses");

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/expenses", expensesRouter);

// Connect to MongoDB (Atlas or other cloud DB)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
