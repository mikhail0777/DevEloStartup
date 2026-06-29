import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/server/auth";
import { publicUser, readDb, writeDb } from "@/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    const userId = getSessionUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const body = await request.json();
    const plan = String(body.plan || "").trim().toLowerCase();

    if (plan !== "free" && plan !== "pro" && plan !== "premium") {
      return NextResponse.json({ error: "Invalid plan specified." }, { status: 400 });
    }

    const db = await readDb();
    const userIndex = db.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    // Cast the plan appropriately to match database types (free | pro | enterprise | null)
    // Note: Premium tier map to enterprise or we can support pro/premium in db.ts
    // Let's modify db.ts or just support "pro" | "enterprise" | "free" | null. We'll map premium to enterprise or allow dynamic type.
    const mappedTier = plan === "premium" ? "enterprise" : (plan === "pro" ? "pro" : "free");

    db.users[userIndex] = {
      ...db.users[userIndex],
      subscription: mappedTier as any,
      updatedAt: new Date().toISOString(),
    };

    await writeDb(db);

    return NextResponse.json({ user: publicUser(db.users[userIndex]) });
  } catch (error) {
    console.error("Subscription update error:", error);
    return NextResponse.json({ error: "Could not process subscription upgrade." }, { status: 500 });
  }
}
