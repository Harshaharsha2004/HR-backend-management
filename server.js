const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();
app.use(express.json());

// connect DB once
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Database connection failed",
      error: err.message,
    });
  }
});

// Routes
app.use("/api/employees", require("./src/routes/employeeRoutes"));
app.use("/api/attendance", require("./src/routes/attendanceRoutes"));
app.use("/api/leaves", require("./src/routes/leaveRoutes"));
app.use("/api/payroll", require("./src/routes/payrollRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("HR Backend API running on Vercel");
});

module.exports = app;
