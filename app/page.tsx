"use client";

import Link from "next/link";
import { Code, Terminal, Brain, Target, Shield, Zap, ArrowRight, Star, Layers, Play, Cpu } from "lucide-react";

export default function LandingPage() {
  const brandLogos = [
    { name: "Google", slug: "google" },
    { name: "Meta", slug: "meta" },
    { name: "Netflix", slug: "netflix" },
    { name: "Apple", slug: "apple" },
    { name: "Airbnb", slug: "airbnb" },
    { name: "Uber", slug: "uber" },
    { name: "Spotify", slug: "spotify" },
    { name: "GitHub", slug: "github" },
    { name: "Figma", slug: "figma" },
    { name: "Vercel", slug: "vercel" },
    { name: "Discord", slug: "discord" },
    { name: "Zoom", slug: "zoom" }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white flex flex-col font-mono">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#1A1F26]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center font-mono font-bold text-white text-base select-none">
              &lt;/&gt;
            </div>
            <span className="text-xl font-bold tracking-wider text-white select-none font-mono">
              Dev<span className="text-zinc-500">Elo</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 font-sans">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#modes" className="hover:text-white transition-colors">Practice Modes</Link>
            <Link href="#stats" className="hover:text-white transition-colors">Benchmarks</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold border border-[#1A1F26] rounded-md hover:border-white hover:text-white transition-all bg-zinc-950 font-mono">
              Dashboard
            </Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold rounded-md bg-white text-black hover:bg-zinc-200 transition-all flex items-center gap-2 font-mono">
              Start Practice <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 flex-1 flex flex-col justify-center overflow-hidden bg-black">
        {/* Subtle modern white glow indicator */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1A1F26] bg-[#0B0E14] text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-8 font-mono">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Next-Gen Technical Prep Platform
          </div>

          {/* IDE-style hero headline with colored words */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl mb-6 font-mono">
            <span className="text-[#FF7B72]">import</span>{" "}
            <span className="text-white">{"{ "}</span>
            <span className="text-[#79C0FF]">career</span>
            <span className="text-white">{" }"}</span>{" "}
            <span className="text-[#FF7B72]">from</span>{" "}
            <span className="text-[#7EE787]">&apos;practice&apos;</span>
            <span className="text-white">;</span>
            <br />
            <span className="text-zinc-500 text-2xl md:text-4xl mt-3 block">
              // Practice interviews like they really happen.
            </span>
          </h1>

          <p className="text-base text-zinc-400 max-w-2xl leading-relaxed mb-12 font-sans">
            Dynamic, AI-generated coding challenges and production tasks. Experience code-observant AI interviewers that review your structure, constraints, and architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 font-mono">
            <Link href="/dashboard" className="px-8 py-4 rounded-lg bg-white text-black font-bold text-base hover:bg-zinc-200 transition-all flex items-center justify-center gap-3">
              <Play className="w-5 h-5 fill-black text-black" /> Get Started Free
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-lg border border-[#1A1F26] text-white font-semibold text-base hover:border-zinc-700 bg-zinc-950 transition-all flex items-center justify-center gap-2">
              Explore Features
            </Link>
          </div>

          {/* Stats row — styled like key:value terminal output with IDE colored highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#1A1F26] pt-12 w-full max-w-4xl text-left select-none">
            <div>
              <div className="text-2xl font-bold text-[#7EE787] font-mono">10,000+</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1.5 font-sans">// Interviews Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FF7B72] font-mono">32%</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1.5 font-sans">// Readiness Gain</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#79C0FF] font-mono">400+</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1.5 font-sans">// Mastered Daily</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#D2A8FF] font-mono">500+</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1.5 font-sans">// Offer Landings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Marquee — Grayscale vector logos with glow effect */}
      <section className="border-t border-[#1A1F26] py-12 bg-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold text-center font-mono">
            // Helped engineers get hired at
          </p>
        </div>
        <div className="relative w-full">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee whitespace-nowrap gap-12">
            {[...brandLogos, ...brandLogos, ...brandLogos].map((brand, idx) => (
              <div key={idx} className="flex items-center justify-center mx-6 shrink-0 h-10 select-none">
                <img
                  src={`https://cdn.simpleicons.org/${brand.slug}/ffffff`}
                  alt={brand.name}
                  className="h-6 w-auto opacity-40 hover:opacity-100 transition-all duration-300 object-contain hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards — Premium Minimalist Dark Copilot Card Style */}
      <section id="features" className="py-24 border-t border-[#1A1F26] bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 select-none font-sans">
            <h2 className="text-3xl font-bold text-white mb-4">
              Elevate Beyond Static Code Banks
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              DevElo goes past traditional algorithmic syntax prep. We evaluate your communication, prompt efficiency, and error verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="feature-card flex flex-col gap-5 bg-[#0B0E14] border border-[#1A1F26]">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#1A1F26] flex items-center justify-center text-white">
                <Code className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">
                Go beyond <span className="text-[#7EE787] font-mono">&apos;one-size-fits-all&apos;</span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                Choose from leading <span className="text-[#79C0FF] font-mono">LLMs</span> optimized for <span className="text-[#FF7B72] font-mono">speed</span>, <span className="text-[#7EE787] font-mono">accuracy</span>, or <span className="text-[#D2A8FF] font-mono">cost</span> parameters.
              </p>
            </div>

            {/* Card 2 */}
            <div className="feature-card flex flex-col gap-5 bg-[#0B0E14] border border-[#1A1F26]">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#1A1F26] flex items-center justify-center text-white">
                <Brain className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">
                Use your <span className="text-[#FF7B72] font-mono">agents</span>, your way
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                Use <span className="text-[#79C0FF] font-mono">GitHub Copilot</span>, your own custom <span className="text-[#7EE787] font-mono">agents</span>, or the third-party ones you already rely on in your code.
              </p>
            </div>

            {/* Card 3 */}
            <div className="feature-card flex flex-col gap-5 bg-[#0B0E14] border border-[#1A1F26]">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#1A1F26] flex items-center justify-center text-white">
                <Target className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">
                Stay in your <span className="text-[#D2A8FF] font-mono">flow()</span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                Copilot works where you do—in <span className="text-[#7EE787] font-mono">GitHub</span>, your <span className="text-[#D2A8FF] font-mono">IDE</span>, project tools, and custom <span className="text-[#79C0FF] font-mono">MCP servers</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Showcase */}
      <section id="modes" className="py-24 border-t border-[#1A1F26] bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="select-none font-sans">
              <h2 className="text-3xl font-bold text-white mb-4">Practice Arena Modules</h2>
              <p className="text-sm text-zinc-400 max-w-lg">
                Choose the best mode tailored to your current team workflow and career requirements.
              </p>
            </div>
            <Link href="/dashboard" className="text-xs font-bold text-white hover:underline flex items-center gap-1 mt-4 md:mt-0 font-mono">
              Go to Arena Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", label: "Coding Arena", title: "Algorithm Sandbox", desc: "Solve logic puzzles inside our integrated Monaco IDE with active compiler outputs and custom hints.", color: "#FF7B72" },
              { num: "02", label: "Real Interview", title: "AI Verbal Mock Rounds", desc: "The AI Interviewer acts like a real person, querying complexity bottlenecks, trade-offs, and scale thresholds.", color: "#7EE787" },
              { num: "03", label: "AI-Assisted", title: "Gemini Copilot Workflows", desc: "Solve goals with dynamic AI Copilot assistance. Evaluates how efficiently you verify code and prevent blind copies.", color: "#79C0FF" },
              { num: "04", label: "Real-World Task", title: "Production Bug Hunting", desc: "Locate boundary errors on actual JSON schema configs, validation endpoints, auth holes, and DevOps variable crashes.", color: "#D2A8FF" },
              { num: "05", label: "System Design", title: "High-Throughput Architectures", desc: "Draft architectural grids answering massive cache cascades, distributed sharding clusters, and ingestion queue limits.", color: "#D29922" },
              { num: "06", label: "Hackathon Sprint", title: "Proof of Concept Builders", desc: "Simulate speed hackathons. Map features briefs, coordinate interface widgets, outline slides, and score your pitch.", color: "#8B949E" }
            ].map((mode, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-[#1A1F26] bg-[#0B0E14] hover:border-zinc-700 hover:bg-[#10141B] transition-all flex flex-col gap-4 group">
                <div className="text-xs font-bold font-mono" style={{ color: mode.color }}>
                  {mode.num} / {mode.label}
                </div>
                <h4 className="text-sm font-bold text-white font-sans">{mode.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats and Benchmarks Section */}
      <section id="stats" className="py-24 border-t border-[#1A1F26] bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="select-none">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 font-mono">
                <Star className="w-3.5 h-3.5 text-[#D29922] fill-[#D29922]" /> // Skill-Benchmarking Scale
              </div>
              <h2 className="text-3xl font-bold text-white mb-6 font-sans">Track Your Career Readiness</h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-sans">
                DevElo replaces boring progress indices. Track your active <strong className="text-white">Offer Readiness Score</strong> mapping 6 essential quadrants. We also maintain a secondary <span className="text-[#79C0FF]">&quot;Practice Tier Index&quot;</span> (ELO 0-2500+ scale) to automatically scale task challenges matching your skills.
              </p>
              
              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-[#1A1F26] pb-2">
                  <span className="font-semibold text-[#D29922]">Grandmaster Benchmark</span>
                  <span className="text-white font-bold">2200 - 2500+</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1A1F26] pb-2">
                  <span className="font-semibold text-[#FF7B72]">Senior Level Coder</span>
                  <span className="text-white font-medium">1900 - 2199</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1A1F26] pb-2">
                  <span className="font-semibold text-[#79C0FF]">Intermediate Developer</span>
                  <span className="text-white font-medium">1600 - 1899</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1A1F26] pb-2">
                  <span className="font-semibold text-zinc-500">Internship Coder</span>
                  <span className="text-zinc-500">700 - 999</span>
                </div>
              </div>
            </div>

            {/* Simulated match panel */}
            <div className="p-8 rounded-2xl bg-[#0B0E14] border border-[#1A1F26] flex flex-col gap-6 relative overflow-hidden font-sans">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 select-none font-mono">// Review Timeline Annotation</div>
              
              <div className="flex items-center justify-between select-none">
                <div>
                  <h4 className="text-xl font-bold text-white">Offer Readiness: <span className="text-white">74%</span></h4>
                  <div className="text-xs text-zinc-400 font-semibold mt-1">+3% gain</div>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-black border border-[#1A1F26] font-mono">
                  <span className="text-[10px] text-zinc-500 font-bold block">PRACTICE TIER</span>
                  <span className="text-sm font-bold text-white mt-0.5">1280 <span className="text-xs text-white font-medium">+35</span></span>
                </div>
              </div>

              {/* Code window block */}
              <div className="border border-[#1A1F26] rounded-lg overflow-hidden bg-black p-4 font-mono text-[11px] flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-[#1A1F26] pb-2">
                  <span className="text-zinc-500">index.js</span>
                  <span className="text-white">★ Best Practice</span>
                </div>
                <div className="text-zinc-500">
                  <span className="text-zinc-500">11</span> | <span className="text-zinc-500">// Initialize fast lookup Map</span>
                </div>
                <div>
                  <span className="text-zinc-500">12</span> |{" "}
                  <span className="text-[#FF7B72]">const</span>{" "}
                  <span className="text-[#79C0FF]">activeLookup</span> ={" "}
                  <span className="text-[#FF7B72]">new</span>{" "}
                  <span className="text-[#D29922]">Map</span>();
                </div>
                <div className="text-[#7EE787] bg-[#7EE787]/[0.04] px-3 py-2 rounded border border-[#7EE787]/20 border-dashed text-[10px] leading-relaxed">
                  Reviewer Carl: Selecting a hash lookup Map instead of looping arrays reduces index lookup to O(1) space complexity. Strong code design.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1A1F26] py-12 bg-black select-none mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-xs font-medium font-sans">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold tracking-wider font-mono">DevElo</span>
            <span>© 2026. Made with love for developers.</span>
          </div>
          <div className="flex items-center gap-8 font-mono">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#stats" className="hover:text-white transition-colors">Benchmarks</Link>
            <a href="https://nextjs.org" target="_blank" className="hover:text-white transition-colors">Next.js Framework</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
