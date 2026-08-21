import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

function ensureFile(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
  return filePath;
}

export function readCollection(fileName) {
  const filePath = ensureFile(fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw || "[]");
}

export function writeCollection(fileName, records) {
  const filePath = ensureFile(fileName);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");
}

export function insertRecord(fileName, record) {
  const records = readCollection(fileName);
  records.push(record);
  writeCollection(fileName, records);
  return record;
}

export function updateRecord(fileName, id, updates) {
  const records = readCollection(fileName);
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...updates };
  writeCollection(fileName, records);
  return records[idx];
}

export function findById(fileName, id) {
  const records = readCollection(fileName);
  return records.find((r) => r.id === id) || null;
}