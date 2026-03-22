-- ============================================================
-- Migration: Update rubric descriptions to reflect integration focus
-- Run this in Supabase SQL editor if you already have rubric_criteria rows.
-- ============================================================

-- ── Genesis: updated for integration-first goals ─────────────────────────────

UPDATE rubric_criteria SET
  description = 'Assess how clearly defined, real, and financially meaningful the problem is — especially in the LATAM / Mexico context. Consider: clarity of the pain point, evidence of real user need, relevance to local economy (payments, savings, DeFi access, unbanked populations), and market opportunity.'
WHERE track = 'Genesis' AND order_index = 1;

UPDATE rubric_criteria SET
  description = 'Assess whether the team is building smartly WITH the Stellar ecosystem rather than reinventing existing infrastructure. Consider: integration with existing building blocks (anchors, DeFi protocols, wallets, payment rails), clarity of value proposition over existing alternatives, and a composability mindset — does this plug into the ecosystem?'
WHERE track = 'Genesis' AND order_index = 2;

UPDATE rubric_criteria SET
  description = 'Assess how accessible and frictionless the product is for real users in LATAM — including non-technical and unbanked users. Consider: clarity of user flows for financial actions (send, save, earn, swap), reduction of web3 complexity, interface quality and polish, and whether a first-time user could navigate it.'
WHERE track = 'Genesis' AND order_index = 3;

UPDATE rubric_criteria SET
  description = 'The most heavily weighted pillar — 30%. Assess the depth and meaningfulness of Stellar integration. Consider: use of local anchors and local assets (MXNe, USDC, etc.), integration with DeFi protocols (Blend, Soroswap, Stablebonds), use of SEPs / payment rails, Soroban smart contracts where relevant, and whether Stellar is core to the product — not just a backend token.'
WHERE track = 'Genesis' AND order_index = 4;

UPDATE rubric_criteria SET
  description = 'Assess the quality and completeness of the technical build within the hackathon timeframe. Consider: working demo on Stellar (not only mockups or slides), depth of integration with chosen building blocks, code structure and reliability, and overall level of completion relative to what was scoped.'
WHERE track = 'Genesis' AND order_index = 5;

-- ── Scale: updated for SCF / Shark Tank evaluation ───────────────────────────

UPDATE rubric_criteria SET
  pillar_name = 'Execution & Progress During Hackathon',
  description = 'Assess the tangible progress made during the three days. Scale teams arrive with a defined scope — evaluate whether they delivered on it. Consider: did the team deliver the feature or improvement they scoped? Is there a clear before/after that judges can see? Quality of execution under time constraints, and ability to prioritize and ship rather than overscope.'
WHERE track = 'Scale' AND order_index = 1;

UPDATE rubric_criteria SET
  pillar_name = 'Product Maturity & Market Fit',
  description = 'Assess the overall product, not just what was built during the hackathon. This is a team with an existing MVP — evaluate how strong the foundation is. Consider: clarity of problem and target user, evidence of traction or validated demand (users, pilots, partnerships, waitlists), differentiation from existing solutions in the ecosystem, viability as a business or sustainable project beyond grants.'
WHERE track = 'Scale' AND order_index = 2;

UPDATE rubric_criteria SET
  pillar_name = 'Technical Architecture & Quality',
  description = 'Assess the technical depth and soundness of the project architecture. Consider: quality of the codebase and architecture decisions, meaningful use of Stellar and/or Soroban (not superficial), integration with ecosystem building blocks (anchors, SAC, DeFi protocols, wallets, SEPs), security considerations and proper Soroban patterns (require_auth, storage tiers, events), and stability of the product.'
WHERE track = 'Scale' AND order_index = 3;

UPDATE rubric_criteria SET
  description = 'Assess whether the team is prepared to enter the SCF pipeline — this pillar determines the Instaward vs. Build Award recommendation. Consider: quality of funding package (technical summary, roadmap, pitch), milestones that map to SCF 4-tranche structure, understanding of the path to mainnet launch, team capability and commitment to execute a 3–5 month funded build, and whether their scope is right-sized for SCF funding.'
WHERE track = 'Scale' AND order_index = 4;

UPDATE rubric_criteria SET
  pillar_name = 'Ecosystem Value & Mentorship',
  description = 'Assess the project contribution to the Stellar ecosystem AND the team''s engagement with Genesis teams during the hackathon. Consider: does the project strengthen the ecosystem through integration and composability? Would funding this benefit other builders and users on Stellar? Quality of mentorship provided to assigned Genesis teams, and engagement and visibility during the hackathon.'
WHERE track = 'Scale' AND order_index = 5;
