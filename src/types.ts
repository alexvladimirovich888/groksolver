export interface SubStep {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  timestamp?: string;
  detail?: string;
}

export interface StageInfo {
  stageNumber: number;
  totalStages: number;
  title: string;
  subtitle: string;
  elapsedTime: string;
  stepsTaken: number;
  efficiency: number; // percentage, e.g. 0.87
  subSteps: SubStep[];
  currentTheorem: string;
}

export interface AgentData {
  id: string;
  number: number; // 1 to 7
  name: string;
  problemTitle: string;
  category: string;
  avatarColor: string; // Hex or tailwind class
  avatarBg: string;
  avatarUrl: string; // Image avatar URL
  avatarIconName: string; // lucide icon identifier
  solvedCount: number; // e.g. 3
  totalProblems: number; // e.g. 7
  solvedPercentage: number; // 0 to 100
  currentStage: number; // e.g. 7
  totalStages: number; // 10
  stageInfo: StageInfo;
  description: string;
  formula: string;
  lastUpdated: string;
  status: 'running' | 'synced' | 'paused' | 'solved';
  computeUsageGflops: number;
  activeThreads: number;
  keyInsights: string[];
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'proof';
}

export interface MemoryEntry {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  tags: string[];
  agentId?: string;
}

export interface GlobalDashboardStats {
  projectName: string;
  totalAgents: number;
  totalSubProblemsSolved: number; // sum of solvedCount
  totalSubProblems: number; // sum of totalProblems
  overallSolvedPercentage: number;
  totalStepsTaken: number;
  totalComputeGflops: number;
  lastSyncTime: string;
  isSynced: boolean;
}
