// src/api/client.js
const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Students
  getStudents: () => request("/students"),
  getStudent: (id) => request(`/students/${id}`),
  createStudent: (body) =>
    request("/students", { method: "POST", body: JSON.stringify(body) }),
  updateStudent: (id, body) =>
    request(`/students/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  // Jobs
  getJobs: () => request("/jobs"),
  getJob: (id) => request(`/jobs/${id}`),
  createJob: (body) =>
    request("/jobs", { method: "POST", body: JSON.stringify(body) }),
  getJobEligibility: (id) => request(`/jobs/${id}/eligibility`),
  getJobMatches: (id) => request(`/jobs/${id}/matches`),

  // Interviews
  getInterviews: () => request("/interviews"),
  createInterview: (body) =>
    request("/interviews", { method: "POST", body: JSON.stringify(body) }),
  updateInterview: (id, body) =>
    request(`/interviews/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  notifyInterview: (id) =>
    request(`/interviews/${id}/notify`, { method: "POST" }),

  // Dashboard
  getDashboard: () => request("/dashboard"),
};
