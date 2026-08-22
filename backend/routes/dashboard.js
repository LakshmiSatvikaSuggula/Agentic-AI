import express from "express";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import Interview from "../models/Interview.js";
import {
  getPendingActions,
  getExceptions,
  getSkillGapAnalytics,
  getPlacementReadiness
} from "../utils/dashboardAnalytics.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const jobs = await Job.find();
  const students = await Student.find();
  const interviews = await Interview.find();

  const placedStudentsList = students
    .filter((s) => s.placementStatus === "placed")
    .map((s) => ({
      studentId: s._id,
      name: s.name,
      rollNo: s.rollNo,
      branch: s.branch,
      companyName: s.placedCompany,
      role: s.placedRole,
      placedOn: s.placedOn
    }));

  res.json({
    summary: {
      totalJobs: jobs.length,
      openJobs: jobs.filter((j) => j.status === "open").length,
      totalStudents: students.length,
      placedStudents: placedStudentsList.length,
      totalInterviewsScheduled: interviews.length
    },
    pendingActions: getPendingActions(jobs, interviews),
    exceptions: getExceptions(interviews),
    skillGapAnalytics: getSkillGapAnalytics(jobs, students),
    placementReadiness: getPlacementReadiness(students, jobs),
    placedStudentsList
  });
});

export default router;