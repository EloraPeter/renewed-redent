// src/components/NotificationScheduler.tsx   ← same file, but now with role support
"use client";

import { useEffect } from "react";
import { scheduleNotification, showNotification } from "@/lib/notifications";

type ClassItem = {
  name: string;
  start_time: string; // "HH:mm"
};

type AssignmentItem = {
  title: string;
  due_date: string; // ISO string e.g. "2026-01-20T23:59:00Z"
};

type Props =
  | {
      role: "student";
      wakeUpTime: string | null;
      todayClasses: ClassItem[];
      upcomingAssignments: AssignmentItem[];
    }
  | {
      role: "lecturer";
      todayClasses: ClassItem[];
      pendingSubmissions?: number; // total count — used for general alert if > 0
      upcomingAssignmentsToGrade?: AssignmentItem[]; // if you have due dates for grading
      // Add more lecturer-specific data later (e.g. lowAttendanceClasses, newSubmissionsToday)
    };

export default function NotificationScheduler(props: Props) {
  useEffect(() => {
    const now = new Date();

    if (props.role === "student") {
      const { wakeUpTime, todayClasses, upcomingAssignments } = props;

      // Morning wake-up reminder
      if (wakeUpTime) {
        const [hour, minute] = wakeUpTime.split(":").map(Number);
        const wakeUpDate = new Date();
        wakeUpDate.setHours(hour, minute, 0, 0);

        if (wakeUpDate > now) {
          const delayMs = wakeUpDate.getTime() - now.getTime();
          scheduleNotification(
            delayMs,
            "Good morning! Time to wake up 🌅",
            "MochiDo wishes you a great day of learning 🐹☕"
          );
        }
      }

      // Class starting in 15 minutes
      todayClasses.forEach((cls) => {
        const [h, m] = cls.start_time.split(":").map(Number);
        const classTime = new Date();
        classTime.setHours(h, m, 0, 0);

        const reminderTime = new Date(classTime.getTime() - 15 * 60 * 1000);
        if (reminderTime > now) {
          const delayMs = reminderTime.getTime() - now.getTime();
          scheduleNotification(
            delayMs,
            `Class soon: ${cls.name}`,
            "15 minutes until start — prepare your notes! 📘"
          );
        }
      });

      // Assignment due in 1 hour
      upcomingAssignments.forEach((assign) => {
        const due = new Date(assign.due_date);
        if (due <= now) return;

        const reminderTime = new Date(due.getTime() - 60 * 60 * 1000);
        if (reminderTime > now) {
          const delayMs = reminderTime.getTime() - now.getTime();
          scheduleNotification(
            delayMs,
            `Due soon: ${assign.title}`,
            "1 hour left — submit now! ⏰✍️"
          );
        }
      });
    }

    // ──────────────────────────────────────────────
    // Lecturer-specific reminders
    // ──────────────────────────────────────────────
    else if (props.role === "lecturer") {
      const { todayClasses, pendingSubmissions = 0, upcomingAssignmentsToGrade = [] } = props;

      // Class starting in 30 minutes (longer buffer — lecturer needs prep time)
      todayClasses.forEach((cls) => {
        const [h, m] = cls.start_time.split(":").map(Number);
        const classTime = new Date();
        classTime.setHours(h, m, 0, 0);

        const reminderTime = new Date(classTime.getTime() - 30 * 60 * 1000);
        if (reminderTime > now) {
          const delayMs = reminderTime.getTime() - now.getTime();
          scheduleNotification(
            delayMs,
            `Teaching soon: ${cls.name}`,
            "30 minutes until class — check materials & attendance sheet 📝"
          );
        }
      });

      // New/pending submissions alert — only once per load or if > some threshold
      if (pendingSubmissions > 0) {
        // Could be debounced or only shown once per session — here we trigger immediately
        showNotification(
          `You have ${pendingSubmissions} new/pending submission${pendingSubmissions === 1 ? "" : "s"}`,
          "Check Gradebook → Assignments to review 🖋️"
        );
      }

      // Grading due soon (e.g. assignments where due date is approaching and not yet graded)
      upcomingAssignmentsToGrade.forEach((assign) => {
        const due = new Date(assign.due_date);
        if (due <= now) return;

        const reminderTime = new Date(due.getTime() - 24 * 60 * 60 * 1000); // 24h before grading deadline
        if (reminderTime > now) {
          const delayMs = reminderTime.getTime() - now.getTime();
          scheduleNotification(
            delayMs,
            `Grading due soon: ${assign.title}`,
            "Deadline approaching — start reviewing submissions 📊"
          );
        }
      });
    }
  }, [props]); // Re-run when any prop changes

  return null;
}