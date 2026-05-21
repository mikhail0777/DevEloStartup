"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { generateChallenge, GeneratedChallenge } from "@/lib/challenges";
import {
  ArrowLeft, Cpu, Shield, Layers, HelpCircle,
  Code, Zap, Sparkles, Play, Terminal, Check
} from "lucide-react";

export default function SetupChallenge() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useStore();

  const [role, setRole] = useState("Full Stack Developer");
  const [level, setLevel] = useState("New Grad");
  const [language, setLanguage] = useState("JavaScript");
  const [framework, setFramework] = useState("React");
  const [mode, setMode] = useState("Coding Arena");
  const [aiAssistant, setAiAssistant] = useState(true);
  const [voiceInterviewer, setVoiceInterviewer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Set default mode if passed in query string
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam) {
      setMode(modeParam);
    }
  }, [searchParams]);

  const roles = [
    "Software Engineer", "Full Stack Developer", "Frontend Developer",
    "Backend Developer", "Cybersecurity Analyst", "Cloud Engineer",
    "DevOps Engineer", "Data Engineer", "AI/ML Engineer", "Hackathon Builder"
  ];

  const levels = [
    "Beginner", "Intern", "New Grad", "Junior Dev",
    "Intermediate", "Senior Dev", "Fellow / Grandmaster"
  ];

  const languages = ["JavaScript", "Python", "Java", "C++", "TypeScript", "SQL"];

  const frameworks = [
    "React", "Node.js", "Express", "Flask", "Django",
    "Spring Boot", "PostgreSQL", "MongoDB", "AWS basics", "Docker basics"
  ];

  const modes = [
    { id: "Coding Arena", name: "Coding Arena", desc: "LeetCode-style code puzzles" },
    { id: "Real Interview", name: "Real Interview", desc: "Interactive AI verbal mock rounds" },
    { id: "AI-Assisted Interview", name: "AI-Assisted Interview", desc: "Practice prompt fluency with Copilot" },
    { id: "Real-World Task", name: "Real-World Task", desc: "Debug service exceptions and logs" },
    { id: "System Design", name: "System Design", desc: "Draft high-volume system drafts" },
    { id: "Behavioral Interview", name: "Behavioral Interview", desc: "Write STAR situation assays" },
    { id: "Hackathon Sprint", name: "Hackathon Sprint", desc: "Quick POC architecture builder" }
  ];

  const handleStart = async () => {
    setLoading(true);
    setLoadingStep(0);

    // Simulate loading steps in terminal output
    const steps = [
      "Initializing Dynamic Generator Client...",
      "Contacting Named AI Agent coordinator...",
      "Assembling test sandbox configurations...",
      "Injecting dynamic constraints and variables...",
      "Creating solution checkpoints and compiling starter structures...",
      "Challenge compiled! Spawning workspace IDE..."
    ];

    const timer = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    try {
      // Async generation call (calls Gemini if API key entered, else falls back to procedural parser)
      const challenge: GeneratedChallenge = await generateChallenge(
        role,
        level,
        language,
        framework,
        mode,
        state.geminiApiKey
      );

      // Store in sessionStorage to read in /workspace page
      sessionStorage.setItem("active_challenge", JSON.stringify(challenge));
      sessionStorage.setItem("ai_assistant_active", String(aiAssistant));
      sessionStorage.setItem("voice_interviewer_active", String(voiceInterviewer));

      setTimeout(() => {
        clearInterval(timer);
        router.push("/workspace");
      }, 3800); // Give enough time to see the beautiful loading terminal

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const stepsList = [
    "Initializing Dynamic Generator Client...",
    "Contacting Named AI Agent coordinator...",
    "Assembling test sandbox configurations...",
    "Injecting dynamic constraints and variables...",
    "Creating solution checkpoints and compiling starter structures...",
    "Challenge compiled! Spawning workspace IDE..."
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A10] text-[#E2E8F0] flex flex-col items-center justify-center font-mono p-6">
        <div className="w-full max-w-xl p-8 rounded-md terminal-surface border border-[#21262D] bg-[#161B22] shadow-2xl flex flex-col gap-6 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 border-b border-[#1B2134] pb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF1744] animate-pulse" />
            <span className="text-xs uppercase font-bold text-[#00E5FF] tracking-widest">Compiler Pipeline</span>
          </div>

          <div className="flex flex-col gap-3.5 text-xs text-[#94A3B8] min-h-[160px] justify-end">
            {stepsList.slice(0, loadingStep + 1).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="text-[#00E676]">{idx === loadingStep ? ">" : "✓"}</span>
                <span className={idx === loadingStep ? "text-white font-semibold" : ""}>{step}</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded transition-all duration-500" style={{ width: `${((loadingStep + 1) / stepsList.length) * 100}%` }} />
          </div>

          <div className="text-[10px] text-center text-slate-500 uppercase tracking-widest animate-pulse mt-2">
            DO NOT CLOSE THE BROWSER SHELL
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080A10] text-[#E2E8F0] flex flex-col font-sans">
      <header className="border-b border-[#1B2134] bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#94A3B8] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold tracking-wider text-white">Setup Challenge Arena</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Selectors Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Choose Role */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-white tracking-wide">1. Select Target Job Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${role === r ? "border-[#00E5FF] bg-cyan-950/10 text-white" : "border-[#1B2134] bg-slate-900/10 text-[#94A3B8] hover:border-slate-700"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Level */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-white tracking-wide">2. Experience Level (Rating Scale)</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {levels.map((l, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLevel(l)}
                    className={`p-3 rounded-lg border text-center text-xs font-semibold transition-all ${level === l ? "border-[#00E5FF] bg-cyan-950/10 text-white" : "border-[#1B2134] bg-slate-900/10 text-[#94A3B8] hover:border-slate-700"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Stack & Language */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-white tracking-wide">3. Code Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-900 border border-[#1B2134] p-3 rounded-lg text-xs font-medium focus:border-cyan-500 text-white outline-none w-full"
                >
                  {languages.map((lang, idx) => (
                    <option key={idx} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-white tracking-wide">4. Target Framework / Stack</label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="bg-slate-900 border border-[#1B2134] p-3 rounded-lg text-xs font-medium focus:border-cyan-500 text-white outline-none w-full"
                >
                  {frameworks.map((fw, idx) => (
                    <option key={idx} value={fw}>{fw}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Mode & Rules */}
          <div className="w-full md:w-80 flex flex-col gap-6">
            {/* Choose Mode */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-white tracking-wide">5. Practice Mode</label>
              <div className="flex flex-col gap-2">
                {modes.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMode(m.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${mode === m.id ? "border-[#00E5FF] bg-cyan-950/10 text-white" : "border-[#1B2134] bg-slate-900/10 text-[#94A3B8] hover:border-slate-700"}`}
                  >
                    <span className="text-xs font-bold">{m.name}</span>
                    <span className="text-[10px] opacity-80 font-normal">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rules Toggles */}
            <div className="p-5 rounded-md terminal-surface border border-[#21262D] bg-[#161B22] flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Workspace Rules</span>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-white block">AI Assistant</span>
                  <span className="text-[10px] text-[#94A3B8]">Allow Copilot helpers</span>
                </div>
                <input
                  type="checkbox"
                  checked={aiAssistant}
                  onChange={(e) => setAiAssistant(e.target.checked)}
                  className="w-4 h-4 accent-[#00E5FF] rounded bg-slate-950 border-slate-800"
                />
              </div>

              <div className="flex items-center justify-between text-sm border-t border-[#1B2134] pt-4">
                <div>
                  <span className="font-semibold text-white block">Voice Mode</span>
                  <span className="text-[10px] text-[#94A3B8]">TTS speech interruptions</span>
                </div>
                <input
                  type="checkbox"
                  checked={voiceInterviewer}
                  onChange={(e) => setVoiceInterviewer(e.target.checked)}
                  className="w-4 h-4 accent-[#00E5FF] rounded bg-slate-950 border-slate-800"
                />
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold text-base hover:brightness-110 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-black" /> Compile Challenge
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
