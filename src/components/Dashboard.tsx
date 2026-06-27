import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { ShieldAlert, Brain, Award, AlertTriangle, ArrowUpRight } from "lucide-react";
import { ModelScore } from "../types";

interface DashboardProps {
  models: ModelScore[];
  weights: Record<string, number>;
  onTabChange: (tab: any) => void;
}

export default function Dashboard({ models, weights, onTabChange }: DashboardProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("claude");

  // Format data for model scores chart
  const barChartData = models
    .map(m => ({
      name: m.name,
      "AI Safety Index": Number(m.overallIndex.toFixed(1)),
      "Hallucination Rate": Number(m.hallucination.toFixed(1)),
    }))
    .sort((a, b) => b["AI Safety Index"] - a["AI Safety Index"]);

  // Multi-radar chart data for a selected model
  const activeModel = models.find(m => m.id === selectedModelId) || models[0];
  const radarData = [
    { subject: "Jailbreak Resist.", value: activeModel.jailbreak, fullMark: 100 },
    { subject: "Prompt Injection", value: activeModel.injection, fullMark: 100 },
    { subject: "Robustness", value: activeModel.robustness, fullMark: 100 },
    { subject: "Consistency", value: activeModel.consistency, fullMark: 100 },
    { subject: "Self-Correction", value: activeModel.correction, fullMark: 100 },
    { subject: "Ethical Alignment", value: activeModel.ethical, fullMark: 100 },
  ];

  // Failure rates by module data for heatmap representation
  const moduleFailures = [
    { name: "Jailbreak Resistance", rate: "21.4%", risk: "Critical", color: "border-l-2 border-rose-500 bg-white text-slate-800" },
    { name: "Prompt Injection", rate: "24.8%", risk: "High", color: "border-l-2 border-orange-500 bg-white text-slate-800" },
    { name: "Adversarial Robustness", rate: "27.1%", risk: "High", color: "border-l-2 border-orange-500 bg-white text-slate-800" },
    { name: "Long-Term Consistency", rate: "18.3%", risk: "Medium", color: "border-l-2 border-amber-500 bg-white text-slate-800" },
    { name: "Hallucination Susceptibility", rate: "31.5%", risk: "High", color: "border-l-2 border-orange-500 bg-white text-slate-800" },
    { name: "Self-Correction rate", rate: "35.2%", risk: "Critical", color: "border-l-2 border-rose-500 bg-white text-slate-800" },
    { name: "Ethical Reasoning Dilemmas", rate: "15.1%", risk: "Low", color: "border-l-2 border-green-500 bg-white text-slate-800" },
  ];

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="stat-index" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Avg Safety Index</p>
            <h3 className="text-2xl font-mono font-bold text-slate-900 mt-2">
              {(models.reduce((acc, m) => acc + m.overallIndex, 0) / models.length).toFixed(1)} <span className="text-sm font-normal text-slate-400">/100</span>
            </h3>
            <p className="text-[10px] text-emerald-600 mt-1 font-bold uppercase tracking-wider">
              +1.4% change last cycle
            </p>
          </div>
          <div className="p-2 bg-slate-900 text-cyan-400 rounded-md">
            <ShieldAlert size={18} />
          </div>
        </div>

        <div id="stat-models" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Evaluated Models</p>
            <h3 className="text-2xl font-mono font-bold text-slate-900 mt-2">
              {models.length} <span className="text-sm font-normal text-slate-400">LLMs</span>
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">
              Commercial & Open
            </p>
          </div>
          <div className="p-2 bg-slate-900 text-cyan-400 rounded-md">
            <Brain size={18} />
          </div>
        </div>

        <div id="stat-scenarios" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Scenarios</p>
            <h3 className="text-2xl font-mono font-bold text-slate-900 mt-2">35,000</h3>
            <p className="text-[10px] text-cyan-600 mt-1 font-bold uppercase tracking-wider">
              8 Research Modules
            </p>
          </div>
          <div className="p-2 bg-slate-900 text-cyan-400 rounded-md">
            <Award size={18} />
          </div>
        </div>

        <div id="stat-vulnerability" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Risk Rate</p>
            <h3 className="text-2xl font-mono font-bold text-rose-600 mt-2">35.2%</h3>
            <p className="text-[10px] text-rose-500 mt-1 font-bold uppercase tracking-wider">
              Failed Self-Correction
            </p>
          </div>
          <div className="p-2 bg-slate-900 text-rose-400 rounded-md">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Leaderboard Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Benchmark Standing</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Comparing Global Safety Index vs. Hallucination Rates (lower is better)</p>
            </div>
            <button 
              onClick={() => onTabChange("leaderboard")}
              className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-tighter hover:bg-slate-800 flex items-center gap-1 shrink-0"
            >
              Adjust weights <ArrowUpRight size={11} />
            </button>
          </div>
          <div className="h-72 w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "6px", border: "none", color: "#fff", fontSize: "11px" }}
                  labelStyle={{ fontWeight: "bold", color: "#22d3ee" }}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase" }} />
                <Bar dataKey="AI Safety Index" fill="#0f172a" radius={[2, 2, 0, 0]} barSize={20} />
                <Bar dataKey="Hallucination Rate" fill="#f43f5e" radius={[2, 2, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Model Profile Radar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Model Vulnerability Profile</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">A detailed breakdown of scores by safety vector</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {models.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModelId(m.id)}
                className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-tighter transition-all border ${
                  selectedModelId === m.id
                    ? "bg-slate-900 border-slate-900 text-cyan-400 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {m.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: "#475569", fontWeight: "bold" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "#94a3b8", fontFamily: "monospace" }} />
                <Radar
                  name={activeModel.name}
                  dataKey="value"
                  stroke="#0891b2"
                  fill="#06b6d4"
                  fillOpacity={0.25}
                />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: "4px", backgroundColor: "#0f172a", color: "#fff" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center p-2 bg-slate-900 text-white rounded-lg flex items-center justify-between px-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tier Profile</span>
            <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
              {activeModel.tier}
            </span>
          </div>
        </div>
      </div>

      {/* Vulnerability Heatmap Section & Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap column */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Failure Rates by Vector</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Academic summary of benchmark bypass rates</p>
          </div>
          <div className="space-y-2">
            {moduleFailures.map((item, idx) => (
              <div 
                key={idx}
                className={`p-2.5 rounded border border-slate-200 flex items-center justify-between ${item.color}`}
              >
                <div>
                  <h5 className="text-[11px] font-bold text-slate-800 leading-tight">{item.name}</h5>
                  <span className="text-[9px] font-bold opacity-80 uppercase tracking-wider text-slate-400">
                    Risk: {item.risk}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-900">{item.rate}</span>
                  <p className="text-[8px] uppercase tracking-wider text-slate-400">Bypass</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive summary and Core Research Questions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Academic Executive Summary</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Initial observations from the AI Safety Arena Benchmark</p>
          </div>

          <div className="text-xs text-slate-600 space-y-3 leading-relaxed font-sans">
            <p>
              In our comprehensive benchmark of eight state-of-the-art Large Language Models, we evaluate robustness, honesty, and safety across 35,000 rigorous adversarial tests. The evaluation reveals significant discrepancies between commercial frontier models and open-weights models.
            </p>
            <p>
              While commercial models like <strong className="text-slate-900 font-semibold font-display">Claude 3.5 Sonnet</strong> and <strong className="text-slate-900 font-semibold font-display">GPT-4o</strong> exhibit high resistance to direct jailbreak attacks, they remain vulnerable to complex, indirect prompt injections hidden in context documents.
            </p>
            <p>
              The area of greatest concern is <strong className="text-slate-900 font-semibold font-display">Model Self-Correction (Module 7)</strong>. Under adversarial peer pressure (where the user insists the model's correct logic is wrong), models exhibit a tendency to submit to false premises, yielding a high failure rate of <strong className="text-rose-600 font-mono font-bold">35.2%</strong>.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Core Research Inquiries</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600">
              <div className="flex gap-2 items-start">
                <span className="w-4 h-4 bg-slate-900 text-cyan-400 font-mono rounded flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">01</span>
                <span>Do commercial alignment methods over-refuse safe prompts under adversarial framing?</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-4 h-4 bg-slate-900 text-cyan-400 font-mono rounded flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">02</span>
                <span>To what extent can honest models be incentivized to output deceptive summaries?</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-4 h-4 bg-slate-900 text-cyan-400 font-mono rounded flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">03</span>
                <span>How does conversational length impact goal persistence and consistency?</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-4 h-4 bg-slate-900 text-cyan-400 font-mono rounded flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">04</span>
                <span>Are open-weights models structurally more prone to prompt injections?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
