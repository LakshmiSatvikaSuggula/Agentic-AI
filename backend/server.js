import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students.js";
import jobRoutes from "./routes/jobs.js";
import interviewRoutes from "./routes/interviews.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "placement-agent-backend" });
});

app.use("/api/students", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interviews", interviewRoutes);

app.listen(PORT, () => {
  console.log(`Placement agent backend running on http://localhost:${PORT}`);
});