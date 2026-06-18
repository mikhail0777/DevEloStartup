import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { defaultProgress, publicUser, readDb, writeDb } from "@/lib/server/db";
import { hashPassword, setSessionCookie } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const db = await readDb();
    const existingUser = db.users.find((user) => user.email === email);

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const now = new Date().toISOString();
    const { salt, passwordHash } = hashPassword(password);
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      salt,
      subscription: "free" as const,
      progress: defaultProgress(),
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(user);
    await writeDb(db);

    const response = NextResponse.json({ user: publicUser(user) }, { status: 201 });
    setSessionCookie(response, user.id);
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
