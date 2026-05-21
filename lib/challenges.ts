export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expected: string;
  isHidden: boolean;
}

export interface AgentTrigger {
  id: string;
  condition: "time" | "lines" | "run" | "submit";
  value: number | string;
  agent: "Interviewer" | "Reviewer" | "Test Runner" | "Bug Hunter" | "Coach" | "Assistant";
  message: string;
}

export interface GeneratedChallenge {
  id: string;
  title: string;
  description: string;
  role: string;
  level: string;
  language: string;
  framework: string;
  mode: string;
  difficultyRating: number;
  starterCode: string;
  solutionTemplate: string;
  constraints: string[];
  examples: Example[];
  testCases: TestCase[];
  hints: string[];
  triggers: AgentTrigger[];
}

// Map user career levels to ELO ratings
export const getEloForLevel = (level: string): number => {
  switch (level) {
    case "Beginner": return 550;
    case "Intern": return 850;
    case "New Grad": return 1150;
    case "Junior Dev": return 1450;
    case "Intermediate": return 1750;
    case "Senior Dev": return 2050;
    case "Fellow / Grandmaster": return 2350;
    default: return 1000;
  }
};

/**
 * Dynamic Local Generator
 * Uses parameters to weave infinitely unique challenges when Gemini API Key is not set.
 */
const generateLocalProceduralChallenge = (
  role: string,
  level: string,
  language: string,
  framework: string,
  mode: string
): GeneratedChallenge => {
  const seed = Math.floor(Math.random() * 1000000);
  const difficultyElo = getEloForLevel(level);

  // List of nouns, verbs, and variables to create random variations
  const collections = ["UserList", "OrderQueue", "PaymentBatch", "LogStream", "MetricBuffer", "TaskScheduler"];
  const actions = ["filterAndSort", "processRecords", "validatePayload", "analyzeTelemetry", "transformDataSet"];
  const parameters = ["status", "priority", "createdBefore", "minAmount", "maxLatency", "retryCount"];

  const entity = collections[seed % collections.length];
  const operation = actions[(seed >> 1) % actions.length];
  const param = parameters[(seed >> 2) % parameters.length];

  let title = "";
  let description = "";
  let starterCode = "";
  let solutionTemplate = "";
  let constraints: string[] = [];
  let examples: Example[] = [];
  let testCases: TestCase[] = [];
  let hints: string[] = [];
  let triggers: AgentTrigger[] = [];

  // Customize based on Mode
  if (mode === "Coding Arena" || mode === "Real Interview" || mode === "AI-Assisted Interview") {
    title = `${role} Prep: Optimize ${entity} ${operation}`;
    description = `In the context of a modern ${framework} application, you are tasked with implementing the core service logic to **${operation}** for a high-volume **${entity}**. 
    
The data items are shaped as objects containing fields like \`id\` (string), \`value\` (number), and \`tag\` (string). You must filter records where the parameter \`${param}\` matches the given arguments, sorting them in descending order by priority and values.

Additionally, explain how you would scale this lookup as input sizes approach 10 million elements, considering memory constraints and index layouts.`;

    starterCode = getStarterCode(language, operation, param);
    solutionTemplate = getSolutionCode(language, operation, param);

    constraints = [
      "Time complexity must be better than O(N log N) for frequent queries.",
      "Must return an empty container/array when inputs are null or empty.",
      "Do not mutate the original input array."
    ];

    examples = [
      {
        input: `items = [{id: "1", val: 120, status: "active"}, {id: "2", val: 50, status: "pending"}], queryVal = "active"`,
        output: `[{id: "1", val: 120, status: "active"}]`,
        explanation: "Filters out status pending and returns sorted active item."
      }
    ];

    testCases = [
      { id: "tc1", input: "standard items matching status", expected: "matched and sorted", isHidden: false },
      { id: "tc2", input: "empty array check", expected: "empty array", isHidden: false },
      { id: "tc3", input: "all items filtered out", expected: "empty array", isHidden: true },
      { id: "tc4", input: "null check boundary condition", expected: "empty array", isHidden: true }
    ];

    hints = [
      "Consider using a linear-scan filter followed by an optimized quicksort or counting sort.",
      "Check boundary arguments before accessing indices."
    ];

    triggers = [
      {
        id: "tr1",
        condition: "lines",
        value: 4,
        agent: "Interviewer",
        message: `I notice you are writing your filtering logic. Before you go further, can you explain your chosen data structures and their space/time tradeoffs?`
      },
      {
        id: "tr2",
        condition: "run",
        value: "first",
        agent: "Bug Hunter",
        message: `I spotted that your check at line 3 does not handle null inputs. What happens if the test runner passes a null array?`
      },
      {
        id: "tr3",
        condition: "submit",
        value: "final",
        agent: "Coach",
        message: `Nicely done! Let's analyze your rating changes and review your strong decisions and critical omissions.`
      }
    ];
  } else if (mode === "Real-World Task") {
    title = `Real-World Task: Debug failing ${framework} ${entity} API`;
    description = `Your team recently deployed a microservice endpoint to perform **${operation}** on **${entity}**, but it is crashing under load. 
    
The logs indicate a severe bug:
\`\`\`text
TypeError: Cannot read properties of undefined (reading 'map')
    at ${operation} (index.js:14:24)
\`\`\`

Review the starter code, identify where the boundary exception occurs, correct it, add full query-parameter validation, and handle error scenarios gracefully returning a 400 Bad Request status.`;

    starterCode = getStarterCode(language, operation, param, true); // bugged version
    solutionTemplate = getSolutionCode(language, operation, param);

    constraints = [
      "Must not crash on malformed payloads.",
      "Return specific validation errors when payload is missing parameters.",
      "Include a mock log output simulating production warning monitors."
    ];

    examples = [
      {
        input: `payload = undefined`,
        output: `Error 400: Malformed input`,
        explanation: "Input body is undefined, throwing appropriate validation block."
      }
    ];

    testCases = [
      { id: "tc1", input: "valid structure input", expected: "200 Success status code", isHidden: false },
      { id: "tc2", input: "undefined input body", expected: "400 Error payload validation", isHidden: false },
      { id: "tc3", input: "empty array inside payload", expected: "200 Success with clean message", isHidden: true }
    ];

    hints = [
      "Verify if input is truthy before accessing attributes.",
      "Use robust defensive guards like try/catch around JSON parsing."
    ];

    triggers = [
      {
        id: "tr1",
        condition: "lines",
        value: 3,
        agent: "Bug Hunter",
        message: `Ah, yes! Look closely at the function arguments. Are we absolutely sure the input object is never null?`
      },
      {
        id: "tr2",
        condition: "time",
        value: 120, // 2 minutes
        agent: "Interviewer",
        message: `How would you write a regression unit test to ensure this specific crash never happens in production again?`
      }
    ];
  } else if (mode === "System Design") {
    title = `System Design: Scalable ${entity} Distributed Architecture`;
    description = `Design a fault-tolerant, highly available, and distributed architecture for matching, processing, and caching **${entity}** updates in real-time.
    
**System Requirements:**
1. Support up to 500,000 requests per second write-load.
2. Under 50ms read latency for hot data caches.
3. High availability with multi-region replication.
4. Support role-based permission locks.

In the editor, draft a detailed architecture overview, outlining services, storage nodes, caching layers, message queues, database schemas, and explain how you will prevent race conditions.`;

    starterCode = `# System Design Architecture: Scalable ${entity} Coordinator

## 1. High-Level Architecture Overview
<!-- Outline your services, queues, and gateways here -->

## 2. Data Storage & Cache Schema
<!-- Define database tables/keys and caching logic here -->

## 3. Scalability & Availability Strategy
<!-- Detail multi-region setups, sharding, and write-load queuing -->
`;
    solutionTemplate = starterCode + "\n// Fully fleshed out architecture draft";
    constraints = [
      "Must detail cache invalidation strategy.",
      "Must address split-brain scenarios in distributed database clusters."
    ];
    examples = [];
    testCases = [
      { id: "tc1", input: "High-level design outline", expected: "Passed core structures", isHidden: false },
      { id: "tc2", input: "Database sharding policy", expected: "Clear sharding keys explained", isHidden: false }
    ];
    hints = ["Consider Redis Sentinel clusters for microsecond lookups.", "Use Apache Kafka to ingest high-frequency stream records."];
    triggers = [
      {
        id: "tr1",
        condition: "time",
        value: 60,
        agent: "Interviewer",
        message: `Nice start! If the Redis caching tier completely crashes, how does your database protect itself from a stampede/cascade failure?`
      }
    ];
  } else if (mode === "Behavioral Interview") {
    title = `Behavioral: Handling Conflict & Scale for ${role}`;
    description = `In this behavioral round, simulate a high-pressure interview context. 

**Prompt:**
*"Tell me about a time you worked on a critical feature (like implementing a ${operation} engine for ${entity}) where a major dispute arose between engineering and product managers concerning scaling trade-offs or release timelines. How did you resolve the deadlock, what metrics did you share, and what was the ultimate result?"*

Draft your response inside the editor using the **STAR Method** (Situation, Task, Action, Result).`;

    starterCode = `# Behavioral Response (STAR Method)

## Situation
<!-- Describe the context and feature scope -->

## Task
<!-- What was your immediate responsibility and the core dispute? -->

## Action
<!-- What did you specifically do to research, align teams, and execute? -->

## Result
<!-- Quantified outcome (e.g. ELO, latency, shipped timeline) -->
`;
    solutionTemplate = starterCode;
    constraints = ["Must detail specific communication actions.", "Include quantifiable results."];
    examples = [];
    testCases = [{ id: "tc1", input: "STAR structure usage", expected: "Proper method formatting", isHidden: false }];
    hints = ["Be candid. Share what you learned and how you'd act differently today."];
    triggers = [
      {
        id: "tr1",
        condition: "time",
        value: 90,
        agent: "Interviewer",
        message: `Excellent. In your Action section, how did you handle the engineering team's morale when shifting timelines?`
      }
    ];
  } else {
    // Hackathon Sprint
    title = `Hackathon Sprint: DevElo ${role} MVP Checklist`;
    description = `Build a proof-of-concept MVP for a student productivity hub integrating a customized **${entity}** tracker. 
    
**Your Sprint Objective:**
1. Create a checklist of core features (OAuth, dashboard, custom tracker).
2. Write a functional React/Node component outline showcasing dynamic state filtering.
3. Detail your final pitch strategy and slide layout.`;

    starterCode = `# Hackathon Project: ${entity} Productivity Hub

## 1. MVP Feature Scope
- [ ] User OAuth
- [ ] Filterable Tracker Listing
- [ ] Analytics Widget

## 2. Core Functional Interface
// Implement your React widget below
`;
    solutionTemplate = starterCode;
    constraints = ["Must draft a reusable component.", "Sprint time limit: 2 hours simulated."];
    examples = [];
    testCases = [{ id: "tc1", input: "Sprint objectives listed", expected: "Passed MVP metrics", isHidden: false }];
    hints = ["Focus on an extremely clean, high-impact demonstration."];
    triggers = [
      {
        id: "tr1",
        condition: "time",
        value: 60,
        agent: "Coach",
        message: `Looking great! Halfway through the sprint. Have you drafted the final presentation slides outline yet?`
      }
    ];
  }

  return {
    id: `dynamic-${seed}`,
    title,
    description,
    role,
    level,
    language,
    framework,
    mode,
    difficultyRating: difficultyElo,
    starterCode,
    solutionTemplate,
    constraints,
    examples,
    testCases,
    hints,
    triggers
  };
};

function getStarterCode(lang: string, op: string, param: string, withBug = false): string {
  if (lang === "JavaScript" || lang === "TypeScript") {
    if (withBug) {
      return `/**
 * Core utility to ${op} based on ${param}.
 * Note: Investigating a production TypeCrash bug here.
 */
function ${op}(records, ${param}Val) {
  // BUG: records might be undefined or null under load
  const filtered = records.filter(item => item.${param} === ${param}Val);
  
  return filtered.sort((a, b) => b.priority - a.priority);
}`;
    }
    return `/**
 * Core utility to ${op} based on ${param}.
 */
function ${op}(records, ${param}Val) {
  // Handle empty bounds and check params
  if (!records || !Array.isArray(records)) {
    return [];
  }
  
  // TODO: Implement filters and optimized sort descending
  
  return [];
}`;
  } else if (lang === "Python") {
    return `def ${op}(records, ${param}_val):
    """
    Core utility to ${op} based on ${param}_val.
    """
    if not records:
        return []
        
    # TODO: Implement optimized selection logic
    return []`;
  } else if (lang === "SQL") {
    return `-- Write your SQL query to retrieve and sort active records
SELECT id, value, tag
FROM ${op}_table
WHERE ${param} = 'active'
-- TODO: Group, filter, and sort descending
;`;
  } else {
    // Java/C++ fallback
    return `public class Solution {
    public List<Record> ${op}(List<Record> records, String ${param}Val) {
        // Implement filtering and sorting
        return new ArrayList<>();
    }
}`;
  }
}

function getSolutionCode(lang: string, op: string, param: string): string {
  if (lang === "JavaScript" || lang === "TypeScript") {
    return `function ${op}(records, ${param}Val) {
  if (!records || !Array.isArray(records)) {
    return [];
  }
  return records
    .filter(item => item && item.${param} === ${param}Val)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}`;
  } else if (lang === "Python") {
    return `def ${op}(records, ${param}_val):
    if not records:
        return []
    filtered = [r for r in records if r and r.get("${param}") == ${param}_val]
    return sorted(filtered, key=lambda x: x.get("priority", 0), reverse=True)`;
  } else if (lang === "SQL") {
    return `SELECT id, value, tag
FROM ${op}_table
WHERE ${param} = 'active'
ORDER BY priority DESC, value DESC;`;
  } else {
    return `// Optimized Java / C++ complete implementation`;
  }
}

/**
 * Main Dynamic AI Challenge Generation Entrypoint
 * Communicates with Gemini API if key is supplied, else falls back to robust local procedural engine.
 */
export const generateChallenge = async (
  role: string,
  level: string,
  language: string,
  framework: string,
  mode: string,
  apiKey?: string
): Promise<GeneratedChallenge> => {
  if (!apiKey) {
    // Return high-fidelity local procedural challenge
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateLocalProceduralChallenge(role, level, language, framework, mode));
      }, 800); // Small delay to feel like a real network load
    });
  }

  // Real Gemini LLM Call!
  try {
    const elo = getEloForLevel(level);
    const systemPrompt = `You are a strict, top-tier tech lead AI generator for the "DevElo" practice platform.
Create a highly professional, unique developer task matching:
Role: ${role}
Career Level: ${level} (Target ELO: ${elo})
Language: ${language}
Framework/Stack: ${framework}
Practice Mode: ${mode}

Return ONLY a valid, parseable JSON object matching this TypeScript interface exactly:
{
  "id": "gemini-[randomString]",
  "title": "[Engaging descriptive title]",
  "description": "[Deep, multi-paragraph markdown details with clear objectives, realistic context, and explanation requests]",
  "role": "${role}",
  "level": "${level}",
  "language": "${language}",
  "framework": "${framework}",
  "mode": "${mode}",
  "difficultyRating": ${elo},
  "starterCode": "[Starter code template with comments]",
  "solutionTemplate": "[Complete working reference solution code]",
  "constraints": ["[Constraint 1]", "[Constraint 2]"],
  "examples": [{"input": "[input value]", "output": "[output]", "explanation": "[why]"}],
  "testCases": [
    {"id": "tc1", "input": "[input description]", "expected": "[outcome]", "isHidden": false},
    {"id": "tc2", "input": "[boundary]", "expected": "[safe exit]", "isHidden": true}
  ],
  "hints": ["Hint 1", "Hint 2"],
  "triggers": [
    {"id": "tr1", "condition": "lines", "value": 4, "agent": "Interviewer", "message": "[Context-aware question about their start]"},
    {"id": "tr2", "condition": "run", "value": "first", "agent": "Bug Hunter", "message": "[Check boundary error warning]"},
    {"id": "tr3", "condition": "submit", "value": "final", "agent": "Coach", "message": "[Review guidelines summary]"}
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) throw new Error("Empty content in Gemini response");

    const parsed: GeneratedChallenge = JSON.parse(jsonText);
    return parsed;
  } catch (err) {
    console.error("Gemini failed, falling back to local engine:", err);
    return generateLocalProceduralChallenge(role, level, language, framework, mode);
  }
};
