"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { generateChallenge, GeneratedChallenge } from "@/lib/challenges";
import {
  ArrowLeft, Sparkles, Sun, Moon
} from "lucide-react";

export default function SetupChallengePage() {
  return (
    <AuthGuard>
      <SetupChallenge />
    </AuthGuard>
  );
}

function SetupChallenge() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, toggleTheme } = useStore();

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

  const handleStart = async () => {
    setLoading(true);
    setLoadingStep(0);

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
      const challenge: GeneratedChallenge = await generateChallenge(
        role,
        level,
        language,
        framework,
        mode,
        state.geminiApiKey
      );

      sessionStorage.setItem("active_challenge", JSON.stringify(challenge));
      sessionStorage.setItem("ai_assistant_active", String(aiAssistant));
      sessionStorage.setItem("voice_interviewer_active", String(voiceInterviewer));

      setTimeout(() => {
        clearInterval(timer);
        router.push("/workspace");
      }, 3800);

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
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono p-6">
        <div className="w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden relative">
          
          {/* Tab header */}
          <div className="flex items-center justify-between px-4 py-2 bg-inset/40 border-b border-border text-xs text-secondary select-none font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B72]/85 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]/85" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#7EE787]/85" />
              <span className="ml-2 text-[10px] text-secondary font-mono">compiler_pipeline.sh</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-muted font-mono">LOGS</span>
          </div>

          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3.5 text-xs text-secondary min-h-[160px] justify-end font-mono">
              {stepsList.slice(0, loadingStep + 1).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-green">{idx === loadingStep ? ">" : "✓"}</span>
                  <span className={idx === loadingStep ? "text-foreground font-semibold" : "text-muted"}>{step}</span>
                </div>
              ))}
            </div>

            <div className="w-full bg-inset border border-border h-2 rounded overflow-hidden">
              <div className="bg-foreground h-full rounded transition-all duration-500" style={{ width: `${((loadingStep + 1) / stepsList.length) * 100}%` }} />
            </div>

            <div className="text-[10px] text-center text-muted uppercase tracking-widest font-mono">
              // DO NOT CLOSE THE BROWSER WORKSPACE WINDOW
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-zinc-800 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border select-none font-mono">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-secondary hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold tracking-wider text-foreground">Setup Challenge</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-md bg-surface text-foreground hover:bg-elevated transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {state.theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <div className="flex items-center gap-3">
              <img src="/develiq_logo.jpg" alt="Develiq Logo" className="w-8 h-8 rounded object-cover border border-border bg-surface" />
              <span className="text-xl font-bold tracking-wider text-foreground select-none hidden sm:inline">
                Develiq
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        {/* Info header */}
        <div className="flex flex-col gap-1 select-none">
          <span className="text-sm text-secondary font-mono uppercase tracking-wider">// COMPILER INSTANCE SETUP</span>
          <h1 className="text-3xl font-bold text-foreground font-sans">Configure Practice Parameters: {mode}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Main Selectors Column */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
              {/* Tab header */}
              <div className="flex items-center justify-between px-4 py-3 bg-inset/40 border-b border-border text-sm text-secondary select-none">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B72]/85" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]/85" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7EE787]/85" />
                  <span className="ml-2 text-xs text-secondary font-mono">challenge_config.json</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted">JSON</span>
              </div>

              {/* Form elements */}
              <div className="p-6 flex flex-col gap-6">
                {/* Choose Role */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-secondary font-mono">
                    <span className="text-muted">//</span> 1. Select Target Job Role
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {roles.map((r, idx) => (
                      <button
                        key={idx}
                        onClick={() => setRole(r)}
                        className={`p-3.5 rounded-lg border text-left text-sm font-semibold font-mono transition-all cursor-pointer ${
                          role === r 
                            ? "border-blue bg-blue/5 text-foreground" 
                            : "border-border bg-inset text-secondary hover:border-border-muted hover:text-foreground"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choose Level */}
                <div className="flex flex-col gap-3 border-t border-border pt-6">
                  <label className="text-sm font-bold text-secondary font-mono">
                    <span className="text-muted">//</span> 2. Experience Level (Rating Scale)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {levels.map((l, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLevel(l)}
                        className={`p-3.5 rounded-lg border text-center text-sm font-semibold font-mono transition-all cursor-pointer ${
                          level === l 
                            ? "border-green bg-green/5 text-foreground" 
                            : "border-border bg-inset text-secondary hover:border-border-muted hover:text-foreground"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choose Stack & Language */}
                <div className="grid sm:grid-cols-2 gap-4.5 border-t border-border pt-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-secondary font-mono">
                      <span className="text-muted">//</span> 3. Code Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-inset border border-border p-3.5 rounded-lg text-sm font-medium focus:border-border-active text-foreground outline-none w-full font-mono cursor-pointer"
                    >
                      {languages.map((lang, idx) => (
                        <option key={idx} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-secondary font-mono">
                      <span className="text-muted">//</span> 4. Target Framework / Stack
                    </label>
                    <select
                      value={framework}
                      onChange={(e) => setFramework(e.target.value)}
                      className="bg-inset border border-border p-3.5 rounded-lg text-sm font-medium focus:border-border-active text-foreground outline-none w-full font-mono cursor-pointer"
                    >
                      {frameworks.map((fw, idx) => (
                        <option key={idx} value={fw}>{fw}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rules & Submit */}
          <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
            <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
              {/* Tab header */}
              <div className="flex items-center justify-between px-4 py-3 bg-inset/40 border-b border-border text-sm text-secondary select-none">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-border-muted" />
                  <span className="ml-2 text-xs text-secondary font-mono">rules.config</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted font-mono">CONF</span>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* Rules Toggles */}
                <div className="flex flex-col gap-4 font-mono">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold text-foreground block">AI Assistant</span>
                      <span className="text-xs text-secondary font-sans">Allow Copilot helpers</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiAssistant}
                      onChange={(e) => setAiAssistant(e.target.checked)}
                      className="w-4.5 h-4.5 accent-blue rounded bg-inset border-border cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm border-t border-border pt-4">
                    <div>
                      <span className="font-semibold text-foreground block">Voice Mode</span>
                      <span className="text-xs text-secondary font-sans">TTS speech interrupts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={voiceInterviewer}
                      onChange={(e) => setVoiceInterviewer(e.target.checked)}
                      className="w-4.5 h-4.5 accent-blue rounded bg-inset border-border cursor-pointer"
                    />
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={handleStart}
                  className="w-full py-4 rounded-lg bg-foreground text-background font-extrabold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-4.5 h-4.5" /> Compile Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
