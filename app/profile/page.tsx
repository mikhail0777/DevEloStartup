"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useStore } from "@/lib/store";
import { 
  ArrowLeft, Trash2, Check, Sun, Moon 
} from "lucide-react";

export default function UserProfile() {
  const { state, getCareerRank, setGeminiApiKey, resetState, updateUser, toggleTheme } = useStore();
  const [apiKeyInput, setApiKeyInput] = useState(state.geminiApiKey);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showSettingsSavedMsg, setShowSettingsSavedMsg] = useState(false);

  useEffect(() => {
    if (state.user) {
      setUsernameInput(state.user.name || "");
      setEmailInput(state.user.email || "");
      setPasswordInput(state.user.password || "");
    }
  }, [state.user]);

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

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !emailInput) return;
    updateUser(usernameInput, emailInput, passwordInput);
    setShowSettingsSavedMsg(true);
    setTimeout(() => {
      setShowSettingsSavedMsg(false);
    }, 3000);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-zinc-800 selection:text-white">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border select-none font-mono">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-secondary hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <span className="text-sm font-bold tracking-wider text-foreground">Profile & Settings</span>
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

        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
          
          {/* User Card Row */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch select-none">
            {/* User Bio Stats */}
            <div className="md:col-span-1 rounded-xl border border-border bg-surface overflow-hidden flex flex-col justify-between">
              {/* Tab header */}
              <div className="flex items-center justify-between px-4 py-2 bg-inset/40 border-b border-border text-xs text-secondary select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-border-muted" />
                  <span className="text-[10px] text-secondary">profile.json</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-muted">JSON</span>
              </div>

              <div className="p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-inset border border-border flex items-center justify-center font-mono font-bold text-3xl text-green shadow-[0_0_20px_rgba(126,231,135,0.04)]">
                  {state.user?.name ? state.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground tracking-wide font-mono">{state.user?.name || "Developer"}</h2>
                  <span className="text-xs text-secondary block font-sans mt-0.5">{state.user?.email || "no-email@develiq.com"}</span>
                  <span className="text-xs text-blue font-semibold uppercase tracking-wider block mt-2 font-mono">{careerRank}</span>
                </div>

                <div className="w-full h-px bg-border my-2" />

                {/* JSON representation of stats */}
                <div className="w-full text-left text-xs leading-relaxed text-secondary select-none font-mono">
                  <div>{"{"}</div>
                  <div className="pl-4 font-mono">
                    <span className="text-red">&quot;name&quot;</span>: <span className="text-green">&quot;{state.user?.name}&quot;</span>,
                  </div>
                  <div className="pl-4 font-mono">
                    <span className="text-red">&quot;email&quot;</span>: <span className="text-green">&quot;{state.user?.email}&quot;</span>,
                  </div>
                  <div className="pl-4 font-mono">
                    <span className="text-blue">&quot;ratingElo&quot;</span>: <span className="text-blue">{state.rating}</span>,
                  </div>
                  <div className="pl-4 font-mono">
                    <span className="text-blue">&quot;streakDays&quot;</span>: <span className="text-blue">{state.streak}</span>
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>

            {/* Account Settings Card */}
            <div className="md:col-span-2 rounded-xl border border-border bg-surface overflow-hidden flex flex-col justify-between">
              {/* Tab header */}
              <div className="flex items-center justify-between px-4 py-2 bg-inset/40 border-b border-border text-xs text-secondary select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue" />
                  <span className="text-[10px] text-secondary">settings.config</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-muted font-mono">CONF</span>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 flex-1 flex flex-col justify-between gap-6 select-text">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">// ACCOUNT SETTINGS</span>
                  <h3 className="text-base font-bold text-foreground font-mono">Update Profile Settings</h3>
                  <p className="text-xs text-secondary leading-relaxed font-sans mt-1">
                    Modify your developer name, email address, or update your security credentials. These are saved in your local store.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 font-mono">
                  {/* Developer Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-secondary pl-1 font-mono">
                      Developer Name
                    </label>
                    <div className="flex items-center bg-inset border border-border rounded-lg overflow-hidden focus-within:border-border-active transition-all">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                        placeholder="Ada Lovelace"
                        className="flex-1 bg-transparent border-0 py-3.5 px-3 text-xs text-foreground placeholder-muted outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Email Address Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-secondary pl-1 font-mono">
                      Email Address
                    </label>
                    <div className="flex items-center bg-inset border border-border rounded-lg overflow-hidden focus-within:border-border-active transition-all">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        placeholder="ada@example.com"
                        className="flex-1 bg-transparent border-0 py-3.5 px-3 text-xs text-foreground placeholder-muted outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs text-secondary pl-1 font-mono">
                      Password
                    </label>
                    <div className="flex items-center bg-inset border border-border rounded-lg overflow-hidden focus-within:border-border-active transition-all">
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="flex-1 bg-transparent border-0 py-3.5 px-3 text-xs text-foreground placeholder-muted outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono">
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Settings
                  </button>
                  {showSettingsSavedMsg && (
                    <span className="text-xs text-green flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> // settings.saved = true;
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Gemini API Key Drawer */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col justify-between select-none">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 bg-inset/40 border-b border-border text-xs text-secondary select-none">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${state.geminiApiKey ? "bg-green" : "bg-blue"}`} />
                <span className="text-[10px] text-secondary">engine_config.json</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-muted">CONF</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider">// COMPILER AI MODEL CONFIG (OPTIONAL)</span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-inset ${state.geminiApiKey ? "text-green border-green" : "text-blue border-blue"}`}>
                    {state.geminiApiKey ? "Custom LLM Connected" : "Built-in LLM Active"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground font-mono">Custom IDE Helper Integration</h3>
                <p className="text-xs text-secondary leading-relaxed font-sans mt-1">
                  Develiq includes a **built-in AI interviewer model** trained to conduct mock sessions and evaluate your code. **No custom key is needed** to practice coding or run mock interviews on the platform.
                  <br /><br />
                  However, if you would like to connect a custom backend AI helper directly inside the editor compiler to guide you while writing code, you can input a personal **Gemini API Key** below.
                </p>
              </div>

              <div className="flex flex-col gap-4 font-mono select-text">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center bg-inset border border-border rounded-lg overflow-hidden focus-within:border-border-active transition-colors">
                    <span className="text-xs text-muted pl-4 select-none font-mono">key:</span>
                    <input 
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder={state.geminiApiKey ? "••••••••••••••••••••••••" : "Paste optional Gemini API Key..."}
                      className="flex-1 bg-transparent border-0 py-3 px-3 text-xs text-foreground placeholder-muted outline-none font-mono"
                    />
                  </div>
                  {state.geminiApiKey && (
                    <button 
                      onClick={handleClearApiKey}
                      className="p-3 border border-red/30 hover:border-red hover:bg-red/5 transition-all rounded-lg text-red cursor-pointer"
                      title="Clear Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between select-none">
                  <button 
                    onClick={handleSaveApiKey}
                    className="px-6 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 text-xs font-bold transition-all cursor-pointer"
                  >
                    Save API Key
                  </button>
                  {showSavedMsg && (
                    <span className="text-xs text-green flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> // config.saved = true;
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Badges Cabinet */}
          <div className="flex flex-col gap-4 select-none">
            <h3 className="text-lg font-bold text-foreground font-mono">// Badges Cabinet</h3>
            
            <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
              {/* Tab header */}
              <div className="flex items-center justify-between px-4 py-2 bg-inset/40 border-b border-border text-xs text-secondary select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-border-muted" />
                  <span className="text-[10px] text-secondary">package.json</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-muted font-mono">JSON</span>
              </div>

              <div className="p-6">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {BADGES.map((badge, idx) => {
                    const isUnlocked = state.unlockedBadges.includes(badge.name);
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-lg border flex gap-4 transition-all ${isUnlocked ? "bg-inset/40 border-green/20 hover:border-green/50" : "bg-inset/10 border-border opacity-40"}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${isUnlocked ? "bg-inset border border-green/30" : "bg-inset border border-border filter grayscale"}`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs flex flex-wrap items-center gap-1.5 font-mono">
                            &quot;{badge.name.toLowerCase().replace(/\s+/g, "-")}&quot;
                            {isUnlocked && <span className="text-[8px] uppercase font-bold text-green tracking-wider bg-green/5 px-1.5 rounded border border-green/20 font-mono">unlocked</span>}
                          </h4>
                          <p className="text-[10px] text-secondary mt-1.5 leading-relaxed font-sans">{badge.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Reset State Utility */}
          <div className="border-t border-border pt-8 flex items-center justify-between text-xs text-secondary select-none font-mono">
            <span>// Reset statistics and history logs back to clean state.</span>
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to delete all match history and streaks? This cannot be undone.")) {
                  resetState();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 border border-red/30 rounded-lg text-red hover:bg-red/5 hover:border-red transition-all font-semibold font-mono cursor-pointer"
            >
              resetDatabaseState()
            </button>
          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
