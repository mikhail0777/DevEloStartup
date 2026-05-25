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
    <div className="min-h-screen bg-black text-white flex flex-col font-mono selection:bg-zinc-800 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#1A1F26] select-none font-mono">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold tracking-wider text-white">Profile & Settings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center font-bold text-white text-base select-none">
              &lt;/&gt;
            </div>
            <span className="text-xl font-bold tracking-wider text-white select-none hidden sm:inline">
              Dev<span className="text-zinc-500">Elo</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* User Card Row */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch select-none">
          {/* User Bio Stats */}
          <div className="md:col-span-1 rounded-xl border border-[#1A1F26] bg-[#0B0E14] overflow-hidden flex flex-col justify-between">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-[#1A1F26] text-xs text-zinc-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-[10px] text-zinc-400">profile.json</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-600">JSON</span>
            </div>

            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center font-mono font-bold text-3xl text-[#7EE787] shadow-[0_0_20px_rgba(126,231,135,0.04)]">
                U
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide font-mono">Developer Coder</h2>
                <span className="text-xs text-[#79C0FF] font-semibold uppercase tracking-wider block mt-1 font-mono">{careerRank}</span>
              </div>

              <div className="w-full h-px bg-[#1A1F26] my-2" />

              {/* JSON representation of stats */}
              <div className="w-full text-left text-xs leading-relaxed text-zinc-400 select-none font-mono">
                <div>{"{"}</div>
                <div className="pl-4">
                  <span className="text-[#79C0FF]">&quot;ratingElo&quot;</span>: <span className="text-[#79C0FF]">{state.rating}</span>,
                </div>
                <div className="pl-4">
                  <span className="text-[#79C0FF]">&quot;streakDays&quot;</span>: <span className="text-[#79C0FF]">{state.streak}</span>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>

          {/* Gemini API Key Drawer */}
          <div className="md:col-span-2 rounded-xl border border-[#1A1F26] bg-[#0B0E14] overflow-hidden flex flex-col justify-between">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-[#1A1F26] text-xs text-zinc-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${state.geminiApiKey ? "bg-[#7EE787]" : "bg-[#79C0FF]"}`} />
                <span className="text-[10px] text-zinc-400">engine_config.json</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-600">CONF</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">// AI ENGINE CONFIG</span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-black ${state.geminiApiKey ? "text-[#7EE787] border-[#7EE787]" : "text-[#79C0FF] border-[#79C0FF]"}`}>
                    {state.geminiApiKey ? "Gemini Active" : "Local Simulation"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-mono">Direct Gemini LLM Connection</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                  By default, DevElo operates with local mock simulation models. Provide a custom **Gemini API Key** to connect directly to the Gemini API, enabling live, non-deterministic coding problems, dynamic mock discussions, and personalized evaluation reviews.
                </p>
              </div>

              <div className="flex flex-col gap-4 font-mono">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center bg-black border border-[#1A1F26] rounded-lg overflow-hidden focus-within:border-zinc-500 transition-colors">
                    <span className="text-xs text-zinc-600 pl-4 select-none font-mono">key:</span>
                    <input 
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Paste your Gemini API Key..."
                      className="flex-1 bg-transparent border-0 py-3 px-3 text-xs text-white placeholder-zinc-700 outline-none font-mono"
                    />
                  </div>
                  {state.geminiApiKey && (
                    <button 
                      onClick={handleClearApiKey}
                      className="p-3 border border-[#FF7B72]/30 hover:border-[#FF7B72] hover:bg-[#FF7B72]/5 transition-all rounded-lg text-[#FF7B72]"
                      title="Clear Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleSaveApiKey}
                    className="px-6 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all animate-pulse"
                  >
                    Save API Key
                  </button>
                  {showSavedMsg && (
                    <span className="text-xs text-[#7EE787] flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> // config.saved = true;
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Cabinet */}
        <div className="flex flex-col gap-4 select-none">
          <h3 className="text-lg font-bold text-white font-mono">// Badges Cabinet</h3>
          
          <div className="rounded-xl border border-[#1A1F26] bg-[#0B0E14] overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-[#1A1F26] text-xs text-zinc-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-[10px] text-zinc-400">package.json</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-600 font-mono">JSON</span>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {BADGES.map((badge, idx) => {
                  const isUnlocked = state.unlockedBadges.includes(badge.name);
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-lg border flex gap-4 transition-all ${isUnlocked ? "bg-black/40 border-[#7EE787]/20 hover:border-[#7EE787]/50" : "bg-black/10 border-[#1A1F26] opacity-40"}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${isUnlocked ? "bg-black border border-[#7EE787]/30 shadow-[0_0_10px_rgba(126,231,135,0.04)]" : "bg-zinc-950 border border-zinc-900 filter grayscale"}`}>
                        {badge.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs flex flex-wrap items-center gap-1.5 font-mono">
                          &quot;{badge.name.toLowerCase().replace(/\s+/g, "-")}&quot;
                          {isUnlocked && <span className="text-[8px] uppercase font-bold text-[#7EE787] tracking-wider bg-[#7EE787]/5 px-1.5 rounded border border-[#7EE787]/20 font-mono">unlocked</span>}
                        </h4>
                        <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed font-sans">{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Reset State Utility */}
        <div className="border-t border-[#1A1F26] pt-8 flex items-center justify-between text-xs text-zinc-500 select-none font-mono">
          <span>// Reset statistics, history logs, and ELO progress back to clean state.</span>
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to delete all match history, ELO rating updates, and streaks? This cannot be undone.")) {
                resetState();
                window.location.reload();
              }
            }}
            className="px-4 py-2 border border-[#FF7B72]/30 rounded-lg text-[#FF7B72] hover:bg-[#FF7B72]/5 hover:border-[#FF7B72] transition-all font-semibold font-mono"
          >
            resetDatabaseState()
          </button>
        </div>

      </main>
    </div>
  );
}
