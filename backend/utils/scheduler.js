// Handles interview/test slot booking with conflict detection for
// panel members, rooms, and the student being interviewed - none of
// these can be double-booked into overlapping time slots.

function toTimeRange(startTime, durationMinutes) {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  return { start, end };
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Checks a proposed slot against existing interviews for conflicts.
// Returns { hasConflict, conflicts: [...] }
export function checkSlotConflicts(existingInterviews, proposedSlot) {
  const { start: newStart, end: newEnd } = toTimeRange(
    proposedSlot.startTime,
    proposedSlot.durationMinutes
  );

  const conflicts = [];

  for (const interview of existingInterviews) {
    const { start: existStart, end: existEnd } = toTimeRange(
      interview.startTime,
      interview.durationMinutes
    );

    if (!rangesOverlap(newStart, newEnd, existStart, existEnd)) continue;

    // Room conflict
    if (interview.room && proposedSlot.room && interview.room === proposedSlot.room) {
      conflicts.push({
        type: "room",
        withInterviewId: interview.id || interview._id,
        detail: `Room ${interview.room} already booked ${interview.startTime}`
      });
    }

    // Panelist conflict - supports both plain string panelists (legacy)
    // and {name, email} object panelists (current format)
    const existingPanelistEmails = (interview.panelists || []).map((p) =>
      typeof p === "string" ? p : p.email
    );
    const proposedPanelistEmails = (proposedSlot.panelists || []).map((p) =>
      typeof p === "string" ? p : p.email
    );
    const sharedPanelists = existingPanelistEmails.filter((email) =>
      email && proposedPanelistEmails.includes(email)
    );

    if (sharedPanelists.length > 0) {
      conflicts.push({
        type: "panelist",
        withInterviewId: interview.id || interview._id,
        detail: `Panelist(s) already booked at this time (${interview.startTime})`
      });
    }

    // Student conflict - same student can't be in two interviews at once
    if (
      proposedSlot.studentId &&
      interview.studentId &&
      interview.studentId.toString() === proposedSlot.studentId.toString()
    ) {
      conflicts.push({
        type: "student",
        withInterviewId: interview.id || interview._id,
        detail: `Student already has an interview scheduled at this overlapping time (${interview.startTime})`
      });
    }
  }

  return { hasConflict: conflicts.length > 0, conflicts };
}