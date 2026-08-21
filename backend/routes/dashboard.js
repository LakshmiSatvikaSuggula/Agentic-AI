import express from "express";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import Interview from "../models/Interview.js";
import { getPendingActions, getExceptions, getSkillGapAnalytics } from "../utils/dashboardAnalytics.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const jobs = await Job.find();
  const students = await Student.find();
  const interviews = await Interview.find();

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