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
  const { state, getCareerRank, getScoreBreakdown, toggleTheme, logoutUser } = useStore();
  
  const careerRank = getCareerRank();
  const breakdown = getScoreBreakdown();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"catalog" | "ladder" | "modes" | "analytics">("catalog");
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

  // Filtered and sorted challenges database (Easy -> Medium -> Hard)
  const DIFFICULTY_MAP: Record<string, number> = { "Easy": 1, "Medium": 2, "Hard": 3 };
  const filteredChallenges = CHALLENGES_DATABASE.filter((ch) => {
    const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ch.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    return (DIFFICULTY_MAP[a.difficulty] || 2) - (DIFFICULTY_MAP[b.difficulty] || 2);
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
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LinkNext href="/" className="flex items-center gap-3">
              <img src="/develiq_logo.jpg" alt="Develiq Logo" className="w-8 h-8 rounded object-cover border border-border" />
              <span className="text-xl font-bold tracking-wider text-foreground select-none font-mono">
                Develiq
              </span>
            </LinkNext>
          </div>
          <div className="flex items-center gap-4 font-mono text-sm">
            <LinkNext href="/pricing" className="text-secondary hover:text-foreground transition-colors">
              Pricing
            </LinkNext>
            <LinkNext href="/profile" className="px-4 py-2 font-semibold border border-border rounded-md bg-surface text-secondary hover:text-foreground hover:border-border-muted transition-all flex items-center gap-2">
              <div className="w-5.5 h-5.5 rounded-full bg-inset border border-border flex items-center justify-center text-[11px] font-bold text-foreground">
                {state.user?.name ? state.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              Profile & Settings
            </LinkNext>
            <button
              onClick={() => {
                logoutUser();
                router.push("/login");
              }}
              className="px-4 py-2 font-semibold border border-border rounded-md bg-surface text-secondary hover:text-foreground hover:border-border-muted transition-all cursor-pointer"
            >
              Sign Out
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-md bg-surface text-foreground hover:bg-elevated transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {state.theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[92%] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Practice Catalog, Ladder, Custom Modes & Match History */}
        <div className="flex flex-col gap-6">
          
          {/* Header Tab Selectors */}
          <div className="flex border-b border-border text-sm font-mono select-none">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-5 py-3.5 border-b-2 font-bold transition-colors cursor-pointer ${activeTab === "catalog" ? "border-foreground text-foreground" : "border-transparent text-secondary hover:text-foreground"}`}
            >
              Practice Catalog
            </button>
            <button
              onClick={() => setActiveTab("modes")}
              className={`px-5 py-3.5 border-b-2 font-bold transition-colors cursor-pointer ${activeTab === "modes" ? "border-foreground text-foreground" : "border-transparent text-secondary hover:text-foreground"}`}
            >
              Interview Wizard
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-5 py-3.5 border-b-2 font-bold transition-colors cursor-pointer ${activeTab === "analytics" ? "border-foreground text-foreground" : "border-transparent text-secondary hover:text-foreground"}`}
            >
              Analytics Dashboard
            </button>
          </div>

          {/* TAB 1: PRACTICE CATALOG */}
          {activeTab === "catalog" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/90 shadow-[0_6px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.25)] p-5 rounded-xl border border-border/80">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-secondary" />
                  <input
                    type="text"
                    placeholder="Search coding challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-inset border border-border rounded-lg pl-11 pr-4 py-2.5 text-sm text-foreground placeholder-muted outline-none focus:border-border-muted transition-colors font-mono"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2.5 items-center w-full sm:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-inset border border-border px-4 py-2.5 rounded-lg text-sm font-semibold focus:border-border-muted text-foreground outline-none font-mono cursor-pointer"
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
                    className="bg-inset border border-border px-4 py-2.5 rounded-lg text-sm font-semibold focus:border-border-muted text-foreground outline-none font-mono cursor-pointer"
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
              <div className="rounded-xl border border-border dark:border-white/15 bg-surface shadow-[0_10px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_0_50px_rgba(255,255,255,0.03),0_10px_35px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left font-mono text-sm">
                    <thead>
                      <tr className="border-b border-border bg-inset/40 text-secondary select-none">
                        <th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-wider">Title</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-wider">Topic</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-wider text-center">Difficulty</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-foreground">
                      {filteredChallenges.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-secondary select-none text-sm">
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
                              <td className="p-4 text-base">
                                {isSolved ? (
                                  <span className="text-green font-bold" title="Solved">✓</span>
                                ) : (
                                  <span className="text-muted" title="Unsolved">•</span>
                                )}
                              </td>
                              <td className="p-4 font-bold text-sm">
                                <button onClick={() => startCatalogChallenge(ch)} className="text-left font-bold text-foreground hover:underline cursor-pointer text-sm">
                                  {ch.title}
                                </button>
                              </td>
                              <td className="p-4">
                                <span className="text-xs font-bold border border-border/80 dark:border-border px-2.5 py-1 rounded bg-inset text-foreground dark:text-foreground/90">
                                  {ch.category}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`text-xs font-extrabold uppercase tracking-wider ${difficultyColor}`}>
                                  {ch.difficulty}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => startCatalogChallenge(ch)}
                                  className="px-4 py-2 rounded bg-foreground text-background text-xs font-extrabold hover:opacity-85 transition-opacity flex items-center gap-1.5 ml-auto cursor-pointer"
                                >
                                  Code <Play className="w-3 h-3 fill-current" />
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



          {/* TAB 3: INTERVIEW SETUP WIZARD (OLD LAUNCHPAD) */}
          {activeTab === "modes" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <h3 className="text-base font-bold text-foreground font-mono">// Configure Custom Interview Parameters</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {modes.map((mode, idx) => (
                  <LinkNext 
                    href={`/setup?mode=${encodeURIComponent(mode.id)}`} 
                    key={idx}
                    className="p-5 rounded-xl border border-border bg-surface hover:border-border-muted hover:bg-elevated transition-all flex gap-4 group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-lg bg-inset flex items-center justify-center border border-border group-hover:border-border-muted shrink-0 transition-colors" style={{ color: mode.color }}>
                      {mode.icon}
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-base transition-colors font-mono">{mode.title}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold border border-border px-2 py-0.5 rounded bg-inset" style={{ color: mode.color }}>{mode.tag}</span>
                        </div>
                        <p className="text-sm text-secondary mt-2.5 leading-relaxed font-sans">{mode.desc}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold mt-4.5 opacity-0 group-hover:opacity-100 transition-opacity font-mono" style={{ color: mode.color }}>
                        Configure Setup <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </LinkNext>
                ))}
              </div>
            </div>
          )}
 
          {/* TAB 4: ANALYTICS DASHBOARD */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Developer Profile & Progression Card */}
                <div className="p-6 rounded-xl border border-border bg-surface flex flex-col justify-between shadow-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-secondary font-mono">// EXPERIENCE LEVEL PROGRESSION</span>
                    <h4 className="text-2xl font-bold text-foreground font-sans">Level {currentLevel} Developer</h4>
                    <p className="text-xs text-secondary font-sans leading-relaxed mt-1">
                      Earn Experience Points (XP) by completing practice challenges, mock interviews, and system designs.
                    </p>
                  </div>
                  <div className="py-6 flex flex-col gap-3.5">
                    <div className="flex justify-between text-xs font-mono font-bold text-foreground">
                      <span>{currentLevelXP} / 1000 XP</span>
                      <span>{xpPercent}%</span>
                    </div>
                    <div className="w-full bg-inset border border-border h-3 rounded-full overflow-hidden">
                      <div className="bg-foreground h-full rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
                    </div>
                  </div>
                  <div className="border-t border-border pt-4 mt-2 flex justify-between items-center text-xs text-secondary font-mono font-bold">
                    <span>Practice Streak:</span>
                    <span className="text-yellow">{state.streak} Days Practice 🔥</span>
                  </div>
                </div>

                {/* Recommendations and history analytics */}
                <div className="p-6 rounded-xl border border-border bg-surface flex flex-col justify-between gap-6 shadow-sm">
                  <div>
                    <span className="text-xs text-secondary font-mono">// COACH RECOMMENDATIONS</span>
                    <h3 className="text-base font-bold text-foreground mt-1 font-sans">Study Recommendation Agenda</h3>
                  </div>

                  <div className="flex-1 flex flex-col gap-4.5 font-sans justify-center text-sm">
                    <div className="p-4 rounded-lg bg-inset border border-border leading-relaxed flex gap-3">
                      <span className="text-xl select-none">💡</span>
                      <div>
                        <strong className="text-foreground font-sans">Next Practice Target Recommendation:</strong>
                        <p className="text-xs text-secondary mt-1 font-sans">
                          {(() => {
                            const keys = ["coding", "debugging", "systemDesign", "communication", "aiFluency", "behavioral"];
                            const lowestKey = keys.reduce((min, k) => (breakdown[k as keyof typeof breakdown] < breakdown[min as keyof typeof breakdown] ? k : min), "coding");
                            
                            switch (lowestKey) {
                              case "coding": return "Your algorithmic complexity index has room for growth. Target 'Algorithms' tags in the practice catalog.";
                              case "debugging": return "Boundary errors and crash safety are your current bottleneck. Practice 'Debugging' challenge tasks in the catalog.";
                              case "systemDesign": return "Distributed database sharding and caching queue designs need reinforcement. Set up a 'System Design' mock setup run.";
                              case "communication": return "Explaining tradeoff choices under interview mock pressure is key. Run dynamic 'Real Interview' voice modes.";
                              case "aiFluency": return "Verify helper snippets properly to improve prompt structure usage metrics. Practice 'AI-Assisted' interview modules.";
                              case "behavioral": return "Build structured workplace essays. Practice STAR methodology layout options inside the 'Behavioral' wizard mode.";
                              default: return "Complete more sessions to update customized AI practice study plans.";
                            }
                          })()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs border-t border-border pt-4 font-mono select-none">
                      <span className="text-secondary font-semibold">Total Sessions:</span>
                      <span className="text-foreground font-bold">{state.history.length} completed</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-border pt-2.5 font-mono select-none">
                      <span className="text-secondary font-semibold">Unlocked Badges:</span>
                      <span className="text-foreground font-bold">{state.unlockedBadges.length} earned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Match History logs list (stays visible below catalog/ladder/wizard tabs) */}
          <div className="border-t border-border pt-6">
            <h3 className="text-base font-bold text-foreground mb-4 font-mono">// Complete Session History Logs</h3>
            <div className="flex flex-col gap-4">
              {state.history.length === 0 ? (
                <div className="p-8 rounded-xl border border-border bg-surface text-center text-secondary text-sm font-mono">
                  No practice sessions completed yet. Select a problem from the catalog to begin!
                </div>
              ) : (
                state.history.map((match, idx) => (
                  <div key={idx} className="p-6 rounded-xl border border-border bg-surface/90 shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.22)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:border-border-muted hover:bg-elevated transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-inset border border-border flex items-center justify-center font-mono font-bold text-blue text-sm shrink-0">
                        {match.framework ? match.framework.slice(0, 2) : match.language.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-foreground text-base hover:underline font-mono">
                            <LinkNext href={`/review?matchId=${match.id}`}>{match.title}</LinkNext>
                          </h4>
                          <span className="text-[11px] text-blue font-medium border border-border px-2 rounded bg-inset font-mono">{match.level}</span>
                        </div>
                        <div className="text-sm text-secondary mt-2.5 font-mono flex flex-wrap items-center gap-3">
                          <span>{match.date}</span>
                          <span>•</span>
                          <span className="text-red">{match.mode}</span>
                          <span>•</span>
                          <span className="text-green">{match.language} {match.framework ? `+ ${match.framework}` : ""}</span>
                        </div>
                        {match.feedback && (
                          <p className="text-sm text-secondary mt-2.5 font-sans border-l-2 border-border pl-3 leading-relaxed">
                            <span className="text-muted font-mono">// Reviewer: </span>
                            &ldquo;{match.feedback}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end md:self-auto shrink-0">
                      <div className="text-right font-mono">
                        <div className="text-xs text-secondary">testsPassed</div>
                        <div className="text-base font-semibold text-foreground mt-0.5">{match.passedCount} / {match.totalCount}</div>
                      </div>
                      <div className="px-4 py-2.5 rounded-lg bg-inset border border-border text-center font-mono text-xs font-bold text-green select-none">
                        Completed
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
