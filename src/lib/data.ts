// src/lib/data.ts
import pool from "@/lib/db";
import { unstable_noStore as noStore } from 'next/cache';
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
// Student data 
// ──────────────────────────────────────────────
export async function getStudentData(userId: string) {
  noStore();
  const today = new Date().toISOString().split("T")[0];

  // Try to get wake-up time from routines
  const wakeUpRes = await pool.query(
    `SELECT SUM(duration_minutes) AS total_prep_min
     FROM routines
     WHERE user_id = $1
       AND affects_wake_up = true
       AND schedule_type = 'daily'`,
    [userId]
  );

  const totalPrep = wakeUpRes.rows[0]?.total_prep_min ?? 0;
  const suggestedWakeUp = totalPrep > 0
    ? `${Math.floor(totalPrep / 60)}h ${totalPrep % 60}m prep → wake up early`
    : 'Flexible wake-up';

  // Today's classes 
  const todayWeekday = new Date().toLocaleString('en-US', { weekday: 'long', timeZone: 'Africa/Lagos' }).toLowerCase();
 
  const classesRes = await pool.query(
    `SELECT 
     name, 
     code,
     start_time::text AS start_time,
     end_time::text AS end_time,
     location
   FROM courses
   WHERE user_id = $1 
     AND $2 = ANY(days)
   ORDER BY start_time ASC`,
    [userId, todayWeekday]  // todayWeekday from earlier
  );

  const todayClasses = classesRes.rows as ClassItem[];

  // Upcoming assignments 
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

  // NEW: Full wake-up calculation
  const wakeUpData = await calculateWakeUpTime(userId);

  return {
    wakeUpTime: wakeUpData.wakeUpTime,
    firstClass: wakeUpData.firstClass,
    totalPrepMinutes: wakeUpData.totalPrepMinutes,
    message: wakeUpData.message,
    todayClasses,
    upcomingAssignments,
  };
}

// ──────────────────────────────────────────────
// Lecturer data 
// ──────────────────────────────────────────────
export async function getLecturerData(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  // Today's classes – using courses where user is the owner/lecturer
  const todayWeekday = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // e.g. "monday"

  const classesRes = await pool.query(
    `SELECT 
     name, 
     code,
     start_time::text AS start_time,
     end_time::text AS end_time,
     location
   FROM courses
   WHERE user_id = $1 
     AND $2 = ANY(days)          -- ← checks if today's weekday is in the days array
   ORDER BY start_time ASC
   LIMIT 10`,
    [userId, todayWeekday]
  );

  const todayClasses = classesRes.rows as ClassItem[];

  // ── Weekly classes ───────────────────────────────────────────────
  const weeklyRes = await pool.query(
    `SELECT 
     INITCAP(LOWER(unnested_day)) AS weekday,  -- e.g. Monday, Tuesday
     name,
     start_time::text AS start_time,
     end_time::text AS end_time,
     location
   FROM (
     SELECT 
       name,
       start_time,
       end_time,
       location,
       unnest(days) AS unnested_day  -- expand array into one row per day
     FROM courses
     WHERE user_id = $1
   ) sub
   ORDER BY 
     CASE LOWER(unnested_day)
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

  // Pending / new submissions (using assignments table)
  const pendingRes = await pool.query(
    `SELECT COUNT(*) as count
   FROM assignments a
   JOIN courses c ON a.course_id = c.id
   WHERE c.user_id = $1
     AND a.submitted_at IS NOT NULL
     -- Optional: only count fairly recent ones so the number doesn't grow forever
     AND a.submitted_at >= CURRENT_DATE - INTERVAL '30 days'
     -- If you later add a graded/status column, add here: AND (a.graded = false OR a.status = 'pending')
  `,
    [userId]
  );
  const pendingSubmissions = Number(pendingRes.rows[0]?.count ?? 0);
  // Assignments that need grading soon (due in next 7 days or already overdue)
  const toGradeRes = await pool.query(
    `SELECT a.title, a.due_date::text AS due_date
   FROM assignments a
   JOIN courses c ON a.course_id = c.id
   WHERE c.user_id = $1
     AND a.due_date >= CURRENT_DATE - INTERVAL '2 days'
     AND a.due_date <= CURRENT_DATE + INTERVAL '7 days'
   ORDER BY a.due_date ASC
   LIMIT 5`,
    [userId]
  );
  const upcomingAssignmentsToGrade = toGradeRes.rows as AssignmentItem[];

  // // Announcements posted this week (example quick stat)
  // const announcementsRes = await pool.query(
  //   `SELECT COUNT(*) as count
  //    FROM announcements
  //    WHERE author_id = $1
  //      AND created_at >= CURRENT_DATE - INTERVAL '7 days'`,
  //   [userId]
  // );
  // const recentAnnouncementsCount = Number(announcementsRes.rows[0]?.count ?? 0);

  return {
    todayClasses,
    pendingSubmissions,
    upcomingAssignmentsToGrade,
    // recentAnnouncementsCount,
    weeklyClasses,       // ← new
    courseStats,
  };
}

// ──────────────────────────────────────────────
// wakup time 
// ────────────────────────────────────────────── 
// Helper: Convert "HH:mm:ss" or "HH:mm" to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

// Helper: Convert minutes back to "HH:mm" (handles negative/overflow)
function minutesToTime(minutes: number): string {
  minutes = (minutes + 1440) % 1440; // wrap around midnight
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

export async function calculateWakeUpTime(userId: string): Promise<{
  wakeUpTime: string | null;
  firstClass: { name: string; start_time: string; location?: string } | null;
  totalPrepMinutes: number;
  message?: string;
}> {
  noStore();
  const todayWeekday = new Date().toLocaleString('en-US', {
    weekday: 'long',
    timeZone: 'Africa/Lagos'
  }).toLowerCase(); // e.g. "wednesday"

  // 1. Get earliest class today
  const classRes = await pool.query(
    `SELECT 
       name, 
       start_time::text AS start_time,
       location
     FROM courses
     WHERE user_id = $1 
       AND $2 = ANY(days)
     ORDER BY start_time ASC
     LIMIT 1`,
    [userId, todayWeekday]
  );

  const firstClass = classRes.rows[0] || null;

  if (!firstClass) {
    return {
      wakeUpTime: null,
      firstClass: null,
      totalPrepMinutes: 0,
      message: 'No classes today — sleep in, no alarm!'
    };
  }

  const targetMinutes = timeToMinutes(firstClass.start_time);

  // 2. Get user commute settings
  const profileRes = await pool.query(
    `SELECT commute_mode, commute_distance_km, commute_affects_wake_up 
     FROM profiles 
     WHERE id = $1`,
    [userId]
  );
  const profile = profileRes.rows[0] || {};
  let commuteMin = 0;
  if (profile.commute_affects_wake_up && profile.commute_distance_km > 0) {
    const speedMinPerKm =
      profile.commute_mode === 'trekking' ? 10 :
        profile.commute_mode === 'bike' ? 5 :
          2; // car
    commuteMin = Math.ceil(profile.commute_distance_km * speedMinPerKm);
  }

  // 3. Get relevant prep routines (affects_wake_up = true + matches today)
  const routinesRes = await pool.query(
    `SELECT title, duration_minutes
     FROM routines
     WHERE user_id = $1 
       AND affects_wake_up = true
       AND (schedule_type = 'daily' 
            OR $2 = ANY(days) 
            OR (schedule_type = 'once' AND once_date = CURRENT_DATE))
     ORDER BY id`,
    [userId, todayWeekday]
  );

  const prepRoutines = routinesRes.rows;

  // 4. Calculate total prep + buffers
  const WAKE_UP_BUFFER = 5;
  const TRANSITION_BUFFER = 5;

  let totalPrepMin = prepRoutines.reduce((sum, r) => sum + r.duration_minutes, 0);
  totalPrepMin += commuteMin;
  totalPrepMin += (prepRoutines.length + (commuteMin > 0 ? 1 : 0) - 1) * TRANSITION_BUFFER; // between activities
  totalPrepMin += WAKE_UP_BUFFER;

  // 5. Backwards from first class
  const wakeUpMinutes = targetMinutes - totalPrepMin;
  const wakeUpTime = minutesToTime(wakeUpMinutes);

  return {
    wakeUpTime,
    firstClass: {
      name: firstClass.name,
      start_time: firstClass.start_time,
      location: firstClass.location || undefined
    },
    totalPrepMinutes: totalPrepMin,
  };
}