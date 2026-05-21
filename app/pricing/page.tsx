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
    <div className="min-h-screen bg-[#080A10] text-[#E2E8F0] flex flex-col font-sans relative">
      {/* Checkout Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm p-8 rounded-2xl glass-panel border border-[#1B2134] bg-slate-950/90 text-center flex flex-col items-center gap-4 relative animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-[#00E676] text-xl animate-bounce">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white mt-2">Subscription Confirmed!</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Congratulations! Your upgrade to **{successModal}** has been processed successfully. Spawning full premium compiler features...
            </p>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest animate-pulse mt-4">
              Redirecting back to dashboard...
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="border-b border-[#1B2134] bg-slate-950/40 select-none">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#94A3B8] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold tracking-wider text-white">DevElo Pricing</span>
          </div>
        </div>
      </header>

      {/* Main Pricing Sections */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 flex flex-col gap-12">
        <div className="text-center select-none">
          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#00E5FF] tracking-widest border border-cyan-500/25 px-2.5 py-0.5 rounded-full bg-cyan-950/10 mb-4 animate-pulse">
            <Sparkles className="w-3 h-3 fill-cyan-400" /> Unlock Pro Capabilities
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Invest in Technical Success</h2>
          <p className="text-sm text-[#94A3B8] max-w-md mx-auto mt-3">
            Choose a plan tailored to your prep demands. Level up your ELO, explain complex systems, and pass visible/hidden test cases.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 select-none">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border flex flex-col justify-between gap-8 transition-all relative ${plan.accentClass}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00E5FF] text-black text-[9px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[#94A3B8]">{plan.name}</span>
                  <div className="flex items-baseline mt-2">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    {plan.period && <span className="text-xs text-[#94A3B8] ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-2 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                      <Check className="w-3.5 h-3.5 text-[#00E676] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={plan.name === "Free Plan"}
                className={`w-full py-2.5 rounded-lg text-xs font-extrabold transition-all border ${plan.isPopular ? "bg-[#00E5FF] text-black border-[#00E5FF] hover:bg-[#00c8e6]" : plan.name === "Free Plan" ? "border-[#1B2134] text-[#94A3B8] cursor-default bg-slate-900/10" : "border-[#1B2134] text-white hover:border-slate-600 bg-slate-950/20"}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Academic / CS Club tier */}
        <div className="p-6 rounded-2xl border border-[#1B2134] bg-slate-900/5 flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 select-none">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0 text-[#6366F1]">
              🎓
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">CS Clubs, Universities, & Bootcamps</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed max-w-xl">
                Get premium licensing bulk credentials for CS classes or local clubs starting at only **$5 - $10 / seat / month**. Enable customized homework, tracks leaderboard, and host mock assessments.
              </p>
            </div>
          </div>
          <a 
            href="mailto:licensing@develo.io?subject=CS Club Licensing Request" 
            className="px-6 py-2.5 rounded-lg border border-indigo-500/20 text-[#6366F1] font-bold text-xs hover:bg-indigo-950/20 transition-all shrink-0"
          >
            Request License
          </a>
        </div>

      </main>
    </div>
  );
}
