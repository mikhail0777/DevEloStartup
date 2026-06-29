import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/server/auth";
import { publicUser, readDb, writeDb } from "@/lib/server/db";

export async function PATCH(request: NextRequest) {
  const userId = getSessionUserId(request);

  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const db = await readDb();
  const userIndex = db.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    progress: {
      ...db.users[userIndex].progress,
      ...body.progress,
    },
    ...(body.aiProvider !== undefined && { aiProvider: body.aiProvider }),
    ...(body.aiModel !== undefined && { aiModel: body.aiModel }),
    ...(body.aiApiKey !== undefined && { aiApiKey: body.aiApiKey }),
    ...(body.aiEndpoint !== undefined && { aiEndpoint: body.aiEndpoint }),
    updatedAt: new Date().toISOString(),
  };

  await writeDb(db);

  return NextResponse.json({ user: publicUser(db.users[userIndex]) });
}
