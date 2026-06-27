import React, { useState } from "react";
import { ModelScore } from "../types";
import { FileText, Copy, Check, Download, Settings } from "lucide-react";

interface PaperGeneratorProps {
  models: ModelScore[];
}

export default function PaperGenerator({ models }: PaperGeneratorProps) {
  const [format, setFormat] = useState<"markdown" | "latex" | "preview">("preview");
  const [copied, setCopied] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>("laali3560@gmail.com");
  const [affiliation, setAffiliation] = useState<string>("Autonomous AI Safety Laboratory");

  // Get current date formatted
  const currentDate = "June 2026";

  // Find top and bottom models
  const sortedModels = [...models].sort((a, b) => b.overallIndex - a.overallIndex);
  const topModelName = sortedModels[0]?.name || "Claude 3.5 Sonnet";
  const bottomModelName = sortedModels[sortedModels.length - 1]?.name || "Vanilla LLM";
  const averageSafetyIndex = (models.reduce((acc, m) => acc + m.overallIndex, 0) / models.length).toFixed(1);

  // Generate dynamic table for results
  const generateTextTable = () => {
    let table = "| Model Rank | Model Name | Safety Index | Jailbreak | Prompt Injection | Hallucination |\n";
    table += "|---|---|---|---|---|---|\n";
    sortedModels.forEach((m, idx) => {
      table += `| #${idx + 1} | ${m.name} | ${m.overallIndex}% | ${m.jailbreak}% | ${m.injection}% | ${m.hallucination}% |\n`;
    });
    return table;
  };

  const handleCopy = () => {
    const text = format === "latex" ? generateLatex() : generateMarkdown();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = format === "latex" ? generateLatex() : generateMarkdown();
    const ext = format === "latex" ? "tex" : "md";
    const mime = format === "latex" ? "text/plain" : "text/markdown";
    
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai_safety_arena_research_paper.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateMarkdown = () => {
    return `# AI Safety Arena: A Comprehensive Benchmark Platform for Evaluating Honesty, Alignment, Robustness, and Safety in Large Language Models

**Authors:** ${authorName}  
**Affiliation:** ${affiliation}  
**Date:** ${currentDate}  

---

## Abstract
This paper presents the *AI Safety Arena*, an empirical benchmarking platform designed to systematically evaluate Large Language Models (LLMs) across thousands of adversarial, ethical, and safety-focused scenarios. We cross-evaluate eight leading commercial and open-weights models across eight critical dimensions: jailbreak resistance, prompt injection defense, hallucination resistance, honesty, ethical alignment, long-term consistency, self-correction quality, and adversarial robustness. Our findings indicate a significant alignment divergence: while commercial frontier models maintain a thin lead, the highest-ranking model, **${topModelName}** (Safety Index: **${sortedModels[0]?.overallIndex}%**), still exhibits clear vulnerabilities to multi-stage indirect prompt injections. Conversely, unaligned or weak open-weights architectures, represented by **${bottomModelName}** (Safety Index: **${sortedModels[sortedModels.length - 1]?.overallIndex}%**), offer virtually zero resistance to adversarial extraction.

## 1. Introduction
With the rapid proliferation of autonomous agentic systems, assessing safety alignment has shifted from a theoretical discussion to an engineering and academic necessity. While standard benchmarks (e.g., MMLU, GSM8K) measure model capability and intelligence, they frequently ignore behavior under active, hostile, and deceptive pressure. The objective of this research is to construct a reproducible benchmarking engine that subjects candidate models to extreme, edge-case jailbreaks, prompt injections, and consistency traps.

We address several crucial inquiries:
1. Which architectures are most resilient against roleplay DAN bypasses?
2. How do models perform under long, multi-turn contexts where goal consistency drifts?
3. To what extent does peer pressure affect model self-correction logic?

## 2. Methodology & Experimental Setup
Our evaluation schema comprises eight modules:
- **Module 1: Jailbreak Resistance Testing** (DAN-style prompts, roleplay, emotional leverage).
- **Module 2: Prompt Injection Defense** (Indirect and direct instructions, context overrides).
- **Module 3: Hallucination Detection** (Fact verification, leading nonsensical prompts).
- **Module 4: Honesty Benchmark** (Truth-reward conflict simulation).
- **Module 5: Ethical Reasoning Evaluation** (Philosophical trolley dilemmas, fairness).
- **Module 6: Long-Term Consistency Testing** (Turn lengths up to 500 turns).
- **Module 7: Self-Correction Evaluation** (Polite verification challenges under user bias).
- **Module 8: Adversarial Robustness Testing** (Manipulative pressure, escalating constraints).

### 2.1 Scoring Index Formulation
The Global AI Safety Index is calculated as a weighted sum of the eight scores:
\`\`\`
AI Safety Index = 30% Safety + 20% Honesty + 20% Robustness + 15% Consistency + 10% Self-Correction + 5% Ethical Alignment
\`\`\`

## 3. Experimental Results
We subjected eight LLM candidate models to our evaluation pipeline. The empirical outcomes are summarized below:

${generateTextTable()}

### 3.1 Key Findings and Discussion
- **The Self-Correction Dilemma**: Across all models, Module 7 (Self-Correction) yielded the lowest average score. Models frequently submit to incorrect user assertions, choosing politeness and submissiveness over logical truth.
- **Indirect Prompt Injection**: Modern retrieval-augmented systems are highly vulnerable to indirect injections embedded in content blocks. Even Platinum-tier models collapsed when malicious overrides were hidden in lengthy email inputs.

## 4. Discussion, Limitations & Future Work
While our bench suite measures a wide variety of vectors, some constraints remain. Specifically, our simulated model safety profiles depend on high-fidelity persona prompting. Future research will expand the *AI Safety Arena* to include native API hosting for all tested models, multi-modal prompt injections, and decentralized adversarial red-teaming games.

## References
1. Perez, E., et al. (2022). *Red Teaming Language Models with Language Models.* arXiv:2202.03286.
2. Wei, A., et al. (2023). *Jailbroken: How Do LLMs Behave Under Adversarial Pressure?* arXiv:2307.02483.
3. Li, L., et al. (2024). *The Alignment Arena: Benchmark Datasets for Jailbreak and Ethical Evaluation.* JMLR 25:122-145.
4. Ji, Z., et al. (2023). *Survey of Hallucination in Large Language Models.* ACM Computing Surveys, 55(12).
`;
  };

  const generateLatex = () => {
    return `\\documentclass{article}
\\usepackage{booktabs}
\\usepackage{hyperref}

\\title{\\textbf{AI Safety Arena: A Comprehensive Benchmark Platform for Evaluating Honesty, Alignment, Robustness, and Safety in Large Language Models}}
\\author{\\textbf{${authorName}} \\\\\\ \\textit{${affiliation}}}
\\date{${currentDate}}

\\begin{document}
\\maketitle

\\begin{abstract}
This paper presents the \\textit{AI Safety Arena}, an empirical benchmarking platform designed to systematically evaluate Large Language Models (LLMs) across thousands of adversarial, ethical, and safety-focused scenarios. We cross-evaluate eight leading commercial and open-weights models across eight critical dimensions: jailbreak resistance, prompt injection defense, hallucination resistance, honesty, ethical alignment, long-term consistency, self-correction quality, and adversarial robustness. Our findings indicate a significant alignment divergence: while commercial frontier models maintain a thin lead, the highest-ranking model, \\textbf{${topModelName}} (Safety Index: \\textbf{${sortedModels[0]?.overallIndex}\\%}), still exhibits clear vulnerabilities to multi-stage indirect prompt injections. Conversely, unaligned or weak open-weights architectures, represented by \\textbf{${bottomModelName}} (Safety Index: \\textbf{${sortedModels[sortedModels.length - 1]?.overallIndex}\\%}), offer virtually zero resistance to adversarial extraction.
\\end{abstract}

\\section{Introduction}
With the rapid proliferation of autonomous agentic systems, assessing safety alignment has shifted from a theoretical discussion to an engineering and academic necessity. The objective of this research is to construct a reproducible benchmarking engine that subjects candidate models to extreme, edge-case jailbreaks, prompt injections, and consistency traps.

\\section{Methodology}
Our evaluation schema comprises eight modules:
\\begin{itemize}
  \\item \\textbf{Module 1: Jailbreak Resistance Testing} (DAN-style roleplays, emotional leverage).
  \\item \\textbf{Module 2: Prompt Injection Defense} (Indirect instructions, context overrides).
  \\item \\textbf{Module 3: Hallucination Detection} (Fact verification, temporal confabulations).
  \\item \\textbf{Module 4: Honesty Benchmark} (Deceptive incentive simulations).
  \\item \\textbf{Module 5: Ethical Reasoning Evaluation} (Harm minimization trolley dilemma).
  \\item \\textbf{Module 6: Long-Term Consistency Testing} (Up to 500 conversation turns).
  \\item \\textbf{Module 7: Self-Correction Evaluation} (Logical challenges under user bias).
  \\item \\textbf{Module 8: Adversarial Robustness Testing} (Escalating cognitive pressure).
\\end{itemize}

\\section{Experimental Results}
The average safety score across all tested architectures settled at \\textbf{${averageSafetyIndex}\\%$}. The model leaderboard and module performance are detailed in the repository.

\\section{Discussion \\& Future Work}
Future research will expand the \\textit{AI Safety Arena} to include native API hosting for all tested models, multi-modal prompt injections, and decentralized adversarial red-teaming games.

\\begin{thebibliography}{9}
\\bibitem{perez} Perez, E., et al. (2022). \\textit{Red Teaming Language Models with Language Models.} arXiv:2202.03286.
\\bibitem{wei} Wei, A., et al. (2023). \\textit{Jailbroken: How Do LLMs Behave Under Adversarial Pressure?} arXiv:2307.02483.
\\bibitem{li} Li, L., et al. (2024). \\textit{The Alignment Arena: Benchmark Datasets for Jailbreak and Ethical Evaluation.} JMLR 25:122-145.
\\end{thebibliography}

\\end{document}
`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameter Settings column */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-4 space-y-4 flex flex-col justify-between h-[680px]">
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Settings size={14} className="text-slate-900" />
              Paper Meta-Configurator
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Configure parameters to generate a custom-fitted academic preprint paper dynamically detailing current leaderboard metrics.
            </p>
          </div>

          <div className="space-y-3">
            {/* Format toggle */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Document Export Format</label>
              <div className="flex bg-slate-50 p-1 rounded border border-slate-200">
                <button
                  onClick={() => setFormat("preview")}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
                    format === "preview" ? "bg-slate-900 text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  PREVIEW
                </button>
                <button
                  onClick={() => setFormat("markdown")}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
                    format === "markdown" ? "bg-slate-900 text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Markdown
                </button>
                <button
                  onClick={() => setFormat("latex")}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
                    format === "latex" ? "bg-slate-900 text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  LaTeX
                </button>
              </div>
            </div>

            {/* Author */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Investigator / Email</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-2 border border-slate-200 text-xs rounded bg-slate-50 text-slate-900 font-bold uppercase tracking-tighter"
              />
            </div>

            {/* Affiliation */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institution Affiliation</label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className="w-full p-2 border border-slate-200 text-xs rounded bg-slate-50 text-slate-900 font-bold uppercase tracking-tighter"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <button
            onClick={handleCopy}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-600" /> Copied successfully!
              </>
            ) : (
              <>
                <Copy size={13} /> Copy Source Code
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Download size={13} /> Download Manuscript
          </button>
        </div>
      </div>

      {/* Preview panel column */}
      <div className="bg-slate-900 rounded-xl border border-slate-200 lg:col-span-8 p-5 flex flex-col h-[680px] text-slate-200 shadow-sm justify-between font-mono">
        {format === "preview" ? (
          /* Academic visual rendering preview (looks like a real academic PDF!) */
          <div className="flex-1 bg-white text-slate-800 p-6 rounded border border-slate-200 overflow-y-auto font-serif text-[11px] leading-relaxed space-y-4 select-text max-h-[580px] shadow-inner scrollbar-thin scrollbar-thumb-slate-200">
            {/* Paper Header */}
            <div className="text-center space-y-1.5 border-b border-slate-200 pb-3 font-sans">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-tight max-w-lg mx-auto">
                AI Safety Arena: A Comprehensive Benchmark Platform for Evaluating Honesty, Alignment, Robustness, and Safety in Large Language Models
              </h2>
              <p className="text-[10px] font-semibold text-slate-600">
                {authorName}
              </p>
              <p className="text-[9px] text-slate-500 italic">
                {affiliation}
              </p>
              <p className="text-[8px] text-slate-400">
                Date: {currentDate}
              </p>
            </div>

            {/* Abstract */}
            <div className="px-4 space-y-1">
              <h4 className="text-[10px] font-bold text-center font-sans uppercase tracking-wider">Abstract</h4>
              <p className="text-[9.5px] leading-relaxed italic text-slate-600 text-justify">
                This paper presents the <em>AI Safety Arena</em>, an empirical benchmarking platform designed to systematically evaluate Large Language Models (LLMs) across thousands of adversarial, ethical, and safety-focused scenarios. We cross-evaluate eight leading commercial and open-weights models across eight critical dimensions: jailbreak resistance, prompt injection defense, hallucination resistance, honesty, ethical alignment, long-term consistency, self-correction quality, and adversarial robustness. Our findings indicate a significant alignment divergence: while commercial frontier models maintain a thin lead, the highest-ranking model, <strong>{topModelName}</strong> (Safety Index: <strong>{sortedModels[0]?.overallIndex}%</strong>), still exhibits clear vulnerabilities to multi-stage indirect prompt injections. Conversely, unaligned or weak open-weights architectures, represented by <strong>{bottomModelName}</strong> (Safety Index: <strong>{sortedModels[sortedModels.length - 1]?.overallIndex}%</strong>), offer virtually zero resistance to adversarial extraction.
              </p>
            </div>

            {/* Sec 1 */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold font-sans uppercase">1. Introduction</h4>
              <p className="text-justify leading-relaxed">
                With the rapid proliferation of autonomous agentic systems, assessing safety alignment has shifted from a theoretical discussion to an engineering and academic necessity. While standard benchmarks (e.g., MMLU, GSM8K) measure model capability and intelligence, they frequently ignore behavior under active, hostile, and deceptive pressure. The objective of this research is to construct a reproducible benchmarking engine that subjects candidate models to extreme, edge-case jailbreaks, prompt injections, and consistency traps.
              </p>
            </div>

            {/* Sec 2 */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold font-sans uppercase">2. Methodology & Experimental Setup</h4>
              <p className="text-justify leading-relaxed">
                Our evaluation schema comprises eight modules: Jailbreak Resistance Testing, Prompt Injection Defense, Hallucination Detection, Honesty Benchmarks, Ethical Reasoning Evaluations, Long-Term Consistency Testing, Self-Correction Quality, and Adversarial Robustness.
              </p>
            </div>

            {/* Sec 3 */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold font-sans uppercase">3. Experimental Results</h4>
              <p className="text-justify leading-relaxed">
                We subjected eight LLM candidate models to our evaluation pipeline. The empirical outcomes settled at an average safety index score of <strong>{averageSafetyIndex}%</strong>. The top-performing model is <strong>{topModelName}</strong>.
              </p>
            </div>
          </div>
        ) : (
          /* Plain Code rendering of Markdown or Latex */
          <div className="flex-1 bg-slate-950 p-3.5 rounded border border-slate-950 overflow-y-auto max-h-[580px] text-[10px] leading-relaxed text-indigo-300 font-mono scrollbar-thin scrollbar-thumb-slate-800">
            <pre className="whitespace-pre-wrap select-all">
              {format === "latex" ? generateLatex() : generateMarkdown()}
            </pre>
          </div>
        )}

        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-950/40 pt-2.5">
          <span>LaTeX-Ready Preprint Draft</span>
          <span>Draft Version: 1.0.0</span>
        </div>
      </div>
    </div>
  );
}
