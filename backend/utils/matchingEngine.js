export function scoreStudentMatch(student, job) {
  const required = (job.requiredSkills || []).map(normalizeSkill);
  const studentSkills = (student.skills || []).map(normalizeSkill);

  const matched = required.filter((skill) => studentSkills.includes(skill));
  const missing = required.filter((skill) => !studentSkills.includes(skill));

  const matchPercent =
    required.length === 0 ? 100 : Math.round((matched.length / required.length) * 100);

  let explanation;
  if (required.length === 0) {
    explanation = "No specific skills required for this role.";
  } else if (matched.length === required.length) {
    explanation = `Matches all ${required.length} required skills: ${required.join(", ")}.`;
  } else if (matched.length === 0) {
    explanation = `Does not match any of the required skills: ${required.join(", ")}.`;
  } else {
    explanation = `Matches ${matched.length} of ${required.length} required skills (${matched.join(", ")}). Missing: ${missing.join(", ")}.`;
  }

  return {
    studentId: student._id,
    studentName: student.name,
    matchPercent,
    matchedSkills: matched,
    missingSkills: missing,
    explanation
  };
}

export function rankStudentsForJob(students, job) {
  return students
    .map((student) => scoreStudentMatch(student, job))
    .sort((a, b) => b.matchPercent - a.matchPercent);
}