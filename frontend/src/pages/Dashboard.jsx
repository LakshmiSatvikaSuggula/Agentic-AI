// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const { summary, pendingActions, exceptions, skillGapAnalytics } = data;

  return (
    <div className="dashboard">
      <h1>Placement Dashboard</h1>

      <section className="summary-grid">
        <SummaryCard label="Total Jobs" value={summary.totalJobs} />
        <SummaryCard label="Open Jobs" value={summary.openJobs} />
        <SummaryCard label="Total Students" value={summary.totalStudents} />
        <SummaryCard
          label="Interviews Scheduled"
          value={summary.totalInterviewsScheduled}
        />
      </section>

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
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="summary-card">
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
    </div>
  );
}