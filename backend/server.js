
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/students.js";
import jobRoutes from "./routes/jobs.js";
import interviewRoutes from "./routes/interviews.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "placement-agent-backend" });
});

app.use("/api/students", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;

