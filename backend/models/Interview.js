import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  studentName: String,
  panelists: [String],
  room: String,
  startTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  status: { type: String, default: "scheduled" },
  outcome: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Interview", interviewSchema);