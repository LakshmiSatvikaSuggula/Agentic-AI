import express from "express";
import { readCollection } from "../utils/db.js";
import {
  getPendingActions,
  getExceptions,
  getSkillGapAnalytics
} from "../utils/dashboardAnalytics.js";

const router = express.Router();

// GET /api/dashboard - full placement operations overview
router.get("/", (req, res) => {
  const jobs = readCollection("jobs.json");
  const students = readCollection("students.json");
  const interviews = readCollection("interviews.json");

  res.json({
    summary: {
      totalJobs: jobs.length,
      openJobs: jobs.filter((j) => j.status === "open").length,
      totalStudents: students.length,
      totalInterviewsScheduled: interviews.length
    },
    pendingActions: getPendingActions(jobs, interviews),
    exceptions: getExceptions(interviews),
    skillGapAnalytics: getSkillGapAnalytics(jobs, students)
  });
});

export default router;