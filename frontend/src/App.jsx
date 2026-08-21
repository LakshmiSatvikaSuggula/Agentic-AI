// src/App.jsx
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Jobs from "./pages/Jobs";
import Interviews from "./pages/Interviews";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1 className="navbar-title">Placement Agent</h1>
          <div className="navbar-links">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/interviews">Interviews</NavLink>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/interviews" element={<Interviews />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}