import express from "express";
import { nanoid } from "nanoid";
import { readCollection, insertRecord, updateRecord, findById } from "../utils/db.js";

const router = express.Router();
const FILE = "students.json";

function seedIfEmpty() {
  const existing = readCollection(FILE);
  if (existing.length > 0) return;

  const seed = [
    { id: nanoid(), name: "Ananya Rao", rollNo: "21CS045", branch: "CSE", cgpa: 8.7, activeBacklogs: 0, skills: ["JavaScript", "React", "Node.js", "SQL"], placementStatus: "unplaced" },
    { id: nanoid(), name: "Rahul Menon", rollNo: "21EC012", branch: "ECE", cgpa: 6.9, activeBacklogs: 1, skills: ["Python", "Embedded C"], placementStatus: "unplaced" },
    { id: nanoid(), name: "Priya Sharma", rollNo: "21CS089", branch: "CSE", cgpa: 9.2, activeBacklogs: 0, skills: ["Python", "Machine Learning", "SQL", "Django"], placementStatus: "unplaced" }
  ];

  seed.forEach((s) => insertRecord(FILE, s));
}

seedIfEmpty();

router.get("/", (req, res) => {
  res.json(readCollection(FILE));
});

router.get("/:id", (req, res) => {
  const student = findById(FILE, req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

router.post("/", (req, res) => {
  const { name, rollNo, branch, cgpa, activeBacklogs, skills } = req.body;
  if (!name || !rollNo) {
    return res.status(400).json({ error: "name and rollNo are required" });
  }
  const record = insertRecord(FILE, {
    id: nanoid(), name, rollNo, branch: branch || "", cgpa: cgpa ?? 0,
    activeBacklogs: activeBacklogs ?? 0, skills: skills || [], placementStatus: "unplaced"
  });
  res.status(201).json(record);
});

router.patch("/:id", (req, res) => {
  const updated = updateRecord(FILE, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Student not found" });
  res.json(updated);
});

export default router;