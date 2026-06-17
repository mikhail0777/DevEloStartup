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
  sender: "User" | "Interviewer" | "Reviewer" | "Test Runner" | "Bug Hunter" | "Assistant";
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

function WorkspaceIDE() {
  const router = useRouter();
  const { state, addMatch, toggleTheme } = useStore();

  const [challenge, setChallenge] = useState<GeneratedChallenge | null>(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<"instructions" | "hints" | "stack">("instructions");
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "tests">("chat");
  const [inputMessage, setInputMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<"Interviewer" | "Bug Hunter" | "Reviewer" | "Assistant">("Interviewer");
  const [testResults, setTestResults] = useState<{ id: string; name: string; status: "idle" | "running" | "passed" | "failed"; output?: string }[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  
  // Rules configuration loaded from setup
  const [aiAssistantActive, setAiAssistantActive] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);
  const [copilotUsageCount, setCopilotUsageCount] = useState(0);

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

        // Initialize test results grid
        setTestResults(parsed.testCases.map(tc => ({
          id: tc.id,
          name: tc.input,
          status: "idle"
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

  // Observe code changes for triggers
  const handleCodeChange = (value: string | undefined) => {
    const val = value || "";
    setCode(val);
    codeRef.current = val;

    // Local code heuristics scanner (O(N^2) loops, keys lookup, etc.)
    const codeLogs = scanUserCode(val, challenge?.language || "JavaScript");
    
    // Check if line-count triggers are matched (e.g. prompt Interviewer when they write certain lines of code)
    const lineCount = val.split("\n").length;
    
    challenge?.triggers.forEach(trig => {
      if (trig.condition === "lines" && typeof trig.value === "number") {
        if (lineCount >= trig.value && !triggeredLines.current[trig.value]) {
          triggeredLines.current[trig.value] = true;
          
          const newMsg: ChatMessage = {
            sender: trig.agent as any,
            text: trig.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setChatMessages(prev => [...prev, newMsg]);
          setSelectedAgent(trig.agent as any);
          setActiveRightTab("chat");

          if (voiceActive) {
            speak(trig.message);
          }
        }
      }
    });
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
  const handleRunCode = () => {
    if (!challenge) return;

    setTerminalOutput(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] > npm run build --target=${challenge.language.toLowerCase()}`,
      `> Parsing source tree structure... Ok.`,
      `> Lint checks completed. 0 compilation warnings.`,
      `> Executing visible test cases in local runner sandbox...`
    ]);

    setTestResults(prev => prev.map(tc => ({ ...tc, status: "running" })));

    setTimeout(() => {
      // Dynamic local compiler assertions - scans code contents for solutions
      const codeLower = code.toLowerCase();
      const hasGuards = codeLower.includes("if") && (codeLower.includes("null") || codeLower.includes("array") || codeLower.includes("records") || codeLower.includes("len") || codeLower.includes("empty"));
      const isCorrectSolution = codeLower.includes("filter") || codeLower.includes("def") || codeLower.includes("select") || codeLower.length > challenge.starterCode.length + 30;

      setTestResults(prev => prev.map((tc, idx) => {
        let passed = true;
        let outputMessage = "Verification passed successfully.";

        // TC2 is empty array guard
        if (tc.id === "tc2" && !hasGuards) {
          passed = false;
          outputMessage = "AssertionError: Expected empty array, got TypeError: Cannot read properties of undefined (reading 'filter')";
        }

        if (tc.id === "tc1" && !isCorrectSolution) {
          passed = false;
          outputMessage = "AssertionError: Expected sorted collection, got un-modified container";
        }

        return {
          ...tc,
          status: passed ? "passed" : "failed",
          output: outputMessage
        };
      }));

      // Trigger Bug Hunter interruption on failed runs
      if (!hasGuards && !hasTriggeredFirstRun.current) {
        hasTriggeredFirstRun.current = true;
        
        const bugMsg = "Aha! Edge-Case Ethan here. Our test runner crashed on malformed array inputs. The compiler threw a crash exception because the records parameter is undefined in line 4. Fix this safety block immediately!";
        setChatMessages(prev => [
          ...prev,
          {
            sender: "Bug Hunter",
            text: bugMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setSelectedAgent("Bug Hunter");
        setActiveRightTab("chat");
        
        if (voiceActive) speak(bugMsg);
      }

      setTerminalOutput(prev => [
        ...prev,
        `✓ TC1 (visible): passed.`,
        hasGuards ? `✓ TC2 (visible): passed.` : `✗ TC2 (visible): failed with runtime exception.`,
        `✓ TC3 (hidden): completed.`,
        `[Result]: Code executed. Check the Test Case grid for details.`
      ]);

      setActiveRightTab("tests");
    }, 1200);
  };

  // Submit Challenge & ELO adjustments
  const handleSubmit = () => {
    if (!challenge) return;

    // Scan the user's code to determine the Chess mistake logs
    const mistakeLogs = scanUserCode(code, challenge.language);

    // Calculate dynamic ELO changes using proportional chess formulas
    // Easy problems give less ELO if user's rating is high
    const challengeDifficulty = challenge.difficultyRating;
    const userRating = state.rating;
    
    const expectedScore = 1 / (1 + Math.pow(10, (challengeDifficulty - userRating) / 400));
    
    // Determine actual score based on compiler checks and mistakes
    const hasGuards = code.toLowerCase().includes("if");
    const failedTests = !hasGuards ? 2 : 0;
    const passedCount = challenge.testCases.length - failedTests;
    const isSuccess = passedCount === challenge.testCases.length;
    
    const baseScore = isSuccess ? 90 : 60;
    const penaltyCount = mistakeLogs.filter(x => x.type !== "strong-move" && x.type !== "excellent-tradeoff").length;
    const actualScorePercentage = Math.max(10, Math.min(100, baseScore - (penaltyCount * 8) - (copilotUsageCount * 5)));
    
    const actualScore = actualScorePercentage / 100;
    const ELO_K = 40; // Chess K-factor
    const eloChange = Math.round(ELO_K * (actualScore - expectedScore));
    
    const ratingAfter = Math.max(100, userRating + eloChange);

    // Dynamic coach text
    const summaryFeedback = isSuccess 
      ? `Phenomenal performance! You handled index validations beautifully. Earned +${eloChange} ELO rating gains.`
      : `Decent work, but your solution missed empty input checks. Review Clean-Code Carl's annotations to improve.`;

    const matchHistoryItem = {
      id: `match-${Date.now()}`,
      title: challenge.title,
      role: challenge.role,
      level: challenge.level,
      mode: challenge.mode,
      language: challenge.language,
      framework: challenge.framework,
      date: new Date().toISOString().split("T")[0],
      overallScore: actualScorePercentage,
      eloChange: eloChange,
      passedCount: passedCount,
      totalCount: challenge.testCases.length,
      mistakes: mistakeLogs,
      feedback: summaryFeedback,
      ratingBefore: userRating,
      ratingAfter: ratingAfter
    };

    // Commit to persistent localStorage
    addMatch(matchHistoryItem);

    // Store temporary item to render immediately on review screen
    sessionStorage.setItem("last_match_review", JSON.stringify(matchHistoryItem));
    router.push("/review");
  };

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
      <header className="h-12 border-b border-border bg-surface px-6 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <LinkNext href="/dashboard" className="text-secondary hover:text-foreground transition-colors text-sm">
            ← Dashboard
          </LinkNext>
          <span className="text-border">|</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {challenge.mode} • {challenge.level}
          </span>
          <span className="text-xs text-secondary font-mono">({challenge.language} / {challenge.framework})</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-inset border border-border text-xs font-mono text-secondary">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            {formatTime(timer)}
          </div>
          <button 
            onClick={handleSubmit}
            className="h-8 px-4 rounded-lg bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            Submit Solution <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 border border-border rounded-lg bg-background text-foreground hover:bg-elevated transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {state.theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Multi-Pane IDE Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Explorer / Problem Instructions */}
        <div className="w-96 border-r border-border bg-background flex flex-col select-none">
          {/* Tab selectors */}
          <div className="h-10 border-b border-border bg-surface flex text-xs font-bold text-secondary">
            <button 
              onClick={() => setActiveTab("instructions")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeTab === "instructions" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground"}`}
            >
              <Info className="w-3.5 h-3.5 mr-1.5" /> Brief
            </button>
            <button 
              onClick={() => setActiveTab("stack")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeTab === "stack" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground"}`}
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" /> Stack
            </button>
            <button 
              onClick={() => setActiveTab("hints")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeTab === "hints" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground"}`}
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1.5" /> Hints
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 p-6 overflow-y-auto text-sm leading-relaxed flex flex-col gap-6">
            {activeTab === "instructions" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-foreground tracking-wide border-b border-border pb-2">{challenge.title}</h2>
                <div className="text-xs text-secondary whitespace-pre-wrap">{challenge.description}</div>

                {/* Constraints */}
                {challenge.constraints && challenge.constraints.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Constraints</span>
                    <ul className="list-disc pl-4 text-xs text-secondary flex flex-col gap-1.5">
                      {challenge.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {challenge.examples && challenge.examples.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Examples</span>
                    <div className="flex flex-col gap-3 font-mono text-xs">
                      {challenge.examples.map((ex, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg bg-inset border border-border">
                          <div className="text-foreground">Input: <span className="text-secondary">{ex.input}</span></div>
                          <div className="text-foreground mt-1">Output: <span className="text-secondary">{ex.output}</span></div>
                          {ex.explanation && (
                            <div className="text-secondary italic mt-1.5 opacity-80">// {ex.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "stack" && (
              <div className="flex flex-col gap-4 text-xs">
                <h3 className="text-sm font-bold text-foreground tracking-wide border-b border-border pb-2">Target Stack & Details</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-secondary">Code Language</span>
                    <span className="text-foreground font-mono">{challenge.language}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-secondary">Target Framework</span>
                    <span className="text-foreground font-mono">{challenge.framework}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-secondary">Benchmark Rating</span>
                    <span className="text-foreground font-bold">{challenge.difficultyRating} ELO</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-inset border border-border text-secondary mt-4 leading-relaxed">
                  <strong className="text-foreground">Stack Guide:</strong> Implement production-ready validation. Protect against nested scan loops and use memory caches (like Map lookups) to achieve Senior Dev efficiency rankings.
                </div>
              </div>
            )}

            {activeTab === "hints" && (
              <div className="flex flex-col gap-4 text-xs">
                <h3 className="text-sm font-bold text-foreground tracking-wide border-b border-border pb-2">Unlockable Hints</h3>
                {challenge.hints.map((hint, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-inset flex flex-col gap-2">
                    <span className="font-bold text-foreground tracking-wider uppercase text-[10px]">Hint #{idx + 1}</span>
                    <p className="text-secondary leading-relaxed">{hint}</p>
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
              options={{
                fontSize: 13,
                fontFamily: "Geist Mono, Courier New, monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 16 }
              }}
            />
          </div>

          {/* Bottom Panel: Output Console */}
          <div className="h-56 border-t border-border bg-background flex flex-col overflow-hidden select-none">
            <div className="h-8 border-b border-border bg-surface px-6 flex items-center justify-between text-xs font-bold text-secondary">
              <div className="flex items-center gap-2">
                <TermIcon className="w-3.5 h-3.5 text-secondary" /> Output Console
              </div>
              <button 
                onClick={() => setTerminalOutput([])}
                className="hover:text-foreground transition-colors text-[10px] cursor-pointer"
              >
                Clear Terminal
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] text-secondary bg-background flex flex-col gap-1 select-text">
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

            {/* Run button tray */}
            <div className="h-12 border-t border-border bg-surface px-6 flex items-center justify-end select-none">
              <button 
                onClick={handleRunCode}
                className="px-4 py-1.5 rounded-lg border border-border bg-background text-foreground font-bold text-xs hover:bg-elevated transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-foreground fill-current" /> Run Code
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Chat Console and Test Cases */}
        <div className="w-96 border-l border-border bg-background flex flex-col overflow-hidden">
          {/* Right tab selectors */}
          <div className="h-10 border-b border-border bg-surface flex text-xs font-bold text-secondary select-none">
            <button 
              onClick={() => setActiveRightTab("chat")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeRightTab === "chat" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground"}`}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> AI Interviewer Chat
            </button>
            <button 
              onClick={() => setActiveRightTab("tests")}
              className={`flex-1 h-full flex items-center justify-center border-b-2 transition-all ${activeRightTab === "tests" ? "border-foreground text-foreground bg-elevated/30" : "border-transparent hover:text-foreground"}`}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Test Suite
            </button>
          </div>

          {/* Right Panel Body */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {activeRightTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden">
            {/* Agent Selector Header */}
            <div className="p-3 border-b border-border bg-surface flex gap-1.5 overflow-x-auto select-none no-scrollbar">
              {Object.keys(AGENT_PROFILES)
                .filter(a => a !== "Coach" && a !== "Test Runner" && (a !== "Assistant" || aiAssistantActive))
                .map((agentName) => {
                  const prof = AGENT_PROFILES[agentName];
                  return (
                    <button
                      key={agentName}
                      onClick={() => setSelectedAgent(agentName as any)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer ${selectedAgent === agentName ? "border-foreground text-foreground bg-elevated" : "border-border text-secondary hover:border-border-muted"}`}
                    >
                      {prof.avatar} {prof.name.split(" ")[0]}
                    </button>
                  );
                })}
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-background select-text">
              {chatMessages
                .filter(msg => msg.sender === "User" || AGENT_PROFILES[msg.sender]?.name.startsWith(AGENT_PROFILES[selectedAgent]?.name.split(" ")[0]))
                .map((msg, idx) => {
                  const isUser = msg.sender === "User";
                  const prof = !isUser ? AGENT_PROFILES[msg.sender] : null;

                  return (
                    <div key={idx} className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-secondary select-none">
                        {!isUser && <span>{prof?.avatar} {prof?.name}</span>}
                        {isUser && <span>User</span>}
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] border ${isUser ? "bg-foreground border-foreground text-background rounded-tr-none font-medium" : "bg-surface border-border text-foreground rounded-tl-none font-sans"}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Text box input drawer */}
            <div className="p-3 border-t border-border bg-surface flex gap-2 select-none">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Reply to ${AGENT_PROFILES[selectedAgent]?.name}...`}
                className="flex-1 bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground placeholder-muted focus:border-border-muted outline-none transition-colors"
              />
              <button
                onClick={handleSendMessage}
                className="w-8 h-8 rounded-lg bg-foreground hover:opacity-90 transition-colors flex items-center justify-center text-background cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
              </div>
            )}

            {activeRightTab === "tests" && (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary select-none">Assertions Results</span>
                <div className="flex flex-col gap-3">
                  {testResults.map((tc, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-inset flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-secondary">TC #{idx + 1}: {tc.name}</span>
                        {tc.status === "idle" && <span className="text-xs text-secondary font-semibold select-none">Idle</span>}
                        {tc.status === "running" && <span className="text-xs text-secondary font-semibold animate-pulse select-none">Running...</span>}
                        {tc.status === "passed" && <span className="text-xs text-green font-semibold select-none">✓ Passed</span>}
                        {tc.status === "failed" && <span className="text-xs text-red font-semibold select-none">✗ Failed</span>}
                      </div>
                      {tc.output && (
                        <div className="p-2.5 rounded-lg bg-background font-mono text-[10px] text-secondary select-text border border-border">
                          {tc.output}
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
