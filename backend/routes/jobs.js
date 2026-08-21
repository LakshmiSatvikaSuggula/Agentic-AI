import express from "express";
import { nanoid } from "nanoid";
import { readCollection, insertRecord, findById } from "../utils/db.js";
import { parseJobDescription } from "../utils/jdParser.js";
import { checkEligibilityForAll } from "../utils/eligibilityChecker.js";
import { rankStudentsForJob } from "../utils/matchingEngine.js";

const router = express.Router();
const FILE = "jobs.json";

// GET /api/jobs - list all posted jobs
router.get("/", (req, res) => {
  res.json(readCollection(FILE));
});

// GET /api/jobs/:id - get one job
router.get("/:id", (req, res) => {
  const job = findById(FILE, req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// POST /api/jobs - submit a new JD, auto-extract eligibility + skills
router.post("/", (req, res) => {
  const { companyName, role, description } = req.body;

  if (!companyName || !role || !description) {
    return res.status(400).json({
      error: "companyName, role, and description are required"
    });
  }

  const extracted = parseJobDescription(description);

  const job = insertRecord(FILE, {
    id: nanoid(),
    companyName,
    role,
    description,
    minCgpa: extracted.minCgpa,
    maxBacklogs: extracted.maxBacklogs,
    eligibleBranches: extracted.eligibleBranches,
    requiredSkills: extracted.requiredSkills,
    status: "open",
    createdAt: new Date().toISOString()
  });

  res.status(201).json(job);
});

// GET /api/jobs/:id/eligibility - check every student against this job's criteria
router.get("/:id/eligibility", (req, res) => {
  const job = findById(FILE, req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const students = readCollection("students.json");
  const results = checkEligibilityForAll(students, job);

  res.json({
    jobId: job.id,
    role: job.role,
    companyName: job.companyName,
    totalStudents: students.length,
    eligibleCount: results.filter((r) => r.eligible).length,
    results
  });
});

// GET /api/jobs/:id/matches - eligible students only, ranked by skill match
router.get("/:id/matches", (req, res) => {
  const job = findById(FILE, req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const students = readCollection("students.json");
  const eligibility = checkEligibilityForAll(students, job);

  const eligibleStudents = students.filter((s) =>
    eligibility.find((e) => e.studentId === s.id && e.eligible)
  );

  const ranked = rankStudentsForJob(eligibleStudents, job);

  res.json({
    jobId: job.id,
    role: job.role,
    companyName: job.companyName,
    requiredSkills: job.requiredSkills,
    candidates: ranked
  });
});

export default router;