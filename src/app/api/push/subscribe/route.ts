// app/api/push/subscribe/route.ts
import { NextResponse } from "next/server";
// import your DB (prisma, supabase, etc.)

export async function POST(req: Request) {
  const sub = await req.json();
  // Save sub.endpoint, sub.keys.auth, sub.keys.p256dh to DB, associated with user ID
  // e.g. await prisma.pushSubscription.upsert({...})

  return NextResponse.json({ success: true });
}