"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Code, Terminal, Brain, Target, Shield, Zap, ArrowRight, Star, Layers, Play, Cpu, Sun, Moon } from "lucide-react";

export default function LandingPage() {
  const { state, toggleTheme } = useStore();
  const isAuthenticated = !!state.user;
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
    <div className="min-h-screen bg-background text-foreground selection:bg-zinc-800 selection:text-white flex flex-col font-mono">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/develiq_logo.jpg" alt="Develiq Logo" className="w-8 h-8 rounded object-cover border border-border bg-surface" />
            <span className="text-xl font-bold tracking-wider text-foreground select-none font-mono">
              Develiq
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary font-sans">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#modes" className="hover:text-foreground transition-colors">Practice Modes</Link>
            <Link href="#stats" className="hover:text-foreground transition-colors">Benchmarks</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold border border-border rounded-md hover:border-foreground hover:text-foreground transition-all bg-surface font-mono">
              Dashboard
            </Link>
            <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="px-4 py-2 text-sm font-semibold rounded-md bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-2 font-mono">
              {isAuthenticated ? "Start Coding Now" : "Start Practice"} <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-md bg-surface text-foreground hover:bg-elevated transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {state.theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 flex-1 flex flex-col justify-center overflow-hidden bg-background">
        {/* Subtle modern glow indicator */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-foreground/[0.01] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface text-secondary text-xs font-semibold uppercase tracking-wider mb-8 font-mono">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            Next-Gen Technical Prep Platform
          </div>

          {/* IDE-style hero headline with colored words */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl mb-6 font-mono">
            <span className="text-red">import</span>{" "}
            <span className="text-foreground">{"{ "}</span>
            <span className="text-blue">career</span>
            <span className="text-foreground">{" }"}</span>{" "}
            <span className="text-red">from</span>{" "}
            <span className="text-green">&apos;practice&apos;</span>
            <span className="text-foreground">;</span>
            <br />
            <span className="text-muted text-2xl md:text-4xl mt-3 block">
              // Practice interviews like they really happen.
            </span>
          </h1>

          <p className="text-base text-secondary max-w-2xl leading-relaxed mb-12 font-sans">
            Dynamic, AI-generated coding challenges and production tasks. Experience code-observant AI interviewers that review your structure, constraints, and architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 font-mono">
            <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="px-8 py-4 rounded-lg bg-foreground text-background font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-3">
              <Play className="w-5 h-5 fill-current" /> {isAuthenticated ? "Start Coding Now" : "Get Started Free"}
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-lg border border-border text-foreground font-semibold text-base hover:border-border-muted bg-surface transition-all flex items-center justify-center gap-2">
              Explore Features
            </Link>
          </div>

          {/* Stats row — styled like key:value terminal output with IDE colored highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12 w-full max-w-4xl text-left select-none">
            <div>
              <div className="text-2xl font-bold text-green font-mono">10,000+</div>
              <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1.5 font-sans">// Interviews Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red font-mono">32%</div>
              <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1.5 font-sans">// Skill Growth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue font-mono">400+</div>
              <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1.5 font-sans">// Mastered Daily</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow font-mono">500+</div>
              <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1.5 font-sans">// Offer Landings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Marquee — Grayscale vector logos with glow effect */}
      <section className="border-t border-border py-12 bg-background overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <p className="text-xs text-muted uppercase tracking-widest font-bold text-center font-mono">
            // Helped engineers get hired at
          </p>
        </div>
        <div className="relative w-full">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee whitespace-nowrap gap-12">
            {[...brandLogos, ...brandLogos, ...brandLogos].map((brand, idx) => (
              <div key={idx} className="flex items-center justify-center mx-6 shrink-0 h-10 select-none">
                <img
                  src={`https://cdn.simpleicons.org/${brand.slug}/${state.theme === "light" ? "000000" : "ffffff"}`}
                  alt={brand.name}
                  className="h-6 w-auto opacity-40 hover:opacity-100 transition-all duration-300 object-contain hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards — Premium Minimalist Dark Copilot Card Style */}
      <section id="features" className="py-24 border-t border-border bg-background relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 select-none font-sans">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Elevate Beyond Static Code Banks
            </h2>
            <p className="text-sm text-secondary max-w-xl mx-auto">
              Develiq goes past traditional algorithmic syntax prep. We evaluate your communication, prompt efficiency, and error verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="feature-card flex flex-col gap-5">
              <div className="w-10 h-10 rounded-lg bg-inset border border-border flex items-center justify-center text-foreground">
                <Code className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-foreground font-sans tracking-tight">
                Go beyond <span className="text-green font-mono">&apos;one-size-fits-all&apos;</span>
              </h3>
              <p className="text-sm text-secondary leading-relaxed font-sans">
                Choose from leading <span className="text-blue font-mono">LLMs</span> optimized for <span className="text-red font-mono">speed</span>, <span className="text-green font-mono">accuracy</span>, or <span className="text-yellow font-mono">cost</span> parameters.
              </p>
            </div>

            {/* Card 2 */}
            <div className="feature-card flex flex-col gap-5">
              <div className="w-10 h-10 rounded-lg bg-inset border border-border flex items-center justify-center text-foreground">
                <Brain className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-foreground font-sans tracking-tight">
                Use your <span className="text-red font-mono">agents</span>, your way
              </h3>
              <p className="text-sm text-secondary leading-relaxed font-sans">
                Use <span className="text-blue font-mono">GitHub Copilot</span>, your own custom <span className="text-green font-mono">agents</span>, or the third-party ones you already rely on in your code.
              </p>
            </div>

            {/* Card 3 */}
            <div className="feature-card flex flex-col gap-5">
              <div className="w-10 h-10 rounded-lg bg-inset border border-border flex items-center justify-center text-foreground">
                <Target className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-foreground font-sans tracking-tight">
                Stay in your <span className="text-blue font-mono">flow()</span>
              </h3>
              <p className="text-sm text-secondary leading-relaxed font-sans">
                Copilot works where you do—in <span className="text-green font-mono">GitHub</span>, your <span className="text-yellow font-mono">IDE</span>, project tools, and custom <span className="text-blue font-mono">MCP servers</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Showcase */}
      <section id="modes" className="py-24 border-t border-border bg-background relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="select-none font-sans">
              <h2 className="text-3xl font-bold text-foreground mb-4">Practice Arena Modules</h2>
              <p className="text-sm text-secondary max-w-lg">
                Choose the best mode tailored to your current team workflow and career requirements.
              </p>
            </div>
            <Link href="/dashboard" className="text-xs font-bold text-foreground hover:underline flex items-center gap-1 mt-4 md:mt-0 font-mono">
              Go to Arena Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", label: "Coding Arena", title: "Algorithm Sandbox", desc: "Solve logic puzzles inside our integrated Monaco IDE with active compiler outputs and custom hints.", color: "var(--color-red)" },
              { num: "02", label: "Real Interview", title: "AI Verbal Mock Rounds", desc: "The AI Interviewer acts like a real person, querying complexity bottlenecks, trade-offs, and scale thresholds.", color: "var(--color-green)" },
              { num: "03", label: "AI-Assisted", title: "Gemini Copilot Workflows", desc: "Solve goals with dynamic AI Copilot assistance. Evaluates how efficiently you verify code and prevent blind copies.", color: "var(--color-blue)" },
              { num: "04", label: "Real-World Task", title: "Production Bug Hunting", desc: "Locate boundary errors on actual JSON schema configs, validation endpoints, auth holes, and DevOps variable crashes.", color: "var(--syntax-method)" },
              { num: "05", label: "System Design", title: "High-Throughput Architectures", desc: "Draft architectural grids answering massive cache cascades, distributed sharding clusters, and ingestion queue limits.", color: "var(--color-yellow)" },
              { num: "06", label: "Hackathon Sprint", title: "Proof of Concept Builders", desc: "Simulate speed hackathons. Map features briefs, coordinate interface widgets, outline slides, and score your pitch.", color: "var(--color-secondary)" }
            ].map((mode, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border bg-surface hover:border-border-muted hover:bg-elevated transition-all flex flex-col gap-4 group">
                <div className="text-xs font-bold font-mono" style={{ color: mode.color }}>
                  {mode.num} / {mode.label}
                </div>
                <h4 className="text-sm font-bold text-foreground font-sans">{mode.title}</h4>
                <p className="text-xs text-secondary leading-relaxed font-sans">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats and Benchmarks Section */}
      <section id="stats" className="py-24 border-t border-border bg-background relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="select-none">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mb-4 font-mono">
                <Star className="w-3.5 h-3.5 text-yellow fill-current" /> // Developer Progression Scale
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6 font-sans">Track Your Coding Progress</h2>
              <p className="text-sm text-secondary leading-relaxed mb-8 font-sans">
                Develiq keeps you motivated. Track your developer level, earn experience points (XP) for completing practice tasks, and maintain a coding streak calendar. We automatically scale challenge difficulties matching your active stack.
              </p>
              
              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-yellow">Principal Engineer Tier</span>
                  <span className="text-foreground font-bold">Level 10 - 9000+ XP</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-red">Lead Engineer Tier</span>
                  <span className="text-foreground font-medium">Level 7 - Level 9 (6000+ XP)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-blue">Senior Engineer Tier</span>
                  <span className="text-foreground font-medium">Level 4 - Level 6 (3000+ XP)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-muted">Associate Coder Tier</span>
                  <span className="text-muted">Level 1 - Level 3 (0+ XP)</span>
                </div>
              </div>
            </div>

            {/* Simulated match panel */}
            <div className="p-8 rounded-2xl bg-surface border border-border flex flex-col gap-6 relative overflow-hidden font-sans">
              <div className="text-xs font-bold uppercase tracking-wider text-muted select-none font-mono">// Session Complete Log</div>
              
              <div className="flex items-center justify-between select-none">
                <div>
                  <h4 className="text-xl font-bold text-foreground">XP Earned: <span>+500 XP</span></h4>
                  <div className="text-xs text-secondary font-semibold mt-1">Level Up Progress 85%</div>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-inset border border-border font-mono">
                  <span className="text-[10px] text-muted font-bold block">PRACTICE STREAK</span>
                  <span className="text-sm font-bold text-foreground mt-0.5">5 Days <span className="text-xs text-foreground font-medium">🔥</span></span>
                </div>
              </div>

              {/* Code window block */}
              <div className="border border-border rounded-lg overflow-hidden bg-inset p-4 font-mono text-[11px] flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted font-mono">index.js</span>
                  <span className="text-foreground">★ Best Practice</span>
                </div>
                <div className="text-muted">
                  <span className="text-muted">11</span> | <span className="text-muted">// Initialize fast lookup Map</span>
                </div>
                <div>
                  <span className="text-muted">12</span> |{" "}
                  <span className="text-red">const</span>{" "}
                  <span className="text-blue">activeLookup</span> ={" "}
                  <span className="text-red">new</span>{" "}
                  <span className="text-yellow">Map</span>();
                </div>
                <div className="bg-green/10 border border-green/20 text-green/90 px-3 py-2 rounded border-dashed text-[10px] leading-relaxed">
                  Reviewer Carl: Selecting a hash lookup Map instead of looping arrays reduces index lookup to O(1) space complexity. Strong code design.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background select-none mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-secondary text-xs font-medium font-sans">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-bold tracking-wider font-mono">Develiq</span>
            <span>© 2026. Made with love for developers.</span>
          </div>
          <div className="flex items-center gap-8 font-mono">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#stats" className="hover:text-foreground transition-colors">Benchmarks</Link>
            <a href="https://nextjs.org" target="_blank" className="hover:text-foreground transition-colors">Next.js Framework</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
