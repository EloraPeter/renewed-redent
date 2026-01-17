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

  // Try to get wake-up time from routines
  const wakeUpRes = await pool.query(
    `SELECT schedule->>'time' AS wake_up_time
     FROM routines
     WHERE user_id = $1
       AND title ILIKE 'wake up'`,
    [userId]
  );
  const wakeUpTime = wakeUpRes.rows[0]?.wake_up_time ?? null;

  // Today's classes
  // Note: your current query uses 'classes' table and 'enrollments' table,
  // but these tables don't exist in the schema you shared.
  // For now we'll comment it out and return empty array.
  // You may need to adjust this part later.
  /*
  const classesRes = await pool.query(
    `SELECT name, start_time
     FROM classes c
     JOIN enrollments e ON c.id = e.class_id
     WHERE e.user_id = $1
       AND c.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)
     ORDER BY start_time`,
    [userId]
  );
  const todayClasses = classesRes.rows as ClassItem[];
  */
  const todayClasses: ClassItem[] = []; // temporary

  // Upcoming assignments (this should work with your current schema)
  const assignmentsRes = await pool.query(
    `SELECT a.title, a.due_date::text AS due_date
     FROM assignments a
     WHERE a.user_id = $1
       AND a.due_date >= CURRENT_DATE
       AND a.due_date <= CURRENT_DATE + INTERVAL '7 days'
     ORDER BY a.due_date ASC
     LIMIT 5`,
    [userId]
  );
  const upcomingAssignments = assignmentsRes.rows as AssignmentItem[];

  return {
    wakeUpTime,
    todayClasses,
    upcomingAssignments,
  };
}

// ──────────────────────────────────────────────
// Lecturer data (new function)
// ──────────────────────────────────────────────
export async function getLecturerData(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  // Today's classes – using courses where user is the owner/lecturer
  const classesRes = await pool.query(
    `SELECT name, start_time::text AS start_time
     FROM courses
     WHERE user_id = $1
       AND LOWER(TRIM(day)) = LOWER(TRIM(to_char(CURRENT_DATE, 'Day')))
     ORDER BY start_time
     LIMIT 10`,
    [userId]
  );
  const todayClasses = classesRes.rows as ClassItem[];

  // ── Weekly classes ───────────────────────────────────────────────
  const weeklyRes = await pool.query(
    `SELECT 
       INITCAP(LOWER(day)) AS weekday,  -- e.g. Monday, Tuesday
       name,
       start_time::text AS start_time,
       end_time::text AS end_time,
       location
     FROM courses
     WHERE user_id = $1
     ORDER BY 
       CASE LOWER(day)
         WHEN 'monday'    THEN 1
         WHEN 'tuesday'   THEN 2
         WHEN 'wednesday' THEN 3
         WHEN 'thursday'  THEN 4
         WHEN 'friday'    THEN 5
         WHEN 'saturday'  THEN 6
         WHEN 'sunday'    THEN 7
         ELSE 8
       END, start_time`,
    [userId]
  );
  const weeklyClasses = weeklyRes.rows;

  // ── Simple aggregated stats (per course) ─────────────────────────
  // Using only existing tables (no submissions table)
  const statsRes = await pool.query(
    `SELECT 
     c.name AS course_name,
     COUNT(a.id) FILTER (WHERE a.due_date < CURRENT_DATE) AS past_assignments,
     COUNT(a.id) FILTER (WHERE a.submitted_at IS NOT NULL) AS submitted,
     COUNT(a.id) FILTER (WHERE a.submitted_at IS NOT NULL 
                      AND a.submitted_at <= a.due_date) AS on_time
   FROM courses c
   LEFT JOIN assignments a ON a.course_id = c.id
   WHERE c.user_id = $1
   GROUP BY c.id, c.name
   HAVING COUNT(a.id) > 0`,
    [userId]
  );

  const courseStats = statsRes.rows.map(r => ({
    course: r.course_name,
    past: Number(r.past_assignments),
    submitted: Number(r.submitted),
    onTime: Number(r.on_time),
    onTimePercent: r.past_assignments > 0
      ? Math.round((Number(r.on_time) / Number(r.past_assignments)) * 100)
      : 0,
  }));

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
    weeklyClasses,       // ← new
    courseStats,
  };
}