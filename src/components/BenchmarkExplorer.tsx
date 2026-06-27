import React, { useState } from "react";
import { TestCase } from "../types";
import { Search, Compass, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

interface BenchmarkExplorerProps {
  testCases: TestCase[];
  onSelectTestCaseForEvaluation: (testCase: TestCase) => void;
}

export default function BenchmarkExplorer({ testCases, onSelectTestCaseForEvaluation }: BenchmarkExplorerProps) {
  const [selectedModule, setSelectedModule] = useState<string>("All Modules");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(testCases[0]?.id || "");

  const modules = [
    "All Modules",
    "Jailbreak Resistance",
    "Prompt Injection",
    "Hallucination Detection",
    "Honesty Benchmark",
    "Ethical Reasoning",
    "Long-Term Consistency",
    "Self-Correction",
    "Adversarial Robustness",
  ];

  // Filter test cases
  const filteredCases = testCases.filter((tc) => {
    const matchesModule = selectedModule === "All Modules" || tc.moduleType === selectedModule;
    const matchesSearch = 
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const activeTestCase = testCases.find(tc => tc.id === selectedTestCaseId) || filteredCases[0] || testCases[0];

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Expert":
        return "bg-rose-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded";
      case "Hard":
        return "bg-orange-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded";
      case "Medium":
        return "bg-yellow-500 text-slate-950 text-[9px] font-bold uppercase px-2 py-0.5 rounded";
      default:
        return "bg-slate-400 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar: Navigation, Search, Filter & List */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 lg:col-span-1 flex flex-col h-[700px]">
        <div className="space-y-1 shrink-0 border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Compass size={14} className="text-slate-900" />
            Benchmark Registry
          </h4>
          <p className="text-[11px] text-slate-400">
            Explore active empirical test cases.
          </p>
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search test scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 text-xs rounded-lg bg-slate-50/50 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-1 overflow-x-auto pb-2 shrink-0 border-b border-slate-100 -mx-1 px-1 scrollbar-none">
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-full border shrink-0 transition-all uppercase tracking-tighter ${
                selectedModule === mod
                  ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {mod.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Case List - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredCases.length > 0 ? (
            filteredCases.map((tc) => (
              <button
                key={tc.id}
                onClick={() => setSelectedTestCaseId(tc.id)}
                className={`w-full p-2.5 text-left rounded-lg border transition-all flex flex-col gap-1 ${
                  selectedTestCaseId === tc.id
                    ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                    : "bg-slate-50/40 border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    selectedTestCaseId === tc.id 
                      ? "bg-slate-800 text-cyan-400 border border-slate-700"
                      : "bg-slate-200 text-slate-700 border border-slate-300"
                  }`}>
                    {tc.moduleType.split(" ")[0]}
                  </span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    selectedTestCaseId === tc.id 
                      ? "bg-slate-800 text-slate-300" 
                      : getDifficultyBadge(tc.difficulty)
                  }`}>
                    {tc.difficulty}
                  </span>
                </div>
                <h5 className={`text-xs font-bold mt-1 truncate ${selectedTestCaseId === tc.id ? "text-white" : "text-slate-900"}`}>
                  {tc.title}
                </h5>
                <p className={`text-[10px] truncate ${selectedTestCaseId === tc.id ? "text-slate-300" : "text-slate-400"}`}>
                  {tc.prompt}
                </p>
              </button>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
              No matching scenarios.
            </div>
          )}
        </div>
      </div>

      {/* Main Details Panel */}
      {activeTestCase ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-2 p-5 flex flex-col h-[700px] justify-between">
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-200 bg-slate-50 -mx-5 -mt-5 p-5">
              <div>
                <span className="text-[10px] font-bold text-cyan-600 bg-cyan-100/60 px-2 py-0.5 rounded uppercase tracking-widest font-mono">
                  {activeTestCase.moduleType} — {activeTestCase.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">{activeTestCase.title}</h3>
              </div>
              <div className="shrink-0">
                {getDifficultyBadge(activeTestCase.difficulty)}
              </div>
            </div>

            {/* Input Prompt Panel */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={13} className="text-slate-900" />
                Adversarial Input Prompt
              </h5>
              <div className="bg-slate-900 text-slate-100 border border-slate-950 p-4 rounded-lg font-mono text-[11px] leading-relaxed select-all whitespace-pre-wrap shadow-inner">
                {activeTestCase.prompt}
              </div>
            </div>

            {/* expectedResponsePattern */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Expected Response Standard
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/20 border border-emerald-100 p-3 rounded-lg font-sans">
                {activeTestCase.expectedResponsePattern}
              </p>
            </div>

            {/* Complexity and Safety Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-1">
                <h6 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Safety Boundaries Tested</h6>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  {activeTestCase.safetyCriteria}
                </p>
              </div>

              {activeTestCase.complexityAnalysis && (
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-1">
                  <h6 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Academic Complexity Analysis</h6>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {activeTestCase.complexityAnalysis}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Call to action at bottom */}
          <div className="border-t border-slate-200 pt-3.5 mt-3 flex justify-between items-center bg-white shrink-0">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
              ID: {activeTestCase.id}
            </span>
            <button
              onClick={() => onSelectTestCaseForEvaluation(activeTestCase)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[10px] font-bold uppercase tracking-tighter rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
            >
              Run Real-time Sandbox Simulation <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-2 p-12 flex items-center justify-center text-slate-400 text-sm h-[700px] uppercase font-bold tracking-widest">
          Select an empirical test scenario.
        </div>
      )}
    </div>
  );
}
