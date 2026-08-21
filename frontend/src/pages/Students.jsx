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
  email:"",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

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
    if (!form.name.trim() || !form.rollNo.trim()||!form.email.trim()) {
      setFormError("Name and Roll No and Email are required.");
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
  name="email"
  type="email"
  placeholder="Email *"
  value={form.email}
  onChange={handleChange}
/>
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Student"}
        </button>
      </form>

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
              <th>Status</th>
              <th>Email</th>
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
                <td>{s.placementStatus}</td>
                 <td>{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}