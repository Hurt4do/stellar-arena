export type StackTag =
  | "Rust"
  | "PyTorch"
  | "Next.js"
  | "WebGL"
  | "Solidity"
  | "CI"
  | "C#"
  | "Oculus SDK"
  | "Unity"
  | "C"
  | "Arduino"
  | "Python"
  | "DevOps"
  | "Security"
  | "JWT"
  | "Go"
  | "Kubernetes"
  | "gRPC"
  | "WasM"
  | "Docker"
  | "GPU"
  | "Blockchain"
  | "AI/ML";

export type QueueStatus = "pending" | "in_progress" | "evaluated";

export interface Project {
  id: string;
  name: string;
  // Legacy mock fields
  team?: string;
  description?: string;
  projectIdLabel?: string;
  globalRank?: number;
  globalRankLabel?: string;
  tags?: string[];
  previewCards?: Array<{
    id: string;
    label: string;
    tone: "cyan" | "purple";
  }>;
  summaryMetrics?: {
    latency?: string;
    nodes?: string;
    compression?: string;
    security?: string;
  };
  techStack?: string[];
  engineerIds?: string[];
  engineers?: Array<{
    id: string;
    name: string;
    role: string;
    colorTone: "cyan" | "purple" | "green";
  }>;
  // Supabase / DoraHacks fields
  profile_url?: string | null;
  demo_link?: string | null;
  github?: string | null;
  track?: string | null;
  bounties?: string | null;
  team_members?: string | null;
  team_description?: string | null;
  review_status?: string | null;
  submission_time?: string | null;
  last_updated?: string | null;
}

export interface QueueItem {
  id: string;
  projectId: string;
  teamName: string;
  status: QueueStatus;
  statusLabel: string; // e.g. "IN PROGRESS"
  stackTags: string[];
  evaluationProgressPct: number; // 0..100
  actionLabel: string;
}

export interface RankingRow {
  rank: number;
  projectId: string;
  projectName: string;
  metadataTags: string[];
  efficiency: number;
  innovation: number;
  totalScore: number;
}

export interface ScoreRubricFactor {
  key: "innovation" | "complexity" | "ux" | "presentation";
  title: string;
  description: string;
  score: number;
  tone: "cyan" | "purple" | "green" | "blue";
}

export interface ProjectScoreState {
  projectId: string;
  rubric: ScoreRubricFactor[];
  judgeLog: string;
}

export interface QuickAdjustmentState {
  efficiencyWeightPct: number;
  innovationWeightPct: number;
}

