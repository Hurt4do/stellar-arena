# Stellar Arena — Hack+ Alebrije Judging Portal

Internal judging portal for **Hack+ Alebrije**, Stellar's flagship builder activation in Mexico City (March 20–22, 2026). Built for ~190 builders across two tracks, managed by judges, mentors, and admins through a role-based dashboard.

---

## What it does

- **Judges score projects** across weighted rubric pillars using a step-by-step evaluation form
- **Live leaderboard** aggregates scores across all judges in real time
- **Two tracks** with distinct evaluation criteria and demo formats
- **Admin panel** for importing projects from DoraHacks CSV and managing the database
- **Role-based access** — Builders see leaderboards, Mentors evaluate, Admins manage everything

---

## Tracks

### Genesis — Integration Track
~150 participants · Up to 40 projects · $8,000 USDC prize pool

3 parallel rooms, 3 judges per room, 10 minutes per team (3 min pitch / 2 min Q&A / 2 min notes / 3 min buffer).

**Scoring pillars:**
| Pillar | Weight |
|---|---|
| Problem & Relevance | 20% |
| Solution & Product | 20% |
| UX / UI | 10% |
| Use of Stellar & Ecosystem | 30% |
| Technical Implementation & Execution | 20% |

**Categories:** Payments · DeFi & Real-World Assets · Local Financial Tools · Open Integration

**Prizes:** 1st $4,000 USDC · 2nd $2,500 USDC · 3rd $1,500 USDC

### Scale — SCF Accelerator Track
~8 advanced teams · Shark Tank format · 22 minutes per team (6 min pitch / 8 min Q&A / 8 min feedback)

Simulates the Stellar Community Fund (SCF) evaluation environment. Panel deliberates on one of three outcomes per team: Instaward (up to $15K), Direct SCF Build referral (up to $150K), or Continue Building.

**Scoring pillars:**
| Pillar | Weight |
|---|---|
| Execution & Progress During Hackathon | 25% |
| Product Maturity & Market Fit | 20% |
| Technical Architecture & Quality | 20% |
| Funding Readiness | 20% |
| Ecosystem Value & Mentorship | 15% |

---

## Roles

| Role | Access | Login |
|---|---|---|
| **Builder** | Leaderboard (read-only) | Name only |
| **Mentor** | Overview, All Projects, My Scoring, Leaderboard, Judging Guide | Name + passcode |
| **Admin** | Everything + Import CSV + Manage Projects | Name + passcode |

Sessions persist via cookies (8-hour expiry). Mentors can switch between Genesis and Scale tracks from the sidebar.

---

## Tech stack

- **Framework:** Next.js 14 (App Router) — deployed on Vercel
- **Database:** Supabase (PostgreSQL)
- **Auth:** Cookie-based passcode auth (no external provider)
- **UI:** Tailwind CSS + shadcn/ui + Radix UI
- **Font:** Oxanium (Google Fonts)

---

## Project structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected routes
│   │   ├── overview/         # Judge home — evaluation queue
│   │   ├── projects/         # All projects with track filter + scored badges
│   │   ├── evaluation/[id]/  # Step-by-step scoring form
│   │   ├── my-scoring/       # Judge's evaluated / pending projects
│   │   ├── leaderboard/      # Live rankings
│   │   ├── guide/            # Judging reference guide with prizes & categories
│   │   └── admin/
│   │       ├── import/       # DoraHacks CSV import
│   │       └── manage/       # Delete individual or all projects
│   ├── api/
│   │   ├── auth/             # Login, logout, track switcher
│   │   └── admin/            # Delete project API routes
│   └── login/
├── features/                 # Page-level view components
├── components/
│   ├── layout/               # Sidebar, DashboardShell
│   ├── dashboard/            # Cards, sliders, rubric matrix
│   └── guide/                # Pillar donuts, timeline bar, outcome cards
└── lib/
    ├── auth.ts               # Role helpers, cookie constants
    ├── supabase.ts           # Supabase client
    └── db/
        ├── projects.ts       # CRUD for projects table
        ├── scores.ts         # Score upsert + leaderboard aggregation + feedback
        ├── rubric.ts         # Rubric criteria queries
        └── judges.ts         # Judge queries
```

---

## Database schema

Five tables in Supabase:

| Table | Purpose |
|---|---|
| `projects` | Populated via DoraHacks CSV export |
| `judges` | Created on mentor/admin login |
| `rubric_criteria` | Seeded per track (Genesis + Scale), 5 pillars each |
| `scores` | One row per judge × project × criterion |
| `project_feedback` | One row per judge × project — final comment, pitch tags, Scale outcome |

**Scoring method:** each judge scores independently → final score = average of all judges' normalized scores (0–100).

---

## Setup

### 1. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSCODE=your_admin_passcode
MENTOR_PASSCODE=your_mentor_passcode
```

### 2. Database

**Fresh setup:** run `supabase/schema.sql` in the Supabase SQL Editor — creates all tables and seeds rubric criteria for both tracks.

**Existing database:** run the two snippets below instead:
1. Create `project_feedback` table + seed Scale rubric (new additions)
2. Run `supabase/migration_update_rubric.sql` to update rubric descriptions

### 3. Run locally

```bash
npm install
npm run dev
```

### 4. Import projects

Log in as admin → **Import CSV** → upload a DoraHacks CSV export. Re-uploading is safe — existing entries are updated via upsert.

---

## Deployment

Deployed via **Vercel + GitHub integration**. Pushing to `main` triggers an automatic deployment. Set all environment variables in the Vercel project settings under *Environment Variables*.
