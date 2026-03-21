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
-- Seed: Genesis track rubric (5 pillars)
-- ============================================================
INSERT INTO rubric_criteria (track, pillar_name, description, max_score, weight_pct, order_index)
VALUES
  ('Genesis', 'Problem & Relevance',
   'Assess how clearly defined, real, and meaningful the problem is. Consider clarity of the problem statement, real-world relevance, understanding of the target user, and evidence of need.',
   20, 20, 1),
  ('Genesis', 'Solution & Product',
   'Assess how effectively the solution addresses the problem. Consider alignment between problem and solution, clarity of the value proposition, differentiation from existing solutions, and level of product innovation.',
   20, 20, 2),
  ('Genesis', 'User Experience (UX/UI)',
   'Assess how intuitive and usable the product is. Consider clarity of user flows, interface usability and design, accessibility for non-technical users, and reduction of friction especially in web3 interactions.',
   10, 10, 3),
  ('Genesis', 'Use of Stellar & Ecosystem',
   'Assess how well the project leverages Stellar technology. Consider meaningful (not superficial) use of Stellar, implementation of core features (payments, assets, anchors, Soroban, etc.), integration with ecosystem tools, and clear justification for using Stellar.',
   30, 30, 4),
  ('Genesis', 'Technical Implementation & Execution',
   'Assess the technical quality and completeness of the project. Consider functional demo (not only mockups), stability and reliability, technical structure and architecture, and level of completion within hackathon timeframe.',
   20, 20, 5)
ON CONFLICT DO NOTHING;

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
