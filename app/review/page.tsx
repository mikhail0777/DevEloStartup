"use client";

import { useEffect, useState } from "react";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useStore, MatchHistoryItem } from "@/lib/store";
import { 
  Award, RefreshCw, Grid, Star, AlertCircle, 
  HelpCircle, CheckCircle2, ChevronRight, BookOpen, AlertOctagon,
  Sun, Moon
} from "lucide-react";

export default function MatchReviewPage() {
  return (
    <AuthGuard>
      <MatchReview />
    </AuthGuard>
  );
}

function MatchReview() {
  const router = useRouter();
  const { state, toggleTheme } = useStore();
  const [match, setMatch] = useState<MatchHistoryItem | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("last_match_review");
    if (saved) {
      try {
        setMatch(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else if (state.history.length > 0) {
      setMatch(state.history[0]);
    } else {
      router.push("/dashboard");
    }
  }, [router, state.history]);

  if (!match) {
    return <div className="min-h-screen bg-background" />;
  }



  const scorePercent = Math.round((match.passedCount / (match.totalCount || 1)) * 100);
  const strokeColor = scorePercent >= 80 ? "stroke-green" : scorePercent >= 50 ? "stroke-yellow" : "stroke-red";
  const textScoreColor = scorePercent >= 80 ? "text-green" : scorePercent >= 50 ? "text-yellow" : "text-red";

  const getLabelColor = (type: string) => {
    switch (type) {
      case "strong-move":
      case "excellent-tradeoff":
      case "best-practice":
        return "text-green bg-green/10 border-green/20";
      case "critical-miss":
      case "bug":
      case "missed-edge-case":
      case "architectural-omission":
      case "runtime-exception":
        return "text-red bg-red/10 border-red/20";
      case "overcomplicated":
      case "ai-overreliance":
      case "weak-explanation":
      case "boilerplate-replication":
        return "text-yellow bg-yellow/10 border-yellow/20";
      default:
        return "text-foreground bg-surface border-border";
    }
  };

  const getLabelSymbol = (type: string) => {
    switch (type) {
      case "strong-move": 
      case "best-practice": return "★";
      case "excellent-tradeoff": return "⚿";
      case "critical-miss": 
      case "architectural-omission": return "✕";
      case "bug": 
      case "runtime-exception": return "!";
      case "missed-edge-case": return "⌂";
      case "overcomplicated": return "⚠";
      case "ai-overreliance": 
      case "boilerplate-replication": return "🤖";
      case "weak-explanation": return "✍";
      default: return "•";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-border bg-background/80 select-none backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[92%] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/develiq_logo.jpg" alt="Develiq Logo" className="w-8 h-8 rounded object-cover border border-border bg-surface" />
            <span className="text-xl font-bold tracking-wider text-foreground">Develiq</span>
            <span className="text-border ml-2 mr-2">|</span>
            <span className="text-sm uppercase font-extrabold text-foreground tracking-wider">Post-Match Review</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-md bg-surface text-foreground hover:bg-elevated transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {state.theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <LinkNext href="/dashboard" className="text-sm font-bold text-foreground hover:underline transition-all">
              Exit to Dashboard →
            </LinkNext>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[92%] w-full mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* Core Gauge Row */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch select-none">
          {/* Sandbox Execution Status */}
          <div className="p-8 rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-6 hover:border-border-muted transition-all shadow-sm">
            <span className="text-sm font-extrabold uppercase tracking-wider text-foreground">// Sandbox Execution</span>
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="112" cy="112" r="96" className="stroke-border-muted fill-none" strokeWidth="10" />
                <circle cx="112" cy="112" r="96" className={`${strokeColor} fill-none transition-all duration-1000 ease-out`} strokeWidth="10" 
                        strokeDasharray={603} strokeDashoffset={603 - (603 * scorePercent) / 100} strokeLinecap="round" />
              </svg>
              <div className={`absolute text-4xl font-extrabold ${textScoreColor}`}>{scorePercent}%</div>
            </div>
            <div className="px-5 py-2.5 rounded-full text-xs font-bold tracking-widest text-foreground bg-inset border border-border uppercase mt-2">
              {match.passedCount === match.totalCount ? "All Tests Passed" : `${match.passedCount} / ${match.totalCount} Tests Passed`}
            </div>
          </div>

          {/* Coach's Mindy summary Box */}
          <div className="p-8 rounded-2xl border border-border bg-surface flex gap-5 hover:border-border-muted transition-all shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-inset border border-border flex items-center justify-center text-2xl shrink-0 select-none">
              🧠
            </div>
            <div className="flex flex-col gap-3.5">
              <span className="text-sm font-extrabold uppercase tracking-wider text-foreground">// Coach Review</span>
              <h4 className="text-lg font-extrabold text-foreground leading-tight">Mentor Mindy:</h4>
              <p className="text-base text-foreground/90 leading-relaxed font-medium">"{match.feedback}"</p>
            </div>
          </div>
        </div>

        {/* Mistake Timeline grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Mistakes Timeline Cards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-foreground mb-2">Code Analysis Timeline</h3>
            {match.mistakes.length === 0 ? (
              <div className="p-6 rounded-xl border border-border bg-surface text-center text-foreground text-sm font-semibold">
                Perfect sweep! No architectural omissions, runtime exceptions, or boilerplate replication flagged in this file.
              </div>
            ) : (
              match.mistakes.map((mistake, idx) => (
                <div key={idx} className={`p-5 rounded-xl border flex gap-4 transition-all ${getLabelColor(mistake.type)} shadow-sm`}>
                  <div className="w-9 h-9 rounded-lg bg-inset border border-current opacity-85 flex items-center justify-center font-bold text-base shrink-0 select-none">
                    {getLabelSymbol(mistake.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-foreground text-base">{mistake.title}</h4>
                      {mistake.line && (
                        <span className="font-mono text-xs font-bold text-foreground opacity-90 bg-inset border border-border px-2 py-0.5 rounded">Line {mistake.line}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground mt-2 leading-relaxed font-medium">{mistake.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Study Plan recommendations */}
          <div className="md:col-span-1 flex flex-col gap-6 select-none">
            <h3 className="text-xl font-bold text-foreground mb-2">Improvement Agenda</h3>
            <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col gap-5 shadow-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-foreground" />
                <span className="text-sm uppercase font-extrabold text-foreground tracking-wider">Suggested Targets</span>
              </div>
              
              <div className="flex flex-col gap-4 text-sm text-foreground leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-foreground font-bold">•</span>
                  <div>
                    <strong className="text-foreground block mb-1">Defensive Validation Guards</strong>
                    Always write robust check bounds mapping `records` arrays for empty properties to guarantee runtime safety.
                  </div>
                </div>
                <div className="flex gap-2 border-t border-border pt-4">
                  <span className="text-foreground font-bold">•</span>
                  <div>
                    <strong className="text-foreground block mb-1">Complexity Optimizations</strong>
                    Practice swapping dual-nested loops `O(N^2)` with fast hashed index Maps to maintain Grandmaster-level efficiency.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 border-t border-border pt-4">
                <LinkNext href="/setup" className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-extrabold hover:opacity-90 transition-all flex items-center justify-center gap-1 cursor-pointer">
                  Start Another Challenge <ChevronRight className="w-3.5 h-3.5" />
                </LinkNext>
                <LinkNext href="/dashboard" className="w-full py-3 rounded-xl border border-border text-center text-sm font-extrabold hover:border-border-muted transition-all bg-surface text-foreground font-sans">
                  Return to Dashboard
                </LinkNext>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
