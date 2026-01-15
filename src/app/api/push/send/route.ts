// app/api/push/send/route.ts  (protected or cron-triggered)
import webPush from "web-push";
import { NextResponse } from "next/server";

// Set once (can move to module scope)
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  // In real app: fetch subscriptions for user(s) who need this reminder
  const { subscription, title, body, url } = await req.json(); // or from DB

  try {
    await webPush.sendNotification(
      subscription,
      JSON.stringify({ title, body, url })
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Push failed:", err);
    // If 410 gone → remove subscription from DB
    if (err.statusCode === 410) {
      // delete from DB
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}