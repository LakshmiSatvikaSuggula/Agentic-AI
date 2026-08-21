# AI Campus Placement Operations & Interview Coordination Agent

An AI-powered agentic system designed to automate and coordinate campus placement operations, from **company job-requirement analysis and student eligibility verification to candidate matching, interview scheduling, panel coordination, notifications, and placement analytics**.

The system assists placement officers by reducing repetitive manual work while keeping **final selection and important decisions under human control**.

---

## 📌 Project Overview

Campus placement activities involve multiple stakeholders such as:

* Placement Officers
* Students
* Recruiting Companies
* Interview Panels
* Faculty Coordinators
* Training and Placement Departments

Managing these activities manually can result in:

* Repeated communication
* Eligibility errors
* Scheduling conflicts
* Difficulty in matching students with job requirements
* Room and panel conflicts
* Missed notifications
* Lack of real-time placement insights

This project proposes an **AI Campus Placement Operations Agent** that acts as an intelligent coordination layer between companies, placement officers, students, and interview panels.

### Core Workflow

```text
Company Job Description
        ↓
AI Job & Eligibility Extraction
        ↓
Student Eligibility Verification
        ↓
Skill-Based Candidate Matching
        ↓
Placement Officer Review
        ↓
Test / Interview Scheduling
        ↓
Panel & Room Coordination
        ↓
Student Notifications
        ↓
Interview / Selection Updates
        ↓
Placement Dashboard
        ↓
Skill-Gap & Placement Analytics
```

---

## 🎯 Objectives

The main objectives of the project are:

1. Automate job-description and eligibility extraction.
2. Verify student eligibility automatically.
3. Match students with suitable job opportunities based on skills.
4. Provide explanations for candidate recommendations.
5. Schedule aptitude tests, coding tests, and interviews.
6. Detect panel, room, and time conflicts.
7. Coordinate interview panels and venues.
8. Send notifications and reminders to students and coordinators.
9. Provide a centralized placement dashboard.
10. Identify pending actions and exceptions.
11. Analyze student skill gaps and placement readiness.
12. Keep humans involved in final candidate selection and approval.

---

## 🚀 Key Features

### 1. Job Description Analysis

The AI agent analyzes company job descriptions and extracts important information such as:

* Company name
* Job role
* Required skills
* Preferred skills
* Educational qualification
* Minimum CGPA
* Eligible branches
* Backlog requirements
* Graduation year
* Required certifications
* Experience requirements
* Salary/package information
* Job location
* Selection process

### Example

**Input:**

```text
Software Developer

Eligibility:
B.Tech CSE/IT
CGPA >= 7.0
No active backlogs

Skills:
Python, Java, SQL, React
```

**Extracted Requirements:**

```text
Role: Software Developer
Branches: CSE, IT
Minimum CGPA: 7.0
Active Backlogs: Not Allowed

Required Skills:
- Python
- Java
- SQL
- React
```

---

# 👨‍🎓 2. Student Eligibility Verification

The system compares company requirements against student profiles.

Student information can include:

```text
Student Name
Roll Number
Branch
CGPA
Graduation Year
Backlogs
Technical Skills
Certifications
Projects
Internships
Placement Status
```

### Eligibility Example

```text
Company Requirement
        ↓
CGPA >= 7.0
CSE / IT
No Active Backlogs
Python + SQL
        ↓
Student Profile
        ↓
Eligibility Engine
        ↓
Eligible / Not Eligible
```

The system can provide an explanation:

```text
Eligible

✓ CGPA: 8.1 >= 7.0
✓ Branch: CSE
✓ Backlogs: 0
✓ Python: Available
✓ SQL: Available
```

For an ineligible student:

```text
Not Eligible

✓ Branch: CSE
✓ Backlogs: 0
✗ CGPA: 6.5 < 7.0
✓ Python: Available
```

---

# 🧠 3. Skill-Based Candidate Matching

The AI system ranks eligible candidates based on their similarity to the job requirements.

Possible factors include:

* Required technical skills
* Preferred skills
* CGPA
* Certifications
* Projects
* Internships
* Relevant experience
* Coding skills
* Academic background

### Matching Example

```text
Job Requirements
       ↓
Python
SQL
React
Java
       ↓
Student Skill Profiles
       ↓
AI Matching Engine
       ↓
Candidate Ranking
```

Example output:

| Student   | Match Score | Reason                    |
| --------- | ----------: | ------------------------- |
| Student A |         94% | Strong Python, SQL, React |
| Student B |         88% | Strong Python and SQL     |
| Student C |         76% | Python and basic React    |
| Student D |         61% | SQL only                  |

The system should **explain why a candidate received a particular score** rather than producing an unexplained ranking.

---

# 📅 4. Interview & Test Scheduling

The system assists with scheduling:

* Aptitude tests
* Coding tests
* Technical interviews
* HR interviews
* Group discussions
* Final interviews

The scheduler considers:

```text
Student Availability
+
Panel Availability
+
Room Availability
+
Interview Duration
+
Number of Candidates
=
Conflict-Free Schedule
```

### Example

```text
Company: ABC Technologies

Technical Interview
Date: 25-Aug-2026

Panel:
Panel A

Room:
Lab 3

Time Slots:
09:00 - 09:30 → Student 1
09:30 - 10:00 → Student 2
10:00 - 10:30 → Student 3
```

The system can detect conflicts such as:

```text
⚠ Scheduling Conflict

Panel A is already assigned
from 10:00 AM - 11:00 AM.

Recommended alternative:
Panel B
or
11:00 AM - 12:00 PM
```

---

# 👥 5. Panel Coordination

The system manages interview panel assignments.

Panel information may include:

```text
Panel ID
Interviewer Name
Department
Expertise
Availability
Assigned Company
Assigned Round
```

The AI agent can recommend suitable panels based on:

* Technical expertise
* Availability
* Interview round
* Company requirements

---

# 🏫 6. Venue Management

The system can manage placement venues such as:

* Seminar halls
* Computer labs
* Classrooms
* Interview rooms
* Conference rooms

Venue information:

```text
Room Number
Capacity
Location
Available Time
Equipment
Current Booking
```

The system prevents double booking.

Example:

```text
Room: Lab 2

10:00 - 12:00 → Coding Test
12:00 - 01:00 → Available
01:00 - 03:00 → Technical Interviews
```

---

# 🔔 7. Student Notifications & Reminders

The system can generate notifications for:

* Eligibility results
* Test schedules
* Interview schedules
* Venue details
* Reporting time
* Document requirements
* Selection updates
* Reminders

Example notification:

```text
Placement Update

Company: ABC Technologies
Round: Technical Interview
Date: 25-Aug-2026
Time: 10:00 AM
Venue: Lab 3

Please report 15 minutes before the scheduled time.
```

---

# 📊 8. Placement Operations Dashboard

The dashboard provides a centralized view of placement activities.

### Dashboard Metrics

```text
Total Students
        ↓
Eligible Students
        ↓
Students Registered
        ↓
Tests Scheduled
        ↓
Interviews Scheduled
        ↓
Selected Students
        ↓
Placed Students
```

Possible dashboard sections:

* Total companies
* Active drives
* Eligible students
* Registered students
* Scheduled interviews
* Pending actions
* Scheduling conflicts
* Selection statistics
* Placement percentage
* Skill-gap analysis

---

# ⚠️ 9. Pending Actions & Exception Management

The system identifies issues that require human attention.

Examples:

```text
⚠ 12 students have incomplete profiles

⚠ 2 interview panels have scheduling conflicts

⚠ 1 venue is double-booked

⚠ 15 eligible students have not registered

⚠ 3 students are missing required documents

⚠ Company requirements require manual verification
```

This allows placement officers to focus on exceptions instead of manually monitoring every activity.

---

# 📈 10. Skill-Gap & Placement-Readiness Analytics

The system analyzes student skills and identifies areas that need improvement.

Example:

```text
Student Skill Profile

Python       ██████████ 90%
SQL          ████████░░ 80%
DSA          ██████░░░░ 60%
React        █████░░░░░ 50%
Communication ███████░░░ 70%
```

### Skill Gap

For a Software Developer role:

```text
Required:
Python ✓
SQL ✓
DSA ✗
React ✗
Git ✓

Skill Gap:
DSA
React
```

The system can recommend learning areas based on frequently requested industry skills.

---

# 🤖 Agentic AI Architecture

The proposed system can use multiple specialized AI agents.

```text
                    ┌───────────────────────┐
                    │   Placement Officer   │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Placement AI Agent  │
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
 ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
 │ JD Analysis    │    │ Eligibility    │    │ Candidate      │
 │ Agent          │    │ Agent          │    │ Matching Agent │
 └────────────────┘    └────────────────┘    └────────────────┘
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Scheduling Agent      │
                    └───────────┬───────────┘
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │ Panel Mgmt │ │ Room Mgmt  │ │ Notification│
          └────────────┘ └────────────┘ └────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Placement Dashboard   │
                    └───────────────────────┘
```

---

# 🔄 End-to-End Workflow

## Step 1 — Company Requirement Entry

Placement officer uploads or enters the company job description.

```text
JD PDF / DOCX / Text
          ↓
AI JD Analyzer
```

---

## Step 2 — Requirement Extraction

The AI extracts structured requirements.

```text
Role
Skills
CGPA
Branch
Backlogs
Graduation Year
Selection Rounds
```

---

## Step 3 — Eligibility Verification

The system compares requirements with the student database.

```text
Company Requirements
          +
Student Profiles
          ↓
Eligibility Engine
          ↓
Eligible Candidates
```

---

## Step 4 — Candidate Matching

The AI ranks eligible students based on skills and job relevance.

```text
Eligible Students
        ↓
Skill Matching
        ↓
Candidate Ranking
        ↓
Explanation
```

---

## Step 5 — Human Review

The placement officer reviews the AI recommendations.

```text
AI Recommendation
        ↓
Human Review
        ↓
Approve / Modify / Reject
```

**The AI does not make the final hiring decision.**

---

## Step 6 — Scheduling

The system schedules:

```text
Tests
Interviews
Panels
Rooms
Time Slots
```

while detecting conflicts.

---

## Step 7 — Notifications

Students and coordinators receive relevant notifications.

```text
Schedule Created
       ↓
Notification Agent
       ↓
Student / Panel / Coordinator
```

---

## Step 8 — Event Tracking

The dashboard tracks:

```text
Scheduled
Attended
Absent
Completed
Selected
Rejected
Pending
```

---

## Step 9 — Analytics

The system generates reports such as:

* Company-wise placement statistics
* Branch-wise placement statistics
* Skill demand analysis
* Student placement readiness
* Skill-gap analysis
* Selection conversion rates
* Interview attendance
* Scheduling conflicts

---

# 🛠️ Proposed Technology Stack

## Frontend

* React.js
* Vite
* HTML5
* CSS3
* JavaScript
* Bootstrap or Tailwind CSS

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB
* MongoDB Atlas

## AI / Machine Learning

Possible technologies:

* Python
* Scikit-learn
* Sentence Transformers
* Natural Language Processing
* Large Language Models
* Embedding-based semantic matching

## Authentication

* JWT
* Role-Based Access Control

Possible roles:

```text
Admin
Placement Officer
Student
Recruiter
Interviewer
Faculty Coordinator
```

## Deployment

Possible deployment platforms:

```text
Frontend → Vercel / AWS
Backend  → Render / AWS
Database → MongoDB Atlas
```

---

# 🗂️ Suggested Project Structure

```text
placement-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── agents/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── ai/
│   ├── jd_analyzer/
│   ├── eligibility/
│   ├── matching/
│   ├── analytics/
│   ├── embeddings/
│   └── requirements.txt
│
├── data/
│   ├── students/
│   ├── companies/
│   └── sample_jobs/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── screenshots/
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 🗄️ Main Database Entities

## Student

```text
Student
├── studentId
├── name
├── email
├── branch
├── graduationYear
├── cgpa
├── backlogs
├── skills
├── certifications
├── projects
├── internships
└── placementStatus
```

## Company

```text
Company
├── companyId
├── companyName
├── industry
├── jobRoles
├── eligibilityCriteria
├── requiredSkills
└── selectionProcess
```

## Job

```text
Job
├── jobId
├── companyId
├── role
├── description
├── requiredSkills
├── eligibility
├── salary
└── selectionRounds
```

## Interview

```text
Interview
├── interviewId
├── jobId
├── studentId
├── panelId
├── roomId
├── date
├── startTime
├── endTime
└── status
```

## Panel

```text
Panel
├── panelId
├── members
├── expertise
├── availability
└── assignedInterviews
```

## Venue

```text
Venue
├── roomId
├── roomName
├── capacity
├── facilities
├── availability
└── bookings
```

---

# 🔐 Human-in-the-Loop Design

Human oversight is a key part of the system.

The AI can:

```text
Analyze
Recommend
Rank
Schedule
Notify
Detect Conflicts
Generate Reports
```

But the placement officer controls:

```text
Final Candidate Approval
Eligibility Overrides
Schedule Approval
Exception Handling
Final Selection
```

### Human-in-the-loop workflow

```text
AI Recommendation
       ↓
Placement Officer Review
       ↓
Approve / Modify / Reject
       ↓
System Executes Approved Action
```

This reduces the risk of incorrect automated decisions.

---

# 📊 Example AI Matching Explanation

```text
Candidate: Student A

Overall Match: 91%

Why?

✓ Python matches required skill
✓ SQL matches required skill
✓ React matches preferred skill
✓ CGPA satisfies eligibility
✓ CSE branch satisfies requirement
✓ Relevant web development project

Skill Gap:
- Java
```

This makes the AI recommendation **transparent and explainable**.

---

# 📌 Example Dashboard

```text
====================================================
              PLACEMENT AI DASHBOARD
====================================================

Companies              Active Drives
    24                       6

Eligible Students      Interviews Today
   1,245                     48

Selected Students      Pending Actions
    186                       17

----------------------------------------------------

Upcoming Drives
----------------------------------------------------
ABC Technologies       25-Aug-2026
XYZ Solutions           27-Aug-2026
TechCorp                30-Aug-2026

----------------------------------------------------

⚠ Exceptions
----------------------------------------------------
3 Panel Conflicts
2 Room Conflicts
15 Profile Updates Pending
8 Students Not Registered

----------------------------------------------------

Skill Demand
----------------------------------------------------
Python        █████████████
SQL           ███████████
Java          █████████
React         ███████
DSA           ███████████
```

---

# 🔌 Example API Endpoints

## Authentication

```http
POST /api/auth/login
POST /api/auth/register
```

## Students

```http
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
```

## Companies

```http
GET    /api/companies
POST   /api/companies
GET    /api/companies/:id
```

## Jobs

```http
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs/analyze
```

## Eligibility

```http
POST /api/eligibility/check
GET  /api/eligibility/:jobId
```

## Candidate Matching

```http
POST /api/matching
GET  /api/matching/:jobId
```

## Scheduling

```http
POST /api/schedules
GET  /api/schedules
PUT  /api/schedules/:id
```

## Analytics

```http
GET /api/analytics/placement
GET /api/analytics/skills
GET /api/analytics/readiness
```

---

# 🧪 Example Use Case

### Company

```text
Company: Tech Solutions

Role: Software Developer

Eligibility:
CSE / IT
CGPA >= 7.0
No active backlogs

Required Skills:
Python
SQL
DSA
React
```

### AI Processing

```text
              Job Description
                     ↓
              Requirement AI
                     ↓
             Eligibility Check
                     ↓
             450 Eligible
               Students
                     ↓
            Skill Matching AI
                     ↓
            Top 100 Candidates
                     ↓
            Placement Officer
                Review
                     ↓
              Approved List
                     ↓
              Scheduling AI
                     ↓
       Panel + Room + Time Allocation
                     ↓
               Notifications
                     ↓
             Interview Process
                     ↓
                Analytics
```

---

# 📈 Success Metrics

The prototype can be evaluated using:

| Metric                    | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| Eligibility Accuracy      | Correct identification of eligible students |
| Matching Accuracy         | Quality of candidate recommendations        |
| Scheduling Conflict Rate  | Number of scheduling conflicts              |
| Notification Success Rate | Successful communication                    |
| Time Saved                | Reduction in manual placement work          |
| Skill Gap Detection       | Accuracy of identified skill gaps           |
| Human Override Rate       | Number of AI recommendations modified       |
| Placement Conversion      | Students progressing through rounds         |

---

# 🔒 Security & Privacy

Because the system handles student information, security should be considered from the beginning.

Recommended practices:

* JWT authentication
* Role-Based Access Control
* Password hashing
* HTTPS
* Input validation
* API authorization
* Secure environment variables
* Database access controls
* Audit logs
* Minimal exposure of student data
* Protection of resumes and academic information

Sensitive information should not be unnecessarily exposed to AI models or other users.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-repository-url>

cd placement-ai
```

## 2. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

## 3. Backend Setup

```bash
cd backend

npm install

npm run dev
```

## 4. AI Service Setup

```bash
cd ai

pip install -r requirements.txt
```

## 5. Environment Variables

Create a `.env` file.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

AI_API_KEY=your_ai_api_key
```

**Do not commit `.env` files or API keys to GitHub.**

---

# 🧑‍💻 User Roles

### Placement Officer

Can:

* Add companies
* Upload job descriptions
* Review eligibility
* Review AI recommendations
* Approve schedules
* Manage panels
* Manage rooms
* View analytics
* Handle exceptions

### Student

Can:

* Manage profile
* Add skills
* Upload resume
* View eligible jobs
* Register for drives
* View interview schedules
* Receive notifications
* View skill-gap recommendations

### Recruiter

Can:

* Submit job requirements
* View approved candidate information
* Provide interview results
* Update hiring status

### Interview Panel

Can:

* View assigned interviews
* View candidate information
* Update interview status
* Submit feedback

---

# 🧠 AI Agent Responsibilities

| Agent              | Responsibility                  |
| ------------------ | ------------------------------- |
| JD Agent           | Extracts job requirements       |
| Eligibility Agent  | Checks student eligibility      |
| Matching Agent     | Ranks candidates                |
| Scheduling Agent   | Creates conflict-free schedules |
| Panel Agent        | Assigns interview panels        |
| Venue Agent        | Allocates rooms                 |
| Notification Agent | Sends reminders                 |
| Analytics Agent    | Generates placement insights    |

---

# 🔄 Agent Decision Example

```text
IF company requires CGPA >= 7.0
AND student CGPA >= 7.0
AND branch is eligible
AND active backlogs = 0
THEN student is eligible
```

Then:

```text
IF student is eligible
THEN calculate skill match score
```

Then:

```text
IF candidate is shortlisted
THEN recommend available test/interview slot
```

Finally:

```text
IF placement officer approves
THEN confirm schedule
AND send notification
```

---

# 🌟 Advantages

* Reduces manual placement workload
* Minimizes eligibility errors
* Improves candidate-job matching
* Provides explainable recommendations
* Reduces scheduling conflicts
* Centralizes placement information
* Improves communication
* Provides real-time operational visibility
* Identifies student skill gaps
* Supports data-driven placement decisions
* Keeps humans in control of final decisions

---

# 🚧 Future Enhancements

Future versions can include:

* Resume parsing
* Automatic resume-to-JD matching
* LLM-powered placement assistant
* WhatsApp/email notifications
* Calendar integration
* Voice-based placement assistant
* Interview feedback analysis
* Predictive placement analytics
* Personalized learning recommendations
* Multi-college placement management
* Company recommendation engine
* Automated placement reports
* RAG-based policy and placement-rule assistant

---

# 🎯 Expected Outcome

The final prototype should demonstrate an end-to-end placement workflow:

```text
Job Description
      ↓
AI Requirement Extraction
      ↓
Eligibility Verification
      ↓
Candidate Matching
      ↓
Human Approval
      ↓
Test / Interview Scheduling
      ↓
Panel & Room Coordination
      ↓
Student Notifications
      ↓
Interview Tracking
      ↓
Placement Dashboard
      ↓
Skill Gap Analytics
```

The system should function as an **AI-powered placement operations assistant**, not as an autonomous hiring system.

---

# 📜 Project Scope

The project focuses on **placement operations and coordination** rather than replacing recruiters or placement officers.

The AI provides:

```text
Automation
+
Recommendations
+
Scheduling
+
Analytics
+
Exception Detection
```

while humans retain control over:

```text
Final Eligibility Overrides
Candidate Approval
Interview Decisions
Final Selection
```

---

# 👩‍💻 Project Type

**Domain:** College / Placement / Employability / Agentic AI

**Project Category:** AI + Web Application + Agentic Workflow Automation

**Primary Users:** Placement Officers, Students, Recruiters, Interview Panels

---

# 📄 License

This project is developed for educational, academic, and prototype purposes.

Add an appropriate open-source license if the project is publicly released.

---

# ⭐ Conclusion

The **AI Campus Placement Operations & Interview Coordination Agent** aims to transform traditional campus placement management into an intelligent, centralized, and explainable workflow.

By combining **NLP, AI-based candidate matching, scheduling automation, conflict detection, notifications, dashboards, and analytics**, the system can significantly reduce repetitive placement activities while improving coordination and transparency.

Most importantly, the system follows a **human-in-the-loop approach**, ensuring that AI supports placement decisions rather than making final hiring decisions autonomously.
