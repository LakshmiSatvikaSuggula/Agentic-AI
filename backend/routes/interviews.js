import express from "express";
import Interview from "../models/Interview.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";
import { checkSlotConflicts } from "../utils/scheduler.js";
import { sendInterviewReminders, sendOutcomeNotification } from "../utils/notifications.js";

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
  const proposedSlot = { studentId, panelists: panelists || [], room, startTime, durationMinutes };

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

// PATCH /api/interviews/:id - update status/outcome.
// If an outcome (selected/rejected) is being set for the first time,
// automatically email the student AND, if selected, record the
// company/role/date directly on the student's record.
router.patch("/:id", async (req, res) => {
  const existing = await Interview.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Interview not found" });

  const outcomeIsNew = req.body.outcome && req.body.outcome !== existing.outcome;

  const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });

  let notification = null;
  let studentStatusUpdate = null;

  if (outcomeIsNew && (updated.outcome === "selected" || updated.outcome === "rejected")) {
    const student = await Student.findById(updated.studentId);

    if (updated.outcome === "selected") {
      const job = await Job.findById(updated.jobId);
      studentStatusUpdate = await Student.findByIdAndUpdate(
        updated.studentId,
        {
          placementStatus: "placed",
          placedCompany: job?.companyName || "Unknown",
          placedRole: job?.role || "Unknown",
          placedOn: updated.startTime
        },
        { returnDocument: "after" }
      );
    }

    notification = await sendOutcomeNotification(
      { ...updated.toObject(), studentEmail: student?.email || null },
      updated.outcome
    );
  }

  res.json({
    ...updated.toObject(),
    outcomeNotification: notification,
    studentStatusUpdate
  });
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