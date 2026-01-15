// src/lib/data.ts
import pool from "@/lib/db"; // your Pool export
import { auth } from "@/auth"; // assuming next-auth v5 or similar

export type ClassItem = {
  name: string;
  start_time: string; // "08:30" format
};

export type AssignmentItem = {
  title: string;
  due_date: string; // ISO string or whatever your DB uses
};

export async function getStudentData(userId: string) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Get wake-up time from user settings
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

  // Upcoming assignments (next 7 days for example)
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