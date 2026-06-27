import React, { useState } from "react";
import { 
  BarChart3, Award, Compass, Scale, Terminal, Database, FileText, Github, 
  ShieldAlert, ShieldCheck, Heart, AlertTriangle 
} from "lucide-react";
import { ModelScore, TestCase, ActiveTab } from "./types";
import { INITIAL_MODELS, INITIAL_TEST_CASES, DEFAULT_WEIGHTS } from "./data/datasets";

// Import modular sub-components
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import BenchmarkExplorer from "./components/BenchmarkExplorer";
import ModelComparison from "./components/ModelComparison";
import ExperimentManager from "./components/ExperimentManager";
import DatasetGenerator from "./components/DatasetGenerator";
import PaperGenerator from "./components/PaperGenerator";
import OpenSourceCenter from "./components/OpenSourceCenter";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [models, setModels] = useState<ModelScore[]>(INITIAL_MODELS);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [weights, setWeights] = useState<Record<string, number>>({
    jailbreak: 0.30,
    injection: 0.20,
    robustness: 0.20,
    consistency: 0.15,
    correction: 0.10,
    ethical: 0.05,
  });

  // Handle deep-linking from Benchmark Explorer to sandbox simulation
  const handleSelectTestCaseForEvaluation = (tc: TestCase) => {
    setSelectedTestCase(tc);
    setActiveTab("experiments");
  };

  // Add dynamically synthesized test case to local registry
  const handleImportTestCase = (tc: TestCase) => {
    setTestCases((prev) => [tc, ...prev]);
  };

  // Track weight adjustments to synchronize Leaderboard updates across other views
  const handleWeightsChange = (newWeights: Record<string, number>) => {
    setWeights(newWeights);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
      {/* High Density Premium Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white h-16 flex items-center justify-between px-6 shrink-0 shadow-lg border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 p-2 rounded-md shrink-0">
            <ShieldAlert size={20} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold leading-none tracking-tight flex items-center gap-2">
              AI SAFETY ARENA 
              <span className="text-cyan-400 font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider">v1.4.2-RC</span>
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-semibold uppercase mt-1 tracking-wider">
              Advanced Adversarial Research & LLM Benchmarking Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 shrink-0">
          <div className="hidden sm:block text-right border-r border-slate-700 pr-4 md:pr-8">
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total Tests Conducted</div>
            <div className="text-base md:text-lg font-mono font-bold text-cyan-400 leading-none mt-0.5">142,508</div>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 text-[10px] md:text-xs">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="font-semibold uppercase tracking-tight text-slate-200">Live Engine Active</span>
          </div>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 shrink-0 sticky top-16 z-40 py-2.5">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
            {/* Tab 1: Dashboard */}
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "dashboard"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <BarChart3 size={13} />
              Dashboard
            </button>

            {/* Tab 2: Leaderboard */}
            <button
              id="tab-leaderboard"
              onClick={() => setActiveTab("leaderboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "leaderboard"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <Award size={13} />
              Leaderboards
            </button>

            {/* Tab 3: Explorer */}
            <button
              id="tab-explorer"
              onClick={() => setActiveTab("explorer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "explorer"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <Compass size={13} />
              Benchmark Explorer
            </button>

            {/* Tab 4: Comparison */}
            <button
              id="tab-comparison"
              onClick={() => setActiveTab("comparison")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "comparison"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <Scale size={13} />
              Model Comparison
            </button>

            {/* Tab 5: Real-time Simulator */}
            <button
              id="tab-experiments"
              onClick={() => setActiveTab("experiments")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "experiments"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <Terminal size={13} />
              Active Sandbox Arena
            </button>

            {/* Tab 6: Dataset Generator */}
            <button
              id="tab-generator"
              onClick={() => setActiveTab("generator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "generator"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <Database size={13} />
              Dataset Generator
            </button>

            {/* Tab 7: Academic Paper */}
            <button
              id="tab-paper"
              onClick={() => setActiveTab("paper")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "paper"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <FileText size={13} />
              Automated Paper Writer
            </button>

            {/* Tab 8: Open Source Github */}
            <button
              id="tab-opensource"
              onClick={() => setActiveTab("opensource")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all shrink-0 border ${
                activeTab === "opensource"
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-sm font-bold"
                  : "bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 font-medium"
              }`}
            >
              <Github size={13} />
              Repository Docs
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content View with elegant margins and adaptive spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <div className="transition-all duration-300">
          {activeTab === "dashboard" && (
            <Dashboard models={models} weights={weights} onTabChange={setActiveTab} />
          )}

          {activeTab === "leaderboard" && (
            <Leaderboard models={models} onWeightsChange={handleWeightsChange} />
          )}

          {activeTab === "explorer" && (
            <BenchmarkExplorer 
              testCases={testCases} 
              onSelectTestCaseForEvaluation={handleSelectTestCaseForEvaluation} 
            />
          )}

          {activeTab === "comparison" && (
            <ModelComparison models={models} />
          )}

          {activeTab === "experiments" && (
            <ExperimentManager 
              selectedTestCase={selectedTestCase} 
              onClearSelectedTestCase={() => setSelectedTestCase(null)} 
            />
          )}

          {activeTab === "generator" && (
            <DatasetGenerator onImportTestCase={handleImportTestCase} />
          )}

          {activeTab === "paper" && (
            <PaperGenerator models={models} />
          )}

          {activeTab === "opensource" && (
            <OpenSourceCenter />
          )}
        </div>
      </main>

      {/* Clean Academic Footer */}
      <footer className="bg-white border-t border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 uppercase tracking-wide font-display">AI Safety Arena</span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">STATUS: BENCHMARKING ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <span>Upholding Safety & Reproducible Science</span>
            <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <div className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">
            © 2026 AI SAFETY RESEARCH GROUP • MIT LICENSE
          </div>
        </div>
      </footer>
    </div>
  );
}
