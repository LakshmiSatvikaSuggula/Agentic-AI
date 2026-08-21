import express from "express";
import { nanoid } from "nanoid";
import { readCollection, insertRecord, updateRecord, findById } from "../utils/db.js";
import { checkSlotConflicts } from "../utils/scheduler.js";

const router = express.Router();
const FILE = "interviews.json";

// GET /api/interviews - list all scheduled interviews
router.get("/", (req, res) => {
  res.json(readCollection(FILE));
});

// GET /api/interviews/:id - get one interview
router.get("/:id", (req, res) => {
  const interview = findById(FILE, req.params.id);
  if (!interview) return res.status(404).json({ error: "Interview not found" });
  res.json(interview);
});

// POST /api/interviews - schedule a new interview, checking for conflicts first
router.post("/", (req, res) => {
  const { jobId, studentId, studentName, panelists, room, startTime, durationMinutes } = req.body;

  if (!jobId || !studentId || !startTime || !durationMinutes) {
    return res.status(400).json({
      error: "jobId, studentId, startTime, and durationMinutes are required"
    });
  }

  const existing = readCollection(FILE);
  const proposedSlot = { panelists: panelists || [], room, startTime, durationMinutes };

  const { hasConflict, conflicts } = checkSlotConflicts(existing, proposedSlot);

  if (hasConflict) {
    return res.status(409).json({
      error: "Scheduling conflict detected",
      conflicts
    });
  }

  const interview = insertRecord(FILE, {
    id: nanoid(),
    jobId,
    studentId,
    studentName: studentName || "",
    panelists: panelists || [],
    room: room || "",
    startTime,
    durationMinutes,
    status: "scheduled",
    outcome: null,
    createdAt: new Date().toISOString()
  });

  res.status(201).json(interview);
});

// PATCH /api/interviews/:id - update status/outcome after the interview happens
router.patch("/:id", (req, res) => {
  const updated = updateRecord(FILE, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Interview not found" });
  res.json(updated);
});

export default router;