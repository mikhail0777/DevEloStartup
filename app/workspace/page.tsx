"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LinkNext from "next/link";
import Editor from "@monaco-editor/react";
import AuthGuard from "@/components/AuthGuard";
import { useStore, MistakeLog } from "@/lib/store";
import { GeneratedChallenge } from "@/lib/challenges";
import { AGENT_PROFILES, scanUserCode, getAgentResponse } from "@/lib/agents";
import {
  Play, Send, HelpCircle, AlertTriangle, CheckCircle,
  Terminal as TermIcon, MessageSquare, Volume2, Award, Clock, ArrowRight, Settings, Info,
  Sun, Moon
} from "lucide-react";

interface ChatMessage {
  sender: "User" | "Interviewer" | "Debugger" | "LiveInterviewer" | "Assistant";
  text: string;
  time: string;
}

export default function WorkspaceIDEPage() {
  return (
    <AuthGuard>
      <WorkspaceIDE />
    </AuthGuard>
  );
}

const checkFuncNamePresence = (code: string, funcName: string | undefined, lang: string): boolean => {
  if (!funcName) return true;
  const codeLower = code.toLowerCase();
  const funcNameLower = funcName.toLowerCase();

  // Convert camelCase to snake_case for Python
  const snakeName = funcName.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`).toLowerCase();

  if (lang === "Python") {
    return codeLower.includes(`def ${funcNameLower}`) || codeLower.includes(`def ${snakeName}`);
  } else if (lang === "JavaScript" || lang === "TypeScript") {
    return codeLower.includes(`function ${funcNameLower}`) ||
      codeLower.includes(`${funcNameLower}:`) ||
      codeLower.includes(`${funcNameLower} =`) ||
      codeLower.includes(`class ${funcNameLower}`) ||
      codeLower.includes(`export function ${funcNameLower}`);
  } else if (lang === "Java") {
    return codeLower.includes(`${funcNameLower}(`);
  }
  return true;
};

const evaluateUserCode = (code: string, challenge: any, lang: string, tc: any) => {
  const codeTrimmed = code.trim();
  const starterTrimmed = challenge.starterCode.trim();

  // 1. Unmodified check
  if (codeTrimmed === starterTrimmed || codeTrimmed.length === 0) {
    return { passed: false, output: "AssertionError: Starter code unmodified. Please implement the solution before running." };
  }

  // Check for placeholder strings
  if (code.includes("TODO: Return") || code.includes("TODO: Implement") || code.includes("TODO: Write") || (lang === "Python" && code.includes("pass"))) {
    const lines = code.split("\n");
    const hasUnchangedTodo = lines.some(l => (l.includes("TODO") || l.includes("pass")) && !l.includes("completed") && !l.includes("done"));
    if (hasUnchangedTodo) {
      return { passed: false, output: "AssertionError: Unimplemented placeholder detected. Please replace TODO / pass statements with active logic." };
    }
  }

  // 2. Strict language evaluation
  const codeLower = code.toLowerCase();

  // Validate that the expected function or class name exists in the user's code
  if (challenge.funcName && !checkFuncNamePresence(code, challenge.funcName, lang)) {
    const expectedName = lang === "Python"
      ? challenge.funcName.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
      : challenge.funcName;
    return {
      passed: false,
      output: `AssertionError: The expected function or class '${expectedName}' was not found in your code. Please make sure you are implementing the correct entrypoint.`
    };
  }

  // 3. For JS/TS, try executing algorithms that are purely functional
  const isPureAlg = challenge.category === "Algorithms" &&
    !["reverse-linked-list", "invert-binary-tree", "validate-bst", "number-of-islands", "lowest-common-ancestor", "binary-tree-level-order", "linked-list-cycle", "merge-two-sorted-lists", "merge-k-sorted-lists", "serialize-deserialize-tree", "lru-cache"].includes(challenge.id);

  if ((lang === "JavaScript" || lang === "TypeScript") && isPureAlg) {
    try {
      // Clean up typescript definitions
      let cleanCode = code;
      if (lang === "TypeScript") {
        cleanCode = code
          .replace(/:\s*(string|number|boolean|any|void|number\[\]|string\[\]|Record<[^>]+>|Map<[^>]+>|Set<[^>]+>)(\[\])?/g, "")
          .replace(/\s+as\s+\w+/g, "")
          .replace(/export\s+/g, "")
          .replace(/import\s+[^;]+;/g, "");
      }

      // Determine what call expression to run
      let callExpr = tc.input.trim();
      // If the input doesn't start with the function name, wrap it
      if (!callExpr.startsWith(challenge.funcName)) {
        callExpr = `${challenge.funcName}(${callExpr})`;
      }

      // Execute
      const runner = new Function(`
        ${cleanCode}
        return ${callExpr};
      `);

      const result = runner();

      // Normalize and compare actual vs expected
      const expectedNormalized = tc.expected.trim().replace(/\s+/g, "");
      let actualNormalized = "";
      if (typeof result === "object" && result !== null) {
        actualNormalized = JSON.stringify(result).replace(/\s+/g, "");
      } else {
        actualNormalized = String(result).trim().replace(/\s+/g, "");
      }

      // Also check if result is string but expected has single/double quotes around it
      let expClean = expectedNormalized;
      if ((expClean.startsWith("'") && expClean.endsWith("'")) || (expClean.startsWith("\"") && expClean.endsWith("\""))) {
        expClean = expClean.slice(1, -1);
      }
      let actClean = actualNormalized;
      if ((actClean.startsWith("'") && actClean.endsWith("'")) || (actClean.startsWith("\"") && actClean.endsWith("\""))) {
        actClean = actClean.slice(1, -1);
      }

      if (actClean === expClean || actualNormalized === expectedNormalized) {
        return { passed: true, output: `Verification passed. Output: ${JSON.stringify(result)}` };
      } else {
        return {
          passed: false,
          output: `AssertionError: Expected '${tc.expected}', got '${result !== undefined ? JSON.stringify(result) : "undefined"}'`
        };
      }
    } catch (err: any) {
      return { passed: false, output: `TypeError/SyntaxError: ${err.message || String(err)}` };
    }
  }

  // 4. Strict Heuristics checking for all other templates/languages
  // We can write custom rules based on the challenge ID to make sure they solved it!



  // Rule B: specific challenge verification checks
  switch (challenge.id) {
    case "hello-develiq":
      if (!codeLower.includes("hello") || !codeLower.includes("develiq")) {
        return { passed: false, output: "AssertionError: Greet message incorrect. Your output must contain 'Hello, Develiq!'." };
      }
      break;

    case "sum-of-two":
      if (!code.includes("+") && !codeLower.includes("sum")) {
        return { passed: false, output: "AssertionError: Sum expression missing. You must compute the sum of the inputs." };
      }
      break;

    case "even-or-odd":
      if (!code.includes("%") && !codeLower.includes("even") && !codeLower.includes("odd")) {
        return { passed: false, output: "AssertionError: Modulo checker missing. You must check if the number is even or odd." };
      }
      break;

    case "find-max":
      if (!codeLower.includes("max") && !codeLower.includes(">") && !codeLower.includes("for") && !codeLower.includes("while")) {
        return { passed: false, output: "AssertionError: Maximum finder logic missing. You must find the maximum value." };
      }
      break;

    case "lru-cache":
      if (!codeLower.includes("get") || !codeLower.includes("put") || (!codeLower.includes("map") && !codeLower.includes("ordereddict") && !codeLower.includes("capacity"))) {
        return { passed: false, output: "AssertionError: Cache operations missing. Make sure your LRUCache class implements 'get', 'put', and tracks cache capacity." };
      }
      break;

    // Debugging off-by-one binary search
    case "fix-binary-search":
      if (!code.includes("<=") && !code.includes("l <= r") && !code.includes("low <= high")) {
        return { passed: false, output: "AssertionError: Off-by-one check failed. Make sure the while loop condition checks boundary indexes (e.g., low <= high)." };
      }
      break;

    // Debugging array sort coercion
    case "fix-type-coercion":
      if (!code.includes("a - b") && !code.includes("a-b")) {
        return { passed: false, output: "AssertionError: Sort comparison check failed. JavaScript sorts values as strings alphabetically by default. You must supply a numeric comparison lambda." };
      }
      break;

    // Debugging recursive traversal stack overflow
    case "fix-infinite-recursion":
      if (!code.includes("null") && !code.includes("!node") && !code.includes("== null")) {
        return { passed: false, output: "AssertionError: Base case missing. Recursive traversals must include boundary check statements to exit on null child pointers." };
      }
      break;

    // Debugging key null JSON checks
    case "fix-null-pointer-json":
      if (!code.includes("?") && !code.includes("&&") && !code.includes("address")) {
        return { passed: false, output: "AssertionError: Null pointer safeguard missing. Validate address object existence before accessing nested keys." };
      }
      break;

    // stripe-webhook verification
    case "stripe-webhook":
      if (!codeLower.includes("hmac") || !codeLower.includes("sha256") || !codeLower.includes("300")) {
        return { passed: false, output: "AssertionError: Replay validation error. Missing timestamp validation window check (300 seconds limit) or signature verification algorithm." };
      }
      break;

    // redis-rate-limiter
    case "redis-rate-limiter":
      if (!codeLower.includes("zcard") || !codeLower.includes("zadd") || !codeLower.includes("zrem")) {
        return { passed: false, output: "AssertionError: Missing Redis commands. Sliding window must query ZCARD, add ZADD, and clean ZREMRANGEBYSCORE." };
      }
      break;

    // circuit-breaker
    case "circuit-breaker":
      if (!codeLower.includes("half-open") || !codeLower.includes("open") || !codeLower.includes("closed")) {
        return { passed: false, output: "AssertionError: Invalid states. State machine must maintain CLOSED, OPEN, and HALF-OPEN transition parameters." };
      }
      break;

    // fetch-retry-backoff
    case "fetch-retry-backoff":
      if (!codeLower.includes("retry") || !codeLower.includes("pow") || !codeLower.includes("math.random")) {
        return { passed: false, output: "AssertionError: Backoff stampede risk. Retrying requires exponential backoff delay powered by randomized jitter offsets." };
      }
      break;

    // token-bucket
    case "token-bucket":
      if (!codeLower.includes("refill") || !codeLower.includes("capacity")) {
        return { passed: false, output: "AssertionError: Throttle leak. Compute token replenish rates using timestamps before verifying bucket state limits." };
      }
      break;

    // react-counter
    case "react-counter":
      if (!code.includes("useState") && !code.includes("state")) {
        return { passed: false, output: "AssertionError: State manager missing. Render counters using dynamic state update hooks." };
      }
      break;

    // react-theme-toggle
    case "react-theme-toggle":
      if (!code.includes("localStorage") || !code.includes("className") || !code.includes("document")) {
        return { passed: false, output: "AssertionError: Target toggle missing. Persist theme classes inside localStorage hooks." };
      }
      break;

    // jwt-jwks-verifier
    case "jwt-jwks-verifier":
      if (!codeLower.includes("kid") || !codeLower.includes("exp") || !codeLower.includes("iss")) {
        return { passed: false, output: "AssertionError: Claims validation missing. JWT tokens require key identifier and issuer verify checks." };
      }
      break;

    // validate-bst
    case "validate-bst":
      if (!codeLower.includes("left") || !codeLower.includes("right") || (!codeLower.includes("helper") && !codeLower.includes("validate"))) {
        return { passed: false, output: "AssertionError: Tree traversal error. Validate BST structures recursively checking node key boundaries." };
      }
      break;

    // number-of-islands
    case "number-of-islands":
      if (!codeLower.includes("dfs") && !codeLower.includes("bfs") && !codeLower.includes("grid")) {
        return { passed: false, output: "AssertionError: Graph lookup failed. Run graph searches (DFS/BFS) on land elements flagging visited nodes." };
      }
      break;

    // reverse-linked-list
    case "reverse-linked-list":
    case "reverse-list":
      if (!codeLower.includes("next") || !codeLower.includes("prev")) {
        return { passed: false, output: "AssertionError: Pointer leak. Traverse the linked list updating links to preceding nodes." };
      }
      break;

    // invert-binary-tree
    case "invert-binary-tree":
      if (!codeLower.includes("left") || !codeLower.includes("right") || !codeLower.includes("invert")) {
        return { passed: false, output: "AssertionError: Inversion failed. Swap left and right child pointers recursively." };
      }
      break;

    // course-schedule
    case "course-schedule":
      if (!codeLower.includes("cycle") && !codeLower.includes("dfs") && !codeLower.includes("visited")) {
        return { passed: false, output: "AssertionError: Cycle check missing. Check for circular dependencies in the course prereq graph." };
      }
      break;

    // consistent-hashing-ring
    case "consistent-hashing-ring":
      if (!codeLower.includes("hash") || !codeLower.includes("ring") || !codeLower.includes("replica")) {
        return { passed: false, output: "AssertionError: Ring lookup error. Map node names and client keys to a consistent hashing circle." };
      }
      break;

    // SQL queries
    case "find-duplicate-emails":
    case "delete-duplicate-emails":
    case "employees-earning-more":
    case "department-highest-salary":
    case "rank-scores":
    case "consecutive-numbers":
    case "trips-and-users":
    case "nth-highest-salary":
    case "customers-who-never-order":
      if (!codeLower.includes("select") || !codeLower.includes("from")) {
        return { passed: false, output: "AssertionError: Invalid SQL. Query must contain standard SELECT and FROM statements." };
      }
      break;

    default:
      // Generic code checks for algorithms/debugging/etc.
      if (challenge.category === "Algorithms") {
        if (!codeLower.includes("return") && !codeLower.includes("def") && !codeLower.includes("class")) {
          return { passed: false, output: "AssertionError: Return output statement missing. Implement the logic and return the result." };
        }
      }
  }

  return { passed: true, output: "Verification passed successfully." };
};

function WorkspaceIDE() {
  const router = useRouter();
  const { state, addMatch, toggleTheme } = useStore();

  const renderMessageText = (text: string) => {
    const parts = text.split(/```/g);
    if (parts.length === 1) {
      return <p className="whitespace-pre-wrap">{text}</p>;
    }

    return (
      <div className="flex flex-col gap-2 w-full">
        {parts.map((part, index) => {
          if (index % 2 !== 0) {
            const lines = part.split("\n");
            let language = "";
            let codeContent = part;
            
            if (lines.length > 0 && /^[a-zA-Z0-9#+-]+$/.test(lines[0].trim())) {
              language = lines[0].trim();
              codeContent = lines.slice(1).join("\n");
            }
            
            codeContent = codeContent.trim();
            
            return (
              <div key={index} className="my-2 rounded-lg border border-border bg-inset overflow-hidden flex flex-col font-mono text-xs w-full max-w-full">
                <div className="flex items-center justify-between px-3 py-1.5 bg-surface border-b border-border select-none text-[10px] text-secondary">
                  <span>{language.toUpperCase() || "CODE"}</span>
                  <button
                    onClick={() => {
                      setCode(codeContent);
                      if (editorRef.current) {
                        editorRef.current.setValue(codeContent);
                      }
                    }}
                    className="px-2 py-0.5 rounded border border-border hover:bg-elevated hover:text-foreground text-secondary font-sans font-bold cursor-pointer transition-all"
                  >
                    Apply to Editor
                  </button>
                </div>
                <pre className="p-3 overflow-x-auto text-[13px] leading-relaxed max-w-full whitespace-pre select-text">
                  <code>{codeContent}</code>
                </pre>
              </div>
            );
          } else {
            if (!part.trim()) return null;
            return <p key={index} className="whitespace-pre-wrap">{part}</p>;
          }
        })}
      </div>
    );
  };

  const [challenge, setChallenge] = useState<GeneratedChallenge | null>(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<"instructions" | "hints" | "stack">("instructions");
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "tests">("chat");
  const [inputMessage, setInputMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<"Interviewer" | "Debugger" | "LiveInterviewer" | "Assistant">("Interviewer");
  const [testResults, setTestResults] = useState<{ id: string; name: string; status: "idle" | "running" | "passed" | "failed"; output?: string; isHidden?: boolean }[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [agentMode, setAgentMode] = useState(true);

  useEffect(() => {
    if (!agentMode) {
      setSelectedAgent("Assistant");
    } else {
      setSelectedAgent("Interviewer");
    }
  }, [agentMode]);

  // Rules configuration loaded from setup
  const [aiAssistantActive, setAiAssistantActive] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);
  const [copilotUsageCount, setCopilotUsageCount] = useState(0);

  // Modern IDE states (Phase 1)
  const [fontSize, setFontSize] = useState(15);
  const [consoleTab, setConsoleTab] = useState<"terminal" | "problems">("terminal");
  const [diagnostics, setDiagnostics] = useState<MistakeLog[]>([]);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const liveObservationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastObservedCode = useRef("");

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register Right-Click Context Menu Actions
    editor.addAction({
      id: "explain-selection",
      label: "Develiq AI: Explain Code Selection",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,
      run: (ed: any) => {
        const selectionText = ed.getModel().getValueInRange(ed.getSelection());
        if (selectionText && selectionText.trim()) {
          setSelectedAgent("Interviewer");
          setInputMessage(`Explain this code block:\n\n\`\`\`${challenge?.language || "javascript"}\n${selectionText}\n\`\`\``);
          setActiveRightTab("chat");
        }
      }
    });

    editor.addAction({
      id: "fix-selection",
      label: "Develiq AI: Fix Bugs in Selection",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 2.5,
      run: (ed: any) => {
        const selectionText = ed.getModel().getValueInRange(ed.getSelection());
        if (selectionText && selectionText.trim()) {
          setSelectedAgent("Debugger");
          setInputMessage(`Can you locate any bugs or complexity blunders in this selection and suggest a fix?\n\n\`\`\`${challenge?.language || "javascript"}\n${selectionText}\n\`\`\``);
          setActiveRightTab("chat");
        }
      }
    });
  };

  // Autocomplete provider
  useEffect(() => {
    let completionDisposal: any = null;

    if (monacoRef.current && challenge) {
      const monaco = monacoRef.current;
      const lang = challenge.language.toLowerCase() === "c++" ? "cpp" : challenge.language.toLowerCase();

      completionDisposal = monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: ["/", "a", "s", "v", "r", "m", "c"],
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };

          const suggestions: any[] = [];

          if (challenge.id === "stripe-webhook") {
            suggestions.push({
              label: "verifyWebhookSignature",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: [
                "function verifyWebhook(payload, header, secret) {",
                "  if (!payload || !header || !secret) return false;",
                "  const parts = header.split(',');",
                "  let timestamp = '';",
                "  let signature = '';",
                "  for (const part of parts) {",
                "    if (part.startsWith('t=')) timestamp = part.split('=')[1];",
                "    if (part.startsWith('v1=')) signature = part.split('=')[1];",
                "  }",
                "  if (!timestamp || !signature) return false;",
                "  ",
                "  // Replay prevention guard (300s)",
                "  const nowSeconds = Math.floor(Date.now() / 1000);",
                "  const timestampSec = parseInt(timestamp, 10);",
                "  if (Math.abs(nowSeconds - timestampSec) > 300) return false;",
                "  ",
                "  const signedPayload = timestamp + '.' + payload;",
                "  const expectedSignature = crypto",
                "    .createHmac('sha256', secret)",
                "    .update(signedPayload)",
                "    .digest('hex');",
                "    ",
                "  return signature === expectedSignature;",
                "}"
              ].join("\n"),
              documentation: "Verify Stripe Webhook HMAC signature with replay protection.",
              range: range
            });
          }

          if (challenge.id === "redis-rate-limiter") {
            suggestions.push({
              label: "isAllowedSlidingWindow",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: [
                "async function isAllowed(userId, limit, windowSizeSeconds, redisClient) {",
                "  const now = Date.now();",
                "  const clearBefore = now - (windowSizeSeconds * 1000);",
                "  ",
                "  const pipeline = redisClient.multi();",
                "  pipeline.zremrangebyscore(userId, 0, clearBefore);",
                "  pipeline.zcard(userId);",
                "  pipeline.zadd(userId, now, now.toString());",
                "  ",
                "  const results = await pipeline.exec();",
                "  const activeCount = results[1][1];",
                "  if (activeCount >= limit) {",
                "    await redisClient.zrem(userId, now.toString());",
                "    return false;",
                "  }",
                "  return true;",
                "}"
              ].join("\n"),
              documentation: "Implement atomic Redis multi sliding-window rate limit checks.",
              range: range
            });
          }

          if (challenge.id === "jwt-jwks-verifier") {
            suggestions.push({
              label: "verifyJwtJwksSnippet",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: [
                "function verifyJwtJwks(token, jwksUri, allowedIssuer, allowedAudience) {",
                "  const parts = token.split('.');",
                "  if (parts.length !== 3) return false;",
                "  const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());",
                "  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());",
                "  if (payload.iss !== allowedIssuer || payload.aud !== allowedAudience) return false;",
                "  const nowSeconds = Math.floor(Date.now() / 1000);",
                "  if (payload.exp <= nowSeconds) return false;",
                "  if (!header.kid) return false;",
                "  return true;",
                "}"
              ].join("\n"),
              documentation: "Verify JWT payload claims and extract key identifier.",
              range: range
            });
          }

          if (challenge.id === "fetch-retry-backoff") {
            suggestions.push({
              label: "fetchWithRetrySnippet",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: [
                "async function fetchWithRetry(url, options, maxAttempts, delayMs) {",
                "  let attempt = 0;",
                "  const execute = async () => {",
                "    try {",
                "      const res = await fetch(url, options);",
                "      if (res.status === 429 || res.status >= 500) {",
                "        throw new Error('Server Error ' + res.status);",
                "      }",
                "      return res;",
                "    } catch (err) {",
                "      attempt++;",
                "      if (attempt >= maxAttempts) throw err;",
                "      const backoff = delayMs * Math.pow(2, attempt);",
                "      const jitter = Math.random() * backoff * 0.5;",
                "      await new Promise(resolve => setTimeout(resolve, backoff + jitter));",
                "      return execute();",
                "    }",
                "  };",
                "  return execute();",
                "}"
              ].join("\n"),
              documentation: "Perform fetch wrapper query with exponential backoff and randomized jitter.",
              range: range
            });
          }

          if (challenge.id === "circuit-breaker") {
            suggestions.push({
              label: "CircuitBreakerSnippet",
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: [
                "class CircuitBreaker {",
                "  constructor(action, failureThreshold, cooldownPeriod) {",
                "    this.action = action;",
                "    this.failureThreshold = failureThreshold;",
                "    this.cooldownPeriod = cooldownPeriod;",
                "    this.state = 'CLOSED';",
                "    this.failures = 0;",
                "    this.lastStateChange = Date.now();",
                "  }",
                "  async execute(...args) {",
                "    const now = Date.now();",
                "    if (this.state === 'OPEN') {",
                "      if (now - this.lastStateChange > this.cooldownPeriod * 1000) {",
                "        this.state = 'HALF-OPEN';",
                "        this.lastStateChange = now;",
                "      } else {",
                "        throw new Error('Circuit Open');",
                "      }",
                "    }",
                "    try {",
                "      const result = await this.action(...args);",
                "      if (this.state === 'HALF-OPEN') {",
                "        this.state = 'CLOSED';",
                "        this.failures = 0;",
                "        this.lastStateChange = now;",
                "      }",
                "      return result;",
                "    } catch (err) {",
                "      this.failures++;",
                "      if (this.state === 'HALF-OPEN' || this.failures >= this.failureThreshold) {",
                "        this.state = 'OPEN';",
                "        this.lastStateChange = now;",
                "      }",
                "      throw err;",
                "    }",
                "  }",
                "}"
              ].join("\n"),
              documentation: "Tri-state Circuit Breaker (CLOSED -> OPEN -> HALF-OPEN) logic.",
              range: range
            });
          }

          suggestions.push({
            label: "defensiveGuardCheck",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              "if (!records || records.length === 0) {",
              "  return [];",
              "}"
            ].join("\n"),
            documentation: "Standard safety validator guard checks.",
            range: range
          });

          suggestions.push({
            label: "fastLookupHashMap",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              "const lookup = new Map();",
              "for (const item of items) {",
              "  lookup.set(item.id, item);",
              "}"
            ].join("\n"),
            documentation: "Fast key-value map cache lookup dictionary.",
            range: range
          });

          return { suggestions };
        }
      });
    }

    return () => {
      if (completionDisposal) {
        completionDisposal.dispose();
      }
    };
  }, [monacoRef.current, challenge]);

  // Chess-style annotations manager (Monaco Model decorations)
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const monaco = monacoRef.current;
      const editor = editorRef.current;

      const newDecorations = diagnostics.map((d) => {
        const isStrong = d.type === "strong-move";
        const isExcellent = d.type === "excellent-tradeoff";
        const line = d.line || 1;

        let glyphClass = "monaco-mistake-glyph";
        let inlineClass = state.theme === "light"
          ? "bg-red-50 text-red-700 font-semibold"
          : "bg-red-950/20 text-rose-400";

        if (isStrong) {
          glyphClass = "monaco-strong-move-glyph";
          inlineClass = state.theme === "light"
            ? "bg-blue-50 text-blue-800 font-semibold"
            : "bg-indigo-950/20 text-indigo-400";
        } else if (isExcellent) {
          glyphClass = "monaco-excellent-move-glyph";
          inlineClass = state.theme === "light"
            ? "bg-green-50 text-green-800 font-semibold"
            : "bg-emerald-950/20 text-emerald-400";
        }

        return {
          range: new monaco.Range(line, 1, line, 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: glyphClass,
            className: inlineClass,
            glyphMarginHoverMessage: { value: `**${d.title}**\n\n${d.description}` },
            hoverMessage: { value: `**${d.title}**\n\n${d.description}` }
          }
        };
      });

      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        newDecorations
      );
    }
  }, [diagnostics, state.theme]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const codeRef = useRef("");
  const triggeredLines = useRef<Record<number, boolean>>({});
  const hasTriggeredFirstRun = useRef(false);

  // Initialize and load challenge
  useEffect(() => {
    const saved = sessionStorage.getItem("active_challenge");
    const aiActive = sessionStorage.getItem("ai_assistant_active") !== "false";
    const voice = sessionStorage.getItem("voice_interviewer_active") === "true";

    setAiAssistantActive(aiActive);
    setVoiceActive(voice);

    if (saved) {
      try {
        const parsed: GeneratedChallenge = JSON.parse(saved);
        setChallenge(parsed);
        setCode(parsed.starterCode);
        codeRef.current = parsed.starterCode;

        // Run initial diagnostics scan
        const initialLogs = scanUserCode(parsed.starterCode, parsed.language);
        setDiagnostics(initialLogs);

        // Initialize test results grid
        setTestResults(parsed.testCases.map(tc => ({
          id: tc.id,
          name: tc.input,
          status: "idle",
          isHidden: tc.isHidden
        })));

        // Initial welcome message from named AI Interviewer
        setChatMessages([
          {
            sender: "Interviewer",
            text: `Welcome! I am Hardcore Harry. Today we are doing a level ${parsed.level} practice challenge for the ${parsed.role} role. Please read the description and instructions on the left, check your variables, and explain your initial strategy before coding.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        // Speak initial welcome if voice enabled
        if (voice) {
          speak(`Welcome! I am Hardcore Harry. Today we are doing a level ${parsed.level} practice challenge for the ${parsed.role} role. Please explain your strategy before coding.`);
        }

      } catch (e) {
        console.error(e);
      }
    } else {
      router.push("/dashboard");
    }

    // Set up timer
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (liveObservationTimeoutRef.current) clearTimeout(liveObservationTimeoutRef.current);
    };
  }, [router]);

  // Voice synthesis helper
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Clean markdown structures from string before speaking
      const clean = text.replace(/`[^`]+`/g, "").replace(/\*+/g, "");
      const utterance = new SpeechSynthesisUtterance(clean);
      window.speechSynthesis.cancel(); // Cancel active speeches
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerLiveObservation = async (currentCode: string) => {
    if (!challenge || currentCode === lastObservedCode.current || currentCode.trim() === challenge.starterCode.trim()) return;
    lastObservedCode.current = currentCode;

    try {
      const replyText = await getAgentResponse(
        "LiveInterviewer",
        "[System Live Keystroke Observation Check - The user has paused coding. Observe their solution progress, logic efficiency, and naming choices. Ask a short relevant question or make an observation. Under 2 sentences.]",
        currentCode,
        challenge.description,
        state.geminiApiKey
      );

      const replyMsg: ChatMessage = {
        sender: "LiveInterviewer",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, replyMsg]);
      if (voiceActive) {
        speak(replyText);
      }
    } catch (e) {
      console.error("Live observation error:", e);
    }
  };

  // Observe code changes for triggers
  const handleCodeChange = (value: string | undefined) => {
    const val = value || "";
    setCode(val);
    codeRef.current = val;

    // Local code heuristics scanner (O(N^2) loops, keys lookup, etc.)
    const codeLogs = scanUserCode(val, challenge?.language || "JavaScript");
    setDiagnostics(codeLogs);

    // Live Interviewer Keystroke Observation Check
    if (selectedAgent === "LiveInterviewer" && agentMode) {
      if (liveObservationTimeoutRef.current) {
        clearTimeout(liveObservationTimeoutRef.current);
      }
      liveObservationTimeoutRef.current = setTimeout(() => {
        triggerLiveObservation(val);
      }, 8000);
    }

    // Check if line-count triggers are matched (e.g. prompt Interviewer when they write certain lines of code)
    const lineCount = val.split("\n").length;

    challenge?.triggers.forEach(trig => {
      if (trig.condition === "lines" && typeof trig.value === "number") {
        if (lineCount >= trig.value && !triggeredLines.current[trig.value]) {
          triggeredLines.current[trig.value] = true;

          let mappedAgent: any = trig.agent;
          if (mappedAgent === "Bug Hunter") mappedAgent = "Debugger";

          const newMsg: ChatMessage = {
            sender: mappedAgent as any,
            text: trig.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setChatMessages(prev => [...prev, newMsg]);
          setSelectedAgent(mappedAgent as any);
          setActiveRightTab("chat");

          if (voiceActive) {
            speak(trig.message);
          }
        }
      }
    });
  };

  // Format code in editor using Monaco formatting action or custom fallback
  const handleFormatCode = () => {
    if (editorRef.current) {
      // Trigger Monaco built-in format action
      editorRef.current.trigger("editor-format", "editor.action.formatDocument");
      // Small timeout to let Monaco update, then read back and scan
      setTimeout(() => {
        const val = editorRef.current.getValue() || "";
        setCode(val);
        codeRef.current = val;
        const codeLogs = scanUserCode(val, challenge?.language || "JavaScript");
        setDiagnostics(codeLogs);
      }, 150);
    } else {
      const formatted = formatCodeFallback(code, challenge?.language || "JavaScript");
      setCode(formatted);
      codeRef.current = formatted;
      const codeLogs = scanUserCode(formatted, challenge?.language || "JavaScript");
      setDiagnostics(codeLogs);
    }
  };

  // Send Message to Agent
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !challenge) return;

    const userMsg: ChatMessage = {
      sender: "User",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage("");

    // Simulate Agent typing response
    const activeAgent = selectedAgent;

    const replyText = await getAgentResponse(
      activeAgent,
      inputMessage,
      code,
      challenge.description,
      state.geminiApiKey
    );

    const replyMsg: ChatMessage = {
      sender: activeAgent,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, replyMsg]);

    // Increment Assistant usage count if they ask copilot for help
    if (activeAgent === "Assistant") {
      setCopilotUsageCount(prev => prev + 1);
    }

    if (voiceActive) {
      speak(replyText);
    }
  };

  // Compile and run code simulation
  // Compile and run code simulation
  const handleRunCode = () => {
    if (!challenge) return;

    setTerminalOutput(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] > npm run build --target=${challenge.language.toLowerCase()}`,
      `> Parsing source tree structure... Ok.`,
      `> Lint checks completed. 0 compilation warnings.`,
      `> Executing visible test cases in local runner sandbox...`
    ]);

    // Mark all tests as running
    setTestResults(prev => prev.map(tc => ({ ...tc, status: "running" })));

    setTimeout(() => {
      // Evaluate each test case strictly. Explicitly type the results array to satisfy the testResults state shape.
      const results: {
        id: string;
        name: string;
        status: "passed" | "failed";
        output?: string;
        isHidden?: boolean;
      }[] = challenge.testCases.map(tc => {
        const res = evaluateUserCode(code, challenge, challenge.language, tc);
        // Narrow the status type to the allowed union and include hidden flag
        const status: "passed" | "failed" = res.passed ? "passed" : "failed";
        return {
          id: tc.id,
          name: tc.input,
          status,
          output: res.output,
          // Preserve the hidden flag for each test case to satisfy state shape
          isHidden: tc.isHidden,
        };
      });

      // Update results
      setTestResults(results);

      // Detect runtime errors and trigger Debugger once
      const runtimeError = results.some(r => r.output?.toLowerCase().includes("typeerror") || r.output?.toLowerCase().includes("undefined"));
      if (runtimeError && !hasTriggeredFirstRun.current) {
        hasTriggeredFirstRun.current = true;
        const bugMsg =
          "Aha! Debugger Dan here. Our execution sandbox threw a runtime or crash exception. " +
          "Review your variables, loops, or returns to trace and isolate this error!";
        setChatMessages(prev => [...prev, { sender: "Debugger", text: bugMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setSelectedAgent("Debugger");
        setActiveRightTab("chat");
        if (voiceActive) speak(bugMsg);
      }

      // Build terminal summary: hide details for hidden cases
      setTerminalOutput(prev => {
        const lines = [...prev];
        results.forEach((res, idx) => {
          const tc = challenge.testCases[idx];
          const label = `TC${idx + 1}`;
          const visibility = tc.isHidden ? "hidden" : "visible";
          if (res.status === "passed") {
            lines.push(`✓ ${label} (${visibility}): passed.`);
          } else if (tc.isHidden) {
            lines.push(`✗ ${label} (${visibility}): failed.`);
          } else {
            lines.push(`✗ ${label} (${visibility}): failed: ${res.output}`);
          }
        });
        lines.push(`[Result]: Code executed. Check the Test Case grid for details.`);
        return lines;
      });

      setActiveRightTab("tests");
    }, 1200);
  };

  // Submit Challenge
  const handleSubmit = () => {
    if (!challenge) return;
    const mistakeLogs = scanUserCode(code, challenge.language);

    // Evaluate test cases again to determine pass count
    const results = challenge.testCases.map(tc => evaluateUserCode(code, challenge, challenge.language, tc));
    const passedCount = results.filter(r => r.passed).length;
    const isSuccess = passedCount === challenge.testCases.length;

    const summaryFeedback = isSuccess
      ? "Phenomenal performance! You handled validations beautifully."
      : "Good attempt, but your solution did not pass all the test cases. Double‑check your logic and edge case handling.";

    const matchHistoryItem = {
      id: `match-${Date.now()}`,
      title: challenge.title,
      role: challenge.role,
      level: challenge.level,
      mode: challenge.mode,
      language: challenge.language,
      framework: challenge.framework,
      date: new Date().toISOString().split("T")[0],
      overallScore: isSuccess ? 100 : 50,
      eloChange: 0,
      passedCount: passedCount,
      totalCount: challenge.testCases.length,
      mistakes: mistakeLogs,
      feedback: summaryFeedback,
      ratingBefore: state.rating,
      ratingAfter: state.rating
    };

    addMatch(matchHistoryItem);
    sessionStorage.setItem("last_match_review", JSON.stringify(matchHistoryItem));
    router.push("/review");
  };


  // Submit Challenge

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!challenge) {
    return <div className="min-h-screen bg-[#09090B]" />;
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden selection:bg-zinc-800 selection:text-white">
      {/* IDE Top Status Bar */}
      <header className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <LinkNext href="/dashboard" className="text-secondary hover:text-foreground transition-colors text-base font-semibold">
            ← Dashboard
          </LinkNext>
          <span className="text-border">|</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-foreground">
            {challenge.mode} • {challenge.level}
          </span>
          <span className="text-sm text-secondary font-mono">({challenge.language} / {challenge.framework})</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom controls to increase/decrease font size */}
          <div className="flex items-center gap-1.5 border border-border rounded-lg bg-inset px-2.5 py-1 select-none">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="text-secondary hover:text-foreground text-sm font-bold px-1.5 cursor-pointer transition-colors"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-secondary text-xs font-mono border-x border-border px-2 select-none">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(22, fontSize + 1))}
              className="text-secondary hover:text-foreground text-sm font-bold px-1.5 cursor-pointer transition-colors"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-inset border border-border text-sm font-mono text-foreground font-bold shadow-sm select-none">
            <Clock className="w-4 h-4 text-foreground" />
            {formatTime(timer)}
          </div>
          <button
            onClick={handleRunCode}
            className="h-11 px-6 rounded-xl border border-emerald-500/80 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-extrabold text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-current" /> Run Code
          </button>
          <button
            onClick={handleSubmit}
            className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            Submit Solution <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 border border-border rounded-xl bg-background text-foreground hover:bg-elevated transition-colors cursor-pointer shadow-sm"
            title="Toggle Theme"
          >
            {state.theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Multi-Pane IDE Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Explorer / Problem Instructions */}
        <div className="w-[450px] shrink-0 border-r border-border bg-background flex flex-col select-none">
          {/* Tab selectors */}
          <div className="h-11.5 border-b border-border bg-surface flex text-base font-bold text-secondary">
            <button
              onClick={() => setActiveTab("instructions")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeTab === "instructions" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground cursor-pointer"}`}
            >
              <Info className="w-4 h-4 mr-1.5" /> Brief
            </button>
            <button
              onClick={() => setActiveTab("stack")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeTab === "stack" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground cursor-pointer"}`}
            >
              <Settings className="w-4 h-4 mr-1.5" /> Stack
            </button>
            <button
              onClick={() => setActiveTab("hints")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeTab === "hints" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground cursor-pointer"}`}
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> Hints
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 p-6 overflow-y-auto text-base leading-relaxed flex flex-col gap-6 select-text">
            {activeTab === "instructions" && (
              <div className="flex flex-col gap-5">
                <h2 className="text-3xl font-bold text-foreground tracking-wide border-b border-border pb-2.5">{challenge.title}</h2>
                <div className="text-[17px] text-foreground whitespace-pre-wrap leading-relaxed font-normal">{challenge.description}</div>

                {/* Constraints */}
                {challenge.constraints && challenge.constraints.length > 0 && (
                  <div className="mt-5">
                    <span className="text-sm uppercase font-extrabold text-foreground tracking-widest block mb-2.5">// Constraints</span>
                    <ul className="list-disc pl-5 text-[16px] text-foreground flex flex-col gap-2">
                      {challenge.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {challenge.examples && challenge.examples.length > 0 && (
                  <div className="mt-5">
                    <span className="text-sm uppercase font-extrabold text-foreground tracking-widest block mb-2.5">// Examples</span>
                    <div className="flex flex-col gap-4 font-mono text-[15px]">
                      {challenge.examples.map((ex, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-inset border border-border shadow-sm">
                          <div className="text-foreground font-bold">Input: <span className="text-foreground font-medium">{ex.input}</span></div>
                          <div className="text-foreground font-bold mt-1.5">Output: <span className="text-foreground font-medium">{ex.output}</span></div>
                          {ex.explanation && (
                            <div className="text-foreground/90 italic mt-2 font-sans">// {ex.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "stack" && (
              <div className="flex flex-col gap-5 text-[16.5px]">
                <h3 className="text-xl font-bold text-foreground tracking-wide border-b border-border pb-2.5">Target Stack & Details</h3>
                <div className="flex flex-col gap-4.5">
                  <div className="flex justify-between border-b border-border pb-2.5">
                    <span className="text-foreground font-semibold">Code Language</span>
                    <span className="text-foreground font-mono font-bold">{challenge.language}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2.5">
                    <span className="text-foreground font-semibold">Target Framework</span>
                    <span className="text-foreground font-mono font-bold">{challenge.framework}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2.5">
                    <span className="text-foreground font-semibold">Difficulty</span>
                    <span className="text-foreground font-bold">{challenge.level}</span>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-inset border border-border text-[16.5px] text-foreground mt-5 leading-relaxed shadow-sm">
                  <strong className="text-foreground">Stack Guide:</strong> Implement production-ready validation. Protect against nested scan loops and use memory caches (like Map lookups) to achieve Senior Dev efficiency rankings.
                </div>
              </div>
            )}

            {activeTab === "hints" && (
              <div className="flex flex-col gap-5 text-[16.5px]">
                <h3 className="text-xl font-bold text-foreground tracking-wide border-b border-border pb-2.5">Unlockable Hints</h3>
                {challenge.hints.map((hint, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-border bg-inset shadow-sm flex flex-col gap-2.5">
                    <span className="font-extrabold text-foreground tracking-wider uppercase text-sm">Hint #{idx + 1}</span>
                    <p className="text-[16.5px] text-foreground leading-relaxed font-normal">{hint}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Panel: Editor and Output Console */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Monaco Editor Container */}
          <div className="flex-1 bg-background relative">
            <Editor
              height="100%"
              language={challenge.language.toLowerCase() === "c++" ? "cpp" : challenge.language.toLowerCase()}
              theme={state.theme === "light" ? "light" : "vs-dark"}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: fontSize,
                fontFamily: "Geist Mono, Courier New, monospace",
                minimap: { enabled: true, scale: 0.75 },
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
                folding: true,
                bracketPairColorization: { enabled: true },
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                lineHeight: 22,
                padding: { top: 16 },
                glyphMargin: true,
                suggestOnTriggerCharacters: true,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                }
              }}
            />
          </div>

          {/* Bottom Panel: Output Console & Diagnostics */}
          <div className="h-60 border-t border-border bg-background flex flex-col overflow-hidden select-none">
            <div className="h-9.5 border-b border-border bg-surface px-6 flex items-center justify-between text-sm font-bold text-secondary">
              <div className="flex gap-4 h-full">
                <button
                  onClick={() => setConsoleTab("terminal")}
                  className={`h-full flex items-center gap-1.5 border-b-2 px-1 transition-all ${consoleTab === "terminal" ? "border-foreground text-foreground bg-elevated/10" : "border-transparent hover:text-foreground cursor-pointer"}`}
                >
                  <TermIcon className="w-4 h-4 text-secondary" /> Console Output
                </button>
                <button
                  onClick={() => setConsoleTab("problems")}
                  className={`h-full flex items-center gap-1.5 border-b-2 px-1 transition-all ${consoleTab === "problems" ? "border-foreground text-foreground bg-elevated/10" : "border-transparent hover:text-foreground cursor-pointer"}`}
                >
                  <AlertTriangle className={`w-4 h-4 ${diagnostics.filter(d => d.type !== "strong-move" && d.type !== "excellent-tradeoff").length > 0 ? "text-red animate-pulse" : "text-secondary"}`} />
                  Problems ({diagnostics.filter(d => d.type !== "strong-move" && d.type !== "excellent-tradeoff").length})
                </button>
              </div>

              {consoleTab === "terminal" ? (
                <button
                  onClick={() => setTerminalOutput([])}
                  className="hover:text-foreground transition-colors text-xs cursor-pointer font-sans"
                >
                  Clear Terminal
                </button>
              ) : null}
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-background select-text">
              {consoleTab === "terminal" ? (
                <div className="font-mono text-xs text-secondary flex flex-col gap-1.5">
                  {terminalOutput.length === 0 ? (
                    <span className="italic opacity-60">Terminal idle. Click "Run Code" below to initialize local build sandbox...</span>
                  ) : (
                    terminalOutput.map((line, idx) => (
                      <div key={idx} className={line.startsWith("✗") ? "text-red font-bold" : line.startsWith("✓") ? "text-green font-bold" : ""}>
                        {line}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 font-sans text-sm">
                  {diagnostics.length === 0 ? (
                    <span className="italic opacity-60 text-secondary p-1">No analysis issues detected in your code. Good code quality!</span>
                  ) : (
                    diagnostics.map((d, idx) => {
                      const isGoodMove = d.type === "strong-move" || d.type === "excellent-tradeoff";
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex gap-3 leading-relaxed transition-all ${isGoodMove
                            ? "bg-emerald-500/10 dark:bg-indigo-950/20 border-emerald-500/20 dark:border-indigo-900/40 text-emerald-700 dark:text-indigo-400"
                            : "bg-rose-500/10 dark:bg-red-950/20 border-rose-500/20 dark:border-red-900/40 text-rose-700 dark:text-rose-400"
                            }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isGoodMove ? <Award className="w-4.5 h-4.5" /> : <AlertTriangle className="w-4.5 h-4.5" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold flex items-center justify-between">
                              <span>{d.title}</span>
                              {d.line && <span className="font-mono text-xs opacity-75">Line {d.line}</span>}
                            </div>
                            <div className="text-secondary text-xs mt-0.5">{d.description}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Run button tray */}
            <div className="h-15 border-t border-border bg-surface px-6 flex items-center justify-between select-none">
              <div className="text-xs text-foreground flex items-center gap-2 font-mono font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-green animate-pulse" />
                <span>local-sandbox-node: v19.x</span>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={handleFormatCode}
                  className="px-6 py-2.5 rounded-xl border border-border bg-background text-foreground font-extrabold text-sm hover:bg-elevated transition-all flex items-center gap-1.5 cursor-pointer font-sans shadow-sm"
                >
                  Format Code
                </button>
                <button
                  onClick={handleRunCode}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer font-sans shadow-md"
                >
                  <Play className="w-4 h-4 fill-current text-white" /> Run Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Chat Console and Test Cases */}
        <div className="w-[430px] shrink-0 border-l border-border bg-background flex flex-col overflow-hidden">
          {/* Right tab selectors */}
          <div className="h-11.5 border-b border-border bg-surface flex text-base font-bold text-secondary select-none">
            <button
              onClick={() => setActiveRightTab("chat")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeRightTab === "chat" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground cursor-pointer"}`}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" /> AI Interviewer Chat
            </button>
            <button
              onClick={() => setActiveRightTab("tests")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeRightTab === "tests" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground cursor-pointer"}`}
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> Test Suite
            </button>
          </div>

          {/* Right Panel Body */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {activeRightTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Agent Selector Header */}
                {agentMode ? (
                  <div className="p-3 border-b border-border bg-surface flex gap-1.5 overflow-x-auto select-none no-scrollbar">
                    {Object.keys(AGENT_PROFILES)
                      .filter(a => a !== "Coach" && a !== "Test Runner" && (a !== "Assistant" || aiAssistantActive))
                      .map((agentName) => {
                        const prof = AGENT_PROFILES[agentName];
                        return (
                          <button
                            key={agentName}
                            onClick={() => setSelectedAgent(agentName as any)}
                            className={`px-3.5 py-1.5 rounded-lg border text-sm font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer ${selectedAgent === agentName ? "border-foreground text-foreground bg-elevated" : "border-border text-secondary hover:border-border-muted"}`}
                          >
                            {prof.avatar} {prof.name.split(" ")[0]}
                          </button>
                        );
                      })}
                  </div>
                ) : (
                  <div className="p-3 border-b border-border bg-surface text-xs font-mono text-secondary select-none flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                    <span>Basic AI Coding Chatbot Active</span>
                  </div>
                )}

                {/* Chat Message Stream */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-background select-text">
                  {chatMessages
                    .filter(msg => msg.sender === "User" || AGENT_PROFILES[msg.sender]?.name.startsWith(AGENT_PROFILES[selectedAgent]?.name.split(" ")[0]))
                    .map((msg, idx) => {
                      const isUser = msg.sender === "User";
                      const prof = !isUser ? AGENT_PROFILES[msg.sender] : null;

                      return (
                        <div key={idx} className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
                          <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-secondary select-none">
                            {!isUser && <span>{prof?.avatar} {prof?.name}</span>}
                            {isUser && <span>User</span>}
                            <span>•</span>
                            <span>{msg.time}</span>
                          </div>
                          <div className={`p-3.5 rounded-xl text-[15px] leading-relaxed max-w-[85%] border ${isUser ? "bg-foreground border-foreground text-background rounded-tr-none font-medium" : "bg-surface border-border text-foreground rounded-tl-none font-sans"}`}>
                            {renderMessageText(msg.text)}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Text box input drawer (LeetCode Style Layout) */}
                <div className="p-3.5 border-t border-border bg-surface select-none flex flex-col gap-2.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={agentMode ? `Interact with ${AGENT_PROFILES[selectedAgent]?.name}...` : "Ask a coding question..."}
                      className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-[15px] text-foreground placeholder-muted focus:border-border-active outline-none transition-colors font-sans"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Model selector pill */}
                    <div className="px-3 py-1.5 rounded-full bg-inset border border-border flex items-center gap-1.5 text-xs text-secondary font-mono font-semibold select-none cursor-pointer hover:border-border-muted transition-colors">
                      <span className="w-2 h-2 rounded-full bg-blue" />
                      <span>
                        {state.aiProvider === "built-in" ? "Gemini 2.5 Flash" : 
                         state.aiProvider === "openai" ? `GPT: ${state.aiModel || "gpt-4o"}` :
                         state.aiProvider === "anthropic" ? `Claude: ${state.aiModel || "claude"}` :
                         state.aiProvider === "custom" ? "Custom Agent" : "Gemini 2.5 Flash"}
                      </span>
                    </div>

                    {/* Agent toggle & Send Button */}
                    <div className="flex items-center gap-4.5 select-none">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${agentMode ? "text-blue" : "text-muted"}`}>Agent</span>
                        <button
                          onClick={() => setAgentMode(!agentMode)}
                          className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 relative focus:outline-none ${agentMode ? "bg-blue" : "bg-inset border border-border"}`}
                        >
                          <span className={`w-5 h-5 rounded-full bg-foreground shadow-md block transform duration-300 ${agentMode ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>

                      <button
                        onClick={handleSendMessage}
                        className="w-8.5 h-8.5 rounded-lg bg-foreground hover:opacity-90 transition-colors flex items-center justify-center text-background cursor-pointer shrink-0 shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === "tests" && (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                <span className="text-base font-extrabold uppercase tracking-wider text-foreground select-none">Assertions Results</span>
                <div className="flex flex-col gap-3.5">
                  {testResults.map((tc, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-inset flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-foreground font-bold">TC #{idx + 1}: {tc.isHidden ? "Hidden Test Case" : tc.name}</span>
                        {tc.status === "idle" && <span className="text-sm text-foreground/80 font-bold select-none">Idle</span>}
                        {tc.status === "running" && <span className="text-sm text-foreground/80 font-bold animate-pulse select-none">Running...</span>}
                        {tc.status === "passed" && <span className="text-base text-green font-extrabold select-none">✓ Passed</span>}
                        {tc.status === "failed" && <span className="text-base text-red font-extrabold select-none">✗ Failed</span>}
                      </div>
                      {tc.output && (
                        <div className="p-3 rounded-lg bg-background font-mono text-sm text-foreground select-text border border-border">
                          {tc.isHidden && tc.status === "failed" ? "AssertionError: Hidden test case failed." : tc.output}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback basic indentation formatter for offline use cases
function formatCodeFallback(code: string, language: string): string {
  if (!code) return "";
  const lines = code.split("\n");
  let indentLevel = 0;

  const formattedLines = lines.map(line => {
    let trimmed = line.trim();
    if (!trimmed) return "";

    // Decrease indentation if line starts with a closing brace
    if (trimmed.startsWith("}") || trimmed.startsWith("]") || trimmed.startsWith(")")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indent = "  ".repeat(indentLevel);
    const result = indent + trimmed;

    // Increase indentation if line ends with an opening brace
    if (trimmed.endsWith("{") || trimmed.endsWith("[") || trimmed.endsWith("(")) {
      indentLevel++;
    }

    return result;
  });

  return formattedLines.join("\n");
}
