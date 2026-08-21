// Extracts structured eligibility criteria and skills from raw job description text.
// This is a rule-based prototype - patterns can be swapped for an LLM call later
// without changing the shape of what this function returns.

const KNOWN_SKILLS = [
  "javascript", "python", "java", "c++", "c", "react", "node.js", "node",
  "sql", "mongodb", "django", "machine learning", "deep learning",
  "embedded c", "aws", "docker", "kubernetes", "html", "css", "typescript",
  "data structures", "algorithms", "git", "rest api", "flask", "spring boot"
];

const BRANCH_ALIASES = {
  cse: "CSE", "computer science": "CSE",
  ece: "ECE", "electronics": "ECE",
  eee: "EEE", "electrical": "EEE",
  mech: "MECH", mechanical: "MECH",
  civil: "CIVIL",
  it: "IT", "information technology": "IT"
};

function extractMinCgpa(text) {
  const match = text.match(/(?:cgpa|gpa)\s*(?:of|:)?\s*(\d(?:\.\d+)?)/i);
  return match ? parseFloat(match[1]) : null;
}

function extractMaxBacklogs(text) {
  const noBacklogs = /no\s+(?:active\s+)?backlogs?/i.test(text);
  if (noBacklogs) return 0;
  const match = text.match(/(?:max(?:imum)?\s+)?(\d+)\s+backlogs?/i);
  return match ? parseInt(match[1], 10) : null;
}

function extractBranches(text) {
  const found = new Set();
  const lower = text.toLowerCase();
  for (const [alias, branch] of Object.entries(BRANCH_ALIASES)) {
    if (lower.includes(alias)) found.add(branch);
  }
  return Array.from(found);
}

function extractSkills(text) {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill)).map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1)
  );
}

export function parseJobDescription(rawText) {
  return {
    minCgpa: extractMinCgpa(rawText),
    maxBacklogs: extractMaxBacklogs(rawText),
    eligibleBranches: extractBranches(rawText),
    requiredSkills: extractSkills(rawText),
    rawText
  };
}