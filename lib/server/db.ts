import { promises as fs } from "fs";
import path from "path";
import os from "os";

export interface UserProgress {
  xp: number;
  streak: number;
  streakDates: string[];
  rating: number;
  offerReadiness: number;
  unlockedBadges: string[];
  completedLevels: string[];
  history: unknown[];
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  subscription: "free" | "pro" | "enterprise" | null;
  progress: UserProgress;
  aiProvider?: "built-in" | "gemini" | "openai" | "anthropic" | "custom" | null;
  aiModel?: string | null;
  aiApiKey?: string | null;
  aiEndpoint?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseShape {
  users: StoredUser[];
}

const dataDir = process.env.NODE_ENV === "production"
  ? path.join(os.tmpdir(), "develiq-data")
  : path.join(process.cwd(), ".data");
const dbPath = path.join(dataDir, "users.json");

export const defaultProgress = (): UserProgress => ({
  xp: 0,
  streak: 0,
  streakDates: [],
  rating: 1000,
  offerReadiness: 0,
  unlockedBadges: [],
  completedLevels: [],
  history: [],
});

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ users: [] }, null, 2), "utf8");
  }
}

export async function readDb(): Promise<DatabaseShape> {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as DatabaseShape;
}

export async function writeDb(db: DatabaseShape) {
  await ensureDb();
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

export function publicUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    subscription: user.subscription,
    progress: user.progress,
    aiProvider: user.aiProvider || "built-in",
    aiModel: user.aiModel || "",
    aiApiKey: user.aiApiKey || "",
    aiEndpoint: user.aiEndpoint || "",
    createdAt: user.createdAt,
  };
}

export async function findUserByEmail(email: string) {
  const db = await readDb();
  const normalizedEmail = email.trim().toLowerCase();
  return db.users.find((user) => user.email === normalizedEmail) || null;
}

export async function findUserById(id: string) {
  const db = await readDb();
  return db.users.find((user) => user.id === id) || null;
}
