// src/actions/routines.ts
'use server';

import pool from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";     // ← this now works
import { revalidatePath } from 'next/cache';

async function getUserId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  return session.user.id;
}

export async function getUserRoutines() {
  const userId = await getUserId();
  const res = await pool.query(
    `SELECT 
       id, 
       title, 
       schedule->>'time'           AS time,
       duration_minutes,
       schedule->>'type'           AS schedule_type,
       schedule->>'date'           AS once_date,          -- only meaningful when type='once'
       days
     FROM routines 
     WHERE user_id = $1 
     ORDER BY (schedule->>'time') ASC`,
    [userId]
  );
  return res.rows;
}

export async function createRoutine(formData: FormData) {
  const userId = await getUserId();
  const title       = (formData.get('title') as string)?.trim();
  const time        = formData.get('time') as string;
  const scheduleType = formData.get('schedule_type') as string; // 'daily' | 'weekly' | 'once'
  const durationStr = formData.get('duration_minutes') as string;
  const onceDate    = formData.get('once_date') as string | null;

  // Handle multi-value 'days'
  const daysRaw = formData.getAll('days') as string[]; // array from checkboxes

  if (!title || !time || !scheduleType) {
    return { error: 'Title, time, and repeat type are required' };
  }

  let scheduleObj: any = { time, type: scheduleType };

  let finalDays: string[] = ['daily'];

  if (scheduleType === 'weekly') {
    finalDays = daysRaw.length > 0 ? daysRaw : ['monday']; // fallback
  } else if (scheduleType === 'once') {
    if (!onceDate) return { error: 'Date is required for one-time routines' };
    scheduleObj.date = onceDate;
  }

  const duration = durationStr ? parseInt(durationStr, 10) : 15;

  await pool.query(
    `INSERT INTO routines (user_id, title, schedule, duration_minutes, days)
     VALUES ($1, $2, $3::jsonb, $4, $5)`,
    [
      userId,
      title,
      JSON.stringify(scheduleObj),
      duration,
      finalDays
    ]
  );

  revalidatePath('/dashboard/student/routines');
  return { success: true };
}

export async function deleteRoutine(id: string) {
  const userId = await getUserId();
  const res = await pool.query(
    'DELETE FROM routines WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  if (res.rowCount === 0) return { error: 'Not found or not yours' };

  revalidatePath('/dashboard/student/routines');
  return { success: true };
}

export async function updateRoutine(id: string, formData: FormData) {
  const userId = await getUserId();
  const title = (formData.get('title') as string)?.trim();
  const time = formData.get('time') as string;

  if (!title || !time) {
    return { error: 'Title and time are required' };
  }

  try {
    const res = await pool.query(
      `UPDATE routines
       SET 
         title = $1,
         schedule = jsonb_set(schedule, '{time}', to_jsonb($2::text))
       WHERE id = $3 AND user_id = $4
       RETURNING id`,
      [title, time, id, userId]
    );

    if (res.rowCount === 0) {
      return { error: 'Routine not found or not owned by you' };
    }

    revalidatePath('/dashboard/student/routines');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to update routine' };
  }
}