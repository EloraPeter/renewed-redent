// src/lib/notifications.ts
"use client"; // ← important if you ever use this in server components (but safe here)

export function showNotification(title: string, body: string) {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}

// Simple client-side scheduler using setTimeout
// (real scheduling across page reloads needs service worker + Push API)
export function scheduleNotification(
  delayMs: number,
  title: string,
  body: string
) {
  if (delayMs <= 0) {
    showNotification(title, body);
    return;
  }

  setTimeout(() => {
    showNotification(title, body);
  }, delayMs);
}