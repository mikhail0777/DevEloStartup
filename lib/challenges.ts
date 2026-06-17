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
    title = `Hackathon Sprint: Develiq ${role} MVP Checklist`;
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
    const systemPrompt = `You are a strict, top-tier tech lead AI generator for the "Develiq" practice platform.
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

export interface ChallengeDefinition {
  id: string;
  title: string;
  category: "Algorithms" | "Debugging" | "SQL" | "Frontend" | "System Design";
  difficulty: "Easy" | "Medium" | "Hard";
  elo: number;
  description: string;
  constraints: string[];
  examples: Example[];
  hints: string[];
  templates: Record<string, {
    starterCode: string;
    solutionTemplate: string;
    testCases: TestCase[];
  }>;
}

export const CHALLENGES_DATABASE: ChallengeDefinition[] = [
  {
    id: "hello-develiq",
    title: "Hello Develiq!",
    category: "Algorithms",
    difficulty: "Easy",
    elo: 100,
    description: "Write a function `greet()` that returns the exact string `'Hello, Develiq!'`. This is your first challenge to test compiling outputs.",
    constraints: [
      "Must return exactly 'Hello, Develiq!' with correct capitalization and punctuation.",
      "Must not take any arguments."
    ],
    examples: [
      { input: "greet()", output: "'Hello, Develiq!'", explanation: "Returns the platform welcome message." }
    ],
    hints: [
      "Make sure you include the comma and the exclamation mark at the end.",
      "Just return the static string directly."
    ],
    templates: {
      JavaScript: {
        starterCode: `function greet() {\n  // TODO: Return 'Hello, Develiq!'\n  return "";\n}`,
        solutionTemplate: `function greet() {\n  return "Hello, Develiq!";\n}`,
        testCases: [
          { id: "tc1", input: "greet()", expected: "Hello, Develiq!", isHidden: false }
        ]
      },
      TypeScript: {
        starterCode: `export function greet(): string {\n  // TODO: Return 'Hello, Develiq!'\n  return "";\n}`,
        solutionTemplate: `export function greet(): string {\n  return "Hello, Develiq!";\n}`,
        testCases: [
          { id: "tc1", input: "greet()", expected: "Hello, Develiq!", isHidden: false }
        ]
      },
      Python: {
        starterCode: `def greet() -> str:\n    # TODO: Return 'Hello, Develiq!'\n    return ""`,
        solutionTemplate: `def greet() -> str:\n    return "Hello, Develiq!"`,
        testCases: [
          { id: "tc1", input: "greet()", expected: "Hello, Develiq!", isHidden: false }
        ]
      },
      Java: {
        starterCode: `public class Solution {\n    public String greet() {\n        // TODO: Return 'Hello, Develiq!'\n        return "";\n    }\n}`,
        solutionTemplate: `public class Solution {\n    public String greet() {\n        return "Hello, Develiq!";\n    }\n}`,
        testCases: [
          { id: "tc1", input: "new Solution().greet()", expected: "Hello, Develiq!", isHidden: false }
        ]
      },
      SQL: {
        starterCode: `-- Write a query that yields a column named 'greeting' containing 'Hello, Develiq!'\nSELECT '' AS greeting;`,
        solutionTemplate: `SELECT 'Hello, Develiq!' AS greeting;`,
        testCases: [
          { id: "tc1", input: "Query result", expected: "Hello, Develiq!", isHidden: false }
        ]
      }
    }
  },
  {
    id: "sum-of-two",
    title: "Sum of Two Numbers",
    category: "Algorithms",
    difficulty: "Easy",
    elo: 200,
    description: "Write a function `sum(a, b)` that takes two numbers and returns their mathematical sum.",
    constraints: [
      "Inputs are numbers/integers.",
      "Works with negative numbers and zero."
    ],
    examples: [
      { input: "sum(5, 7)", output: "12" },
      { input: "sum(-3, 4)", output: "1" }
    ],
    hints: [
      "Use the plus (+) operator to combine the two arguments.",
      "Return the result directly."
    ],
    templates: {
      JavaScript: {
        starterCode: `function sum(a, b) {\n  // TODO: Return sum of a and b\n  return 0;\n}`,
        solutionTemplate: `function sum(a, b) {\n  return a + b;\n}`,
        testCases: [
          { id: "tc1", input: "sum(5, 7)", expected: "12", isHidden: false },
          { id: "tc2", input: "sum(-3, 4)", expected: "1", isHidden: true }
        ]
      },
      TypeScript: {
        starterCode: `export function sum(a: number, b: number): number {\n  return 0;\n}`,
        solutionTemplate: `export function sum(a: number, b: number): number {\n  return a + b;\n}`,
        testCases: [
          { id: "tc1", input: "sum(5, 7)", expected: "12", isHidden: false },
          { id: "tc2", input: "sum(-3, 4)", expected: "1", isHidden: true }
        ]
      },
      Python: {
        starterCode: `def sum(a: int, b: int) -> int:\n    return 0`,
        solutionTemplate: `def sum(a: int, b: int) -> int:\n    return a + b`,
        testCases: [
          { id: "tc1", input: "sum(5, 7)", expected: "12", isHidden: false },
          { id: "tc2", input: "sum(-3, 4)", expected: "1", isHidden: true }
        ]
      },
      Java: {
        starterCode: `public class Solution {\n    public int sum(int a, int b) {\n        return 0;\n    }\n}`,
        solutionTemplate: `public class Solution {\n    public int sum(int a, int b) {\n        return a + b;\n    }\n}`,
        testCases: [
          { id: "tc1", input: "sum(5, 7)", expected: "12", isHidden: false },
          { id: "tc2", input: "sum(-3, 4)", expected: "1", isHidden: true }
        ]
      },
      SQL: {
        starterCode: `-- Return the sum of columns a and b\nSELECT 0 AS result;`,
        solutionTemplate: `SELECT a + b AS result FROM values_table;`,
        testCases: [
          { id: "tc1", input: "sum columns", expected: "passed", isHidden: false }
        ]
      }
    }
  },
  {
    id: "even-or-odd",
    title: "Even or Odd Checks",
    category: "Algorithms",
    difficulty: "Easy",
    elo: 350,
    description: "Write a function `isEven(n)` that returns `true` if `n` is even, and `false` if it is odd.",
    constraints: [
      "Inputs are integers.",
      "Can receive negative values."
    ],
    examples: [
      { input: "isEven(4)", output: "true" },
      { input: "isEven(7)", output: "false" }
    ],
    hints: [
      "Use the modulo (%) operator to check remainder when dividing by 2."
    ],
    templates: {
      JavaScript: {
        starterCode: `function isEven(n) {\n  return false;\n}`,
        solutionTemplate: `function isEven(n) {\n  return n % 2 === 0;\n}`,
        testCases: [
          { id: "tc1", input: "isEven(4)", expected: "true", isHidden: false },
          { id: "tc2", input: "isEven(7)", expected: "false", isHidden: false },
          { id: "tc3", input: "isEven(-2)", expected: "true", isHidden: true }
        ]
      },
      TypeScript: {
        starterCode: `export function isEven(n: number): boolean {\n  return false;\n}`,
        solutionTemplate: `export function isEven(n: number): boolean {\n  return n % 2 === 0;\n}`,
        testCases: [
          { id: "tc1", input: "isEven(4)", expected: "true", isHidden: false },
          { id: "tc2", input: "isEven(7)", expected: "false", isHidden: false }
        ]
      },
      Python: {
        starterCode: `def is_even(n: int) -> bool:\n    return False`,
        solutionTemplate: `def is_even(n: int) -> bool:\n    return n % 2 == 0`,
        testCases: [
          { id: "tc1", input: "is_even(4)", expected: "True", isHidden: false },
          { id: "tc2", input: "is_even(7)", expected: "False", isHidden: false }
        ]
      },
      Java: {
        starterCode: `public class Solution {\n    public boolean isEven(int n) {\n        return false;\n    }\n}`,
        solutionTemplate: `public class Solution {\n    public boolean isEven(int n) {\n        return n % 2 == 0;\n    }\n}`,
        testCases: [
          { id: "tc1", input: "isEven(4)", expected: "true", isHidden: false },
          { id: "tc2", input: "isEven(7)", expected: "false", isHidden: false }
        ]
      },
      SQL: {
        starterCode: `-- Check if n column is even (return 'even' or 'odd')\nSELECT 'even' AS label;`,
        solutionTemplate: `SELECT CASE WHEN n % 2 = 0 THEN 'even' ELSE 'odd' END AS label FROM numbers;`,
        testCases: [
          { id: "tc1", input: "even check", expected: "passed", isHidden: false }
        ]
      }
    }
  },
  {
    id: "find-max",
    title: "Find Maximum Element",
    category: "Algorithms",
    difficulty: "Easy",
    elo: 500,
    description: "Write a function `findMax(arr)` that finds the maximum value inside a numerical array. Return `null` (or None) if the array is empty.",
    constraints: [
      "The array may contain positive and negative decimal numbers.",
      "Should handle empty array inputs."
    ],
    examples: [
      { input: "findMax([1, 5, 3])", output: "5" },
      { input: "findMax([])", output: "null" }
    ],
    hints: [
      "Initialize a maximum variable to the first element or a small value, then iterate.",
      "Don't forget to write a defensive guard for empty arrays."
    ],
    templates: {
      JavaScript: {
        starterCode: `function findMax(arr) {\n  // TODO: Return maximum or null\n  return null;\n}`,
        solutionTemplate: `function findMax(arr) {\n  if (!arr || arr.length === 0) return null;\n  return Math.max(...arr);\n}`,
        testCases: [
          { id: "tc1", input: "findMax([1, 5, 3])", expected: "5", isHidden: false },
          { id: "tc2", input: "findMax([])", expected: "null", isHidden: false },
          { id: "tc3", input: "findMax([-10, -5, -20])", expected: "-5", isHidden: true }
        ]
      },
      TypeScript: {
        starterCode: `export function findMax(arr: number[]): number | null {\n  return null;\n}`,
        solutionTemplate: `export function findMax(arr: number[]): number | null {\n  if (!arr || arr.length === 0) return null;\n  return Math.max(...arr);\n}`,
        testCases: [
          { id: "tc1", input: "findMax([1, 5, 3])", expected: "5", isHidden: false },
          { id: "tc2", input: "findMax([])", expected: "null", isHidden: false }
        ]
      },
      Python: {
        starterCode: `from typing import List, Optional\n\ndef find_max(arr: List[int]) -> Optional[int]:\n    return None`,
        solutionTemplate: `from typing import List, Optional\n\ndef find_max(arr: List[int]) -> Optional[int]:\n    if not arr:\n        return None\n    return max(arr)`,
        testCases: [
          { id: "tc1", input: "find_max([1, 5, 3])", expected: "5", isHidden: false },
          { id: "tc2", input: "find_max([])", expected: "None", isHidden: false }
        ]
      },
      Java: {
        starterCode: `public class Solution {\n    public Integer findMax(int[] arr) {\n        return null;\n    }\n}`,
        solutionTemplate: `public class Solution {\n    public Integer findMax(int[] arr) {\n        if (arr == null || arr.length == 0) return null;\n        int max = arr[0];\n        for (int val : arr) {\n            if (val > max) max = val;\n        }\n        return max;\n    }\n}`,
        testCases: [
          { id: "tc1", input: "findMax(new int[]{1, 5, 3})", expected: "5", isHidden: false }
        ]
      },
      SQL: {
        starterCode: `-- Find the highest value from scores table\nSELECT 0 AS max_score;`,
        solutionTemplate: `SELECT MAX(score) AS max_score FROM scores;`,
        testCases: [
          { id: "tc1", input: "max aggregation", expected: "passed", isHidden: false }
        ]
      }
    }
  },
  {
    id: "two-sum",
    title: "Two Sum Indices",
    category: "Algorithms",
    difficulty: "Easy",
    elo: 800,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "Must run faster than O(N^2) using a hash map lookup.",
      "Cannot reuse the same element at the same index."
    ],
    examples: [
      { input: "twoSum([2, 7, 11, 15], 9)", output: "[0, 1]", explanation: "nums[0] + nums[1] == 9, so return [0, 1]" }
    ],
    hints: [
      "Use a hash map to map each value to its index.",
      "For each element, check if (target - num) exists in the map."
    ],
    templates: {
      JavaScript: {
        starterCode: `function twoSum(nums, target) {\n  // TODO: Return array of indices [idx1, idx2]\n  return [];\n}`,
        solutionTemplate: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
        testCases: [
          { id: "tc1", input: "twoSum([2, 7, 11, 15], 9)", expected: "[0,1]", isHidden: false },
          { id: "tc2", input: "twoSum([3, 2, 4], 6)", expected: "[1,2]", isHidden: false }
        ]
      },
      TypeScript: {
        starterCode: `export function twoSum(nums: number[], target: number): number[] {\n  return [];\n}`,
        solutionTemplate: `export function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
        testCases: [
          { id: "tc1", input: "twoSum([2, 7, 11, 15], 9)", expected: "[0,1]", isHidden: false }
        ]
      },
      Python: {
        starterCode: `from typing import List\n\ndef two_sum(nums: List[int], target: int) -> List[int]:\n    return []`,
        solutionTemplate: `from typing import List\n\ndef two_sum(nums: List[int], target: int) -> List[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
        testCases: [
          { id: "tc1", input: "two_sum([2, 7, 11, 15], 9)", expected: "[0, 1]", isHidden: false }
        ]
      },
      Java: {
        starterCode: `import java.util.HashMap;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}`,
        solutionTemplate: `import java.util.HashMap;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                return new int[]{map.get(comp), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
        testCases: [
          { id: "tc1", input: "twoSum(new int[]{2, 7, 11, 15}, 9)", expected: "[0, 1]", isHidden: false }
        ]
      },
      SQL: {
        starterCode: `-- Retrieve indices matching target 9\nSELECT 0 AS idx1, 0 AS idx2;`,
        solutionTemplate: `SELECT a.idx AS idx1, b.idx AS idx2 FROM nums a JOIN nums b ON a.val + b.val = 9 AND a.idx < b.idx;`,
        testCases: [
          { id: "tc1", input: "two sum match", expected: "passed", isHidden: false }
        ]
      }
    }
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    category: "Algorithms",
    difficulty: "Easy",
    elo: 950,
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid. An input string is valid if brackets close in the correct order and types match up.",
    constraints: [
      "Length of s is up to 10^4.",
      "Time complexity must be O(N)."
    ],
    examples: [
      { input: "isValid('()')", output: "true" },
      { input: "isValid('([)]')", output: "false" }
    ],
    hints: [
      "Use a Stack data structure to track opening brackets.",
      "Pop from the stack when matching a closing bracket and compare."
    ],
    templates: {
      JavaScript: {
        starterCode: `function isValid(s) {\n  return false;\n}`,
        solutionTemplate: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
        testCases: [
          { id: "tc1", input: "isValid('()')", expected: "true", isHidden: false },
          { id: "tc2", input: "isValid('([)]')", expected: "false", isHidden: false },
          { id: "tc3", input: "isValid('{[()]}')", expected: "true", isHidden: true }
        ]
      },
      TypeScript: {
        starterCode: `export function isValid(s: string): boolean {\n  return false;\n}`,
        solutionTemplate: `export function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
        testCases: [
          { id: "tc1", input: "isValid('()')", expected: "true", isHidden: false }
        ]
      },
      Python: {
        starterCode: `def is_valid(s: str) -> bool:\n    return False`,
        solutionTemplate: `def is_valid(s: str) -> bool:\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in pairs.values():\n            stack.append(char)\n        elif char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n    return len(stack) == 0`,
        testCases: [
          { id: "tc1", input: "is_valid('()')", expected: "True", isHidden: false }
        ]
      },
      Java: {
        starterCode: `import java.util.Stack;\n\npublic class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}`,
        solutionTemplate: `import java.util.Stack;\n\npublic class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') {\n                stack.push(c);\n            } else {\n                if (stack.isEmpty()) return false;\n                char open = stack.pop();\n                if (c == ')' && open != '(') return false;\n                if (c == '}' && open != '{') return false;\n                if (c == ']' && open != '[') return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}`,
        testCases: [
          { id: "tc1", input: "isValid(\"()\")", expected: "true", isHidden: false }
        ]
      },
      SQL: {
        starterCode: `-- Return validity check for nested brackets (hard fallback in SQL)\nSELECT true AS is_valid;`,
        solutionTemplate: `SELECT true AS is_valid;`,
        testCases: [
          { id: "tc1", input: "stack valid", expected: "passed", isHidden: false }
        ]
      }
    }
  },
  {
    id: "aggregate-revenue",
    title: "SQL aggregate: Active Customers Revenue",
    category: "SQL",
    difficulty: "Easy",
    elo: 850,
    description: "Write an SQL query to retrieve the sum of payments from customers who have an active account status, grouped by customer ID.",
    constraints: [
      "Group results by customer_id.",
      "Filter only active statuses."
    ],
    examples: [],
    hints: [
      "Use SUM(payment_amount) aggregate and WHERE status = 'active'.",
      "GROUP BY customer_id at the end."
    ],
    templates: {
      SQL: {
        starterCode: `-- Write SQL aggregate query below\nSELECT customer_id, 0 AS total_payments\nFROM payments\nWHERE 1=0;`,
        solutionTemplate: `SELECT customer_id, SUM(payment_amount) AS total_payments\nFROM payments\nWHERE status = 'active'\nGROUP BY customer_id;`,
        testCases: [
          { id: "tc1", input: "grouped aggregates", expected: "passed", isHidden: false }
        ]
      },
      JavaScript: {
        starterCode: `function getActiveRevenue(records) {\n  return [];\n}`,
        solutionTemplate: `function getActiveRevenue(records) {\n  const res = {};\n  records.filter(r => r.status === 'active').forEach(r => {\n    res[r.customer_id] = (res[r.customer_id] || 0) + r.payment_amount;\n  });\n  return Object.keys(res).map(k => ({ customer_id: k, total_payments: res[k] }));\n}`,
        testCases: [
          { id: "tc1", input: "getActiveRevenue([{customer_id:'c1',status:'active',payment_amount:10}])", expected: "[{customer_id:'c1',total_payments:10}]", isHidden: false }
        ]
      },
      TypeScript: {
        starterCode: `export function getActiveRevenue(records: any[]): any[] {\n  return [];\n}`,
        solutionTemplate: `export function getActiveRevenue(records: any[]): any[] {\n  const res: Record<string, number> = {};\n  records.filter(r => r.status === 'active').forEach(r => {\n    res[r.customer_id] = (res[r.customer_id] || 0) + r.payment_amount;\n  });\n  return Object.keys(res).map(k => ({ customer_id: k, total_payments: res[k] }));\n}`,
        testCases: [
          { id: "tc1", input: "revenue items", expected: "passed", isHidden: false }
        ]
      },
      Python: {
        starterCode: `def get_active_revenue(records: list) -> list:\n    return []`,
        solutionTemplate: `def get_active_revenue(records: list) -> list:\n    res = {}\n    for r in records:\n        if r.get('status') == 'active':\n            cid = r.get('customer_id')\n            res[cid] = res.get(cid, 0) + r.get('payment_amount', 0)\n    return [{'customer_id': k, 'total_payments': v} for k, v in res.items()]`,
        testCases: [
          { id: "tc1", input: "revenue items", expected: "passed", isHidden: false }
        ]
      },
      Java: {
        starterCode: `import java.util.*;\n\npublic class Solution {\n    public List<Map<String, Object>> getActiveRevenue(List<Map<String, Object>> records) {\n        return new ArrayList<>();\n    }\n}`,
        solutionTemplate: `import java.util.*;\n\npublic class Solution {\n    public List<Map<String, Object>> getActiveRevenue(List<Map<String, Object>> records) {\n        Map<String, Double> map = new HashMap<>();\n        for (Map<String, Object> r : records) {\n            if ("active".equals(r.get("status"))) {\n                String cid = (String) r.get("customer_id");\n                double val = (Double) r.get("payment_amount");\n                map.put(cid, map.getOrDefault(cid, 0.0) + val);\n            }\n        }\n        List<Map<String, Object>> res = new ArrayList<>();\n        for (String key : map.keySet()) {\n            Map<String, Object> row = new HashMap<>();\n            row.put("customer_id", key);\n            row.put("total_payments", map.get(key));\n            res.add(row);\n        }\n        return res;\n    }\n}`,
        testCases: [
          { id: "tc1", input: "revenue items", expected: "passed", isHidden: false }
        ]
      }
    }
  },
  {
    id: "use-cart-hook",
    title: "React State Custom useCart Hook",
    category: "Frontend",
    difficulty: "Medium",
    elo: 1450,
    description: "Create a React state custom hook `useCart` that supports adding, removing, and clearing items in an e-commerce cart. The hook should return `cartItems` array, `addToCart(item)`, `removeFromCart(itemId)`, and `clearCart()` methods.",
    constraints: [
      "Must use standard React state Hooks.",
      "Must update quantity if item already exists."
    ],
    examples: [],
    hints: [
      "State should be an array of objects: { id, name, price, quantity }.",
      "Map array item IDs to check if they already exist before adding."
    ],
    templates: {
      JavaScript: {
        starterCode: `import { useState } from 'react';\n\nexport function useCart() {\n  // TODO: Implement e-commerce cart state hook\n  return {\n    cartItems: [],\n    addToCart: () => {},\n    removeFromCart: () => {},\n    clearCart: () => {}\n  };\n}`,
        solutionTemplate: `import { useState } from 'react';\n\nexport function useCart() {\n  const [cartItems, setCartItems] = useState([]);\n\n  const addToCart = (item) => {\n    setCartItems((prev) => {\n      const existing = prev.find((x) => x.id === item.id);\n      if (existing) {\n        return prev.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));\n      }\n      return [...prev, { ...item, quantity: 1 }];\n    });\n  };\n\n  const removeFromCart = (itemId) => {\n    setCartItems((prev) => prev.filter((x) => x.id !== itemId));\n  };\n\n  const clearCart = () => {\n    setCartItems([]);\n  };\n\n  return { cartItems, addToCart, removeFromCart, clearCart };\n}`,
        testCases: [
          { id: "tc1", input: "hook initialization", expected: "passed", isHidden: false }
        ]
      },
      TypeScript: {
        starterCode: `import { useState } from 'react';\n\nexport interface CartItem {\n  id: string;\n  name: string;\n  price: number;\n  quantity: number;\n}\n\nexport function useCart() {\n  return {\n    cartItems: [] as CartItem[],\n    addToCart: (item: any) => {},\n    removeFromCart: (itemId: string) => {},\n    clearCart: () => {}\n  };\n}`,
        solutionTemplate: `import { useState } from 'react';\n\nexport interface CartItem {\n  id: string;\n  name: string;\n  price: number;\n  quantity: number;\n}\n\nexport function useCart() {\n  const [cartItems, setCartItems] = useState<CartItem[]>([]);\n\n  const addToCart = (item: Omit<CartItem, 'quantity'>) => {\n    setCartItems((prev) => {\n      const existing = prev.find((x) => x.id === item.id);\n      if (existing) {\n        return prev.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));\n      }\n      return [...prev, { ...item, quantity: 1 }];\n    });\n  };\n\n  const removeFromCart = (itemId: string) => {\n    setCartItems((prev) => prev.filter((x) => x.id !== itemId));\n  };\n\n  const clearCart = () => {\n    setCartItems([]);\n  };\n\n  return { cartItems, addToCart, removeFromCart, clearCart };\n}`,
        testCases: [
          { id: "tc1", input: "hook initialization", expected: "passed", isHidden: false }
        ]
      },
      Python: {
        starterCode: `# Simulate cart state class in Python\nclass Cart:\n    def __init__(self):\n        self.items = []\n    def add_to_cart(self, item):\n        pass\n    def remove_from_cart(self, item_id):\n        pass\n    def clear_cart(self):\n        pass`,
        solutionTemplate: `class Cart:\n    def __init__(self):\n        self.items = []\n    def add_to_cart(self, item):\n        for x in self.items:\n            if x['id'] == item['id']:\n                x['quantity'] += 1\n                return\n        self.items.append({**item, 'quantity': 1})\n    def remove_from_cart(self, item_id):\n        self.items = [x for x in self.items if x['id'] != item_id]\n    def clear_cart(self):\n        self.items = []`,
        testCases: [
          { id: "tc1", input: "cart actions", expected: "passed", isHidden: false }
        ]
      },
      Java: {
        starterCode: `import java.util.*;\n\npublic class Cart {\n    public List<Map<String, Object>> items = new ArrayList<>();\n    public void addToCart(Map<String, Object> item) {}\n    public void removeFromCart(String itemId) {}\n    public void clearCart() {}\n}`,
        solutionTemplate: `import java.util.*;\n\npublic class Cart {\n    public List<Map<String, Object>> items = new ArrayList<>();\n    public void addToCart(Map<String, Object> item) {\n        for (Map<String, Object> x : items) {\n            if (x.get("id").equals(item.get("id"))) {\n                int q = (Integer) x.get("quantity");\n                x.put("quantity", q + 1);\n                return;\n            }\n        }\n        Map<String, Object> newItem = new HashMap<>(item);\n        newItem.put("quantity", 1);\n        items.add(newItem);\n    }\n    public void removeFromCart(String itemId) {\n        items.removeIf(x -> x.get("id").equals(itemId));\n    }\n    public void clearCart() {\n        items.clear();\n    }\n}`,
        testCases: [
          { id: "tc1", input: "cart items", expected: "passed", isHidden: false }
        ]
      }
    }
  },
  {
    id: "lru-cache",
    title: "LRU Cache Implementation",
    category: "Algorithms",
    difficulty: "Hard",
    elo: 2000,
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class:\n\n* `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n* `get(int key)` Return the value of the key if key exists, otherwise return -1.\n* `put(int key, int value)` Update key value if key exists. Otherwise, add key-value pair. If keys exceed capacity, evict the least recently used key.",
    constraints: [
      "Both get and put operations must run in O(1) time complexity.",
      "Capacity is a positive integer."
    ],
    examples: [],
    hints: [
      "Use a combination of a Doubly Linked List and a Hash Map.",
      "The Map maps keys to nodes in the Linked List. Moving node to head makes it recently used."
    ],
    templates: {
      JavaScript: {
        starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n  }\n  get(key) {\n    return -1;\n  }\n  put(key, value) {\n  }\n}`,
        solutionTemplate: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const lruKey = this.cache.keys().next().value;\n      this.cache.delete(lruKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
        testCases: [
          { id: "tc1", input: "put and get sequence", expected: "passed", isHidden: false }
        ]
      },
      TypeScript: {
        starterCode: `export class LRUCache {\n  constructor(capacity: number) {}\n  get(key: number): number {\n    return -1;\n  }\n  put(key: number, value: number): void {}\n}`,
        solutionTemplate: `export class LRUCache {\n  private capacity: number;\n  private cache: Map<number, number>;\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key: number): number {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const lruKey = this.cache.keys().next().value;\n      this.cache.delete(lruKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
        testCases: [
          { id: "tc1", input: "cache operations", expected: "passed", isHidden: false }
        ]
      },
      Python: {
        starterCode: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass`,
        solutionTemplate: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)`,
        testCases: [
          { id: "tc1", input: "cache operations", expected: "passed", isHidden: false }
        ]
      },
      Java: {
        starterCode: `import java.util.LinkedHashMap;\n\npublic class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
        solutionTemplate: `import java.util.LinkedHashMap;\nimport java.util.Map;\n\npublic class LRUCache {\n    private LinkedHashMap<Integer, Integer> map;\n    private final int capacity;\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {\n            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n                return size() > LRUCache.this.capacity;\n            }\n        };\n    }\n    public int get(int key) {\n        return map.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        map.put(key, value);\n    }\n}`,
        testCases: [
          { id: "tc1", input: "cache operations", expected: "passed", isHidden: false }
        ]
      }
    }
  }
];

export const getCareerRankForElo = (elo: number): string => {
  if (elo < 700) return "Beginner / Intro";
  if (elo < 1000) return "Intern";
  if (elo < 1300) return "New Grad";
  if (elo < 1600) return "Junior Dev";
  if (elo < 1900) return "Intermediate";
  if (elo < 2200) return "Senior Dev";
  return "Fellow / Grandmaster";
};

export const buildChallengeFromDefinition = (
  defn: ChallengeDefinition,
  language: string,
  framework: string,
  mode: string
): GeneratedChallenge => {
  const templates = defn.templates || {};
  const langConfig = templates[language] || templates["JavaScript"] || Object.values(templates)[0];

  const triggers: AgentTrigger[] = [
    {
      id: "tr1",
      condition: "lines",
      value: 4,
      agent: "Interviewer",
      message: "I notice you are writing your solutions. Explain how you analyze constraints and bounds validation."
    },
    {
      id: "tr2",
      condition: "run",
      value: "first",
      agent: "Bug Hunter",
      message: "Running compiled check... Look out for index exceptions and empty conditions!"
    },
    {
      id: "tr3",
      condition: "submit",
      value: "final",
      agent: "Coach",
      message: "Submission processed! Reviewing ELO updates and unlocking badges."
    }
  ];

  return {
    id: defn.id,
    title: defn.title,
    description: defn.description,
    role: "Developer",
    level: getCareerRankForElo(defn.elo),
    language,
    framework,
    mode,
    difficultyRating: defn.elo,
    starterCode: langConfig?.starterCode || "",
    solutionTemplate: langConfig?.solutionTemplate || "",
    constraints: defn.constraints || [],
    examples: defn.examples || [],
    testCases: langConfig?.testCases || [],
    hints: defn.hints || [],
    triggers: triggers
  };
};
