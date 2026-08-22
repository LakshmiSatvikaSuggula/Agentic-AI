import express from "express";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import { parseJobDescription } from "../utils/jdParser.js";
import { checkEligibilityForAll } from "../utils/eligibilityChecker.js";
import { rankStudentsForJob } from "../utils/matchingEngine.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Job.find());
});

router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

router.post("/", async (req, res) => {
  const { companyName, role, description } = req.body;
  if (!companyName || !role || !description) {
    return res.status(400).json({ error: "companyName, role, and description are required" });
  }

  const extracted = parseJobDescription(description);

  const job = await Job.create({
    companyName,
    role,
    description,
    minCgpa: extracted.minCgpa,
    maxBacklogs: extracted.maxBacklogs,
    eligibleBranches: extracted.eligibleBranches,
    requiredSkills: extracted.requiredSkills
  });

  res.status(201).json(job);
});

router.get("/:id/eligibility", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const students = await Student.find();
  const results = checkEligibilityForAll(students, job);

  res.json({
    jobId: job._id,
    role: job.role,
    companyName: job.companyName,
    totalStudents: students.length,
    eligibleCount: results.filter((r) => r.eligible).length,
    results
  });
});

router.get("/:id/matches", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const students = await Student.find();
  const eligibility = checkEligibilityForAll(students, job);

  const eligibleStudents = students.filter((s) =>
    eligibility.find((e) => e.studentId.toString() === s._id.toString() && e.eligible)
  );

  const ranked = rankStudentsForJob(eligibleStudents, job);

  res.json({
    jobId: job._id,
    role: job.role,
    companyName: job.companyName,
    requiredSkills: job.requiredSkills,
    candidates: ranked
  });
});


export default router;