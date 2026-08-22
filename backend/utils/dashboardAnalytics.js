// Aggregates data across jobs, students, and interviews into the
// placement dashboard: pending actions, exceptions, skill-gap analytics,
// and per-student placement readiness.

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

// Placement-readiness: a per-student score reflecting how strong a
// candidate they are right now, based on academic standing and how
// well their skills cover what open jobs are actually asking for.

function getInDemandSkills(jobs) {
  const demand = {};
  for (const job of jobs) {
    for (const skill of job.requiredSkills || []) {
      const key = skill.toLowerCase();
      demand[key] = (demand[key] || 0) + 1;
    }
  }
  return demand;
}

export function getPlacementReadiness(students, jobs) {
  const inDemandSkills = getInDemandSkills(jobs);

  return students
    .map((student) => {
      const reasons = [];
      let score = 0;

      // Academic standing - up to 40 points
      if (student.cgpa >= 8) {
        score += 40;
      } else if (student.cgpa >= 7) {
        score += 30;
        reasons.push("CGPA is solid but below 8 - some companies set a higher bar");
      } else if (student.cgpa >= 6) {
        score += 15;
        reasons.push("CGPA may fall below several companies' minimum cutoff");
      } else {
        reasons.push("CGPA is low and will filter this student out of most eligibility checks");
      }

      // Backlogs - up to 20 points
      if (student.activeBacklogs === 0) {
        score += 20;
      } else if (student.activeBacklogs === 1) {
        score += 8;
        reasons.push("1 active backlog will disqualify from zero-backlog roles");
      } else {
        reasons.push(`${student.activeBacklogs} active backlogs significantly limit eligibility`);
      }

      // Skill coverage against current job market - up to 40 points
      const studentSkills = (student.skills || []).map((s) => s.toLowerCase());
      const demandedSkillNames = Object.keys(inDemandSkills);
      const matchedDemand = demandedSkillNames.filter((s) => studentSkills.includes(s));
      const missingDemand = demandedSkillNames.filter((s) => !studentSkills.includes(s));

      const skillCoveragePercent =
        demandedSkillNames.length === 0
          ? 100
          : Math.round((matchedDemand.length / demandedSkillNames.length) * 100);

      score += Math.round((skillCoveragePercent / 100) * 40);

      if (missingDemand.length > 0) {
        reasons.push(
          `Missing ${missingDemand.length} in-demand skill(s) from current openings: ${missingDemand.join(", ")}`
        );
      }

      let readinessLabel;
      if (score >= 80) readinessLabel = "Highly ready";
      else if (score >= 60) readinessLabel = "Ready";
      else if (score >= 40) readinessLabel = "Needs improvement";
      else readinessLabel = "At risk";

      return {
        studentId: student._id,
        studentName: student.name,
        readinessScore: score,
        readinessLabel,
        matchedInDemandSkills: matchedDemand,
        missingInDemandSkills: missingDemand,
        reasons: reasons.length > 0 ? reasons : ["Strong academic standing and skill coverage"]
      };
    })
    .sort((a, b) => b.readinessScore - a.readinessScore);
}