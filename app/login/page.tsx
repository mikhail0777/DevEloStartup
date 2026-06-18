"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useStore();
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

      loginUser(data.user.name, data.user.email);
      router.push("/dashboard");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 font-mono">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-2xl flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans">Log In</h1>
          <p className="text-xs text-secondary mt-2 font-sans">Continue your Develiq progress.</p>
        </div>

        <label className="text-xs text-secondary">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="bg-inset border border-border rounded-lg px-4 py-3 text-sm outline-none"
        />

        <label className="text-xs text-secondary">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="bg-inset border border-border rounded-lg px-4 py-3 text-sm outline-none"
        />

        {error && <p className="text-xs text-red">{error}</p>}

        <button disabled={isLoading} className="bg-foreground text-background rounded-lg py-3 text-xs font-extrabold disabled:opacity-60">
          {isLoading ? "Loading..." : "Log In"}
        </button>

        <Link href="/signup" className="text-center text-xs text-secondary hover:text-foreground">
          Need an account? Sign up
        </Link>
      </form>
    </main>
  );
}
