import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  minCgpa: Number,
  maxBacklogs: Number,
  eligibleBranches: [String],
  requiredSkills: [String],
  status: { type: String, default: "open" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Job", jobSchema);