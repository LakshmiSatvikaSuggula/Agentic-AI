// Checks a single student against a job's eligibility criteria.
// Returns whether they're eligible, plus the specific reasons if not -
// this transparency matters so a TPO can see exactly why someone was filtered out.

export function checkEligibility(student, job) {
  const reasons = [];

  if (job.minCgpa !== null && job.minCgpa !== undefined) {
    if (student.cgpa < job.minCgpa) {
      reasons.push(`CGPA ${student.cgpa} is below required ${job.minCgpa}`);
    }
  }

  if (job.maxBacklogs !== null && job.maxBacklogs !== undefined) {
    if (student.activeBacklogs > job.maxBacklogs) {
      reasons.push(
        `Has ${student.activeBacklogs} active backlog(s), max allowed is ${job.maxBacklogs}`
      );
    }
  }

  if (job.eligibleBranches && job.eligibleBranches.length > 0) {
    if (!job.eligibleBranches.includes(student.branch)) {
      reasons.push(
        `Branch ${student.branch} not in eligible list: ${job.eligibleBranches.join(", ")}`
      );
    }
  }

  return {
    studentId: student.id,
    studentName: student.name,
    eligible: reasons.length === 0,
    reasons
  };
}

// Runs eligibility check across a full list of students for one job.
export function checkEligibilityForAll(students, job) {
  return students.map((student) => checkEligibility(student, job));
}