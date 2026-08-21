import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

async function seedIfEmpty() {
  const count = await Student.countDocuments();
  if (count > 0) return;

  await Student.insertMany([
    { name: "Ananya Rao", rollNo: "21CS045", branch: "CSE", cgpa: 8.7, activeBacklogs: 0, skills: ["JavaScript", "React", "Node.js", "SQL"], email: "ananya.rao@example.com" },
    { name: "Rahul Menon", rollNo: "21EC012", branch: "ECE", cgpa: 6.9, activeBacklogs: 1, skills: ["Python", "Embedded C"], email: "rahul.menon@example.com" },
    { name: "Priya Sharma", rollNo: "21CS089", branch: "CSE", cgpa: 9.2, activeBacklogs: 0, skills: ["Python", "Machine Learning", "SQL", "Django"], email: "priya.sharma@example.com" }
  ]);
}

seedIfEmpty();

router.get("/", async (req, res) => {
  res.json(await Student.find());
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

router.post("/", async (req, res) => {
  const { name, rollNo, branch, cgpa, activeBacklogs, skills, email } = req.body;
  if (!name || !rollNo || !email) {
    return res.status(400).json({ error: "name, rollNo, and email are required" });
  }
  const student = await Student.create({ name, rollNo, branch, cgpa, activeBacklogs, skills, email });
  res.status(201).json(student);
});

router.patch("/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Student not found" });
  res.json(updated);
});

export default router;