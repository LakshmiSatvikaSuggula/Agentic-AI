// src/pages/Students.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

const emptyForm = {
  name: "",
  rollNo: "",
  branch: "",
  cgpa: "",
  activeBacklogs: "",
  skills: "",
  email: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  function loadStudents() {
    setLoading(true);
    api
      .getStudents()
      .then(setStudents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadStudents, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.rollNo.trim() || !form.email.trim()) {
      setFormError("Name, Roll No, and Email are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        rollNo: form.rollNo.trim(),
        branch: form.branch.trim(),
        cgpa: form.cgpa ? Number(form.cgpa) : undefined,
        activeBacklogs: form.activeBacklogs ? Number(form.activeBacklogs) : undefined,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        email: form.email.trim(),
      };
      const created = await api.createStudent(payload);
      setStudents((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch (e) {
      setFormError(e.data?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCsvUpload(e) {
    e.preventDefault();
    setUploadError(null);
    setUploadResult(null);

    if (!csvFile) {
      setUploadError("Please choose a CSV file first.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await fetch("/api/students/bulk-upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed.");
        return;
      }

      setUploadResult(data);
      loadStudents(); // refresh the table with newly inserted students
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="students-page">
      <h1>Students</h1>

      <form onSubmit={handleSubmit} className="student-form">
        <h2>Add Student</h2>
        {formError && <p className="error">{formError}</p>}

        <input
          name="name"
          placeholder="Name *"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="rollNo"
          placeholder="Roll No *"
          value={form.rollNo}
          onChange={handleChange}
        />
        <input
          name="branch"
          placeholder="Branch (e.g. CSE)"
          value={form.branch}
          onChange={handleChange}
        />
        <input
          name="cgpa"
          type="number"
          step="0.1"
          placeholder="CGPA"
          value={form.cgpa}
          onChange={handleChange}
        />
        <input
          name="activeBacklogs"
          type="number"
          placeholder="Active Backlogs"
          value={form.activeBacklogs}
          onChange={handleChange}
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Student"}
        </button>
      </form>

      <div className="csv-upload-section">
        <h2>Bulk Upload Students (CSV)</h2>
        <p className="hint">
          CSV columns: name, rollNo, branch, cgpa, activeBacklogs, skills, email
          — separate multiple skills with a semicolon (e.g. Python;SQL;React)
        </p>

        <form onSubmit={handleCsvUpload} className="csv-form">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
          />
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
        </form>

        {uploadError && <p className="error">{uploadError}</p>}

        {uploadResult && (
          <div className="upload-summary">
            <p>
              <strong>{uploadResult.insertedCount}</strong> student(s) added,{" "}
              <strong>{uploadResult.skippedCount}</strong> row(s) skipped
              (out of {uploadResult.totalRowsInFile} total rows).
            </p>

            {uploadResult.errors.length > 0 && (
              <ul className="upload-errors">
                {uploadResult.errors.map((e, i) => (
                  <li key={i}>
                    Row {e.row}: {e.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <h2>All Students</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Backlogs</th>
              <th>Skills</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.rollNo}</td>
                <td>{s.branch}</td>
                <td>{s.cgpa}</td>
                <td>{s.activeBacklogs}</td>
                <td>{(s.skills || []).join(", ")}</td>
                <td>{s.email}</td>
                <td>{s.placementStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}