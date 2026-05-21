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
      icon: <Code className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
      desc: "LeetCode-style code puzzles with standard test verification.",
      tag: "Code Practice"
    },
    {
      id: "Real Interview",
      title: "Real Interview Mode",
      icon: <Layers className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
      desc: "Interactive mock interview where the AI asks follow-up questions.",
      tag: "High Pressure"
    },
    {
      id: "AI-Assisted Interview",
      title: "AI-Assisted Interview",
      icon: <Terminal className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
      desc: "Practice prompts and verify code with Gemini Copilot allowed.",
      tag: "Modern Workflow"
    },
    {
      id: "Real-World Task",
      title: "Real-World Task Mode",
      icon: <Shield className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
      desc: "Locate runtime bugs, fix APIs, and validation errors.",
      tag: "Debugging & QA"
    },
    {
      id: "System Design",
      title: "System Design",
      icon: <Zap className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
      desc: "Draft scalable, distributed architectures for ingestion.",
      tag: "Scale Architecture"
    },
    {
      id: "Behavioral Interview",
      title: "Behavioral Round",
      icon: <HelpCircle className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />,
      desc: "Draft STAR method essays answering workplace conflict.",
      tag: "STAR Essays"
    }
  ];

  // SVG Circular Gauge Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (state.offerReadiness / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex flex-col font-mono selection:bg-zinc-800 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#27272A] bg-zinc-950/40 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <LinkNext href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center font-bold text-black text-lg select-none">
                D
              </div>
              <span className="text-xl font-bold tracking-wider text-white select-none">
                Dev<span className="text-[#A1A1AA]">Elo</span>
              </span>
            </LinkNext>
          </div>
          <div className="flex items-center gap-6">
            <LinkNext href="/profile" className="flex items-center gap-2 hover:text-white text-zinc-400 transition-colors text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-[#27272A] flex items-center justify-center text-xs font-semibold text-white">
                U
              </div>
              <span>Settings</span>
            </LinkNext>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Side: Stats & Skills Profile */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Main Hero stats card with de-emphasized ELO */}
          <div className="p-6 rounded-md terminal-surface border border-[#21262D] relative overflow-hidden flex flex-col gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Practice Benchmarks</span>
                <h2 className="text-2xl font-bold text-white tracking-wide mt-1">{careerRank}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Practice Tier • ELO {state.rating}</p>
              </div>
              <div className="px-2.5 py-1 rounded bg-zinc-900 border border-[#27272A] text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Level {currentLevel}</span>
              </div>
            </div>

            {/* Visual Gauge for Offer Readiness */}
            <div className="flex items-center gap-5 border-t border-b border-[#27272A] py-5">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track */}
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-zinc-800 fill-none"
                    strokeWidth="8"
                  />
                  {/* Progress Indicator */}
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-white fill-none transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-white leading-none">{state.offerReadiness}%</span>
                  <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest mt-1">Ready</span>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Offer Readiness Score
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                  Aggregated index tracking core system fluency, code optimization, and real-time prompt verification metrics.
                </p>
              </div>
            </div>

            {/* Level progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                <span>XP Level Progression</span>
                <span>{currentLevelXP} / 1000 XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
              </div>
            </div>

            {/* Grid of Key Tech-Startup Stats */}
            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-[#27272A]">
                <Activity className="w-4 h-4 text-zinc-300" />
                <div>
                  <span className="text-white font-bold block">{state.history.length}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Interviews Done</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-[#27272A]">
                <Calendar className="w-4 h-4 text-zinc-300" />
                <div>
                  <span className="text-white font-bold block">{state.streak} Days</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Active Streak</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-[#27272A]">
                <Award className="w-4 h-4 text-zinc-300" />
                <div>
                  <span className="text-white font-bold block">{state.unlockedBadges.length} Earned</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Badges Unlocked</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-[#27272A]">
                <Zap className="w-4 h-4 text-zinc-300" />
                <div>
                  <span className="text-white font-bold block">{masteredTasksCount}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Tasks Mastered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Skill Breakdown list */}
          <div className="p-6 rounded-md terminal-surface border border-[#21262D] flex flex-col gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Competency Matrix</span>
              <h3 className="text-base font-bold text-white mt-1">Quadrant Assessment</h3>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Coding Arena", val: breakdown.coding },
                { label: "Debugging & QA", val: breakdown.debugging },
                { label: "AI-Assisted Workflows", val: breakdown.aiFluency },
                { label: "System Design", val: breakdown.systemDesign },
                { label: "Communication Score", val: breakdown.communication },
                { label: "Behavioral Maturity", val: breakdown.behavioral }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                    <span>{item.label}</span>
                    <span className="text-white font-semibold">{item.val}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-zinc-300 rounded-full" style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right Side: Challenge Selection & Match History */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Main Launchpad Grid */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Choose Your Practice Mode</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {modes.map((mode, idx) => (
                <LinkNext 
                  href={`/setup?mode=${encodeURIComponent(mode.id)}`} 
                  key={idx}
                  className="p-5 rounded-xl border border-[#27272A] bg-zinc-900/10 hover:border-zinc-500 hover:bg-zinc-900/30 transition-all flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-[#27272A] group-hover:border-zinc-500 shrink-0 transition-colors">
                    {mode.icon}
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm group-hover:text-white transition-colors">{mode.title}</span>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold border border-[#27272A] px-1.5 py-0.5 rounded bg-zinc-950">{mode.tag}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{mode.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      Configure Setup <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </LinkNext>
              ))}
            </div>
          </div>

          {/* Match History */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Interview History Logs</h3>
            <div className="flex flex-col gap-4">
              {state.history.length === 0 ? (
                <div className="p-8 rounded-xl border border-[#27272A] bg-zinc-900/10 text-center text-zinc-500 text-sm">
                  No practice matches completed yet. Choose a mode above to start!
                </div>
              ) : (
                state.history.map((match, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-[#27272A] bg-zinc-900/15 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-[#27272A] flex items-center justify-center font-bold text-white text-base">
                        {match.framework ? match.framework[0] : match.language[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm hover:underline">
                            <LinkNext href={`/review?matchId=${match.id}`}>{match.title}</LinkNext>
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-medium border border-[#27272A] px-1.5 rounded">{match.level}</span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-1.5 flex flex-wrap items-center gap-3">
                          <span>{match.date}</span>
                          <span>•</span>
                          <span>{match.mode}</span>
                          <span>•</span>
                          <span>{match.language} + {match.framework}</span>
                        </div>
                        {match.feedback && (
                          <p className="text-xs italic text-zinc-400 mt-2 line-clamp-1">"{match.feedback}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end md:self-auto shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Passed Tests</div>
                        <div className="text-sm font-semibold text-white mt-0.5">{match.passedCount} / {match.totalCount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Overall Score</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">{match.overallScore} / 100</div>
                      </div>
                      <div className="px-3.5 py-2 rounded-lg bg-zinc-900 border border-[#27272A] text-center w-24">
                        <span className="text-[9px] text-zinc-500 font-bold block leading-none uppercase">Tier ELO</span>
                        <span className="text-xs font-bold block text-white mt-1">
                          {match.ratingAfter}
                          <span className={`text-[10px] font-medium ml-1 ${match.eloChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
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
