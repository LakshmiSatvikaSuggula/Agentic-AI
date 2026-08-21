import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Seed a few sample students the first time the collection is empty
async function seedIfEmpty() {
  const count = await Student.countDocuments();
  if (count > 0) return;

  await Student.insertMany([
    { name: "Ananya Rao", rollNo: "21CS045", branch: "CSE", cgpa: 8.7, activeBacklogs: 0, skills: ["JavaScript", "React", "Node.js", "SQL"] },
    { name: "Rahul Menon", rollNo: "21EC012", branch: "ECE", cgpa: 6.9, activeBacklogs: 1, skills: ["Python", "Embedded C"] },
    { name: "Priya Sharma", rollNo: "21CS089", branch: "CSE", cgpa: 9.2, activeBacklogs: 0, skills: ["Python", "Machine Learning", "SQL", "Django"] }
  ]);
}

seedIfEmpty();

// GET /api/students - list all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// GET /api/students/:id - get one student
router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

// POST /api/students - add a new student
router.post("/", async (req, res) => {
  const { name, rollNo, branch, cgpa, activeBacklogs, skills } = req.body;
  if (!name || !rollNo) {
    return res.status(400).json({ error: "name and rollNo are required" });
  }
  const student = await Student.create({ name, rollNo, branch, cgpa, activeBacklogs, skills });
  res.status(201).json(student);
});

// PATCH /api/students/:id - update a student record
router.patch("/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Student not found" });
  res.json(updated);
});

export default router;