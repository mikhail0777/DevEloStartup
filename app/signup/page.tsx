"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowRight, User, Mail, Lock, Sun, Moon } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { state, loginUser, toggleTheme } = useStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    setIsLoading(true);
    
    // Simulate network delay for effect
    setTimeout(() => {
      loginUser(name, email, password);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border relative">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/develiq_logo.jpg" alt="Develiq Logo" className="w-8 h-8 rounded object-cover border border-border bg-surface" />
            <span className="text-xl font-bold tracking-wider text-foreground select-none font-mono">
              Develiq
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-md bg-surface text-foreground hover:bg-elevated transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {state.theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <Link href="/" className="text-xs font-semibold text-secondary hover:text-foreground transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-inset/40 border-b border-border text-xs text-secondary select-none">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B72]/85" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]/85" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#7EE787]/85" />
                <span className="ml-2 text-[10px] text-secondary font-mono">signup.tsx</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-muted">TSX</span>
            </div>

            {/* Form Content */}
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-foreground font-sans">
                  Sign Up
                </h1>
                <p className="text-xs text-secondary leading-relaxed font-sans">
                  Create an account to start practice runs, record logs, and level up your engineering ELO rating.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
                
                {/* Developer Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-secondary pl-1 font-mono">
                    <span className="text-muted">//</span> Developer Name
                  </label>
                  <div className="relative flex items-center bg-inset border border-border rounded-lg overflow-hidden focus-within:border-border-active transition-all group">
                    <User className="absolute left-3.5 w-4 h-4 text-muted group-focus-within:text-green transition-colors select-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Ada Lovelace"
                      className="w-full bg-transparent border-0 py-3.5 pl-10 pr-4 text-xs text-foreground placeholder-muted outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-secondary pl-1 font-mono">
                    <span className="text-muted">//</span> Email Address
                  </label>
                  <div className="relative flex items-center bg-inset border border-border rounded-lg overflow-hidden focus-within:border-border-active transition-all group">
                    <Mail className="absolute left-3.5 w-4 h-4 text-muted group-focus-within:text-blue transition-colors select-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ada@example.com"
                      className="w-full bg-transparent border-0 py-3.5 pl-10 pr-4 text-xs text-foreground placeholder-muted outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-secondary pl-1 font-mono">
                    <span className="text-muted">//</span> Password
                  </label>
                  <div className="relative flex items-center bg-inset border border-border rounded-lg overflow-hidden focus-within:border-border-active transition-all group">
                    <Lock className="absolute left-3.5 w-4 h-4 text-muted group-focus-within:text-yellow transition-colors select-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent border-0 py-3.5 pl-10 pr-4 text-xs text-foreground placeholder-muted outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !name || !email || !password}
                    className="w-full py-3.5 rounded-lg bg-foreground text-background font-extrabold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group font-mono cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                        Signing Up...
                      </span>
                    ) : (
                      <>
                        Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-inset/40 text-center font-sans text-[10px] text-secondary">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
