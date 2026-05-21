"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, getCareerRankForElo } from "@/lib/store";
import { 
  ArrowLeft, Award, Key, Shield, Calendar, 
  Trash2, Check, Sparkles, BookOpen, Layers 
} from "lucide-react";

export default function UserProfile() {
  const { state, getCareerRank, setGeminiApiKey, resetState } = useStore();
  const [apiKeyInput, setApiKeyInput] = useState(state.geminiApiKey);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const careerRank = getCareerRank();

  // Badges metadata mapping
  const BADGES = [
    { name: "First Submit", icon: "🚀", desc: "Completed your first interview sandbox session." },
    { name: "7-Day Streak", icon: "🔥", desc: "Maintained a 7-day practice streak calendar." },
    { name: "Bug Hunter", icon: "👾", desc: "Earned 95+ accuracy rating in a debugging round." },
    { name: "React Ready", icon: "⚛️", desc: "Completed a React/JS framework task successfully." },
    { name: "SQL Slayer", icon: "💾", desc: "Executed a database query challenge perfectly." },
    { name: "API Builder", icon: "🌐", desc: "Created a back-end REST service endpoint." },
    { name: "System Design Rookie", icon: "📐", desc: "Drafted a collaborative scalable design outline." },
    { name: "Interview Survivor", icon: "🛡️", desc: "Completed 5 mock interview sandbox sessions." },
    { name: "AI-Assisted Pro", icon: "🤖", desc: "Completed an AI-Assisted round with zero boilerplate copies." },
    { name: "Hackathon Finalist", icon: "🏆", desc: "Completed a Solo Hackathon sprint projectbrief." }
  ];

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput);
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
    }, 3000);
  };

  const handleClearApiKey = () => {
    setApiKeyInput("");
    setGeminiApiKey("");
  };

  return (
    <div className="min-h-screen bg-[#080A10] text-[#E2E8F0] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-[#1B2134] bg-slate-950/40 select-none">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#94A3B8] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold tracking-wider text-white">Profile & API Settings</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* User Card Row */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch select-none">
          {/* User Bio Stats */}
          <div className="md:col-span-1 p-6 rounded-2xl glass-panel border border-[#1B2134] flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#1B2134] border border-cyan-500/30 flex items-center justify-center font-bold text-3xl text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.1)]">
              U
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Developer Coder</h2>
              <span className="text-xs text-[#00E5FF] font-semibold uppercase tracking-wider block mt-1">{careerRank}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#94A3B8] border-t border-[#1B2134] pt-4 w-full justify-center">
              <div>
                <span className="text-white font-bold block">{state.rating}</span>
                <span>ELO Rating</span>
              </div>
              <div className="w-px h-6 bg-[#1B2134]" />
              <div>
                <span className="text-white font-bold block">{state.streak} Days</span>
                <span>Streak</span>
              </div>
            </div>
          </div>

          {/* Gemini API Key Drawer */}
          <div className="md:col-span-2 p-6 rounded-2xl glass-panel border border-[#1B2134] bg-slate-900/10 flex flex-col justify-between gap-5 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">AI ENGINE MODE</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${state.geminiApiKey ? "text-[#00E676] bg-emerald-950/20 border-emerald-900/30" : "text-[#00E5FF] bg-cyan-950/20 border-cyan-500/20"}`}>
                  {state.geminiApiKey ? "Gemini Active" : "Local Simulation"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">Direct Gemini LLM Connection</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                By default, DevElo operates with advanced client-side template engines. Provide your custom **Gemini API Key** to experience fully dynamic LLM-generated coding problems, real-time context dialogs, and customized reviews.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input 
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your Gemini API Key..."
                  className="flex-1 bg-slate-950 border border-[#1B2134] rounded-lg px-4 py-2 text-xs text-white placeholder-slate-600 focus:border-[#00E5FF] outline-none font-mono"
                />
                {state.geminiApiKey && (
                  <button 
                    onClick={handleClearApiKey}
                    className="p-2 border border-[#FF1744] hover:bg-rose-950/20 transition-all rounded-lg text-[#FF1744]"
                    title="Clear Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={handleSaveApiKey}
                  className="px-5 py-2 rounded-lg bg-[#00E5FF] text-black text-xs font-bold hover:bg-[#00c8e6] transition-all"
                >
                  Save API Key
                </button>
                {showSavedMsg && (
                  <span className="text-xs text-[#00E676] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Key saved persistently!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Badges Cabinet */}
        <div className="flex flex-col gap-4 select-none">
          <h3 className="text-lg font-bold text-white">Badges Cabinet</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BADGES.map((badge, idx) => {
              const isUnlocked = state.unlockedBadges.includes(badge.name);
              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border flex gap-4 transition-all ${isUnlocked ? "bg-slate-900/10 border-cyan-500/20 hover:border-cyan-500/40" : "bg-slate-950/30 border-[#1B2134] opacity-50"}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${isUnlocked ? "bg-cyan-950/20 border border-cyan-500/10 shadow-[0_0_10px_rgba(0,229,255,0.05)]" : "bg-slate-950 border border-slate-900 filter grayscale"}`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      {badge.name}
                      {isUnlocked && <span className="text-[9px] uppercase font-bold text-[#00E676] tracking-wider bg-emerald-950/30 px-1 rounded border border-emerald-900/20">Unlocked</span>}
                    </h4>
                    <p className="text-[10px] text-[#94A3B8] mt-1 leading-relaxed">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset State Utility */}
        <div className="border-t border-[#1B2134] pt-8 flex items-center justify-between text-xs text-[#94A3B8] select-none">
          <span>Reset statistics, history logs, and ELO progress back to clean state.</span>
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to delete all match history, ELO rating updates, and streaks? This cannot be undone.")) {
                resetState();
                window.location.reload();
              }
            }}
            className="px-4 py-2 border border-[#FF1744]/40 rounded-lg text-[#FF1744] hover:bg-rose-950/20 transition-all font-semibold"
          >
            Reset Database State
          </button>
        </div>

      </main>
    </div>
  );
}
