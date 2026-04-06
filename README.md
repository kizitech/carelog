# CareLog — Hospital Shift Reporting System

A modern, production-quality hospital shift reporting system built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

---

## ✨ Features

- **Authentication** — Mock login with form validation (Zod + React Hook Form)
- **Dashboard** — Live stats, Recharts analytics (bar + pie), filtered reports table
- **Report Submission** — Grouped form with patient info, treatment details, and handover sections
- **Report Details** — Full modal view with all shift data
- **Trash System** — Soft-delete with restore / permanent delete
- **Search & Filters** — Real-time search by patient/staff + filter by condition, department, date
- **Profile Modal** — Editable staff profile with "notify admin" action
- **Dark Mode** — Light / Dark / System via `next-themes`
- **Animations** — Framer Motion page transitions, table row staggering, modal entrances
- **Persistence** — All data saved to `localStorage`
- **Responsive** — Mobile-first, works on all screen sizes

---

## 🛠 Tech Stack

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

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Login

Use **any email address** and **any password** to log in (mock auth — no backend required).

---

## 📁 Project Structure

```
carelog/
├── app/
│   ├── globals.css          # Global styles, CSS variables, fonts
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Redirect root → /dashboard or /login
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── dashboard/
│   │   └── page.tsx         # Main dashboard
│   └── trash/
│       └── page.tsx         # Trash / soft-delete management
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx     # Auth guard + layout wrapper
│   │   ├── Navbar.tsx       # Sticky top navbar with user menu + theme
│   │   └── ThemeProvider.tsx
│   ├── shared/
│   │   ├── index.tsx        # Badge, Button, StatCard, Toggle, Avatar, Input…
│   │   └── Modal.tsx        # Animated modal with backdrop
│   ├── reports/
│   │   ├── ReportForm.tsx   # Multi-section new report form
│   │   ├── ReportDetail.tsx # Full report detail view
│   │   ├── ReportsTable.tsx # Data table with row actions
│   │   ├── FilterBar.tsx    # Search + filter controls
│   │   └── ProfileModal.tsx # Staff profile editor
│   └── charts/
│       └── AnalyticsCharts.tsx  # Bar + Pie charts
│
├── context/
│   └── AppContext.tsx       # Global state (auth + reports + filters)
│
├── lib/
│   ├── utils.ts             # Helpers, constants, date formatters
│   ├── schemas.ts           # Zod validation schemas
│   └── seed.ts              # Sample reports data
│
└── types/
    └── index.ts             # TypeScript interfaces
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Teal (`#0d9488`) |
| Font | DM Sans (body) + DM Mono |
| Border radius | 12px (md) / 16px (lg) / 24px (xl) |
| Shadow | Soft, multi-layer |
| Dark mode | Full CSS variable system |

---

## 📸 Pages

| Route | Description |
|-------|-------------|
| `/` | Auto-redirects based on auth state |
| `/login` | Centered login card with gradient background |
| `/dashboard` | Stats → Charts → Filters → Reports table |
| `/trash` | Soft-deleted reports with restore/delete actions |

---

## 📝 Notes for Academic Presentation

- All data is stored in `localStorage` — no backend needed
- The login accepts any valid email + password combination
- Reports are pre-seeded with realistic sample data
- The app is fully functional offline
- Clean component separation makes it easy to explain architecture
- TypeScript types are defined for all data structures

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

*Built with ❤️ for clinical excellence.*
