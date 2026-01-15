// src/lib/data.ts
import pool from "@/lib/db";
// Remove this line unless you actually need it later:
// import { auth } from "@/auth";

// ──────────────────────────────────────────────
// Shared types (already good)
// ──────────────────────────────────────────────
export type ClassItem = {
  name: string;
  start_time: string; // "HH:mm" format
};

export type AssignmentItem = {
  title: string;
  due_date: string; // e.g. ISO "2026-01-20T23:59:00Z" or "2026-01-20"
};

// ──────────────────────────────────────────────
// Student data (your original function)
// ──────────────────────────────────────────────
export async function getStudentData(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  // Wake-up time from settings
  const wakeUpRes = await pool.query(
    `SELECT wake_up_time FROM user_settings WHERE user_id = $1`,
    [userId]
  );
  const wakeUpTime = wakeUpRes.rows[0]?.wake_up_time ?? null;

  // Today's classes
  const classesRes = await pool.query(
    `SELECT name, start_time
     FROM classes c
     JOIN enrollments e ON c.id = e.class_id
     WHERE e.user_id = $1
       AND c.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)
     ORDER BY start_time`,
    [userId]
  );

  // Upcoming assignments (next 7 days)
  const assignmentsRes = await pool.query(
    `SELECT title, due_date
     FROM assignments a
     JOIN courses c ON a.course_id = c.id
     JOIN enrollments e ON c.id = e.class_id
     WHERE e.user_id = $1
       AND a.due_date >= CURRENT_DATE
       AND a.due_date <= CURRENT_DATE + INTERVAL '7 days'
     ORDER BY due_date ASC
     LIMIT 5`,
    [userId]
  );

  return {
    wakeUpTime,
    todayClasses: classesRes.rows as ClassItem[],
    upcomingAssignments: assignmentsRes.rows as AssignmentItem[],
  };
}

// ──────────────────────────────────────────────
// Lecturer data (new function)
// ──────────────────────────────────────────────
export async function getLecturerData(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  // Today's classes (as lecturer → teaching)
  const classesRes = await pool.query(
    `SELECT name, start_time
     FROM classes c
     WHERE c.lecturer_id = $1
       AND c.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)
     ORDER BY start_time`,
    [userId]
  );
  const todayClasses = classesRes.rows as ClassItem[];

  // Pending / new submissions (not yet graded)
  const pendingRes = await pool.query(
    `SELECT COUNT(*) as count
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN courses c ON a.course_id = c.id
     WHERE c.lecturer_id = $1
       AND s.graded = false
       AND s.submitted_at IS NOT NULL`,
    [userId]
  );
  const pendingSubmissions = Number(pendingRes.rows[0]?.count ?? 0);

  // Assignments that need grading soon (due in next 7 days or already overdue)
  const toGradeRes = await pool.query(
    `SELECT a.title, a.due_date
     FROM assignments a
     JOIN courses c ON a.course_id = c.id
     WHERE c.lecturer_id = $1
       AND a.due_date >= CURRENT_DATE - INTERVAL '2 days'   -- include a bit of buffer for late subs
       AND a.due_date <= CURRENT_DATE + INTERVAL '7 days'
     ORDER BY a.due_date ASC
     LIMIT 5`,
    [userId]
  );
  const upcomingAssignmentsToGrade = toGradeRes.rows as AssignmentItem[];

  // Announcements posted this week (example quick stat)
  const announcementsRes = await pool.query(
    `SELECT COUNT(*) as count
     FROM announcements
     WHERE author_id = $1
       AND created_at >= CURRENT_DATE - INTERVAL '7 days'`,
    [userId]
  );
  const recentAnnouncementsCount = Number(announcementsRes.rows[0]?.count ?? 0);

  return {
    todayClasses,
    pendingSubmissions,
    upcomingAssignmentsToGrade,
    recentAnnouncementsCount,
  };
}