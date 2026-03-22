-- ============================================================
-- BAF Judging Portal — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Projects (populated from DoraHacks CSV export)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,                      -- BUIDL ID
  name TEXT NOT NULL,                       -- BUIDL name
  profile_url TEXT,                         -- BUIDL profile URL
  demo_link TEXT,                           -- BUIDL demo link
  github TEXT,                              -- BUIDL GitHub
  track TEXT,                               -- e.g. "Genesis" | "Scale"
  bounties TEXT,
  team_members TEXT,
  team_description TEXT,
  review_status TEXT,
  submission_time TIMESTAMPTZ,
  last_updated TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Judges
CREATE TABLE IF NOT EXISTS judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Per-track rubric criteria
CREATE TABLE IF NOT EXISTS rubric_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track TEXT NOT NULL,                      -- "Genesis" | "Scale"
  pillar_name TEXT NOT NULL,
  description TEXT,
  max_score INT NOT NULL,
  weight_pct INT NOT NULL,
  order_index INT NOT NULL
);

-- One row per judge × project × criterion
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES judges(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES rubric_criteria(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  comments TEXT,
  pitch_tags TEXT[],
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, judge_id, criterion_id)
);

-- ============================================================
-- Seed: Genesis track rubric (5 pillars — Integration focus)
-- ============================================================
INSERT INTO rubric_criteria (track, pillar_name, description, max_score, weight_pct, order_index)
VALUES
  ('Genesis', 'Problem & Relevance',
   'Assess how clearly defined, real, and financially meaningful the problem is — especially in the LATAM / Mexico context. Consider: clarity of the pain point, evidence of real user need, relevance to local economy (payments, savings, DeFi access, unbanked populations), and market opportunity.',
   20, 20, 1),
  ('Genesis', 'Solution & Product',
   'Assess whether the team is building smartly WITH the Stellar ecosystem rather than reinventing existing infrastructure. Consider: integration with existing building blocks (anchors, DeFi protocols, wallets, payment rails), clarity of value proposition over existing alternatives, and a composability mindset — does this plug into the ecosystem?',
   20, 20, 2),
  ('Genesis', 'User Experience (UX/UI)',
   'Assess how accessible and frictionless the product is for real users in LATAM — including non-technical and unbanked users. Consider: clarity of user flows for financial actions (send, save, earn, swap), reduction of web3 complexity, interface quality and polish, and whether a first-time user could navigate it.',
   10, 10, 3),
  ('Genesis', 'Use of Stellar & Ecosystem',
   'The most heavily weighted pillar — 30%. Assess the depth and meaningfulness of Stellar integration. Consider: use of local anchors and local assets (MXNe, USDC, etc.), integration with DeFi protocols (Blend, Soroswap, Stablebonds), use of SEPs / payment rails, Soroban smart contracts where relevant, and whether Stellar is core to the product — not just a backend token.',
   30, 30, 4),
  ('Genesis', 'Technical Implementation & Execution',
   'Assess the quality and completeness of the technical build within the hackathon timeframe. Consider: working demo on Stellar (not only mockups or slides), depth of integration with chosen building blocks, code structure and reliability, and overall level of completion relative to what was scoped.',
   20, 20, 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: Scale track rubric (5 pillars — SCF / Shark Tank format)
-- ============================================================
INSERT INTO rubric_criteria (track, pillar_name, description, max_score, weight_pct, order_index)
VALUES
  ('Scale', 'Execution & Progress During Hackathon',
   'Assess the tangible progress made during the three days. Scale teams arrive with a defined scope — evaluate whether they delivered on it. Consider: did the team deliver the feature or improvement they scoped? Is there a clear before/after that judges can see? Quality of execution under time constraints, and ability to prioritize and ship rather than overscope.',
   25, 25, 1),
  ('Scale', 'Product Maturity & Market Fit',
   'Assess the overall product, not just what was built during the hackathon. This is a team with an existing MVP — evaluate how strong the foundation is. Consider: clarity of problem and target user, evidence of traction or validated demand (users, pilots, partnerships, waitlists), differentiation from existing solutions in the ecosystem, viability as a business or sustainable project beyond grants.',
   20, 20, 2),
  ('Scale', 'Technical Architecture & Quality',
   'Assess the technical depth and soundness of the project architecture. Consider: quality of the codebase and architecture decisions, meaningful use of Stellar and/or Soroban (not superficial), integration with ecosystem building blocks (anchors, SAC, DeFi protocols, wallets, SEPs), security considerations and proper Soroban patterns (require_auth, storage tiers, events), and stability of the product.',
   20, 20, 3),
  ('Scale', 'Funding Readiness',
   'Assess whether the team is prepared to enter the SCF pipeline — this pillar determines the Instaward vs. Build Award recommendation. Consider: quality of funding package (technical summary, roadmap, pitch), milestones that map to SCF 4-tranche structure, understanding of the path to mainnet launch, team capability and commitment to execute a 3–5 month funded build, and whether their scope is right-sized for SCF funding.',
   20, 20, 4),
  ('Scale', 'Ecosystem Value & Mentorship',
   'Assess the project contribution to the Stellar ecosystem AND the team''s engagement with Genesis teams during the hackathon. Consider: does the project strengthen the ecosystem through integration and composability? Would funding this benefit other builders and users on Stellar? Quality of mentorship provided to assigned Genesis teams, and engagement and visibility during the hackathon.',
   15, 15, 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Project feedback (one row per judge × project — pitch tags, overall comment, outcome)
-- ============================================================
CREATE TABLE IF NOT EXISTS project_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES judges(id) ON DELETE CASCADE,
  final_comment TEXT,
  pitch_tags TEXT[],
  outcome TEXT,                             -- 'INSTAWARD' | 'SCF_BUILD' | 'CONTINUE_BUILDING' (Scale only)
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, judge_id)
);

-- ============================================================
-- Enable Row Level Security (optional but recommended)
-- Uncomment if you want to lock down tables
-- ============================================================
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rubric_criteria ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Allow all for anon" ON projects FOR ALL TO anon USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for anon" ON judges FOR ALL TO anon USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for anon" ON rubric_criteria FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow all for anon" ON scores FOR ALL TO anon USING (true) WITH CHECK (true);
