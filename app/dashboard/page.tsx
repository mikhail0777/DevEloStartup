"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LinkNext from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { 
  Award, Zap, Calendar, ArrowRight, Code, Play, 
  Terminal, Shield, Layers, HelpCircle, Activity, Sparkles,
  Sun, Moon, Search, Lock, Check, RefreshCw
} from "lucide-react";
import { CHALLENGES_DATABASE, buildChallengeFromDefinition } from "@/lib/challenges";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}

function Dashboard() {
  const router = useRouter();
  const { state, getCareerRank, getScoreBreakdown, toggleTheme } = useStore();
  
  const careerRank = getCareerRank();
  const breakdown = getScoreBreakdown();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"catalog" | "ladder" | "modes">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLang, setSelectedLang] = useState("JavaScript");
  const [selectedFramework, setSelectedFramework] = useState("React");

  // Calculate XP Level parameters (threshold: 1000 XP per level)
  const currentLevel = Math.floor(state.xp / 1000) + 1;
  const currentLevelXP = state.xp % 1000;
  const xpPercent = Math.min(100, Math.round((currentLevelXP / 1000) * 100));

  // Determine Mastered Tasks count (overall score >= 80)
  const masteredTasksCount = state.history.filter(m => m.overallScore >= 80).length;

  const modes = [
    {
      id: "Coding Arena",
      title: "Coding Arena",
      icon: <Code className="w-5 h-5 transition-colors" />,
      desc: "LeetCode-style code puzzles with standard test verification.",
      tag: "Code Practice",
      color: "#FF7B72",
      num: "01"
    },
    {
      id: "Real Interview",
      title: "Real Interview Mode",
      icon: <Layers className="w-5 h-5 transition-colors" />,
      desc: "Interactive mock interview where the AI asks follow-up questions.",
      tag: "High Pressure",
      color: "#7EE787",
      num: "02"
    },
    {
      id: "AI-Assisted Interview",
      title: "AI-Assisted Interview",
      icon: <Terminal className="w-5 h-5 transition-colors" />,
      desc: "Practice prompts and verify code with Gemini Copilot allowed.",
      tag: "Modern Workflow",
      color: "#79C0FF",
      num: "03"
    },
    {
      id: "Real-World Task",
      title: "Real-World Task Mode",
      icon: <Shield className="w-5 h-5 transition-colors" />,
      desc: "Locate runtime bugs, fix APIs, and validation errors.",
      tag: "Debugging & QA",
      color: "#D2A8FF",
      num: "04"
    },
    {
      id: "System Design",
      title: "System Design",
      icon: <Zap className="w-5 h-5 transition-colors" />,
      desc: "Draft scalable, distributed architectures for ingestion.",
      tag: "Scale Architecture",
      color: "#D29922",
      num: "05"
    },
    {
      id: "Behavioral Interview",
      title: "Behavioral Round",
      icon: <HelpCircle className="w-5 h-5 transition-colors" />,
      desc: "Draft STAR method essays answering workplace conflict.",
      tag: "STAR Essays",
      color: "#8B949E",
      num: "06"
    }
  ];

  // SVG Circular Gauge Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (state.offerReadiness / 100) * circumference;

  // Filtered challenges database
  const filteredChallenges = CHALLENGES_DATABASE.filter((ch) => {
    const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ch.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startCatalogChallenge = (defn: any) => {
    const challenge = buildChallengeFromDefinition(defn, selectedLang, selectedFramework, "Coding Arena");
    sessionStorage.setItem("active_challenge", JSON.stringify(challenge));
    sessionStorage.setItem("ai_assistant_active", "true");
    sessionStorage.setItem("voice_interviewer_active", "false");
    router.push("/workspace");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-zinc-800 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LinkNext href="/" className="flex items-center gap-3">
              <img src="/develiq_logo.jpg" alt="Develiq Logo" className="w-8 h-8 rounded object-cover border border-border" />
              <span className="text-xl font-bold tracking-wider text-foreground select-none font-mono">
                Develiq
              </span>
            </LinkNext>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <LinkNext href="/pricing" className="text-secondary hover:text-foreground transition-colors">
              Pricing
            </LinkNext>
            <LinkNext href="/profile" className="px-4 py-2 font-semibold border border-border rounded-md bg-surface text-secondary hover:text-foreground hover:border-border-muted transition-all flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-inset border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
                {state.user?.name ? state.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              Settings
            </LinkNext>
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-md bg-surface text-foreground hover:bg-elevated transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {state.theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Side: Stats & Skills Profile */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Main Hero stats card with IDE aesthetics */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-inset/40 border-b border-border text-xs text-secondary select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B72]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#7EE787]/80" />
                <span className="ml-2 font-mono text-[10px] text-secondary">benchmarks.json</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-muted font-mono">JSON</span>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Profile declaration */}
              <div className="font-mono text-xs leading-relaxed select-none">
                <div>
                  <span className="text-red">const</span> <span className="text-blue">candidate</span> = {"{"}
                </div>
                <div className="pl-4">
                  <span className="text-blue">tier</span>: <span className="text-green">&quot;{careerRank}&quot;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-blue">eloRating</span>: <span className="text-blue">{state.rating}</span>,
                </div>
                <div className="pl-4">
                  <span className="text-blue">level</span>: <span className="text-blue">{currentLevel}</span>
                </div>
                <div>{"};"}</div>
              </div>

              {/* Visual Gauge for Offer Readiness */}
              <div className="flex items-center gap-5 border-t border-b border-border py-5">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Track */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="stroke-inset fill-none"
                      strokeWidth="8"
                    />
                    {/* Progress Indicator */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="stroke-green fill-none transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                    <span className="text-xl font-extrabold text-green leading-none">{state.offerReadiness}%</span>
                    <span className="text-[8px] font-semibold text-secondary uppercase tracking-widest mt-1">Ready</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    Offer Readiness Score
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed mt-1 font-sans">
                    Aggregated index tracking core system fluency, code optimization, and real-time prompt verification metrics.
                  </p>
                </div>
              </div>

              {/* Level progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-secondary mb-1.5">
                  <span>XP Level Progression</span>
                  <span className="text-secondary">{currentLevelXP} / 1000 XP</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-inset border border-border overflow-hidden">
                  <div className="h-full bg-blue rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
                </div>
              </div>

              {/* Grid of Key Tech-Startup Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs text-secondary">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-inset/40 border border-border">
                  <Activity className="w-4 h-4 text-secondary" />
                  <div>
                    <span className="text-green font-bold block">{state.history.length}</span>
                    <span className="text-[9px] text-secondary uppercase tracking-wider">// Run Sessions</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-inset/40 border border-border">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <div>
                    <span className="text-red font-bold block">{state.streak} Days</span>
                    <span className="text-[9px] text-secondary uppercase tracking-wider">// Streak</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-inset/40 border border-border">
                  <Award className="w-4 h-4 text-secondary" />
                  <div>
                    <span className="text-yellow font-bold block">{state.unlockedBadges.length}</span>
                    <span className="text-[9px] text-secondary uppercase tracking-wider">// Badges</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-inset/40 border border-border">
                  <Zap className="w-4 h-4 text-secondary" />
                  <div>
                    <span className="text-yellow font-bold block">{masteredTasksCount}</span>
                    <span className="text-[9px] text-secondary uppercase tracking-wider">// Mastered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Skill Breakdown list */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-inset/40 border-b border-border text-xs text-secondary select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B72]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#7EE787]/80" />
                <span className="ml-2 font-mono text-[10px] text-secondary">competency_matrix.config</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-muted font-mono">CONF</span>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div>
                <span className="text-xs text-secondary uppercase tracking-wider">// Quadrant Assessment</span>
                <h3 className="text-base font-bold text-foreground mt-1">Competency Report</h3>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { label: "codingArena", val: breakdown.coding, color: "#FF7B72" },
                  { label: "debuggingAndQA", val: breakdown.debugging, color: "var(--syntax-method)" },
                  { label: "aiWorkflows", val: breakdown.aiFluency, color: "#79C0FF" },
                  { label: "systemDesign", val: breakdown.systemDesign, color: "#D29922" },
                  { label: "communication", val: breakdown.communication, color: "#7EE787" },
                  { label: "behavioralMaturity", val: breakdown.behavioral, color: "#8B949E" }
                ].map((item, idx) => (
                  <div key={idx} className="font-mono text-xs">
                    <div className="flex justify-between mb-1.5">
                      <div>
                        <span className="text-secondary">.</span>
                        <span className="text-foreground hover:underline cursor-pointer">{item.label}</span>
                      </div>
                      <span style={{ color: item.color }} className="font-bold">{item.val}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-inset border border-border overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.val}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Side: Catalog, Ladder, Custom Modes & Match History */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Header Tab Selectors */}
          <div className="flex border-b border-border text-xs font-mono select-none">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer ${activeTab === "catalog" ? "border-foreground text-foreground" : "border-transparent text-secondary hover:text-foreground"}`}
            >
              Practice Catalog
            </button>
            <button
              onClick={() => setActiveTab("ladder")}
              className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer ${activeTab === "ladder" ? "border-foreground text-foreground" : "border-transparent text-secondary hover:text-foreground"}`}
            >
              ELO Career Ladder
            </button>
            <button
              onClick={() => setActiveTab("modes")}
              className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer ${activeTab === "modes" ? "border-foreground text-foreground" : "border-transparent text-secondary hover:text-foreground"}`}
            >
              Interview Wizard
            </button>
          </div>

          {/* TAB 1: PRACTICE CATALOG */}
          {activeTab === "catalog" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface p-4 rounded-xl border border-border">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-secondary" />
                  <input
                    type="text"
                    placeholder="Search coding challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-inset border border-border rounded-lg pl-10 pr-4 py-2 text-xs text-foreground placeholder-muted outline-none focus:border-border-muted transition-colors font-mono"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-inset border border-border px-3 py-2 rounded-lg text-xs font-semibold focus:border-border-muted text-foreground outline-none font-mono cursor-pointer"
                  >
                    <option value="All">All Topics</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Debugging">Debugging</option>
                    <option value="SQL">Database & SQL</option>
                    <option value="Frontend">Frontend Component</option>
                    <option value="System Design">System Design</option>
                  </select>

                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-inset border border-border px-3 py-2 rounded-lg text-xs font-semibold focus:border-border-muted text-foreground outline-none font-mono cursor-pointer"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="SQL">SQL</option>
                  </select>
                </div>
              </div>

              {/* Challenges Table */}
              <div className="rounded-xl border border-border bg-surface overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border bg-inset/40 text-secondary select-none">
                        <th className="p-4 font-bold text-[10px] uppercase tracking-wider">Status</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-wider">Title</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-wider">Topic</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-wider text-center">Difficulty</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-wider text-right">ELO</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-foreground">
                      {filteredChallenges.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-secondary select-none">
                            No challenges match your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredChallenges.map((ch) => {
                          const isSolved = state.history.some(h => h.title === ch.title && h.overallScore >= 80);
                          const difficultyColor = 
                            ch.difficulty === "Easy" ? "text-green" :
                            ch.difficulty === "Medium" ? "text-yellow" : "text-red";
                          return (
                            <tr key={ch.id} className="hover:bg-elevated/50 transition-colors">
                              <td className="p-4">
                                {isSolved ? (
                                  <span className="text-green font-bold" title="Solved">✓</span>
                                ) : (
                                  <span className="text-muted" title="Unsolved">•</span>
                                )}
                              </td>
                              <td className="p-4 font-bold">
                                <button onClick={() => startCatalogChallenge(ch)} className="text-left font-bold text-foreground hover:underline cursor-pointer">
                                  {ch.title}
                                </button>
                              </td>
                              <td className="p-4">
                                <span className="text-[10px] border border-border px-2 py-0.5 rounded bg-inset text-secondary">
                                  {ch.category}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${difficultyColor}`}>
                                  {ch.difficulty}
                                </span>
                              </td>
                              <td className="p-4 text-right font-bold text-secondary">
                                {ch.elo}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => startCatalogChallenge(ch)}
                                  className="px-3.5 py-1.5 rounded bg-foreground text-background text-[10px] font-extrabold hover:opacity-85 transition-opacity flex items-center gap-1 ml-auto cursor-pointer"
                                >
                                  Code <Play className="w-2.5 h-2.5 fill-current" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELO CAREER LADDER PROGRESSION */}
          {activeTab === "ladder" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-surface p-6 rounded-xl border border-border select-none">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                  🎯 ELO Career Ladder Progression
                </h3>
                <p className="text-xs text-secondary leading-relaxed font-sans">
                  Solve challenges within your current locked/unlocked stages to increase your ELO rating. Higher tiers unlock automatically as your rating reaches their ELO brackets.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {[
                  { title: "1. Beginner / Intro Stage", minElo: 100, maxElo: 699, color: "var(--color-green)" },
                  { title: "2. Intern Stage", minElo: 700, maxElo: 999, color: "var(--color-blue)" },
                  { title: "3. New Grad Stage", minElo: 1000, maxElo: 1299, color: "var(--color-yellow)" },
                  { title: "4. Junior Dev Stage", minElo: 1300, maxElo: 1599, color: "var(--syntax-method)" },
                  { title: "5. Intermediate Stage", minElo: 1600, maxElo: 1899, color: "var(--syntax-keyword)" },
                  { title: "6. Senior Dev Stage", minElo: 1900, maxElo: 2199, color: "var(--color-red)" },
                  { title: "7. Fellow / Grandmaster Stage", minElo: 2200, maxElo: 3000, color: "#D29922" }
                ].map((stage, idx) => {
                  const isUnlocked = state.rating >= stage.minElo || idx === 0;
                  const stageProblems = CHALLENGES_DATABASE.filter(ch => ch.elo >= stage.minElo && ch.elo <= stage.maxElo);

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border p-6 flex flex-col gap-4 bg-surface transition-all ${
                        isUnlocked 
                          ? "border-border shadow-sm" 
                          : "border-border/60 opacity-40 select-none"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm flex items-center gap-2" style={{ color: isUnlocked ? stage.color : "var(--color-secondary)" }}>
                          {stage.title}
                          {isUnlocked ? (
                            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-current bg-background">
                              Unlocked
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-border text-muted bg-background flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          )}
                        </h4>
                        <span className="text-xs font-bold text-secondary">
                          {stage.minElo} - {stage.maxElo} ELO
                        </span>
                      </div>

                      {!isUnlocked && (
                        <p className="text-xs text-secondary font-sans italic">// Unlocks when your ELO rating reaches {stage.minElo} (Current: {state.rating}).</p>
                      )}

                      {isUnlocked && (
                        <div className="grid sm:grid-cols-2 gap-3 mt-2">
                          {stageProblems.length === 0 ? (
                            <div className="p-3 text-xs text-secondary italic">// No custom problems mapped in this range yet.</div>
                          ) : (
                            stageProblems.map((ch) => {
                              const isSolved = state.history.some(h => h.title === ch.title && h.overallScore >= 80);
                              return (
                                <button
                                  key={ch.id}
                                  onClick={() => startCatalogChallenge(ch)}
                                  className="p-3 rounded-lg border border-border bg-background hover:border-border-muted text-left flex items-center justify-between transition-colors font-mono text-xs cursor-pointer text-foreground group"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={isSolved ? "text-green font-bold" : "text-muted"}>
                                      {isSolved ? "✓" : "•"}
                                    </span>
                                    <span className="font-bold hover:underline">{ch.title}</span>
                                  </div>
                                  <span className="text-[10px] text-secondary group-hover:translate-x-0.5 transition-transform">
                                    {ch.elo} ELO →
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INTERVIEW SETUP WIZARD (OLD LAUNCHPAD) */}
          {activeTab === "modes" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground font-mono">// Configure Custom Interview Parameters</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {modes.map((mode, idx) => (
                  <LinkNext 
                    href={`/setup?mode=${encodeURIComponent(mode.id)}`} 
                    key={idx}
                    className="p-5 rounded-xl border border-border bg-surface hover:border-border-muted hover:bg-elevated transition-all flex gap-4 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-inset flex items-center justify-center border border-border group-hover:border-border-muted shrink-0 transition-colors" style={{ color: mode.color }}>
                      {mode.icon}
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-sm transition-colors font-mono">{mode.title}</span>
                          <span className="text-[8px] uppercase tracking-wider font-bold border border-border px-1.5 py-0.5 rounded bg-inset" style={{ color: mode.color }}>{mode.tag}</span>
                        </div>
                        <p className="text-xs text-secondary mt-2 leading-relaxed font-sans">{mode.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity font-mono" style={{ color: mode.color }}>
                        Configure Setup <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </LinkNext>
                ))}
              </div>
            </div>
          )}

          {/* Match History logs list (stays visible below catalog/ladder/wizard tabs) */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-bold text-foreground mb-4 font-mono">// Complete Session History Logs</h3>
            <div className="flex flex-col gap-4">
              {state.history.length === 0 ? (
                <div className="p-8 rounded-xl border border-border bg-surface text-center text-secondary text-xs font-mono">
                  No practice sessions completed yet. Select a problem from the catalog to begin!
                </div>
              ) : (
                state.history.map((match, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-border-muted hover:bg-elevated transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-inset border border-border flex items-center justify-center font-mono font-bold text-blue text-xs shrink-0">
                        {match.framework ? match.framework.slice(0, 2) : match.language.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground text-sm hover:underline font-mono">
                            <LinkNext href={`/review?matchId=${match.id}`}>{match.title}</LinkNext>
                          </h4>
                          <span className="text-[9px] text-blue font-medium border border-border px-1.5 rounded bg-inset font-mono">{match.level}</span>
                        </div>
                        <div className="text-xs text-secondary mt-2 font-mono flex flex-wrap items-center gap-3">
                          <span>{match.date}</span>
                          <span>•</span>
                          <span className="text-red">{match.mode}</span>
                          <span>•</span>
                          <span className="text-green">{match.language} {match.framework ? `+ ${match.framework}` : ""}</span>
                        </div>
                        {match.feedback && (
                          <p className="text-xs text-secondary mt-2 font-sans border-l-2 border-border pl-3 leading-relaxed">
                            <span className="text-muted font-mono">// Reviewer: </span>
                            &ldquo;{match.feedback}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end md:self-auto shrink-0">
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-secondary">testsPassed</div>
                        <div className="text-sm font-semibold text-foreground mt-0.5">{match.passedCount} / {match.totalCount}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-secondary">overallScore</div>
                        <div className="text-sm font-bold text-green mt-0.5">{match.overallScore} / 100</div>
                      </div>
                      <div className="px-3.5 py-2 rounded-lg bg-inset border border-border text-center w-24 font-mono">
                        <span className="text-[9px] text-secondary font-bold block leading-none uppercase">Tier ELO</span>
                        <span className="text-xs font-bold block text-foreground mt-1.5">
                          {match.ratingAfter}
                          <span className={`text-[10px] font-medium ml-1.5 ${match.eloChange >= 0 ? "text-green" : "text-red"}`}>
                            {match.eloChange >= 0 ? `+${match.eloChange}` : match.eloChange}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
