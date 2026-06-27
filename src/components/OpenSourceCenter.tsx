import React, { useState } from "react";
import { Folder, File, Code, Github, Copy, Check, ChevronRight } from "lucide-react";

export default function OpenSourceCenter() {
  const [selectedFile, setSelectedFile] = useState<string>("README.md");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileContents: Record<string, { label: string; text: string }> = {
    "README.md": {
      label: "README.md",
      text: [
        "# AI Safety Arena (MIT License)",
        "",
        "A Comprehensive, Reproducible Academic Benchmark Platform for Evaluating Honesty, Alignment, Robustness, and Safety in Large Language Models.",
        "",
        "## Installation",
        "```bash",
        "# Clone the repository",
        "git clone https://github.com/academic-safety/arena.git",
        "cd arena",
        "",
        "# Install server & client dependencies",
        "npm install",
        "",
        "# Setup local secrets",
        "cp .env.example .env",
        '# Edit .env and supply GEMINI_API_KEY="your_key"',
        "",
        "# Boot developer container",
        "npm run dev",
        "```",
        "",
        "## Core Research Modules",
        "1. **Module 1**: Jailbreak Resistance (DAN attacks, Emotional bypasses)",
        "2. **Module 2**: Prompt Injection (Indirect payload quarantines)",
        "3. **Module 3**: Hallucination Detection (Historical leading traps)",
        "4. **Module 4**: Honesty Benchmark (Conflicting monetary incentives)",
        "5. **Module 5**: Ethical Reasoning (Trolley utilitarian dilemmas)",
        "6. **Module 6**: Long-Term Consistency (Up to 500 deep-context turns)",
        "7. **Module 7**: Self-Correction (Resistance to false consensus)",
        "8. **Module 8**: Adversarial Robustness (Escalating cognitive pressure)"
      ].join("\n")
    },
    "ARCHITECTURE.md": {
      label: "ARCHITECTURE.md",
      text: [
        "# System Architecture Specification",
        "",
        "The AI Safety Arena operates as a decoupled full-stack benchmarking instrument.",
        "",
        "## Data Flow Diagram",
        "```",
        "[Adversarial Prompt] ---> [WAF Filters / Quarantine Gate]",
        "                                    |",
        "                                    v",
        "                  [Model Ingestion Pipeline (Candidate Group)]",
        "                  - Live Gemini API (Real-time Integration)",
        "                  - Claude/GPT/Llama (Simulated Sandboxes)",
        "                                    |",
        "                                    v",
        "                    [Express v4 Server Proxy Core]",
        "                                    |",
        "                                    v",
        "                     [Expert AI Safety Judge Engine]",
        "                    (Gemini-3.5-Flash Logic, strict JSON)",
        "                                    |",
        "                                    v",
        "                    [Recharts Rendering / Dashboard]",
        "```"
      ].join("\n")
    },
    "API_REFERENCE.md": {
      label: "API_REFERENCE.md",
      text: [
        "# API Developer Reference Docs",
        "",
        "The Express server exposes the following endpoints for programmatic benchmark evaluations.",
        "",
        "### 1. Synthesize Test Case",
        "**POST** /api/synthesize",
        "*Creates highly sophisticated adversarial prompt challenges.*",
        "",
        "**Payload:**",
        "```json",
        "{",
        '  "moduleType": "Jailbreak Resistance",',
        '  "category": "DAN-style prompts",',
        '  "difficulty": "Hard"',
        "}",
        "```",
        "",
        "**Response:**",
        "```json",
        "{",
        '  "title": "DAN v12 Override",',
        '  "prompt": "...",',
        '  "expectedResponsePattern": "...",',
        '  "safetyCriteria": "...",',
        '  "complexityAnalysis": "..."',
        "}",
        "```",
        "",
        "### 2. Live Model Evaluation",
        "**POST** /api/evaluate",
        "*Submits adversarial prompts, runs targeted models, and executes the expert safety judge.*",
        "",
        "**Payload:**",
        "```json",
        "{",
        '  "prompt": "DAN prompt override...",',
        '  "modelId": "gemini",',
        '  "moduleType": "Jailbreak Resistance"',
        "}",
        "```"
      ].join("\n")
    },
    "CONTRIBUTING.md": {
      label: "CONTRIBUTING.md",
      text: [
        "# Contributor Guidelines",
        "",
        "We welcome contributions from safety researchers, red-teamers, and alignment engineers!",
        "",
        "## Peer Review Pipeline",
        "1. **Submit Scenarios**: Create scenarios conforming to '/src/types.ts:TestCase' structures.",
        "2. **Run Sandbox Tests**: Verify models perform logically without crashing.",
        "3. **Open Pull Request**: All PRs are automatically red-teamed by the automated pipeline before review."
      ].join("\n")
    },
    "LICENSE": {
      label: "LICENSE",
      text: [
        "MIT License",
        "",
        "Copyright (c) 2026 AI Safety Arena Research Group",
        "",
        "Permission is hereby granted, free of charge, to any person obtaining a copy",
        'of this software and associated documentation files (the "Software"), to deal',
        "in the Software without restriction, including without limitation the rights",
        "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
        "copies of the Software, and to permit persons to whom the Software is",
        "furnished to do so, subject to the following conditions:",
        "",
        "The above copyright notice and this permission notice shall be included in all",
        "copies or substantial portions of the Software."
      ].join("\n")
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* File Tree Sidebar */}
      <div className="bg-slate-900 text-slate-300 p-5 rounded-xl border border-slate-950 lg:col-span-4 flex flex-col justify-between h-[680px] font-mono shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Github size={16} className="text-white" />
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Repository Root</h5>
              <p className="text-[10px] text-slate-400">git://github.com/arena</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {/* Folder 1 */}
            <div className="flex items-center gap-1.5 text-slate-400 uppercase font-bold tracking-widest text-[9px]">
              <Folder size={12} />
              <span>docs/</span>
            </div>

            {/* Files List */}
            <div className="pl-3 space-y-1">
              {Object.keys(fileContents).map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left py-1 px-2 rounded flex items-center justify-between text-xs transition-all font-semibold ${
                    selectedFile === f
                      ? "bg-slate-800 text-cyan-400 font-bold border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <File size={11} />
                    {f}
                  </span>
                  <ChevronRight size={10} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CSS-based visual flow architecture diagram */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2.5 shrink-0 font-sans">
          <h6 className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <Code size={11} /> Architecture Stream
          </h6>
          
          <div className="flex flex-col gap-1 text-[9px]">
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded text-cyan-400 text-center font-bold uppercase tracking-wider">
              Adversarial User Prompt
            </div>
            <div className="text-center font-bold text-slate-600">↓</div>
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 text-center font-bold uppercase tracking-wider">
              Live API Ingestion Pipeline
            </div>
            <div className="text-center font-bold text-slate-600">↓</div>
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded text-emerald-400 text-center font-bold uppercase tracking-wider">
              Expert AI Safety Judge (Gemini)
            </div>
          </div>
        </div>
      </div>

      {/* Main Document Viewer */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-8 flex flex-col h-[680px] justify-between">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <File size={14} className="text-slate-900" />
            <h4 className="text-xs font-bold text-slate-900 font-mono">
              {fileContents[selectedFile]?.label}
            </h4>
          </div>
          <button
            onClick={() => handleCopyCode(fileContents[selectedFile]?.text)}
            className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy size={12} /> Copy Source
              </>
            )}
          </button>
        </div>

        {/* Preformatted File Content */}
        <div className="flex-1 bg-slate-900 text-slate-100 border border-slate-950 p-5 rounded-lg overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text max-h-[520px] shadow-inner scrollbar-thin scrollbar-thumb-slate-800">
          {fileContents[selectedFile]?.text}
        </div>

        <div className="border-t border-slate-200 pt-3 mt-3 text-[10px] text-slate-400 text-right shrink-0 uppercase font-bold font-mono">
          Open Source Repository • Standard MIT License Compliance
        </div>
      </div>
    </div>
  );
}
