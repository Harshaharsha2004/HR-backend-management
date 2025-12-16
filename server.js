const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/employees", require("./src/routes/employeeRoutes"));
app.use("/api/attendance", require("./src/routes/attendanceRoutes"));
app.use("/api/leaves", require("./src/routes/leaveRoutes"));
app.use("/api/payroll", require("./src/routes/payrollRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));


// Start server
app.get("/", (req, res) => {
  res.send("HR Backend API running on Vercel");
});

module.exports = app;