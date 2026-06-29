import { MistakeLog } from "./store";

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  color: string;
  accentClass: string;
}

export const AGENT_PROFILES: Record<string, AgentProfile> = {
  Interviewer: {
    id: "interviewer",
    name: "Hardcore Harry",
    role: "AI Senior Interviewer",
    avatar: "👨‍💻",
    description: "No-nonsense tech lead who pushes for optimal space/time complexity and deep architectural explanations.",
    color: "#00E5FF",
    accentClass: "border-cyan-glow bg-cyan-950/20 text-cyan-400"
  },
  Reviewer: {
    id: "reviewer",
    name: "Clean-Code Carl",
    role: "Senior Code Reviewer",
    avatar: "🧐",
    description: "Obsessed with clean structures, descriptive variable naming, defensive coding, and maintainability.",
    color: "#6366F1",
    accentClass: "border-indigo-glow bg-indigo-950/20 text-indigo-400"
  },
  "Test Runner": {
    id: "testrunner",
    name: "Edge-Case Ethan",
    role: "Validation Sandbox Engineer",
    avatar: "🧪",
    description: "Strict quality assurance bot that tests boundaries, empty payloads, duplicate keys, and latency overflows.",
    color: "#10B981",
    accentClass: "border-emerald-glow bg-emerald-950/20 text-emerald-400"
  },
  "Bug Hunter": {
    id: "bughunter",
    name: "Debugger Dan",
    role: "Fault & Warning Locator",
    avatar: "👾",
    description: "Instantly spots index out-of-bounds, unhandled exceptions, and memory leaks before compiler runs.",
    color: "#FF1744",
    accentClass: "border-rose-glow bg-rose-950/20 text-rose-400"
  },
  Coach: {
    id: "coach",
    name: "Mentor Mindy",
    role: "Interview Career Coach",
    avatar: "🧠",
    description: "Analyzes ELO progress, evaluates explanation clarity, and provides personalized daily practice agendas.",
    color: "#FFC107",
    accentClass: "border-amber-glow bg-amber-950/20 text-amber-400"
  },
  Assistant: {
    id: "assistant",
    name: "AI Copilot",
    role: "Code Helper Agent",
    avatar: "🤖",
    description: "Your helpful code assistant, available in AI-Assisted mode. Tracks usage strictly to score prompt fluency.",
    color: "#E2E8F0",
    accentClass: "border-slate-700 bg-slate-800/40 text-slate-300"
  }
};

/**
 * Check if the code defines any parameterized function
 */
const hasParameters = (code: string, language: string): boolean => {
  const lang = language.toLowerCase();
  if (lang === "sql") return false;
  
  // Remove comments first to avoid matching function signatures in comments
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*/g, "")
    .replace(/#.*/g, "");

  if (lang === "python") {
    const defs = cleanCode.match(/def\s+\w+\s*\(([^)]*)\):/g);
    if (!defs) return false;
    for (const def of defs) {
      const match = def.match(/\(([^)]*)\)/);
      if (match) {
        const paramsText = match[1] || "";
        const params = paramsText.split(",").map(p => p.trim()).filter(p => p && p !== "self" && p !== "cls");
        if (params.length > 0) return true;
      }
    }
    return false;
  } else {
    // JS/TS/Java/C++
    const funcRegexes = [
      /function\s+\w*\s*\(([^)]*)\)/g,
      /\(([^)]*)\)\s*=>/g,
      /(?:public|private|protected|static|class)?\s+[\w<>[\]]+\s+\w+\s*\(([^)]*)\)\s*\{/g
    ];
    
    for (const regex of funcRegexes) {
      const matches = cleanCode.matchAll(regex);
      for (const match of matches) {
        const sig = match[0];
        if (/\b(?:if|for|while|catch|switch|super)\b/.test(sig)) continue;
        const paramsText = match[1] || "";
        const params = paramsText.split(",").map(p => p.trim()).filter(p => p);
        if (params.length > 0) return true;
      }
    }
    return false;
  }
};

/**
 * Scan User Code (Heuristics Scanner)
 * Observes real-time code changes in Monaco and flags Chess-style rating annotations
 */
export const scanUserCode = (code: string, language: string): MistakeLog[] => {
  const logs: MistakeLog[] = [];
  if (!code || code.trim().length === 0) return logs;

  const lines = code.split("\n");
  const isSql = language.toLowerCase() === "sql";

  // 1. Check for nested loops (O(N^2) Complexity Warning)
  if (!isSql) {
    let loopStartLine = -1;
    let hasNestedLoop = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isLoop = /for\s*\(|while\s*\(|forEach|map\s*\(/.test(line);
      if (isLoop) {
        if (loopStartLine !== -1 && i - loopStartLine < 6) {
          hasNestedLoop = true;
          logs.push({
            id: `nested-loop-${i}`,
            type: "overcomplicated",
            title: "High Computational Complexity",
            description: "Detected nested loops/scans. This yields O(N^2) time complexity. Can we optimize using a hashing strategy?",
            line: i + 1
          });
          break;
        }
        loopStartLine = i;
      }
    }
  }

  // 2. Check for Hashing / Lookup Table (Strong Move)
  if (!isSql) {
    let foundMap = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/new\s+Map|new\s+Set|\{\}|\bdict\b|\[\w+\]\s*=\s*/.test(line)) {
        foundMap = true;
        logs.push({
          id: `hashmap-${i}`,
          type: "strong-move",
          title: "Optimal Key-Based Hashing",
          description: "Excellent trade-off decision! Leveraging key lookup structures allows sorting and retrieval in O(1) average-time.",
          line: i + 1
        });
        break; // Only flag once
      }
    }
  }



  // 4. Check for Copilot Boilerplate (AI Overreliance check)
  if (code.includes("// Generated by Copilot") || code.includes("/** AI Assist")) {
    logs.push({
      id: "ai-overreliance",
      type: "ai-overreliance",
      title: "AI Overreliance",
      description: "Blind copy warning: Copied solution boilerplate verbatim from AI Assistant without detailing structural tradeoffs.",
      line: 1
    });
  }

  // 5. Stripe Webhook-specific Checks
  if (code.includes("verifyWebhook") || code.includes("verify_webhook")) {
    const hasCrypto = /createHmac|crypto|hmac|hashlib/.test(code);
    const hasReplayCheck = /300|Math\.abs|abs\(|Date\.now|time\.time/.test(code);

    if (!hasCrypto) {
      logs.push({
        id: "webhook-insecure-crypto",
        type: "critical-miss",
        title: "Insecure Cryptographic Check",
        description: "Critical Warning: Signature validation should leverage cryptographically secure HMAC SHA-256 validation to prevent payload spoofing.",
        line: 5
      });
    } else {
      logs.push({
        id: "webhook-secure-crypto",
        type: "excellent-tradeoff",
        title: "Secure Cryptographic Validation",
        description: "Excellent Move: Using cryptographically secure HMAC validation ensures raw webhook integrity.",
        line: 8
      });
    }

    if (!hasReplayCheck) {
      logs.push({
        id: "webhook-replay-vulnerable",
        type: "critical-miss",
        title: "Missing Replay Protection",
        description: "Security Vulnerability: Webhook is vulnerable to replay attacks. Enforce a threshold verification on the header timestamp (e.g. 5-minute/300-second window).",
        line: 6
      });
    } else {
      logs.push({
        id: "webhook-replay-safe",
        type: "excellent-tradeoff",
        title: "Replay Attack Prevention",
        description: "Strong Move: Restricting the signature timestamp comparison to a 300-second window protects against verification spoofing.",
        line: 12
      });
    }
  }

  // 6. Redis Rate Limiter-specific Checks
  if (code.includes("isAllowed") || code.includes("is_allowed")) {
    const hasMulti = /multi|pipeline/.test(code);
    const hasEvict = /zremrangebyscore|zremrange|ZREMRANGEBYSCORE|ZREMRANGE/.test(code);

    if (!hasMulti) {
      logs.push({
        id: "rate-limiter-race-condition",
        type: "critical-miss",
        title: "Concurreny Race Condition",
        description: "High Risk: Executing Redis queries sequentially can lead to race conditions. Utilize an atomic pipeline/transaction (multi/pipeline) to isolate queries.",
        line: 5
      });
    } else {
      logs.push({
        id: "rate-limiter-atomic",
        type: "excellent-tradeoff",
        title: "Atomic Redis Transaction",
        description: "Excellent Move: Grouping operations in an atomic multi pipeline ensures transaction safety under load.",
        line: 10
      });
    }

    if (!hasEvict) {
      logs.push({
        id: "rate-limiter-no-eviction",
        type: "bug",
        title: "Missing Window Cleanup",
        description: "Logical Issue: Timestamps older than the sliding window size should be evicted (ZREMRANGEBYSCORE) before counting requests.",
        line: 4
      });
    }
  }

  // 7. JWT JWKS-specific Checks
  if (code.includes("verifyJwtJwks") || code.includes("verify_jwt_jwks")) {
    const hasKid = /kid|header/.test(code);
    const hasExp = /exp|expiration|now/.test(code);

    if (!hasKid) {
      logs.push({
        id: "jwt-missing-kid",
        type: "critical-miss",
        title: "Missing Key ID Matching",
        description: "Critical Miss: JWT verification must extract the key identifier ('kid') from the token header to match it with the JWKS key pool.",
        line: 4
      });
    } else {
      logs.push({
        id: "jwt-kid-match",
        type: "excellent-tradeoff",
        title: "Dynamic Key Identification",
        description: "Strong Move: Successfully parsing and matching key IDs ensures correct cryptographic verify signatures are mapped.",
        line: 6
      });
    }

    if (!hasExp) {
      logs.push({
        id: "jwt-missing-exp",
        type: "critical-miss",
        title: "Missing Expiration Bounds",
        description: "Security Issue: Token expiration ('exp') claims must be verified against current epoch seconds to block expired credential reuse.",
        line: 5
      });
    } else {
      logs.push({
        id: "jwt-exp-safe",
        type: "excellent-tradeoff",
        title: "Token Lifetime Restraints",
        description: "Excellent Tradeoff: Asserting token expiration guards the endpoint from stale session replay hijacks.",
        line: 10
      });
    }
  }

  // 8. Fetch Retry-specific Checks
  if (code.includes("fetchWithRetry") || code.includes("fetch_with_retry")) {
    const hasBackoff = /pow|multiplier|\*\*/.test(code);
    const hasJitter = /random|Jitter/.test(code);

    if (!hasBackoff) {
      logs.push({
        id: "retry-flat-interval",
        type: "critical-miss",
        title: "Flat Retry Intervals",
        description: "Performance Bug: Retrying with static bounds rather than exponential scale delays will overload struggling backend servers.",
        line: 6
      });
    } else {
      logs.push({
        id: "retry-exponential-scale",
        type: "excellent-tradeoff",
        title: "Exponential Backoff Scaler",
        description: "Excellent Tradeoff: Scaling retries exponentially allows backend services recovery buffers under load.",
        line: 8
      });
    }

    if (!hasJitter) {
      logs.push({
        id: "retry-missing-jitter",
        type: "bug",
        title: "Thundering Herd Vulnerability",
        description: "Vulnerability: Lack of randomized delay jitter coordinates failed clients to retry at the same time, triggering stampedes.",
        line: 7
      });
    } else {
      logs.push({
        id: "retry-jitter-protected",
        type: "strong-move",
        title: "Client Request De-synchronization",
        description: "Strong Move: Adding randomized jitter offsets request timing, flattening the retry peak traffic curves.",
        line: 12
      });
    }
  }

  // 9. Circuit Breaker-specific Checks
  if (code.includes("CircuitBreaker")) {
    const hasClosed = /CLOSED/.test(code);
    const hasOpen = /OPEN/.test(code);
    const hasHalfOpen = /HALF-OPEN/.test(code);

    if (!hasClosed || !hasOpen || !hasHalfOpen) {
      logs.push({
        id: "circuit-breaker-missing-states",
        type: "critical-miss",
        title: "Incomplete Circuit States",
        description: "Logic Warning: Circuit breaker wrapper must support all three standard states (CLOSED, OPEN, HALF-OPEN) to self-heal.",
        line: 5
      });
    } else {
      logs.push({
        id: "circuit-breaker-tri-state",
        type: "excellent-tradeoff",
        title: "Self-Healing Circuit States",
        description: "Strong Move: Implementing CLOSED, OPEN, and HALF-OPEN transitions enables self-healing fail-safe bounds.",
        line: 8
      });
    }
  }

  return logs;
};

/**
 * AI Agent Chat Responders
 * Integrates dynamic replies when typing in the workspace panels
 */
export const getAgentResponse = async (
  agentType: keyof typeof AGENT_PROFILES,
  userMessage: string,
  currentCode: string,
  challengeContext: string,
  apiKey?: string
): Promise<string> => {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentType,
        userMessage,
        currentCode,
        challengeContext,
        customApiKey: apiKey,
      }),
    });

    if (!response.ok) {
      throw new Error("Server AI Proxy Call failed");
    }

    const data = await response.json();
    return data.text || "System offline, failed to retrieve agent dialogue.";
  } catch (err) {
    console.error("Agent dialogue proxy error, fallback to mock:", err);
    return `[Fallback] ${AGENT_PROFILES[agentType]?.name || "Assistant"} is observing your code. Check your parameters and ensure bounds validation exists.`;
  }
};
