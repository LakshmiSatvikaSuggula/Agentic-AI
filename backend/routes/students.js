import express from "express";
import multer from "multer";
import Student from "../models/Student.js";
import { parseStudentsCsv } from "../utils/csvParser.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

// POST /api/students/bulk-upload - upload a CSV of students
router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Field name must be 'file'." });
  }

  const csvText = req.file.buffer.toString("utf-8");
  const { validRows, errors } = parseStudentsCsv(csvText);

  const inserted = [];
  const insertErrors = [...errors];

  for (const row of validRows) {
    try {
      const existing = await Student.findOne({ rollNo: row.rollNo });
      if (existing) {
        insertErrors.push({ row: row.rollNo, reason: `Roll No ${row.rollNo} already exists - skipped` });
        continue;
      }
      const created = await Student.create(row);
      inserted.push(created);
    } catch (err) {
      insertErrors.push({ row: row.rollNo, reason: err.message });
    }
  }

  res.json({
    totalRowsInFile: validRows.length + errors.length,
    insertedCount: inserted.length,
    skippedCount: insertErrors.length,
    inserted,
    errors: insertErrors
  });
});

router.patch("/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
  if (!updated) return res.status(404).json({ error: "Student not found" });
  res.json(updated);
});

export default router;