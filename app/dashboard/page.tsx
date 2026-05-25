"use client";

import LinkNext from "next/link";
import { useStore } from "@/lib/store";
import { 
  Award, Zap, Calendar, ArrowRight, Code, Play, 
  Terminal, Shield, Layers, HelpCircle, Activity, Sparkles
} from "lucide-react";

export default function Dashboard() {
  const { state, getCareerRank, getScoreBreakdown } = useStore();
  
  const careerRank = getCareerRank();
  const breakdown = getScoreBreakdown();
  
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono selection:bg-zinc-800 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#1A1F26]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LinkNext href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center font-mono font-bold text-white text-base select-none">
                &lt;/&gt;
              </div>
              <span className="text-xl font-bold tracking-wider text-white select-none font-mono">
                Dev<span className="text-zinc-500">Elo</span>
              </span>
            </LinkNext>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs">
            <LinkNext href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
              Pricing
            </LinkNext>
            <LinkNext href="/profile" className="px-4 py-2 font-semibold border border-[#1A1F26] rounded-md bg-[#0B0E14] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                U
              </div>
              Settings
            </LinkNext>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Side: Stats & Skills Profile */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Main Hero stats card with IDE aesthetics */}
          <div className="rounded-xl border border-[#1A1F26] bg-[#0B0E14] overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-[#1A1F26] text-xs text-zinc-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B72]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#7EE787]/80" />
                <span className="ml-2 font-mono text-[10px] text-zinc-400">benchmarks.json</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-600 font-mono">JSON</span>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Profile declaration */}
              <div className="font-mono text-xs leading-relaxed select-none">
                <div>
                  <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">candidate</span> = {"{"}
                </div>
                <div className="pl-4">
                  <span className="text-[#79C0FF]">tier</span>: <span className="text-[#7EE787]">&quot;{careerRank}&quot;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-[#79C0FF]">eloRating</span>: <span className="text-[#79C0FF]">{state.rating}</span>,
                </div>
                <div className="pl-4">
                  <span className="text-[#79C0FF]">level</span>: <span className="text-[#79C0FF]">{currentLevel}</span>
                </div>
                <div>{"};"}</div>
              </div>

              {/* Visual Gauge for Offer Readiness */}
              <div className="flex items-center gap-5 border-t border-b border-[#1A1F26] py-5">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Track */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="stroke-zinc-950 fill-none"
                      strokeWidth="8"
                    />
                    {/* Progress Indicator */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="stroke-[#7EE787] fill-none transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                    <span className="text-xl font-extrabold text-[#7EE787] leading-none">{state.offerReadiness}%</span>
                    <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest mt-1">Ready</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Offer Readiness Score
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1 font-sans">
                    Aggregated index tracking core system fluency, code optimization, and real-time prompt verification metrics.
                  </p>
                </div>
              </div>

              {/* Level progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                  <span>XP Level Progression</span>
                  <span className="text-zinc-500">{currentLevelXP} / 1000 XP</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black border border-[#1A1F26] overflow-hidden">
                  <div className="h-full bg-[#79C0FF] rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
                </div>
              </div>

              {/* Grid of Key Tech-Startup Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-[#1A1F26]">
                  <Activity className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="text-[#7EE787] font-bold block">{state.history.length}</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">// Interviews Done</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-[#1A1F26]">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="text-[#FF7B72] font-bold block">{state.streak} Days</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">// Streak</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-[#1A1F26]">
                  <Award className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="text-[#D2A8FF] font-bold block">{state.unlockedBadges.length}</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">// Badges</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-[#1A1F26]">
                  <Zap className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="text-[#D29922] font-bold block">{masteredTasksCount}</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">// Mastered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Skill Breakdown list */}
          <div className="rounded-xl border border-[#1A1F26] bg-[#0B0E14] overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-[#1A1F26] text-xs text-zinc-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B72]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#7EE787]/80" />
                <span className="ml-2 font-mono text-[10px] text-zinc-400">competency_matrix.config</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-600 font-mono">CONF</span>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">// Quadrant Assessment</span>
                <h3 className="text-base font-bold text-white mt-1">Competency Report</h3>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { label: "codingArena", val: breakdown.coding, color: "#FF7B72" },
                  { label: "debuggingAndQA", val: breakdown.debugging, color: "#D2A8FF" },
                  { label: "aiWorkflows", val: breakdown.aiFluency, color: "#79C0FF" },
                  { label: "systemDesign", val: breakdown.systemDesign, color: "#D29922" },
                  { label: "communication", val: breakdown.communication, color: "#7EE787" },
                  { label: "behavioralMaturity", val: breakdown.behavioral, color: "#8B949E" }
                ].map((item, idx) => (
                  <div key={idx} className="font-mono text-xs">
                    <div className="flex justify-between mb-1.5">
                      <div>
                        <span className="text-zinc-500">.</span>
                        <span className="text-white hover:underline cursor-pointer">{item.label}</span>
                      </div>
                      <span style={{ color: item.color }} className="font-bold">{item.val}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black border border-[#1A1F26] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.val}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Side: Challenge Selection & Match History */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Main Launchpad Grid */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 font-mono">// Choose Your Practice Mode</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {modes.map((mode, idx) => (
                <LinkNext 
                  href={`/setup?mode=${encodeURIComponent(mode.id)}`} 
                  key={idx}
                  className="p-5 rounded-xl border border-[#1A1F26] bg-[#0B0E14] hover:border-zinc-700 hover:bg-[#10141B] transition-all flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-[#1A1F26] group-hover:border-zinc-700 shrink-0 transition-colors" style={{ color: mode.color }}>
                    {mode.icon}
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm group-hover:text-white transition-colors font-mono">{mode.title}</span>
                        <span className="text-[8px] uppercase tracking-wider font-bold border border-[#1A1F26] px-1.5 py-0.5 rounded bg-black" style={{ color: mode.color }}>{mode.tag}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">{mode.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity font-mono" style={{ color: mode.color }}>
                      Configure Setup <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </LinkNext>
              ))}
            </div>
          </div>

          {/* Match History */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 font-mono">// Interview History Logs</h3>
            <div className="flex flex-col gap-4">
              {state.history.length === 0 ? (
                <div className="p-8 rounded-xl border border-[#1A1F26] bg-[#0B0E14] text-center text-zinc-500 text-sm font-mono">
                  No practice matches completed yet. Choose a mode above to start!
                </div>
              ) : (
                state.history.map((match, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-[#1A1F26] bg-[#0B0E14] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 hover:bg-[#10141B] transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-black border border-[#1A1F26] flex items-center justify-center font-mono font-bold text-[#79C0FF] text-xs shrink-0">
                        {match.framework ? match.framework.slice(0, 2) : match.language.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm hover:underline font-mono">
                            <LinkNext href={`/review?matchId=${match.id}`}>{match.title}</LinkNext>
                          </h4>
                          <span className="text-[9px] text-[#79C0FF] font-medium border border-[#1A1F26] px-1.5 rounded bg-black font-mono">{match.level}</span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-2 font-mono flex flex-wrap items-center gap-3">
                          <span>{match.date}</span>
                          <span>•</span>
                          <span className="text-[#FF7B72]">{match.mode}</span>
                          <span>•</span>
                          <span className="text-[#7EE787]">{match.language} {match.framework ? `+ ${match.framework}` : ""}</span>
                        </div>
                        {match.feedback && (
                          <p className="text-xs text-zinc-400 mt-2 font-sans border-l-2 border-zinc-800 pl-3 leading-relaxed">
                            <span className="text-zinc-600 font-mono">// Reviewer: </span>
                            &ldquo;{match.feedback}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end md:self-auto shrink-0">
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-zinc-500">testsPassed</div>
                        <div className="text-sm font-semibold text-white mt-0.5">{match.passedCount} / {match.totalCount}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-zinc-500">overallScore</div>
                        <div className="text-sm font-bold text-[#7EE787] mt-0.5">{match.overallScore} / 100</div>
                      </div>
                      <div className="px-3.5 py-2 rounded-lg bg-black border border-[#1A1F26] text-center w-24 font-mono">
                        <span className="text-[9px] text-zinc-500 font-bold block leading-none uppercase">Tier ELO</span>
                        <span className="text-xs font-bold block text-white mt-1.5">
                          {match.ratingAfter}
                          <span className={`text-[10px] font-medium ml-1.5 ${match.eloChange >= 0 ? "text-[#7EE787]" : "text-[#FF7B72]"}`}>
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
