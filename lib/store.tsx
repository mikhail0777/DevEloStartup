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
  xp: number;
  streak: number;
  streakDates: string[]; // ISO Date strings
  rating: number;
  offerReadiness: number;
  unlockedBadges: string[];
  history: MatchHistoryItem[];
  geminiApiKey: string;
}

const DEFAULT_STATE: UserProfileState = {
  xp: 450,
  streak: 3,
  streakDates: ["2026-05-19", "2026-05-20", "2026-05-21"],
  rating: 1120, // New Grad level
  offerReadiness: 48,
  unlockedBadges: ["First Submit"],
  history: [
    {
      id: "demo-match-1",
      title: "Filter Job Applications by Status",
      role: "Full Stack Developer",
      level: "New Grad",
      mode: "Real Interview",
      language: "JavaScript",
      framework: "React",
      date: "2026-05-20",
      overallScore: 78,
      eloChange: 35,
      passedCount: 4,
      totalCount: 5,
      ratingBefore: 1085,
      ratingAfter: 1120,
      mistakes: [
        {
          id: "m1",
          type: "missed-edge-case",
          title: "Failed Empty Array Input",
          description: "When the application list is empty, the function returns undefined instead of an empty array.",
          line: 5,
        },
        {
          id: "m2",
          type: "strong-move",
          title: "Efficient Hashmap Selection",
          description: "Chose a key-based Lookup Map for filtering priority tags, yielding O(1) matching time.",
          line: 12,
        }
      ],
      feedback: "Great initial explanation and fast implementation. Work on safeguarding against null inputs and boundary cases."
    }
  ],
  geminiApiKey: ""
};

interface DevEloStore {
  state: UserProfileState;
  addXP: (amount: number) => void;
  updateELO: (change: number) => void;
  addMatch: (match: MatchHistoryItem) => void;
  updateReadiness: (newScore: number) => void;
  unlockBadge: (badge: string) => void;
  setGeminiApiKey: (key: string) => void;
  resetState: () => void;
  getCareerRank: () => CareerRank;
  getScoreBreakdown: () => ScoreBreakdown;
}

const StoreContext = createContext<DevEloStore | undefined>(undefined);

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

  useEffect(() => {
    const saved = localStorage.getItem("develo_state_v1");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved state:", e);
      }
    }
    setMounted(true);
  }, []);

  const saveState = (newState: UserProfileState) => {
    setState(newState);
    localStorage.setItem("develo_state_v1", JSON.stringify(newState));
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
        addXP,
        updateELO,
        addMatch,
        updateReadiness,
        unlockBadge,
        setGeminiApiKey,
        resetState,
        getCareerRank,
        getScoreBreakdown,
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
