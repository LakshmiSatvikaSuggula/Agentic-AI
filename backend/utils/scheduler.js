// Handles interview/test slot booking with conflict detection for
// panel members and rooms - the two things that can't be double-booked.

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

    const sharedPanelists = (interview.panelists || []).filter((p) =>
      (proposedSlot.panelists || []).includes(p)
    );

    if (interview.room === proposedSlot.room) {
      conflicts.push({
        type: "room",
        withInterviewId: interview.id,
        detail: `Room ${interview.room} already booked ${interview.startTime}`
      });
    }

    if (sharedPanelists.length > 0) {
      conflicts.push({
        type: "panelist",
        withInterviewId: interview.id,
        detail: `Panelist(s) ${sharedPanelists.join(", ")} already booked ${interview.startTime}`
      });
    }
  }

  return { hasConflict: conflicts.length > 0, conflicts };
}