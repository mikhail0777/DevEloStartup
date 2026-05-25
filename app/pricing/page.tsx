"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Sparkles, AlertCircle, Award } from "lucide-react";

export default function Pricing() {
  const router = useRouter();
  const [successModal, setSuccessModal] = useState<string | null>(null);

  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      desc: "Good enough to try out our core practice loops.",
      buttonText: "Current Plan",
      features: [
        "5 AI interviews / month",
        "20 coding arena challenges",
        "Daily challenge XP gains",
        "Basic ELO rating updates",
        "Streak tracking calendar"
      ],
      isPopular: false,
      accentClass: "border-[#1B2134] bg-slate-900/10"
    },
    {
      name: "Pro Tier",
      price: "$15",
      period: "/ month",
      desc: "Perfect for active students and active job seekers.",
      buttonText: "Upgrade to Pro",
      features: [
        "Unlimited coding arena challenges",
        "Unlimited AI mock interviews",
        "Full real-world debugging tasks",
        "AI-Assisted prompt fluency checks",
        "Hidden boundary test analysis",
        "Personalized Coach Study Plans"
      ],
      isPopular: true,
      accentClass: "border-[#00E5FF] bg-cyan-950/5 shadow-[0_0_25px_rgba(0,229,255,0.08)]"
    },
    {
      name: "Premium Suite",
      price: "$29",
      period: "/ month",
      desc: "For candidates interviewing at top-tier companies.",
      buttonText: "Go Premium",
      features: [
        "Everything in Pro Tier",
        "Voice Interview TTS integrations",
        "Advanced System Design evaluations",
        "Weekly readiness progress logs",
        "Voice speech synthesis interruptions",
        "Full agent replay analyses"
      ],
      isPopular: false,
      accentClass: "border-[#1B2134] bg-slate-900/10"
    }
  ];

  const handleSubscribe = (planName: string) => {
    if (planName === "Free Plan") return;
    
    setSuccessModal(planName);
    setTimeout(() => {
      setSuccessModal(null);
      router.push("/dashboard");
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono relative selection:bg-zinc-800 selection:text-white">
      {/* Checkout Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-xl border border-[#7EE787] bg-[#0B0E14] text-center flex flex-col items-center gap-4 p-8 relative animate-fade-in font-mono shadow-[0_0_30px_rgba(126,231,135,0.06)]">
            <div className="w-12 h-12 rounded-full bg-black border border-[#7EE787] flex items-center justify-center text-[#7EE787] text-xl animate-bounce">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white mt-2">Subscription Confirmed!</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Congratulations! Your upgrade to **{successModal}** has been processed successfully. Spawning full premium compiler features...
            </p>
            <div className="text-[10px] text-[#7EE787] uppercase tracking-widest animate-pulse mt-4 font-mono">
              // Redirecting to compiler...
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#1A1F26] select-none font-mono">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold tracking-wider text-white">DevElo Pricing</span>
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

      {/* Main Pricing Sections */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 flex flex-col gap-12">
        <div className="text-center select-none font-sans">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1A1F26] bg-[#0B0E14] text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-6 font-mono">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Unlock Pro Capabilities
          </div>
          <h2 className="text-3xl font-bold text-white font-mono">// Invest in Technical Success</h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto mt-4 font-sans leading-relaxed">
            Choose a plan tailored to your prep demands. Level up your ELO, explain complex systems, and pass visible/hidden test cases.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 select-none font-mono">
          {plans.map((plan, idx) => {
            // Determine active/popular
            const fileNames = ["free_plan.json", "pro_tier.ts", "premium_suite.rs"];
            const lang = idx === 0 ? "JSON" : idx === 1 ? "TS" : "Rust";
            const fileName = fileNames[idx];
            const isPro = plan.isPopular;

            return (
              <div 
                key={idx} 
                className={`rounded-xl border flex flex-col justify-between overflow-hidden transition-all bg-[#0B0E14] ${isPro ? "border-[#7EE787] shadow-[0_0_20px_rgba(126,231,135,0.06)]" : "border-[#1A1F26]"}`}
              >
                {/* Tab header */}
                <div className={`flex items-center justify-between px-4 py-2 text-xs border-b ${isPro ? "bg-black/60 border-[#7EE787]" : "bg-black/40 border-[#1A1F26]"} text-zinc-500`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${isPro ? "bg-[#7EE787]" : "bg-zinc-700"}`} />
                    <span className={`text-[10px] ${isPro ? "text-[#7EE787] font-semibold" : "text-zinc-400"}`}>{fileName}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-600">{lang}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div>
                    {/* Simulated Code object */}
                    <div className="text-xs leading-relaxed text-zinc-400 select-none">
                      <div>
                        <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">{idx === 0 ? "freePlan" : idx === 1 ? "proTier" : "premiumSuite"}</span> = {"{"}
                      </div>
                      <div className="pl-4">
                        <span className="text-[#79C0FF]">price</span>: <span className="text-[#7EE787]">&quot;{plan.price}&quot;</span>,
                      </div>
                      {plan.period && (
                        <div className="pl-4">
                          <span className="text-[#79C0FF]">period</span>: <span className="text-[#7EE787]">&quot;month&quot;</span>,
                        </div>
                      )}
                      <div className="pl-4">
                        <span className="text-[#79C0FF]">desc</span>: <span className="text-[#7EE787]">&quot;{plan.desc}&quot;</span>
                      </div>
                      <div>{"};"}</div>
                    </div>

                    <div className="w-full h-px bg-[#1A1F26] my-5" />

                    {/* Features list styled as package exports or comments */}
                    <div className="flex flex-col gap-3 font-sans text-xs">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-zinc-300">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPro ? "text-[#7EE787]" : "text-zinc-500"}`} />
                          <span className="font-sans leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={plan.name === "Free Plan"}
                    className={`w-full py-3 rounded-lg text-xs font-bold transition-all border font-mono tracking-wide ${isPro ? "bg-[#7EE787] text-black border-[#7EE787] hover:bg-[#6bd675] cursor-pointer" : plan.name === "Free Plan" ? "border-zinc-800 text-zinc-600 bg-zinc-950/40 cursor-default" : "border-[#1A1F26] text-white hover:border-zinc-700 bg-black/40 hover:bg-[#10141B]"}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic / CS Club tier */}
        <div className="p-6 rounded-xl border border-[#1A1F26] bg-[#0B0E14] flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 select-none font-mono">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-black border border-[#1A1F26] flex items-center justify-center text-lg shrink-0 text-[#79C0FF]">
              🎓
            </div>
            <div>
              <h4 className="font-bold text-white text-sm font-mono">// CS Clubs, Universities, & Bootcamps</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xl font-sans">
                Get premium licensing bulk credentials for CS classes or local clubs starting at only <strong className="text-white">$5 - $10 / seat / month</strong>. Enable customized homework, tracks leaderboard, and host mock assessments.
              </p>
            </div>
          </div>
          <a 
            href="mailto:licensing@develo.io?subject=CS Club Licensing Request" 
            className="px-6 py-3 rounded-lg border border-[#1A1F26] text-[#79C0FF] hover:border-zinc-700 bg-black/40 hover:bg-[#10141B] font-bold text-xs transition-all shrink-0 font-mono"
          >
            Request License
          </a>
        </div>

      </main>
    </div>
  );
}
