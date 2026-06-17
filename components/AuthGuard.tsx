"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!state.user) {
      router.push("/signup");
    }
  }, [state.user, router]);

  if (!state.user) {
    // Return empty or a loading state while redirecting
    return <div className="min-h-screen bg-black" />;
  }

  return <>{children}</>;
}
