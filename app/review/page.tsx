"use client";

import { useEffect, useState } from "react";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import { useStore, MatchHistoryItem, getCareerRankForElo } from "@/lib/store";
import { 
  Award, RefreshCw, Grid, Star, AlertCircle, 
  HelpCircle, CheckCircle2, ChevronRight, BookOpen, AlertOctagon 
} from "lucide-react";

export default function MatchReview() {
  const router = useRouter();
  const { state } = useStore();
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
    return <div className="min-h-screen bg-[#09090B]" />;
  }

  const rankBefore = getCareerRankForElo(match.ratingBefore);
  const rankAfter = getCareerRankForElo(match.ratingAfter);

  const getLabelColor = (type: string) => {
    switch (type) {
      case "strong-move":
      case "excellent-tradeoff":
      case "best-practice":
        return "text-emerald-400 bg-emerald-950/10 border-emerald-900/20";
      case "critical-miss":
      case "bug":
      case "missed-edge-case":
      case "architectural-omission":
      case "runtime-exception":
        return "text-rose-400 bg-rose-950/10 border-rose-900/20";
      case "overcomplicated":
      case "ai-overreliance":
      case "weak-explanation":
      case "boilerplate-replication":
        return "text-amber-400 bg-amber-950/10 border-amber-900/20";
      default:
        return "text-zinc-400 bg-zinc-900/30 border-[#27272A]";
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
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-[#27272A] bg-zinc-950/40 select-none backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center font-bold text-black text-lg">
              D
            </div>
            <span className="text-xl font-bold tracking-wider text-white">Dev<span className="text-zinc-500">Elo</span></span>
            <span className="text-[#27272A] ml-2 mr-2">|</span>
            <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Post-Match Review</span>
          </div>
          <LinkNext href="/dashboard" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
            Exit to Dashboard →
          </LinkNext>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* Core Gauge Row */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch select-none">
          {/* Overall Accuracy Gauge */}
          <div className="p-8 rounded-2xl glass-panel border border-[#27272A] bg-zinc-900/10 flex flex-col items-center justify-center text-center gap-4 hover:border-zinc-700 transition-all">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Match Accuracy</span>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="64" className="stroke-zinc-800 fill-none" strokeWidth="8" />
                <circle cx="72" cy="72" r="64" className="stroke-white fill-none transition-all duration-1000 ease-out" strokeWidth="8" 
                        strokeDasharray={402} strokeDashoffset={402 - (402 * match.overallScore) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute text-4xl font-extrabold text-white">{match.overallScore}<span className="text-sm font-semibold opacity-60">%</span></div>
            </div>
            <div className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-zinc-400 bg-zinc-900 border border-[#27272A] uppercase mt-2">
              {match.overallScore >= 90 ? "Brilliant" : match.overallScore >= 75 ? "Excellent" : "Completed"}
            </div>
          </div>

          {/* ELO adjustment card */}
          <div className="p-8 rounded-2xl glass-panel border border-[#27272A] bg-zinc-900/10 flex flex-col justify-between gap-6 relative overflow-hidden hover:border-zinc-700 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Tier Adjustment</span>
              <div className="text-4xl font-extrabold text-white flex items-baseline gap-2 mt-2">
                {match.ratingAfter}
                <span className={`text-base font-bold ${match.eloChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {match.eloChange >= 0 ? `+${match.eloChange}` : match.eloChange} ELO
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#27272A]">
                <span className="text-zinc-500">Rank Progression</span>
                <span className="text-white font-bold">{rankAfter}</span>
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
                {rankBefore === rankAfter ? "Level Maintained" : "New Career Rank Unlocked!"}
              </div>
            </div>
          </div>

          {/* Coach's Mindy summary Box */}
          <div className="p-8 rounded-2xl glass-panel border border-[#27272A] bg-zinc-900/20 flex gap-4 hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#27272A] flex items-center justify-center text-xl shrink-0">
              🧠
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white">Coach Review</span>
              <h4 className="text-sm font-bold text-zinc-300 leading-tight">Mentor Mindy:</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">"{match.feedback}"</p>
            </div>
          </div>
        </div>

        {/* Mistake Timeline grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Mistakes Timeline Cards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white mb-2">Code Analysis Timeline</h3>
            {match.mistakes.length === 0 ? (
              <div className="p-6 rounded-xl border border-[#27272A] bg-zinc-900/10 text-center text-zinc-500 text-xs">
                Perfect sweep! No architectural omissions, runtime exceptions, or boilerplate replication flagged in this file.
              </div>
            ) : (
              match.mistakes.map((mistake, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex gap-4 transition-all ${getLabelColor(mistake.type)}`}>
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-current opacity-70 flex items-center justify-center font-bold text-sm shrink-0">
                    {getLabelSymbol(mistake.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{mistake.title}</h4>
                      {mistake.line && (
                        <span className="font-mono text-[10px] opacity-70">Line {mistake.line}</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{mistake.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Study Plan recommendations */}
          <div className="md:col-span-1 flex flex-col gap-6 select-none">
            <h3 className="text-lg font-bold text-white mb-2">Improvement Agenda</h3>
            <div className="p-6 rounded-2xl border border-[#27272A] bg-zinc-900/10 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white" />
                <span className="text-xs uppercase font-extrabold text-white tracking-wider">Suggested Targets</span>
              </div>
              
              <div className="flex flex-col gap-3.5 text-xs text-zinc-400 leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-zinc-500 font-bold">•</span>
                  <div>
                    <strong className="text-zinc-300 block mb-0.5">Defensive Validation Guards</strong>
                    Always write robust check bounds mapping `records` arrays for empty properties to guarantee runtime safety.
                  </div>
                </div>
                <div className="flex gap-2 border-t border-[#27272A] pt-3.5">
                  <span className="text-zinc-500 font-bold">•</span>
                  <div>
                    <strong className="text-zinc-300 block mb-0.5">Complexity Optimizations</strong>
                    Practice swapping dual-nested loops `O(N^2)` with fast hashed index Maps to maintain Grandmaster-level efficiency.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 border-t border-[#27272A] pt-4">
                <LinkNext href="/setup" className="w-full py-2.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-1">
                  Start Another Challenge <ChevronRight className="w-3.5 h-3.5" />
                </LinkNext>
                <LinkNext href="/dashboard" className="w-full py-2.5 rounded-lg border border-[#27272A] text-center text-xs font-semibold hover:border-zinc-600 transition-all bg-zinc-900/20 text-zinc-300">
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
