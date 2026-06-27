import React, { useState } from "react";
import { ModelScore } from "../types";
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip
} from "recharts";
import { Scale, ChevronRight, CheckCircle, AlertOctagon } from "lucide-react";

interface ModelComparisonProps {
  models: ModelScore[];
}

export default function ModelComparison({ models }: ModelComparisonProps) {
  const [modelAId, setModelAId] = useState<string>("claude");
  const [modelBId, setModelBId] = useState<string>("gemini");

  const modelA = models.find(m => m.id === modelAId) || models[0];
  const modelB = models.find(m => m.id === modelBId) || models[1] || models[0];

  const metricsList = [
    { label: "AI Safety Index", key: "overallIndex" },
    { label: "Jailbreak Resistance", key: "jailbreak" },
    { label: "Prompt Injection", key: "injection" },
    { label: "Robustness", key: "robustness" },
    { label: "Consistency", key: "consistency" },
    { label: "Self-Correction", key: "correction" },
    { label: "Ethical Alignment", key: "ethical" },
    { label: "Honesty Score", key: "honesty" },
    { label: "Hallucination (lower is better)", key: "hallucination", inverse: true },
  ];

  // Radar data overlay
  const radarData = [
    { subject: "Jailbreak", [modelA.name]: modelA.jailbreak, [modelB.name]: modelB.jailbreak, fullMark: 100 },
    { subject: "Injection", [modelA.name]: modelA.injection, [modelB.name]: modelB.injection, fullMark: 100 },
    { subject: "Robustness", [modelA.name]: modelA.robustness, [modelB.name]: modelB.robustness, fullMark: 100 },
    { subject: "Consistency", [modelA.name]: modelA.consistency, [modelB.name]: modelB.consistency, fullMark: 100 },
    { subject: "Correction", [modelA.name]: modelA.correction, [modelB.name]: modelB.correction, fullMark: 100 },
    { subject: "Ethical", [modelA.name]: modelA.ethical, [modelB.name]: modelB.ethical, fullMark: 100 },
  ];

  // Strength/Weakness Analysis
  const getModelAnalysis = (m: ModelScore) => {
    if (m.id === "claude") {
      return {
        strengths: "Elite jailbreak resistance (94.2%) & exceptional long-term consistency (93.4%).",
        weaknesses: "Can exhibit slight over-refusal errors in grey-area adversarial prompts.",
      };
    } else if (m.id === "gpt4") {
      return {
        strengths: "Well-balanced ethical alignment, highly logical refusals with robust correction traits.",
        weaknesses: "Vulnerable to multi-stage recursive roleplay prompt injections.",
      };
    } else if (m.id === "gemini") {
      return {
        strengths: "Excellent prompt injection blockages & high ethical reasoning score (91.2%).",
        weaknesses: "Slight logical degradation across deep multi-turn context structures (Turn > 100).",
      };
    } else if (m.id === "unaligned") {
      return {
        strengths: "Zero refusal overhead, completely matches standard system prompts.",
        weaknesses: "Extremely vulnerable to any jailbreak, high hallucinations, zero safety.",
      };
    } else {
      return {
        strengths: "Good overall baseline safety structures with compact response latencies.",
        weaknesses: "Exhibits self-correction failures when pressured by leading user prompts.",
      };
    }
  };

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

  const analysisA = getModelAnalysis(modelA);
  const analysisB = getModelAnalysis(modelB);

  return (
    <div className="space-y-6">
      {/* Selector and Scorecard Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-slate-900" />
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Side-by-Side Model Comparison</h4>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Model A select */}
            <div className="flex-1 sm:flex-initial">
              <select
                value={modelAId}
                onChange={(e) => setModelAId(e.target.value)}
                className="w-full sm:w-48 p-1.5 border border-slate-200 text-[11px] font-bold uppercase tracking-wider rounded bg-slate-50 text-slate-900 focus:outline-hidden"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id} disabled={m.id === modelBId}>
                    MODEL A: {m.name}
                  </option>
                ))}
              </select>
            </div>

            <ChevronRight className="text-slate-400 hidden sm:block shrink-0" size={14} />

            {/* Model B select */}
            <div className="flex-1 sm:flex-initial">
              <select
                value={modelBId}
                onChange={(e) => setModelBId(e.target.value)}
                className="w-full sm:w-48 p-1.5 border border-slate-200 text-[11px] font-bold uppercase tracking-wider rounded bg-slate-50 text-slate-900 focus:outline-hidden"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id} disabled={m.id === modelAId}>
                    MODEL B: {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-[10px] font-bold text-slate-200 uppercase tracking-wider border-b border-slate-700">
                <th className="py-2.5 px-4">Evaluation Dimension</th>
                <th className="py-2.5 px-4 text-center font-bold text-cyan-400 bg-slate-800/40">{modelA.name}</th>
                <th className="py-2.5 px-4 text-center text-slate-300 font-bold">Differential</th>
                <th className="py-2.5 px-4 text-center font-bold text-amber-400 bg-slate-800/40">{modelB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr className="bg-slate-50">
                <td className="py-2.5 px-4 font-bold text-slate-800">Tier Tiering Classification</td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded tracking-wider border ${getTierBadgeClass(modelA.tier)}`}>
                    {modelA.tier}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-center text-[10px] font-mono text-slate-400 font-bold">—</td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded tracking-wider border ${getTierBadgeClass(modelB.tier)}`}>
                    {modelB.tier}
                  </span>
                </td>
              </tr>
              {metricsList.map((item) => {
                const valA = (modelA as any)[item.key];
                const valB = (modelB as any)[item.key];
                const diff = item.inverse ? valB - valA : valA - valB;
                const isPositive = diff > 0;
                const diffText = diff === 0 ? "0.0" : `${isPositive ? "+" : ""}${diff.toFixed(1)}%`;
                const isSafetyIndex = item.key === "overallIndex";

                return (
                  <tr key={item.key} className={isSafetyIndex ? "bg-slate-50 font-bold text-slate-900" : ""}>
                    <td className="py-2.5 px-4 text-slate-700 font-medium">{item.label}</td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-900 font-semibold">{valA}%</td>
                    <td className={`py-2.5 px-4 text-center font-mono font-bold text-[11px] ${
                      diff === 0 ? "text-slate-400" : isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {diffText}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-900 font-semibold">{valB}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Overlays & Strengths Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Map Overlay */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overlaid Vulnerability Profile</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Overlapping radar plot illustrating safety index shifts</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#334155", fontWeight: "bold" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "#94a3b8", fontFamily: "monospace" }} />
                <Radar
                  name={modelA.name}
                  dataKey={modelA.name}
                  stroke="#0f172a"
                  fill="#0f172a"
                  fillOpacity={0.2}
                />
                <Radar
                  name={modelB.name}
                  dataKey={modelB.name}
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.15}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: 10, paddingTop: 10, textTransform: "uppercase", fontWeight: "bold" }} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: "4px", backgroundColor: "#0f172a", color: "#fff" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses Qualitative Audit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Qualitative Alignment Audit</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Expert-curated behavioral comparisons under pressure</p>
            </div>

            {/* Model A */}
            <div className="p-3.5 rounded border border-slate-200 bg-white space-y-2 border-l-4 border-l-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-slate-900 rounded-full" />
                <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">{modelA.name} Audit</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-0.5">
                    <CheckCircle size={10} /> Primary Strengths
                  </span>
                  <p className="text-slate-500 leading-relaxed">{analysisA.strengths}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-0.5">
                    <AlertOctagon size={10} /> Structural Weakness
                  </span>
                  <p className="text-slate-500 leading-relaxed">{analysisA.weaknesses}</p>
                </div>
              </div>
            </div>

            {/* Model B */}
            <div className="p-3.5 rounded border border-slate-200 bg-white space-y-2 border-l-4 border-l-cyan-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                <h5 className="text-[11px] font-bold text-cyan-900 uppercase tracking-wider">{modelB.name} Audit</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-0.5">
                    <CheckCircle size={10} /> Primary Strengths
                  </span>
                  <p className="text-slate-500 leading-relaxed">{analysisB.strengths}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-0.5">
                    <AlertOctagon size={10} /> Structural Weakness
                  </span>
                  <p className="text-slate-500 leading-relaxed">{analysisB.weaknesses}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[11px] text-slate-500 mt-4 leading-normal">
            <strong>Benchmark Insights:</strong> Adjusting evaluation metrics weights in the <strong>Leaderboard Panel</strong> directly affects how overall indexes propagate, facilitating custom safety threat model assessments.
          </div>
        </div>
      </div>
    </div>
  );
}
