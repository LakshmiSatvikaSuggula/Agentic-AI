import { useEffect, useState } from "react";

export default function App() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 720, margin: "40px auto" }}>
      <h1>Placement Operations Agent</h1>
      <p>Frontend talking to backend — student records below.</p>

      {status === "loading" && <p>Loading students...</p>}
      {status === "error" && (
        <p style={{ color: "crimson" }}>
          Could not reach backend. Make sure it's running on port 5000.
        </p>
      )}

      {status === "ready" && (
        <table cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #333", textAlign: "left" }}>
              <th>Name</th>
              <th>Roll No</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Backlogs</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{s.name}</td>
                <td>{s.rollNo}</td>
                <td>{s.branch}</td>
                <td>{s.cgpa}</td>
                <td>{s.activeBacklogs}</td>
                <td>{s.skills.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}