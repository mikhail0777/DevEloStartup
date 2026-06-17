"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft, Check, Sparkles, AlertCircle, Award, Sun, Moon } from "lucide-react";

export default function Pricing() {
  const router = useRouter();
  const { state, toggleTheme } = useStore();
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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono relative selection:bg-zinc-800 selection:text-white">
      {/* Checkout Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-xl border border-green bg-surface text-center flex flex-col items-center gap-4 p-8 relative animate-fade-in font-mono shadow-sm">
            <div className="w-12 h-12 rounded-full bg-inset border border-green flex items-center justify-center text-green text-xl animate-bounce">
              ✓
            </div>
            <h3 className="text-lg font-bold text-foreground mt-2">Subscription Confirmed!</h3>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              Congratulations! Your upgrade to **{successModal}** has been processed successfully. Spawning full premium compiler features...
            </p>
            <div className="text-[10px] text-green uppercase tracking-widest animate-pulse mt-4 font-mono">
              // Redirecting to compiler...
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border select-none font-mono">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-secondary hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold tracking-wider text-foreground">Develiq Pricing</span>
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

      {/* Main Pricing Sections */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 flex flex-col gap-12">
        <div className="text-center select-none font-sans">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface text-secondary text-xs font-semibold uppercase tracking-wider mb-6 font-mono">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            Unlock Pro Capabilities
          </div>
          <h2 className="text-3xl font-bold text-foreground font-mono">// Invest in Technical Success</h2>
          <p className="text-sm text-secondary max-w-lg mx-auto mt-4 font-sans leading-relaxed">
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
                className={`rounded-xl border flex flex-col justify-between overflow-hidden transition-all bg-surface ${isPro ? "border-green shadow-sm" : "border-border"}`}
              >
                {/* Tab header */}
                <div className={`flex items-center justify-between px-4 py-2 text-xs border-b ${isPro ? "bg-inset/60 border-green" : "bg-inset/40 border-border"} text-secondary`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${isPro ? "bg-green" : "bg-border-muted"}`} />
                    <span className={`text-[10px] ${isPro ? "text-green font-semibold" : "text-secondary"}`}>{fileName}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-muted">{lang}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div>
                    {/* Simulated Code object */}
                    <div className="text-xs leading-relaxed text-secondary select-none">
                      <div>
                        <span className="text-red">const</span> <span className="text-blue">{idx === 0 ? "freePlan" : idx === 1 ? "proTier" : "premiumSuite"}</span> = {"{"}
                      </div>
                      <div className="pl-4">
                        <span className="text-blue">price</span>: <span className="text-green">&quot;{plan.price}&quot;</span>,
                      </div>
                      {plan.period && (
                        <div className="pl-4">
                          <span className="text-blue">period</span>: <span className="text-green">&quot;month&quot;</span>,
                        </div>
                      )}
                      <div className="pl-4">
                        <span className="text-blue">desc</span>: <span className="text-green">&quot;{plan.desc}&quot;</span>
                      </div>
                      <div>{"};"}</div>
                    </div>

                    <div className="w-full h-px bg-border my-5" />

                    {/* Features list styled as package exports or comments */}
                    <div className="flex flex-col gap-3 font-sans text-xs">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-foreground">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPro ? "text-green" : "text-secondary"}`} />
                          <span className="font-sans leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={plan.name === "Free Plan"}
                    className={`w-full py-3 rounded-lg text-xs font-bold transition-all border font-mono tracking-wide ${isPro ? "bg-green text-background border-green hover:opacity-90 cursor-pointer" : plan.name === "Free Plan" ? "border-border text-muted bg-surface/40 cursor-default" : "border-border text-foreground hover:border-border-muted bg-surface hover:bg-elevated"}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic / CS Club tier */}
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 select-none font-mono">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-inset border border-border flex items-center justify-center text-lg shrink-0 text-blue">
              🎓
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm font-mono">// CS Clubs, Universities, & Bootcamps</h4>
              <p className="text-xs text-secondary mt-2 leading-relaxed max-w-xl font-sans">
                Get premium licensing bulk credentials for CS classes or local clubs starting at only <strong className="text-foreground">$5 - $10 / seat / month</strong>. Enable customized homework, tracks leaderboard, and host mock assessments.
              </p>
            </div>
          </div>
          <a 
            href="mailto:licensing@develiq.io?subject=CS Club Licensing Request" 
            className="px-6 py-3 rounded-lg border border-border text-blue hover:border-border-muted bg-surface hover:bg-elevated font-bold text-xs transition-all shrink-0 font-mono"
          >
            Request License
          </a>
        </div>

      </main>
    </div>
  );
}
