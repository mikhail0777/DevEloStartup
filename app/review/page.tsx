"use client";

import { useEffect, useState } from "react";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useStore, MatchHistoryItem, getCareerRankForElo } from "@/lib/store";
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

  const rankBefore = getCareerRankForElo(match.ratingBefore);
  const rankAfter = getCareerRankForElo(match.ratingAfter);

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
        return "text-secondary bg-surface border-border";
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
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/develiq_logo.jpg" alt="Develiq Logo" className="w-8 h-8 rounded object-cover border border-border bg-surface" />
            <span className="text-xl font-bold tracking-wider text-foreground">Develiq</span>
            <span className="text-border ml-2 mr-2">|</span>
            <span className="text-xs uppercase font-bold text-secondary tracking-wider">Post-Match Review</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-md bg-surface text-foreground hover:bg-elevated transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {state.theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <LinkNext href="/dashboard" className="text-xs font-semibold text-secondary hover:text-foreground transition-colors">
              Exit to Dashboard →
            </LinkNext>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* Core Gauge Row */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch select-none">
          {/* Overall Accuracy Gauge */}
          <div className="p-8 rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-4 hover:border-border-muted transition-all">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Match Accuracy</span>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="64" className="stroke-border-muted fill-none" strokeWidth="8" />
                <circle cx="72" cy="72" r="64" className="stroke-foreground fill-none transition-all duration-1000 ease-out" strokeWidth="8" 
                        strokeDasharray={402} strokeDashoffset={402 - (402 * match.overallScore) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute text-4xl font-extrabold text-foreground">{match.overallScore}<span className="text-sm font-semibold opacity-60">%</span></div>
            </div>
            <div className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-secondary bg-inset border border-border uppercase mt-2">
              {match.overallScore >= 90 ? "Brilliant" : match.overallScore >= 75 ? "Excellent" : "Completed"}
            </div>
          </div>

          {/* ELO adjustment card */}
          <div className="p-8 rounded-2xl border border-border bg-surface flex flex-col justify-between gap-6 relative overflow-hidden hover:border-border-muted transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-inset/50 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Tier Adjustment</span>
              <div className="text-4xl font-extrabold text-foreground flex items-baseline gap-2 mt-2">
                {match.ratingAfter}
                <span className={`text-base font-bold ${match.eloChange >= 0 ? "text-green" : "text-red"}`}>
                  {match.eloChange >= 0 ? `+${match.eloChange}` : match.eloChange} ELO
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-border">
                <span className="text-secondary">Rank Progression</span>
                <span className="text-foreground font-bold">{rankAfter}</span>
              </div>
              <div className="text-[10px] text-muted uppercase tracking-widest mt-1">
                {rankBefore === rankAfter ? "Level Maintained" : "New Career Rank Unlocked!"}
              </div>
            </div>
          </div>

          {/* Coach's Mindy summary Box */}
          <div className="p-8 rounded-2xl border border-border bg-surface flex gap-4 hover:border-border-muted transition-all">
            <div className="w-10 h-10 rounded-xl bg-inset border border-border flex items-center justify-center text-xl shrink-0">
              🧠
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Coach Review</span>
              <h4 className="text-sm font-bold text-secondary leading-tight">Mentor Mindy:</h4>
              <p className="text-xs text-secondary leading-relaxed">"{match.feedback}"</p>
            </div>
          </div>
        </div>

        {/* Mistake Timeline grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Mistakes Timeline Cards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-foreground mb-2">Code Analysis Timeline</h3>
            {match.mistakes.length === 0 ? (
              <div className="p-6 rounded-xl border border-border bg-surface text-center text-secondary text-xs">
                Perfect sweep! No architectural omissions, runtime exceptions, or boilerplate replication flagged in this file.
              </div>
            ) : (
              match.mistakes.map((mistake, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex gap-4 transition-all ${getLabelColor(mistake.type)}`}>
                  <div className="w-8 h-8 rounded-lg bg-inset border border-current opacity-70 flex items-center justify-center font-bold text-sm shrink-0">
                    {getLabelSymbol(mistake.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm">{mistake.title}</h4>
                      {mistake.line && (
                        <span className="font-mono text-[10px] opacity-70">Line {mistake.line}</span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-1.5 leading-relaxed">{mistake.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Study Plan recommendations */}
          <div className="md:col-span-1 flex flex-col gap-6 select-none">
            <h3 className="text-lg font-bold text-foreground mb-2">Improvement Agenda</h3>
            <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-foreground" />
                <span className="text-xs uppercase font-extrabold text-foreground tracking-wider">Suggested Targets</span>
              </div>
              
              <div className="flex flex-col gap-3.5 text-xs text-secondary leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-muted font-bold">•</span>
                  <div>
                    <strong className="text-foreground block mb-0.5">Defensive Validation Guards</strong>
                    Always write robust check bounds mapping `records` arrays for empty properties to guarantee runtime safety.
                  </div>
                </div>
                <div className="flex gap-2 border-t border-border pt-3.5">
                  <span className="text-muted font-bold">•</span>
                  <div>
                    <strong className="text-foreground block mb-0.5">Complexity Optimizations</strong>
                    Practice swapping dual-nested loops `O(N^2)` with fast hashed index Maps to maintain Grandmaster-level efficiency.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 border-t border-border pt-4">
                <LinkNext href="/setup" className="w-full py-2.5 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1 cursor-pointer">
                  Start Another Challenge <ChevronRight className="w-3.5 h-3.5" />
                </LinkNext>
                <LinkNext href="/dashboard" className="w-full py-2.5 rounded-lg border border-border text-center text-xs font-semibold hover:border-border-muted transition-all bg-surface text-foreground">
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
