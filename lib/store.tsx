"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CareerRank =
  | "Beginner"
  | "Intern"
  | "New Grad"
  | "Junior Dev"
  | "Intermediate"
  | "Senior Dev"
  | "Fellow / Grandmaster";

export interface ScoreBreakdown {
  coding: number;
  debugging: number;
  communication: number;
  systemDesign: number;
  behavioral: number;
  aiFluency: number;
}

export interface MistakeLog {
  id: string;
  type: "critical-miss" | "bug" | "weak-explanation" | "missed-edge-case" | "overcomplicated" | "ai-overreliance" | "strong-move" | "excellent-tradeoff";
  title: string;
  description: string;
  line?: number;
}

export interface MatchHistoryItem {
  id: string;
  title: string;
  role: string;
  level: string;
  mode: string;
  language: string;
  framework: string;
  date: string;
  overallScore: number;
  eloChange: number;
  passedCount: number;
  totalCount: number;
  mistakes: MistakeLog[];
  feedback: string;
  betterSolution?: string;
  ratingBefore: number;
  ratingAfter: number;
}

export interface UserProfileState {
  user: { name: string; email: string; password?: string } | null;
  xp: number;
  streak: number;
  streakDates: string[]; // ISO Date strings
  rating: number;
  offerReadiness: number;
  unlockedBadges: string[];
  history: MatchHistoryItem[];
  geminiApiKey: string;
  theme: "dark" | "light";
  subscription: "free" | "pro" | "premium" | "enterprise" | null;
  aiProvider: "built-in" | "gemini" | "openai" | "anthropic" | "custom";
  aiModel: string;
  aiApiKey: string;
  aiEndpoint: string;
}

const DEFAULT_STATE: UserProfileState = {
  user: null,
  xp: 0,
  streak: 0,
  streakDates: [],
  rating: 1000, // Intern / Beginner level
  offerReadiness: 0,
  unlockedBadges: [],
  history: [],
  geminiApiKey: "",
  theme: "dark",
  subscription: "free",
  aiProvider: "built-in",
  aiModel: "",
  aiApiKey: "",
  aiEndpoint: ""
};

interface DeveliqStore {
  state: UserProfileState;
  loginUser: (user: any) => void;
  updateUser: (name: string, email: string, subscription?: string) => void;
  updateAiProviderSettings: (provider: string, model: string, key: string, endpoint: string) => void;
  logoutUser: () => void;
  addXP: (amount: number) => void;
  updateELO: (change: number) => void;
  addMatch: (match: MatchHistoryItem) => void;
  updateReadiness: (newScore: number) => void;
  unlockBadge: (badge: string) => void;
  setGeminiApiKey: (key: string) => void;
  resetState: () => void;
  getCareerRank: () => CareerRank;
  getScoreBreakdown: () => ScoreBreakdown;
  toggleTheme: () => void;
}

const StoreContext = createContext<DeveliqStore | undefined>(undefined);

export const getCareerRankForElo = (elo: number): CareerRank => {
  if (elo < 700) return "Beginner";
  if (elo < 1000) return "Intern";
  if (elo < 1300) return "New Grad";
  if (elo < 1600) return "Junior Dev";
  if (elo < 1900) return "Intermediate";
  if (elo < 2200) return "Senior Dev";
  return "Fellow / Grandmaster";
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserProfileState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  // Restore user session from backend or fallback to localStorage
  useEffect(() => {
    const initStore = async () => {
      let initialTheme: "dark" | "light" = "dark";
      let localApiKey = "";
      const saved = localStorage.getItem("develiq_state_v1");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.theme) initialTheme = parsed.theme;
          if (parsed.geminiApiKey) localApiKey = parsed.geminiApiKey;
        } catch {}
      }

      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const dbUser = data.user;
            setState({
              user: { name: dbUser.name, email: dbUser.email },
              xp: dbUser.progress.xp,
              streak: dbUser.progress.streak,
              streakDates: dbUser.progress.streakDates,
              rating: dbUser.progress.rating,
              offerReadiness: dbUser.progress.offerReadiness,
              unlockedBadges: dbUser.progress.unlockedBadges,
              history: dbUser.progress.history,
              subscription: dbUser.subscription || "free",
              aiProvider: dbUser.aiProvider || "built-in",
              aiModel: dbUser.aiModel || "",
              aiApiKey: dbUser.aiApiKey || "",
              aiEndpoint: dbUser.aiEndpoint || "",
              geminiApiKey: localApiKey,
              theme: initialTheme,
            });
            setMounted(true);
            return;
          }
        }
      } catch (err) {
        console.error("Session restore error:", err);
      }

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            theme: initialTheme,
          });
        } catch {}
      }
      setMounted(true);
    };

    initStore();
  }, []);

  // Debounced progress synchronization to backend users.json DB
  useEffect(() => {
    if (state.user && mounted) {
      const payload = {
        xp: state.xp,
        streak: state.streak,
        streakDates: state.streakDates,
        rating: state.rating,
        offerReadiness: state.offerReadiness,
        unlockedBadges: state.unlockedBadges,
        history: state.history,
      };
      
      const timeoutId = setTimeout(() => {
        fetch("/api/progress", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            progress: payload,
            aiProvider: state.aiProvider,
            aiModel: state.aiModel,
            aiApiKey: state.aiApiKey,
            aiEndpoint: state.aiEndpoint,
          }),
        }).catch((err) => console.error("Database progress sync error:", err));
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [state.user, state.xp, state.streak, state.streakDates, state.rating, state.offerReadiness, state.unlockedBadges, state.history, state.aiProvider, state.aiModel, state.aiApiKey, state.aiEndpoint, mounted]);

  useEffect(() => {
    if (state.theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [state.theme]);

  const saveState = (newState: UserProfileState) => {
    setState(newState);
    localStorage.setItem("develiq_state_v1", JSON.stringify(newState));
  };

  const toggleTheme = () => {
    const nextTheme = state.theme === "light" ? "dark" : "light";
    saveState({
      ...state,
      theme: nextTheme
    });
  };

  const loginUser = (user: any) => {
    saveState({
      ...state,
      user: { name: user.name, email: user.email },
      xp: user.progress.xp,
      streak: user.progress.streak,
      streakDates: user.progress.streakDates,
      rating: user.progress.rating,
      offerReadiness: user.progress.offerReadiness,
      unlockedBadges: user.progress.unlockedBadges,
      history: user.progress.history,
      subscription: user.subscription || "free",
      aiProvider: user.aiProvider || "built-in",
      aiModel: user.aiModel || "",
      aiApiKey: user.aiApiKey || "",
      aiEndpoint: user.aiEndpoint || "",
    });
  };

  const updateUser = (name: string, email: string, subscription?: string) => {
    saveState({
      ...state,
      user: state.user ? { ...state.user, name, email } : null,
      subscription: subscription ? (subscription as any) : state.subscription,
    });
  };

  const updateAiProviderSettings = (provider: string, model: string, key: string, endpoint: string) => {
    saveState({
      ...state,
      aiProvider: provider as any,
      aiModel: model,
      aiApiKey: key,
      aiEndpoint: endpoint
    });
  };

  const logoutUser = () => {
    // Clear cookies client-side or call server-side clear
    document.cookie = "develiq_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    saveState({
      ...state,
      user: null,
      subscription: "free",
      history: [],
      xp: 0,
      rating: 1000,
      streak: 0,
      aiProvider: "built-in",
      aiModel: "",
      aiApiKey: "",
      aiEndpoint: ""
    });
  };

  const addXP = (amount: number) => {
    saveState({
      ...state,
      xp: state.xp + amount,
    });
  };

  const updateELO = (change: number) => {
    const nextRating = Math.max(100, state.rating + change);
    saveState({
      ...state,
      rating: nextRating,
    });
  };

  const addMatch = (match: MatchHistoryItem) => {
    const newHistory = [match, ...state.history];
    
    // Recalculate Offer Readiness based on history scores
    const averageScore = Math.round(
      newHistory.reduce((acc, curr) => acc + curr.overallScore, 0) / newHistory.length
    );
    
    // Add additional badges based on match criteria
    const newBadges = [...state.unlockedBadges];
    if (newHistory.length >= 5 && !newBadges.includes("Interview Survivor")) {
      newBadges.push("Interview Survivor");
    }
    if (match.overallScore >= 95 && !newBadges.includes("Bug Hunter")) {
      newBadges.push("Bug Hunter");
    }
    if (match.mode === "AI-Assisted Interview" && !newBadges.includes("AI-Assisted Pro")) {
      newBadges.push("AI-Assisted Pro");
    }
    if (match.framework === "React" && !newBadges.includes("React Ready")) {
      newBadges.push("React Ready");
    }

    saveState({
      ...state,
      history: newHistory,
      rating: match.ratingAfter,
      offerReadiness: Math.min(100, Math.max(15, averageScore - 10 + Math.min(15, newHistory.length * 3))),
      unlockedBadges: newBadges,
      xp: state.xp + 500, // Large XP boost for completing interviews
    });
  };

  const updateReadiness = (newScore: number) => {
    saveState({
      ...state,
      offerReadiness: newScore,
    });
  };

  const unlockBadge = (badge: string) => {
    if (!state.unlockedBadges.includes(badge)) {
      saveState({
        ...state,
        unlockedBadges: [...state.unlockedBadges, badge],
        xp: state.xp + 150, // XP boost for earning badge
      });
    }
  };

  const setGeminiApiKey = (key: string) => {
    saveState({
      ...state,
      geminiApiKey: key,
    });
  };

  const resetState = () => {
    saveState(DEFAULT_STATE);
  };

  const getCareerRank = () => {
    return getCareerRankForElo(state.rating);
  };

  const getScoreBreakdown = (): ScoreBreakdown => {
    // Generate derived breakdown percentages from completed matches
    if (state.history.length === 0) {
      return { coding: 50, debugging: 50, communication: 50, systemDesign: 50, behavioral: 50, aiFluency: 50 };
    }
    
    let codingTotal = 0, debuggingTotal = 0, communicationTotal = 0, systemDesignTotal = 0, behavioralTotal = 0, aiFluencyTotal = 0;
    let codingCount = 0, debuggingCount = 0, communicationCount = 0, systemDesignCount = 0, behavioralCount = 0, aiFluencyCount = 0;

    state.history.forEach((m) => {
      const isAI = m.mode === "AI-Assisted Interview";
      const isSys = m.mode === "System Design";
      const isBeh = m.mode === "Behavioral Interview";
      const isDebug = m.mode === "Debugging Challenge";

      if (isSys) {
        systemDesignTotal += m.overallScore;
        systemDesignCount++;
      } else if (isBeh) {
        behavioralTotal += m.overallScore;
        behavioralCount++;
      } else if (isDebug) {
        debuggingTotal += m.overallScore;
        debuggingCount++;
        codingTotal += m.overallScore * 0.6;
        codingCount++;
      } else {
        codingTotal += m.overallScore;
        codingCount++;
        debuggingTotal += m.overallScore * 0.8;
        debuggingCount++;
      }

      if (isAI) {
        aiFluencyTotal += m.overallScore;
        aiFluencyCount++;
      }

      // Communication relates to real interviews
      if (m.mode.includes("Interview")) {
        communicationTotal += m.overallScore - (m.mistakes.filter(x => x.type === "weak-explanation").length * 15);
        communicationCount++;
      }
    });

    const getAverage = (total: number, count: number, fallback = 60) => {
      return count > 0 ? Math.min(100, Math.max(10, Math.round(total / count))) : fallback;
    };

    return {
      coding: getAverage(codingTotal, codingCount, 68),
      debugging: getAverage(debuggingTotal, debuggingCount, 58),
      communication: getAverage(communicationTotal, communicationCount, 55),
      systemDesign: getAverage(systemDesignTotal, systemDesignCount, 45),
      behavioral: getAverage(behavioralTotal, behavioralCount, 75),
      aiFluency: getAverage(aiFluencyTotal, aiFluencyCount, isNaN(aiFluencyTotal) ? 50 : 65),
    };
  };

  // Prevent hydration error by rendering children only after mounting
  if (!mounted) {
    return <div className="min-h-screen bg-[#080A10]" />;
  }

  return (
    <StoreContext.Provider
      value={{
        state,
        loginUser,
        updateUser,
        updateAiProviderSettings,
        logoutUser,
        addXP,
        updateELO,
        addMatch,
        updateReadiness,
        unlockBadge,
        setGeminiApiKey,
        resetState,
        getCareerRank,
        getScoreBreakdown,
        toggleTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
