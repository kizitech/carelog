# CareLog v2 — Patient-Centric Hospital Shift Reporting

A modern, production-quality hospital shift management system built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and Recharts.

---

## What's New in v2

- **Patient Assignment System** — Staff sees their assigned patients on login
- **Persistent Patient Records** — Every patient has a profile with full cross-shift history
- **Patient Timeline** — Vertical chronological log of all shift entries per patient
- **Multi-Patient Shift Reports** — One report covers all patients seen in a shift
- **Patient List Page** — Browse, search and filter all hospital patients
- **Shift Filter** — Filter reports by Morning / Afternoon / Night
- **Reset System** — Restore all demo data from the user menu
- **Blue Healthcare Theme** — Deep blue dark mode, soft blue light mode
- **Confirm Dialogs** — Destructive actions require confirmation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Toasts | Sonner |
| Theme | next-themes |
| Icons | Lucide React |
| State | React Context + localStorage |

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — log in with any email + any password.

---

## Project Structure

```
carelog/
├── app/
│   ├── globals.css              # CSS variables (blue theme), fonts
│   ├── layout.tsx
│   ├── page.tsx                 # Auth-aware redirect
│   ├── login/page.tsx
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── patients/
│   │   ├── page.tsx             # Patient list
│   │   └── [id]/page.tsx        # Patient profile + timeline
│   └── trash/page.tsx
│
├── components/
│   ├── layout/                  # Navbar, AppShell, ThemeProvider
│   ├── shared/                  # Button, Modal, ConfirmDialog, inputs…
│   ├── reports/                 # ReportForm, ReportsTable, FilterBar…
│   ├── patients/                # AssignedPatientsPanel, PatientTimeline
│   └── charts/                  # AnalyticsCharts
│
├── context/AppContext.tsx        # Global state (auth, patients, reports)
├── lib/                          # utils, schemas, seed data
└── types/index.ts               # Patient, Report, PatientLog, User
```

---

## Data Model

```
Patient        id, name, dob, department, ward, currentCondition, assignedTo[]
Report         id, staffId, staffName, department, shift, date, patients[]
PatientLog     patientId, conditionBefore, conditionAfter, observations,
               treatment, medication, medNotes, injuries, educationGiven, notes
```

---

## Pages

| Route | Description |
|-------|-------------|
| /login | Auth page |
| /dashboard | Stats, assigned patients, charts, reports table |
| /patients | All patients with filters |
| /patients/[id] | Patient profile + vertical history timeline |
| /trash | Soft-deleted reports |

---

## Key Workflows

**Submit a Shift Report**
1. Click New Shift Report
2. Set department, shift, date
3. Select patients from dropdown
4. Fill per-patient observations, treatment, conditions
5. Submit — patient currentCondition updates automatically

**View Patient History**
1. Go to Patients page
2. Click any patient card
3. See profile + chronological timeline of all entries

**Reset Demo Data**
Avatar menu → Reset Demo Data → Confirm

---

## Build for Production

```bash
npm run build
npm start
```
