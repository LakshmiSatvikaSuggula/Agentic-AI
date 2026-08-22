import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  branch: String,
  cgpa: Number,
  activeBacklogs: { type: Number, default: 0 },
  skills: [String],
  email: { type: String, required: true },
  placementStatus: { type: String, default: "unplaced" },
  placedCompany: { type: String, default: null },
  placedRole: { type: String, default: null },
  placedOn: { type: Date, default: null }
});

export default mongoose.model("Student", studentSchema);