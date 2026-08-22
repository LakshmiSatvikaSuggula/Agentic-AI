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

  const placedStudents = students.filter((s) => s.placementStatus === "placed");

  const placedStudentsList = placedStudents.map((student) => {
    // Find the interview where this student was marked "selected"
    const selectionInterview = interviews.find(
      (iv) => iv.studentId.toString() === student._id.toString() && iv.outcome === "selected"
    );
    const job = selectionInterview
      ? jobs.find((j) => j._id.toString() === selectionInterview.jobId.toString())
      : null;

    return {
      studentId: student._id,
      name: student.name,
      rollNo: student.rollNo,
      branch: student.branch,
      companyName: job?.companyName || "Unknown",
      role: job?.role || "Unknown",
      placedOn: selectionInterview?.startTime || null
    };
  });

  res.json({
    summary: {
      totalJobs: jobs.length,
      openJobs: jobs.filter((j) => j.status === "open").length,
      totalStudents: students.length,
      placedStudents: placedStudents.length,
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