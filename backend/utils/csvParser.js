import { parse } from "csv-parse/sync";

// Parses raw CSV text into an array of validated student objects.
// Returns { validRows, errors } - errors list which row failed and why,
// so the frontend can show the TPO exactly what to fix.

const REQUIRED_COLUMNS = ["name", "rollNo", "email"];

export function parseStudentsCsv(csvText) {
  let records;
  try {
    records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (err) {
    return { validRows: [], errors: [{ row: 0, reason: `Could not parse CSV: ${err.message}` }] };
  }

  const validRows = [];
  const errors = [];

  records.forEach((record, index) => {
    const rowNum = index + 2; // +2 accounts for header row + 1-based counting
    const missing = REQUIRED_COLUMNS.filter((col) => !record[col] || !record[col].trim());

    if (missing.length > 0) {
      errors.push({ row: rowNum, reason: `Missing required field(s): ${missing.join(", ")}` });
      return;
    }

    const cgpa = record.cgpa ? parseFloat(record.cgpa) : undefined;
    if (record.cgpa && Number.isNaN(cgpa)) {
      errors.push({ row: rowNum, reason: `Invalid CGPA value: "${record.cgpa}"` });
      return;
    }

    const activeBacklogs = record.activeBacklogs ? parseInt(record.activeBacklogs, 10) : 0;
    if (record.activeBacklogs && Number.isNaN(activeBacklogs)) {
      errors.push({ row: rowNum, reason: `Invalid activeBacklogs value: "${record.activeBacklogs}"` });
      return;
    }

    const skills = record.skills
      ? record.skills.split(";").map((s) => s.trim()).filter(Boolean)
      : [];

    validRows.push({
      name: record.name.trim(),
      rollNo: record.rollNo.trim(),
      branch: (record.branch || "").trim(),
      cgpa,
      activeBacklogs,
      skills,
      email: record.email.trim()
    });
  });

  return { validRows, errors };
}