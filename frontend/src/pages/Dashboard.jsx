// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlacedList, setShowPlacedList] = useState(false);

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!data) return null;

  const { summary, pendingActions, exceptions, skillGapAnalytics, placementReadiness, placedStudentsList } = data;

  return (
    <div className="dashboard">
      <h1>Placement Dashboard</h1>

      <section className="summary-grid">
        <SummaryCard label="Total Jobs" value={summary.totalJobs} />
        <SummaryCard label="Open Jobs" value={summary.openJobs} />
        <SummaryCard label="Total Students" value={summary.totalStudents} />
        <SummaryCard
          label="Placed Students"
          value={summary.placedStudents}
          clickable
          onClick={() => setShowPlacedList((prev) => !prev)}
        />
        <SummaryCard
          label="Interviews Scheduled"
          value={summary.totalInterviewsScheduled}
        />
      </section>

      {showPlacedList && (
        <section>
          <h2>Placed Students</h2>
          {placedStudentsList.length === 0 ? (
            <p>No students placed yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Placed On</th>
                </tr>
              </thead>
              <tbody>
                {placedStudentsList.map((p) => (
                  <tr key={p.studentId}>
                    <td>{p.name}</td>
                    <td>{p.rollNo}</td>
                    <td>{p.branch}</td>
                    <td>{p.companyName}</td>
                    <td>{p.role}</td>
                    <td>{new Date(p.placedOn).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <section>
        <h2>Pending Actions</h2>
        {pendingActions.length === 0 ? (
          <p>Nothing pending.</p>
        ) : (
          <ul>
            {pendingActions.map((a, i) => (
              <li key={i}>
                <strong>{a.type}</strong>: {a.detail}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Exceptions</h2>
        {exceptions.length === 0 ? (
          <p>No exceptions.</p>
        ) : (
          <ul>
            {exceptions.map((e, i) => (
              <li key={i} className="exception">
                <strong>{e.type}</strong>: {e.detail}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Skill Gap Analytics</h2>
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Demanded By Jobs</th>
              <th>Students With Skill</th>
              <th>Coverage %</th>
            </tr>
          </thead>
          <tbody>
            {skillGapAnalytics.map((s) => (
              <tr key={s.skill}>
                <td>{s.skill}</td>
                <td>{s.demandedByJobs}</td>
                <td>{s.studentsWithSkill}</td>
                <td>{s.coveragePercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Placement Readiness</h2>
        {placementReadiness.length === 0 ? (
          <p>No students to score yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Readiness</th>
                <th>Score</th>
                <th>Matched In-Demand Skills</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {placementReadiness.map((r) => (
                <tr key={r.studentId}>
                  <td>{r.studentName}</td>
                  <td>
                    <span className={`readiness-badge readiness-${r.readinessLabel.replace(/\s+/g, "-").toLowerCase()}`}>
                      {r.readinessLabel}
                    </span>
                  </td>
                  <td>{r.readinessScore}/100</td>
                  <td>{r.matchedInDemandSkills.join(", ") || "—"}</td>
                  <td>
                    <ul className="readiness-reasons">
                      {r.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, clickable, onClick }) {
  return (
    <div
      className={`summary-card${clickable ? " summary-card-clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
      {clickable && <div className="summary-hint">Click to view</div>}
    </div>
  );
}