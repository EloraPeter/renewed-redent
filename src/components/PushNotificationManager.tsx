"use client";

import { useEffect, useState } from "react";

export default function PushNotificationManager() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  async function subscribeToPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      setSubscription(sub);

      // Send subscription to your server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      console.log("Subscribed!");
    } catch (err) {
      console.error("Push subscription failed:", err);
    }
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        // Optional: check existing subscription
      });
    }
  }, []);

  return (
    <div>
      {!subscription && (
        <button onClick={subscribeToPush}>
          Enable Notifications for Reminders
        </button>
      )}
    </div>
  );
}

// Helper (common)
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}