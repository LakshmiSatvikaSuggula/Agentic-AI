// src/pages/Jobs.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

const emptyForm = { companyName: "", role: "", description: "" };

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [selectedJobId, setSelectedJobId] = useState(null);

  function loadJobs() {
    setLoading(true);
    api
      .getJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadJobs, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (!form.companyName.trim() || !form.role.trim() || !form.description.trim()) {
      setFormError("Company name, role, and description are all required.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.createJob({
        companyName: form.companyName.trim(),
        role: form.role.trim(),
        description: form.description.trim(),
      });
      setJobs((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch (e) {
      setFormError(e.data?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="jobs-page">
      <h1>Jobs</h1>

      <form onSubmit={handleSubmit} className="job-form">
        <h2>Post a Job</h2>
        {formError && <p className="error">{formError}</p>}

        <input
          name="companyName"
          placeholder="Company Name *"
          value={form.companyName}
          onChange={handleChange}
        />
        <input
          name="role"
          placeholder="Role *"
          value={form.role}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Paste raw JD text here *"
          rows={6}
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Job"}
        </button>
      </form>

      <h2>All Jobs</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Min CGPA</th>
              <th>Max Backlogs</th>
              <th>Eligible Branches</th>
              <th>Required Skills</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j._id}>
                <td>{j.companyName}</td>
                <td>{j.role}</td>
                <td>{j.minCgpa}</td>
                <td>{j.maxBacklogs}</td>
                <td>{(j.eligibleBranches || []).join(", ")}</td>
                <td>{(j.requiredSkills || []).join(", ")}</td>
                <td>{j.status}</td>
                <td>
                  <button onClick={() => setSelectedJobId(j._id)}>
                    View Eligibility / Matches
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedJobId && (
        <JobDetail jobId={selectedJobId} onClose={() => setSelectedJobId(null)} />
      )}
    </div>
  );
}

function JobDetail({ jobId, onClose }) {
  const [tab, setTab] = useState("eligibility");
  const [eligibility, setEligibility] = useState(null);
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([api.getJobEligibility(jobId), api.getJobMatches(jobId)])
      .then(([e, m]) => {
        setEligibility(e);
        setMatches(m);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  return (
    <div className="job-detail-panel">
      <div className="job-detail-header">
        <h2>Job Detail</h2>
        <button onClick={onClose}>Close</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="tabs">
            <button
              className={tab === "eligibility" ? "active" : ""}
              onClick={() => setTab("eligibility")}
            >
              Eligibility ({eligibility.eligibleCount}/{eligibility.totalStudents})
            </button>
            <button
              className={tab === "matches" ? "active" : ""}
              onClick={() => setTab("matches")}
            >
              Matches ({matches.candidates.length})
            </button>
          </div>

          {tab === "eligibility" && (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Eligible</th>
                  <th>Reasons</th>
                </tr>
              </thead>
              <tbody>
                {eligibility.results.map((r) => (
                  <tr key={r.studentId}>
                    <td>{r.studentName}</td>
                    <td>{r.eligible ? "✅" : "❌"}</td>
                    <td>{r.reasons.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "matches" && (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Match %</th>
                  <th>Matched Skills</th>
                  <th>Missing Skills</th>
                  <th>Explanation</th>
                </tr>
              </thead>
              <tbody>
                {matches.candidates.map((c) => (
                  <tr key={c.studentId}>
                    <td>{c.studentName}</td>
                    <td>{c.matchPercent}%</td>
                    <td>{c.matchedSkills.join(", ")}</td>
                    <td>{c.missingSkills.join(", ")}</td>
                    <td>{c.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}