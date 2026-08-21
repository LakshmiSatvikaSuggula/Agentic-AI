import express from "express";
import Interview from "../models/Interview.js";
import Student from "../models/Student.js";
import { checkSlotConflicts } from "../utils/scheduler.js";
import { sendInterviewReminders } from "../utils/notifications.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Interview.find());
});

router.get("/:id", async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) return res.status(404).json({ error: "Interview not found" });
  res.json(interview);
});

router.post("/", async (req, res) => {
  const { jobId, studentId, studentName, panelists, room, startTime, durationMinutes } = req.body;

  if (!jobId || !studentId || !startTime || !durationMinutes) {
    return res.status(400).json({ error: "jobId, studentId, startTime, and durationMinutes are required" });
  }

  const existing = await Interview.find();
  const proposedSlot = { panelists: panelists || [], room, startTime, durationMinutes };

  const { hasConflict, conflicts } = checkSlotConflicts(existing, proposedSlot);
  if (hasConflict) {
    return res.status(409).json({ error: "Scheduling conflict detected", conflicts });
  }

  const interview = await Interview.create({
    jobId, studentId, studentName: studentName || "", panelists: panelists || [],
    room: room || "", startTime, durationMinutes
  });

  res.status(201).json(interview);
});

router.patch("/:id", async (req, res) => {
  const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Interview not found" });
  res.json(updated);
});

router.post("/:id/notify", async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) return res.status(404).json({ error: "Interview not found" });

  const student = await Student.findById(interview.studentId);

  const sent = await sendInterviewReminders({
    ...interview.toObject(),
    studentEmail: student?.email || null
  });

  res.json({ interviewId: interview._id, notificationsSent: sent });
});

export default router;