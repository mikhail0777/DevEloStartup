"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowRight, Mail, Lock, Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { state, loginUser, toggleTheme } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not continue.");
        return;
      }

      loginUser(data.user);
      router.push("/dashboard");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
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
            <Link href="/" className="text-sm font-semibold text-foreground hover:underline transition-all">
              Return Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6 py-20 bg-background">
        <div className="w-full max-w-2xl">
          {/* Card Container */}
          <div className="rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="flex items-center justify-between px-8 py-4 bg-inset/40 border-b border-border text-sm text-foreground select-none">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-foreground font-bold">&gt;_</span>
                <span className="text-foreground font-mono">login.tsx</span>
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-foreground">TSX</span>
            </div>

            {/* Form Content */}
            <div className="p-16 flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-extrabold text-foreground font-sans tracking-tight">
                  Log In
                </h1>
                <p className="text-base text-foreground leading-relaxed font-sans">
                  Continue your Develiq progress.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
                
                {/* Email Input */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-base text-foreground pl-1 font-mono">
                    <span className="text-foreground">//</span> Email Address
                  </label>
                  <div className="relative flex items-center bg-inset border border-border rounded-xl overflow-hidden focus-within:border-border-active transition-all group">
                    <Mail className="absolute left-5 w-6 h-6 text-foreground group-focus-within:text-blue transition-colors select-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder="ada@example.com"
                      className="w-full bg-transparent border-0 py-5 pl-14 pr-4 text-base text-foreground placeholder:text-foreground outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-base text-foreground pl-1 font-mono">
                    <span className="text-foreground">//</span> Password
                  </label>
                  <div className="relative flex items-center bg-inset border border-border rounded-xl overflow-hidden focus-within:border-border-active transition-all group">
                    <Lock className="absolute left-5 w-6 h-6 text-foreground group-focus-within:text-yellow transition-colors select-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent border-0 py-5 pl-14 pr-4 text-base text-foreground placeholder:text-foreground outline-none font-mono"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red/40 bg-red/10 px-5 py-4 text-base text-red font-mono">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <div className="mt-4 flex flex-col gap-5">
                  <button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full py-5 rounded-xl bg-foreground text-background font-extrabold text-base hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group font-mono cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-6 h-6 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                        Logging In...
                      </span>
                    ) : (
                      <>
                        Log In <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <Link href="/signup" className="text-center text-base text-foreground font-semibold hover:underline transition-colors">
                    Need an account? Sign up
                  </Link>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-border bg-inset/40 text-center font-sans text-sm text-foreground">
              Welcome back to Develiq. Solve challenges, analyze runs, and scale up.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
