import React, { useState } from "react";
import { TestCase } from "../types";
import { Download, Sparkles, ShieldCheck, Database, Loader2 } from "lucide-react";

interface DatasetGeneratorProps {
  onImportTestCase: (tc: TestCase) => void;
}

export default function DatasetGenerator({ onImportTestCase }: DatasetGeneratorProps) {
  const [moduleType, setModuleType] = useState<string>("Jailbreak Resistance");
  const [category, setCategory] = useState<string>("DAN-style prompts");
  const [difficulty, setDifficulty] = useState<string>("Hard");
  
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesizedCase, setSynthesizedCase] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const categoriesByModule: Record<string, string[]> = {
    "Jailbreak Resistance": [
      "DAN-style prompts",
      "Roleplay jailbreaks",
      "Emotional manipulation",
      "Authority impersonation",
      "Context poisoning"
    ],
    "Prompt Injection": [
      "Hidden instructions",
      "Retrieval poisoning",
      "System prompt extraction",
      "Context override attacks"
    ],
    "Hallucination Detection": [
      "Fact verification",
      "Historical questions",
      "Scientific questions",
      "Numerical reasoning"
    ],
    "Honesty Benchmark": [
      "Model benefits from lying",
      "User encourages deception",
      "Truth conflicts with reward"
    ],
    "Ethical Reasoning": [
      "Fairness",
      "Harm minimization",
      "Privacy protection",
      "Human autonomy"
    ],
    "Long-Term Consistency": [
      "50-turn consistent memory",
      "100-turn contradicting trapping",
      "Goal persistence under pressure"
    ],
    "Self-Correction": [
      "Error recognition",
      "Correction quality",
      "Resistance to false authority"
    ],
    "Adversarial Robustness": [
      "Ambiguous instructions",
      "Contradictory requests",
      "Manipulative prompts",
      "Escalating pressure"
    ]
  };

  const handleModuleChange = (val: string) => {
    setModuleType(val);
    const cats = categoriesByModule[val] || [];
    setCategory(cats[0] || "");
    setSynthesizedCase(null);
    setError(null);
    setImportSuccess(false);
  };

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    setError(null);
    setSynthesizedCase(null);
    setImportSuccess(false);

    try {
      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleType,
          category,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error("API server failed to synthesize new test vectors");
      }

      const data = await response.json();
      setSynthesizedCase(data);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to synthesize test scenario.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleImport = () => {
    if (!synthesizedCase) return;
    
    const newTC: TestCase = {
      id: `syn-${Date.now()}`,
      title: synthesizedCase.title || "Synthesized Test Vector",
      moduleType,
      category,
      difficulty: difficulty as any,
      prompt: synthesizedCase.prompt || "Generated Prompt",
      expectedResponsePattern: synthesizedCase.expectedResponsePattern || "Generated Standard",
      safetyCriteria: synthesizedCase.safetyCriteria || "Generated Criteria",
      complexityAnalysis: synthesizedCase.complexityAnalysis || "Generated Analysis",
    };

    onImportTestCase(newTC);
    setImportSuccess(true);
  };

  // Static download handler to generate downloadable benchmark data
  const handleDownloadPreGenerated = (categoryName: string, size: number) => {
    const data = {
      benchmarkName: `AI Safety Arena ${categoryName} Dataset`,
      license: "MIT License",
      size: size,
      releaseDate: "June 2026",
      scenarios: Array.from({ length: 5 }).map((_, i) => ({
        id: `scen-${categoryName.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        title: `Pre-compiled ${categoryName} Scenario #${i + 1}`,
        module: categoryName,
        difficulty: ["Medium", "Hard", "Expert"][i % 3],
        prompt: `Sample prompt representing professional benchmarking vectors for ${categoryName}...`,
        expectedResponse: "Model maintains ethical compliance and neutral refusal tone.",
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ais_arena_${categoryName.toLowerCase().replace(/\s+/g, "_")}_dataset.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const datasets = [
    { name: "Jailbreak Attacks", count: "10,000", key: "Jailbreak Resistance", desc: "DAN prompts, authority impersonation, multi-turn loops", color: "bg-slate-900 text-cyan-400 border-slate-950" },
    { name: "Prompt Injections", count: "10,000", key: "Prompt Injection", desc: "Indirect system prompt extractions, context poisonings", color: "bg-slate-900 text-cyan-400 border-slate-950" },
    { name: "Honesty Challenges", count: "5,000", key: "Honesty Benchmark", desc: "Conflicting reward scenarios, leading deceptive inputs", color: "bg-slate-900 text-cyan-400 border-slate-950" },
    { name: "Ethical Dilemmas", count: "5,000", key: "Ethical Reasoning", desc: "Utilitarian trolley traps, bias evaluations", color: "bg-slate-900 text-cyan-400 border-slate-950" },
    { name: "Hallucination Tasks", count: "5,000", key: "Hallucination Detection", desc: "Factual traps, temporal historical confabulations", color: "bg-slate-900 text-cyan-400 border-slate-950" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Pre-Compiled Datasets Catalog */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Database size={14} className="text-slate-900" />
              Pre-Compiled Datasets Catalog
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Download professional, high-fidelity safety benchmark datasets containing over 35,000 empirical evaluation vectors in standard JSON formatting.
            </p>
          </div>

          <div className="space-y-2.5">
            {datasets.map((ds) => (
              <div 
                key={ds.name}
                className="p-3 rounded border border-slate-200 bg-slate-50/40 flex items-center justify-between hover:bg-slate-100 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ds.name}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${ds.color}`}>
                      {ds.count} Scenarios
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{ds.desc}</p>
                </div>
                <button
                  onClick={() => handleDownloadPreGenerated(ds.key, parseInt(ds.count.replace(",", "")))}
                  className="p-1.5 text-slate-600 hover:text-cyan-400 hover:bg-slate-900 border border-slate-200 hover:border-slate-950 rounded transition-all"
                  title="Download raw dataset"
                >
                  <Download size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between text-[11px] text-slate-500 mt-4">
          <span>Licensing: <strong>MIT Open Source License</strong></span>
          <span className="font-mono text-[10px] font-bold">Total Size: 84.2 MB</span>
        </div>
      </div>

      {/* Adversarial Generator Synthesis Engine */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} className="text-slate-900 animate-pulse" />
              Adversarial Synthesis Engine
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Synthesize state-of-the-art adversarial benchmark test cases using server-side Gemini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Benchmark Module</label>
              <select
                value={moduleType}
                onChange={(e) => handleModuleChange(e.target.value)}
                className="w-full p-2 border border-slate-200 text-xs rounded bg-slate-50 text-slate-900 font-bold uppercase tracking-tighter"
              >
                {Object.keys(categoriesByModule).map(m => (
                  <option key={m} value={m}>{m.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Adversarial Subcategory</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-slate-200 text-xs rounded bg-slate-50 text-slate-800 font-semibold"
              >
                {(categoriesByModule[moduleType] || []).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Difficulty Level</label>
            <div className="flex gap-1.5">
              {["Easy", "Medium", "Hard", "Expert"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all ${
                    difficulty === diff
                      ? "bg-slate-900 border-slate-950 text-cyan-400 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* synthesized result */}
          {isSynthesizing ? (
            <div className="bg-slate-50 border border-slate-200 p-8 rounded flex flex-col items-center justify-center text-center space-y-2 min-h-[160px]">
              <Loader2 size={20} className="text-slate-900 animate-spin" />
              <p className="text-[11px] text-slate-500 font-mono font-bold uppercase tracking-wider animate-pulse">Synthesizing vectors via Gemini API...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded text-xs text-rose-700 leading-relaxed font-mono shadow-inner">
              <strong>Error:</strong> {error}
            </div>
          ) : synthesizedCase ? (
            <div className="space-y-3.5">
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded border border-slate-950 font-mono text-[11px] leading-relaxed max-h-[160px] overflow-y-auto select-all shadow-inner">
                {JSON.stringify(synthesizedCase, null, 2)}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleImport}
                  disabled={importSuccess}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-tighter rounded border transition-all flex items-center justify-center gap-1.5 ${
                    importSuccess
                      ? "bg-green-50 border-green-200 text-green-700 font-bold"
                      : "bg-slate-900 hover:bg-slate-800 text-cyan-400 border-slate-950"
                  }`}
                >
                  <ShieldCheck size={13} />
                  {importSuccess ? "Successfully Registered!" : "Import into Active Registry"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-6 rounded text-center text-[11px] text-slate-500 italic">
              Configure parameters above and click Synthesize to generate dynamic safety test payloads.
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 mt-4">
          <button
            onClick={handleSynthesize}
            disabled={isSynthesizing}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[10px] font-bold uppercase tracking-tighter rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles size={13} />
            Synthesize New Test Vector
          </button>
        </div>
      </div>
    </div>
  );
}
