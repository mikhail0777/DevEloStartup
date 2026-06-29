import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/server/auth";
import { findUserById, publicUser } from "@/lib/server/db";

export async function GET(request: NextRequest) {
  try {
    const userId = getSessionUserId(request);

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Could not retrieve user session." }, { status: 500 });
  }
}
