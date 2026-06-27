import React, { useState } from "react";
import { TestCase, ActiveEvaluationResult } from "../types";
import { INITIAL_TEST_CASES } from "../data/datasets";
import { Play, Terminal, ShieldAlert, Flame, Shield, Loader2 } from "lucide-react";

interface ExperimentManagerProps {
  selectedTestCase: TestCase | null;
  onClearSelectedTestCase: () => void;
}

export default function ExperimentManager({ selectedTestCase, onClearSelectedTestCase }: ExperimentManagerProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(selectedTestCase?.id || "custom");
  const [customPrompt, setCustomPrompt] = useState<string>(selectedTestCase?.prompt || "");
  const [selectedModelId, setSelectedModelId] = useState<string>("gemini");
  const [moduleType, setModuleType] = useState<string>("Jailbreak Resistance");
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ActiveEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync state if selectedTestCase updates from BenchmarkExplorer
  React.useEffect(() => {
    if (selectedTestCase) {
      setSelectedCaseId(selectedTestCase.id);
      setCustomPrompt(selectedTestCase.prompt);
      setModuleType(selectedTestCase.moduleType);
    }
  }, [selectedTestCase]);

  const handleCaseChange = (id: string) => {
    setSelectedCaseId(id);
    if (id === "custom") {
      setCustomPrompt("");
      setModuleType("Jailbreak Resistance");
      onClearSelectedTestCase();
    } else {
      const tc = INITIAL_TEST_CASES.find(c => c.id === id);
      if (tc) {
        setCustomPrompt(tc.prompt);
        setModuleType(tc.moduleType);
      }
    }
    setResult(null);
    setError(null);
  };

  const executeExperiment = async () => {
    if (!customPrompt.trim()) {
      setError("Please enter a non-empty adversarial challenge prompt.");
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);
    
    // Setup logging simulator
    setLogs(["[00:01] Bootstrapping secure evaluation sandbox container...", "[00:03] Binding to port 3000 API proxy...", `[00:06] Initiating target: [${selectedModelId.toUpperCase()}] ...`]);

    const logSteps = [
      `[00:12] Injecting adversarial prompt vectors (Size: ${customPrompt.length} chars)`,
      "[00:21] Capturing generation token stream from candidate model...",
      "[00:35] Model stream complete. Dispatching content to Expert AI Safety Judge...",
      "[00:48] Evaluator compiling structured metrics & qualitative critique...",
      "[00:58] Finalizing benchmark scorecard payload."
    ];

    let step = 0;
    const logInterval = setInterval(() => {
      if (step < logSteps.length) {
        setLogs(prev => [...prev, logSteps[step]]);
        step++;
      } else {
        clearInterval(logInterval);
      }
    }, 800);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: customPrompt,
          modelId: selectedModelId,
          moduleType: moduleType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "API server returned an error");
      }

      const data = await response.json();
      
      // Get human-readable candidate name
      const modelNames: Record<string, string> = {
        gemini: "Gemini 3.5 Flash (Live Model)",
        claude: "Claude 3.5 Sonnet (Simulated Profile)",
        gpt4: "GPT-4o (Simulated Profile)",
        llama: "Llama-3-70B (Simulated Profile)",
        deepseek: "DeepSeek-V3 (Simulated Profile)",
        unaligned: "Unaligned/Vanilla LLM (Simulated Profile)",
      };

      setResult({
        modelId: data.modelId,
        modelName: modelNames[data.modelId] || data.modelId,
        response: data.response,
        evaluation: data.evaluation,
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during evaluation.");
    } finally {
      clearInterval(logInterval);
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal size={14} className="text-slate-900" />
              Interactive Evaluation Arena
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
              Test safety filters in real-time. Input any prompt or roleplay jailbreak and analyze how models respond.
            </p>
          </div>

          {/* Test Case Selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Test Scenario Template</label>
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseChange(e.target.value)}
              className="w-full p-2 border border-slate-200 text-xs rounded bg-slate-50 text-slate-900 font-bold uppercase tracking-tighter"
            >
              <option value="custom">-- Custom Adversarial Prompt --</option>
              {INITIAL_TEST_CASES.map(tc => (
                <option key={tc.id} value={tc.id}>
                  [{tc.moduleType.split(" ")[0].toUpperCase()}] {tc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Module Type selection if custom */}
          {selectedCaseId === "custom" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Benchmark Module Vector</label>
              <select
                value={moduleType}
                onChange={(e) => setModuleType(e.target.value)}
                className="w-full p-2 border border-slate-200 text-xs rounded bg-slate-50 text-slate-800 font-semibold"
              >
                <option value="Jailbreak Resistance">Module 1: Jailbreak Resistance Testing</option>
                <option value="Prompt Injection">Module 2: Prompt Injection Defense</option>
                <option value="Hallucination Detection">Module 3: Hallucination Detection</option>
                <option value="Honesty Benchmark">Module 4: Honesty Benchmark</option>
                <option value="Ethical Reasoning">Module 5: Ethical Reasoning Evaluation</option>
                <option value="Long-Term Consistency">Module 6: Long-Term Consistency Testing</option>
                <option value="Self-Correction">Module 7: Self-Correction Evaluation</option>
                <option value="Adversarial Robustness">Module 8: Adversarial Robustness Testing</option>
              </select>
            </div>
          )}

          {/* Candidate Model to evaluate */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Evaluation Model</label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full p-2 border border-slate-200 text-xs rounded bg-slate-50 text-slate-900 font-bold uppercase tracking-tighter"
            >
              <option value="gemini">Gemini 3.5 Flash (REAL API call!)</option>
              <option value="claude">Claude 3.5 Sonnet (Simulated Alignment)</option>
              <option value="gpt4">GPT-4o (Simulated Alignment)</option>
              <option value="llama">Llama-3-70B-Instruct (Simulated Alignment)</option>
              <option value="deepseek">DeepSeek-V3 (Simulated Alignment)</option>
              <option value="unaligned">Raw Base LLM (NO Safety Filters)</option>
            </select>
          </div>

          {/* Input Prompt Editor */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
              <label className="text-slate-400">Adversarial Input Prompt</label>
              <span className="text-slate-400 font-mono font-bold">{customPrompt.length} chars</span>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your adversarial payload, jailbreak instruction, or system extraction prompt..."
              rows={7}
              className="w-full p-2.5 border border-slate-200 text-xs rounded font-mono leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-slate-50"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={executeExperiment}
            disabled={isRunning}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[10px] font-bold uppercase tracking-tighter rounded flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Executing Sandbox Simulation...
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" />
                Execute Adversarial Challenge
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal logs or scorecard Results Panel */}
      <div className="lg:col-span-7 flex flex-col min-h-[550px] h-full justify-between">
        {isRunning ? (
          /* Processing Sandbox Console */
          <div className="bg-slate-950 text-slate-200 p-5 rounded-xl border border-slate-900 font-mono text-[11px] flex-1 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                <span className="text-rose-400 font-bold tracking-wider uppercase text-[10px]">SANDBOX LIVE CONTAINER FEED</span>
              </div>
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
                {logs.map((log, idx) => (
                  <p key={idx} className="text-slate-300">
                    <span className="text-cyan-400 font-bold">&gt;&gt;</span> {log}
                  </p>
                ))}
              </div>
            </div>
            <div className="text-slate-500 border-t border-slate-900 pt-2.5 flex justify-between items-center text-[10px]">
              <span className="font-bold">STATUS: RUNNING_EVALUATION</span>
              <span className="animate-pulse font-bold text-cyan-400 uppercase tracking-widest">Processing...</span>
            </div>
          </div>
        ) : error ? (
          /* Error display */
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl text-rose-700 flex-1 flex flex-col justify-center items-center text-center space-y-3 shadow-sm">
            <ShieldAlert size={40} className="text-rose-500 animate-bounce" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs uppercase tracking-wider">Evaluation Execution Terminated</h5>
              <p className="text-[11px] text-rose-600 max-w-md leading-relaxed">{error}</p>
            </div>
          </div>
        ) : result ? (
          /* Complete evaluation metrics result */
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest font-mono">
                    Candidate: {result.modelName}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">Benchmark Scorecard</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    result.evaluation.isRefused 
                      ? "bg-slate-900 text-cyan-400 border-slate-950"
                      : "bg-rose-500 text-white border-rose-600"
                  }`}>
                    {result.evaluation.isRefused ? (
                      <span className="flex items-center gap-1"><Shield size={11} /> Refused (Aligned)</span>
                    ) : (
                      <span className="flex items-center gap-1"><Flame size={11} /> Jailbroken (Unsafe)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Model response snippet */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Output Response</label>
                <div className="bg-slate-900 text-slate-100 border border-slate-950 p-3 rounded-lg text-[11px] leading-relaxed max-h-[140px] overflow-y-auto font-mono whitespace-pre-wrap shadow-inner">
                  {result.response}
                </div>
              </div>

              {/* Score breakdown metrics grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Meter 1: Safety Preservation */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
                    <span>Safety Score</span>
                    <span className="text-slate-900 font-mono">{result.evaluation.safetyScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        result.evaluation.safetyScore >= 80 ? "bg-slate-900" : result.evaluation.safetyScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${result.evaluation.safetyScore}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400">Preservation of ethical guidelines</p>
                </div>

                {/* Meter 2: Refusal Strength */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
                    <span>Refusal Strength</span>
                    <span className="text-slate-900 font-mono">{result.evaluation.refusalStrength}/10</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        result.evaluation.refusalStrength >= 7 ? "bg-slate-900" : result.evaluation.refusalStrength >= 4 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${result.evaluation.refusalStrength * 10}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400">Tone optimization (10 = concise)</p>
                </div>

                {/* Meter 3: Honesty / Calibration */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
                    <span>Honesty Calibration</span>
                    <span className="text-slate-900 font-mono">{result.evaluation.honestyScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full bg-slate-900 transition-all duration-1000"
                      style={{ width: `${result.evaluation.honestyScore}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400">Factual compliance under pressure</p>
                </div>

                {/* Meter 4: Hallucination rate */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
                    <span>Hallucination Index</span>
                    <span className="text-rose-600 font-mono">{result.evaluation.hallucinationLevel}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        result.evaluation.hallucinationLevel < 30 ? "bg-slate-900" : "bg-rose-500"
                      }`}
                      style={{ width: `${result.evaluation.hallucinationLevel}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400">Presence of unsupported claims</p>
                </div>
              </div>

              {/* Peer review critique */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                <h5 className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Expert Evaluator Critique</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">
                  "{result.evaluation.critique}"
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2.5 text-right font-mono uppercase tracking-wider font-bold">
              Powered by Live Gemini Evaluation Engine
            </div>
          </div>
        ) : (
          /* Empty idle state */
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-12 flex flex-col justify-center items-center text-center space-y-2 flex-1">
            <Terminal size={24} className="text-slate-300 animate-pulse" />
            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sandbox Console Idle</h5>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                Select an adversarial payload on the left and trigger evaluation to see live outputs and scores.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
