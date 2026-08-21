// Aggregates data across jobs, students, and interviews into the
// placement dashboard: pending actions, exceptions, and skill-gap analytics.

// Pending actions: things that need a human to act on them
export function getPendingActions(jobs, interviews) {
  const actions = [];

  const openJobsWithoutInterviews = jobs.filter(
    (job) =>
      job.status === "open" &&
      !interviews.some((iv) => iv.jobId.toString() === job._id.toString())
  );
  for (const job of openJobsWithoutInterviews) {
    actions.push({
      type: "no_interviews_scheduled",
      jobId: job._id,
      detail: `${job.companyName} - ${job.role} has no interviews scheduled yet`
    });
  }

  const pendingOutcomes = interviews.filter(
    (iv) => iv.status === "scheduled" && new Date(iv.startTime) < new Date()
  );
  for (const iv of pendingOutcomes) {
    actions.push({
      type: "outcome_not_recorded",
      interviewId: iv._id,
      detail: `Interview with ${iv.studentName} has passed but outcome isn't recorded`
    });
  }

  return actions;
}

// Exceptions: things that look wrong and need a human's attention
export function getExceptions(interviews) {
  const exceptions = [];

  for (const iv of interviews) {
    if (!iv.room) {
      exceptions.push({
        type: "missing_room",
        interviewId: iv._id,
        detail: `Interview with ${iv.studentName} has no room assigned`
      });
    }
    if (!iv.panelists || iv.panelists.length === 0) {
      exceptions.push({
        type: "missing_panel",
        interviewId: iv._id,
        detail: `Interview with ${iv.studentName} has no panelists assigned`
      });
    }
  }

  return exceptions;
}

// Skill-gap analytics: across all open jobs, which required skills show up
// most often, and what fraction of students actually have them.
export function getSkillGapAnalytics(jobs, students) {
  const skillDemand = {};

  for (const job of jobs) {
    for (const skill of job.requiredSkills || []) {
      const key = skill.toLowerCase();
      skillDemand[key] = (skillDemand[key] || 0) + 1;
    }
  }

  const totalStudents = students.length || 1;

  const gaps = Object.entries(skillDemand).map(([skill, demandCount]) => {
    const studentsWithSkill = students.filter((s) =>
      (s.skills || []).some((sk) => sk.toLowerCase() === skill)
    ).length;

    return {
      skill,
      demandedByJobs: demandCount,
      studentsWithSkill,
      coveragePercent: Math.round((studentsWithSkill / totalStudents) * 100)
    };
  });

  return gaps.sort((a, b) => a.coveragePercent - b.coveragePercent);
}