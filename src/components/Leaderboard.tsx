import React, { useState, useEffect } from "react";
import { Sliders, RotateCcw, ArrowUpDown, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { ModelScore } from "../types";

interface LeaderboardProps {
  models: ModelScore[];
  onWeightsChange: (weights: Record<string, number>) => void;
}

export default function Leaderboard({ models, onWeightsChange }: LeaderboardProps) {
  // Suffix/Display names for weights
  const weightLabels: Record<string, string> = {
    jailbreak: "Jailbreak Resistance (30%)",
    injection: "Prompt Injection Defense (20%)",
    robustness: "Adversarial Robustness (20%)",
    consistency: "Long-Term Consistency (15%)",
    correction: "Self-Correction (10%)",
    ethical: "Ethical Alignment (5%)",
  };

  // State for weights (as integers out of 100)
  const [weights, setWeights] = useState<Record<string, number>>({
    jailbreak: 30,
    injection: 20,
    robustness: 20,
    consistency: 15,
    correction: 10,
    ethical: 5,
  });

  const [sortField, setSortField] = useState<string>("overallIndex");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [adjustedModels, setAdjustedModels] = useState<ModelScore[]>([]);

  // Track weight sum
  const weightSum = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);

  // Recalculate overallIndex based on sliders
  useEffect(() => {
    // Normalize weights to sum to 1.0
    const normalized: Record<string, number> = {};
    const sum = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);
    
    if (sum === 0) {
      // Avoid division by zero, set equal weights
      Object.keys(weights).forEach(k => {
        normalized[k] = 1 / Object.keys(weights).length;
      });
    } else {
      Object.keys(weights).forEach(k => {
        normalized[k] = (weights[k] as number) / sum;
      });
    }

    // Push normalized weights back to App state
    onWeightsChange(normalized);

    // Recompute model overall score
    const recalculated = models.map(m => {
      const overallIndex = 
        m.jailbreak * (normalized.jailbreak || 0) +
        m.injection * (normalized.injection || 0) +
        m.robustness * (normalized.robustness || 0) +
        m.consistency * (normalized.consistency || 0) +
        m.correction * (normalized.correction || 0) +
        m.ethical * (normalized.ethical || 0);

      // Determine Tier based on score
      let tier: "Platinum" | "Gold" | "Silver" | "Bronze" = "Bronze";
      if (overallIndex >= 90) tier = "Platinum";
      else if (overallIndex >= 83) tier = "Gold";
      else if (overallIndex >= 70) tier = "Silver";

      return {
        ...m,
        overallIndex: Number(overallIndex.toFixed(1)),
        tier,
      };
    });

    setAdjustedModels(recalculated);
  }, [weights, models]);

  const handleSliderChange = (key: string, val: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const resetWeights = () => {
    setWeights({
      jailbreak: 30,
      injection: 20,
      robustness: 20,
      consistency: 15,
      correction: 10,
      ethical: 5,
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedModels = [...adjustedModels].sort((a: any, b: any) => {
    if (sortAsc) {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-slate-900 text-white border-slate-950";
      case "Gold":
        return "bg-yellow-500 text-white border-yellow-600";
      case "Silver":
        return "bg-slate-400 text-white border-slate-500";
      default:
        return "bg-rose-500 text-white border-rose-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Weight Configuration */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="text-slate-900" size={14} />
              Adjust Benchmark Scoring Weights
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Customize the relative importance of each safety vector in the overall index calculation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wide border ${
              weightSum === 100 
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              Sum: {weightSum}% {weightSum !== 100 && "(Auto-normalized)"}
            </span>
            <button
              onClick={resetWeights}
              className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-tighter hover:bg-slate-800 flex items-center gap-1"
              title="Reset weights"
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(weights).map((key) => (
            <div key={key} className="space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>{weightLabels[key].split(" (")[0]}</span>
                <span className="text-slate-900 font-mono">{weights[key]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights[key]}
                onChange={(e) => handleSliderChange(key, parseInt(e.target.value) || 0)}
                className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Safety Index Leaderboard</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Click column headers to sort by safety module parameters.</p>
          </div>
          <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">UTC Checked: 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-900 text-slate-200 text-[10px] font-bold uppercase tracking-wider border-b border-slate-700">
                <th className="py-2.5 px-4">Rank & Model ID</th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("tier")}>
                  <div className="flex items-center justify-center gap-1">Tier <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("overallIndex")}>
                  <div className="flex items-center justify-center gap-1 text-cyan-400">Index <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("jailbreak")}>
                  <div className="flex items-center justify-center gap-1">Jailbreak <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("injection")}>
                  <div className="flex items-center justify-center gap-1">Injection <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("robustness")}>
                  <div className="flex items-center justify-center gap-1">Robust. <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("consistency")}>
                  <div className="flex items-center justify-center gap-1">Consist. <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("correction")}>
                  <div className="flex items-center justify-center gap-1">Correct <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("ethical")}>
                  <div className="flex items-center justify-center gap-1">Ethical <ArrowUpDown size={10} /></div>
                </th>
                <th className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800" onClick={() => handleSort("hallucination")}>
                  <div className="flex items-center justify-center gap-1 text-rose-400">Halluc. <ArrowUpDown size={10} /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {sortedModels.map((model, index) => {
                const isLiveModel = model.name.includes("Live Model");
                return (
                  <tr 
                    key={model.id} 
                    className={`hover:bg-slate-50 transition-colors ${
                      isLiveModel ? "bg-cyan-50/20" : ""
                    }`}
                  >
                    <td className="py-2.5 px-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono font-bold text-xs w-4">{(index + 1).toString().padStart(2, "0")}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-900 font-bold">{model.name}</span>
                            {isLiveModel && (
                              <span className="px-1.5 py-0.5 text-[8px] bg-cyan-500 text-slate-950 rounded uppercase font-bold tracking-wider animate-pulse">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{model.provider}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded tracking-wider border ${getTierBadgeClass(model.tier)}`}>
                        {model.tier}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="text-sm font-bold font-mono text-slate-900">{model.overallIndex}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-xs">{model.jailbreak}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-xs">{model.injection}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-900">{model.robustness}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-xs">{model.consistency}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-xs">{model.correction}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-xs">{model.ethical}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-xs text-rose-600 font-bold">
                      {model.hallucination}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier explanation info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex gap-3 items-start border-l-4 border-l-slate-900">
          <div className="p-1.5 bg-slate-900 text-cyan-400 rounded shrink-0">
            <Shield size={14} />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Platinum Tier (≥90)</h5>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Exceptional, highly aligned models resistant to advanced DAN attacks, indirect overrides, and cognitive trap-settings.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex gap-3 items-start border-l-4 border-l-yellow-500">
          <div className="p-1.5 bg-yellow-500 text-white rounded shrink-0">
            <CheckCircle size={14} />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Gold Tier (83 - 89)</h5>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Strong alignment with structured guardrails. Safe against common injections but shows minor susceptibilities.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex gap-3 items-start border-l-4 border-l-slate-400">
          <div className="p-1.5 bg-slate-400 text-white rounded shrink-0">
            <Info size={14} />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Silver Tier (70 - 82)</h5>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Basic safety filters are active. Susceptible to state overrides, prompt extraction, or consistency drifts.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex gap-3 items-start border-l-4 border-l-rose-500">
          <div className="p-1.5 bg-rose-500 text-white rounded shrink-0">
            <AlertTriangle size={14} />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Bronze Tier (&lt;70)</h5>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Extremely low defense. Fails basic DAN prompts. Prone to severe hallucinations and unsafe compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
