"use client";

import { useEffect } from "react";
import { scheduleNotification, showNotification } from "@/lib/notifications";

type Props = {
  wakeUpTime: string | null;
  todayClasses: Array<{ name: string; start_time: string }>;
  upcomingAssignments: Array<{ title: string; due_date: string }>;
};

export default function NotificationScheduler({ wakeUpTime, todayClasses, upcomingAssignments }: Props) {
  useEffect(() => {
    const now = new Date();

    // Morning wake-up
    if (wakeUpTime) {
      const [hour, minute] = wakeUpTime.split(":").map(Number);
      const wakeUpDate = new Date();
      wakeUpDate.setHours(hour, minute, 0, 0);

      if (wakeUpDate > now) {
        const delay = wakeUpDate.getTime() - now.getTime();
        scheduleNotification(delay, "Time to wake up! 🌅", "Mochi says good morning! Get ready for class 🐹");
      }
    }

    // Class reminders (15 mins before)
    todayClasses.forEach((cls) => {
      const [hour, minute] = cls.start_time.split(":").map(Number);
      const classTime = new Date();
      classTime.setHours(hour, minute, 0, 0);

      const reminderTime = new Date(classTime.getTime() - 15 * 60 * 1000);

      if (reminderTime > now) {
        const delay = reminderTime.getTime() - now.getTime();
        scheduleNotification(delay, `Class starting soon: ${cls.name}`, "15 minutes until class begins! 📚");
      }
    });

    // Assignment due (1 hour before)
    upcomingAssignments.forEach((assign) => {
      const dueDate = new Date(assign.due_date);
      const reminderTime = new Date(dueDate.getTime() - 60 * 60 * 1000); // 1 hour before

      if (reminderTime > now && dueDate > now) {
        const delay = reminderTime.getTime() - now.getTime();
        scheduleNotification(delay, `Assignment due soon: ${assign.title}`, "1 hour left to submit! ⏰");
      }
    });
  }, [wakeUpTime, todayClasses, upcomingAssignments]);

  return null;
}