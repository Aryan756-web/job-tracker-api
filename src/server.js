const connectDB = require("./config/db");
require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

connectDB();

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("Job Tracker API running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});