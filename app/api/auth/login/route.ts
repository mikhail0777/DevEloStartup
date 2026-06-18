import { NextRequest, NextResponse } from "next/server";
import { publicUser, readDb } from "@/lib/server/db";
import { setSessionCookie, verifyPassword } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Missing login details." }, { status: 400 });
    }

    const db = await readDb();
    const user = db.users.find((candidate) => candidate.email === email);

    if (!user) {
      return NextResponse.json({ error: "Could not sign in." }, { status: 401 });
    }

    const passwordMatches = verifyPassword(password, user.salt, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Could not sign in." }, { status: 401 });
    }

    const response = NextResponse.json({ user: publicUser(user) });
    setSessionCookie(response, user.id);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Could not log in." }, { status: 500 });
  }
}
