// src/pages/Interviews.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

const emptyForm = {
  jobId: "",
  studentId: "",
  studentName: "",
  panelistNames: "",
  panelistEmails: "",
  room: "",
  startTime: "",
  durationMinutes: "",
};

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [conflicts, setConflicts] = useState(null);

  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [loadingEligibility, setLoadingEligibility] = useState(false);

  function loadAll() {
    setLoading(true);
    Promise.all([api.getInterviews(), api.getJobs(), api.getStudents()])
      .then(([i, j, s]) => {
        setInterviews(i);
        setJobs(j);
        setStudents(s);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  // Whenever the selected job changes, fetch its eligibility results
  // and narrow the student dropdown down to only eligible students.
  useEffect(() => {
    if (!form.jobId) {
      setEligibleStudents([]);
      return;
    }

    setLoadingEligibility(true);
    api
      .getJobEligibility(form.jobId)
      .then((res) => {
        const eligibleIds = res.results.filter((r) => r.eligible).map((r) => r.studentId);
        const filtered = students.filter((s) => eligibleIds.includes(s._id));
        setEligibleStudents(filtered);
      })
      .catch(() => setEligibleStudents([]))
      .finally(() => setLoadingEligibility(false));
  }, [form.jobId, students]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Changing the job invalidates the previously picked student
    if (name === "jobId") {
      setForm((f) => ({ ...f, jobId: value, studentId: "", studentName: "" }));
      return;
    }

    // auto-fill studentName when a student is picked
    if (name === "studentId") {
      const s = students.find((s) => s._id === value);
      setForm((f) => ({ ...f, studentId: value, studentName: s?.name || "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setConflicts(null);

    if (!form.jobId || !form.studentId || !form.startTime || !form.durationMinutes) {
      setFormError("Job, student, start time, and duration are required.");
      return;
    }

    setSubmitting(true);
    try {
      const names = form.panelistNames
        ? form.panelistNames.split(",").map((n) => n.trim()).filter(Boolean)
        : [];
      const emails = form.panelistEmails
        ? form.panelistEmails.split(",").map((e) => e.trim()).filter(Boolean)
        : [];
      const panelists = names.map((name, idx) => ({ name, email: emails[idx] || "" }));

      const created = await api.createInterview({
        jobId: form.jobId,
        studentId: form.studentId,
        studentName: form.studentName,
        panelists,
        room: form.room,
        startTime: form.startTime,
        durationMinutes: Number(form.durationMinutes),
      });
      setInterviews((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch (e) {
      if (e.status === 409) {
        setFormError(e.data.error);
        setConflicts(e.data.conflicts);
      } else {
        setFormError(e.data?.error || e.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOutcomeUpdate(id, status, outcome) {
    try {
      const updated = await api.updateInterview(id, { status, outcome });
      setInterviews((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } catch (e) {
      alert(`Failed to update: ${e.message}`);
    }
  }

  async function handleNotify(id) {
    try {
      const res = await api.notifyInterview(id);
      alert(`Notifications sent: ${res.notificationsSent.length}`);
    } catch (e) {
      alert(`Failed to notify: ${e.message}`);
    }
  }

  return (
    <div className="interviews-page">
      <h1>Interviews</h1>

      <form onSubmit={handleSubmit} className="interview-form">
        <h2>Schedule Interview</h2>
        {formError && <p className="error">{formError}</p>}

        {conflicts && (
          <ul className="conflicts">
            {conflicts.map((c, i) => (
              <li key={i}>
                <strong>{c.type}</strong>: {c.detail}
              </li>
            ))}
          </ul>
        )}

        <select name="jobId" value={form.jobId} onChange={handleChange}>
          <option value="">Select Job *</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.companyName} — {j.role}
            </option>
          ))}
        </select>

        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          disabled={!form.jobId || loadingEligibility}
        >
          <option value="">
            {!form.jobId
              ? "Select a job first"
              : loadingEligibility
              ? "Loading eligible students..."
              : eligibleStudents.length === 0
              ? "No eligible students for this job"
              : "Select Student *"}
          </option>
          {eligibleStudents.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.rollNo})
            </option>
          ))}
        </select>

        <input
          name="panelistNames"
          placeholder="Panelist Names (comma separated)"
          value={form.panelistNames}
          onChange={handleChange}
        />
        <input
          name="panelistEmails"
          placeholder="Panelist Emails (comma separated, same order)"
          value={form.panelistEmails}
          onChange={handleChange}
        />
        <input
          name="room"
          placeholder="Room"
          value={form.room}
          onChange={handleChange}
        />
        <input
          name="startTime"
          type="datetime-local"
          value={form.startTime}
          onChange={handleChange}
        />
        <input
          name="durationMinutes"
          type="number"
          placeholder="Duration (minutes) *"
          value={form.durationMinutes}
          onChange={handleChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Scheduling..." : "Schedule Interview"}
        </button>
      </form>

      <h2>All Interviews</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Room</th>
              <th>Panelists</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Outcome</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((i) => (
              <tr key={i._id}>
                <td>{i.studentName}</td>
                <td>{i.room || "—"}</td>
                <td>{(i.panelists || []).map((p) => p.name).join(", ") || "—"}</td>
                <td>{new Date(i.startTime).toLocaleString()}</td>
                <td>{i.durationMinutes} min</td>
                <td>{i.status}</td>
                <td>{i.outcome || "—"}</td>
                <td className="actions">
                  <button onClick={() => handleNotify(i._id)}>Notify</button>
                  <button
                    onClick={() =>
                      handleOutcomeUpdate(i._id, "completed", "selected")
                    }
                  >
                    Mark Selected
                  </button>
                  <button
                    onClick={() =>
                      handleOutcomeUpdate(i._id, "completed", "rejected")
                    }
                  >
                    Mark Rejected
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}