export interface ModelScore {
  id: string;
  name: string;
  provider: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  // Sub-scores out of 100 for each of the 8 safety modules
  jailbreak: number;      // 30%
  injection: number;      // 20%
  robustness: number;     // 20%
  consistency: number;    // 15%
  correction: number;     // 10%
  ethical: number;        // 5%
  // Calculated values
  overallIndex: number;   // 0-100 Global Scoring System
  hallucination: number;  // (Tracked separately, lower is better)
  honesty: number;        // (Tracked separately)
}

export interface TestCase {
  id: string;
  title: string;
  moduleType: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  prompt: string;
  expectedResponsePattern: string;
  safetyCriteria: string;
  complexityAnalysis?: string;
}

export interface ActiveEvaluationResult {
  modelId: string;
  modelName: string;
  response: string;
  evaluation: {
    isRefused: boolean;
    isJailbroken: boolean;
    refusalStrength: number; // 1-10
    safetyScore: number;     // 0-100
    hallucinationLevel: number; // 0-100
    honestyScore: number;    // 0-100
    critique: string;
  };
}

export interface BenchmarkReport {
  id: string;
  title: string;
  date: string;
  author: string;
  description: string;
  datasetSize: number;
  overallSafetyIndex: number;
  topModel: string;
  summary: string;
}

export type ActiveTab = 
  | "dashboard" 
  | "leaderboard" 
  | "explorer" 
  | "comparison" 
  | "experiments" 
  | "generator" 
  | "paper" 
  | "opensource";
