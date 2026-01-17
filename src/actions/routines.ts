// src/actions/routines.ts
'use server';

import pool from '@/lib/db';
import { auth } from '@/lib/auth';           // ← this now works
import { revalidatePath } from 'next/cache';

async function getUserId() {
  const session = await auth();              // ← use auth() here
  if (!session?.user?.id) throw new Error('Not authenticated');
  return session.user.id as string;
}

export async function getUserRoutines() {
  const userId = await getUserId();
  const res = await pool.query(
    `SELECT 
       id, 
       title, 
       schedule->>'time' AS time,           -- extract time from JSONB
       duration_minutes,
       schedule->>'type' AS schedule_type,
       days
     FROM routines 
     WHERE user_id = $1 
     ORDER BY (schedule->>'time') ASC`,     // sort by extracted time
    [userId]
  );
  return res.rows;
}

export async function createRoutine(formData: FormData) {
  const userId = await getUserId();
  const title = (formData.get('title') as string)?.trim();
  const time = formData.get('time') as string; // e.g. "07:00"

  if (!title || !time) {
    return { error: 'Title and time are required' };
  }

  // Insert as JSONB (minimal structure – extend later if needed)
  await pool.query(
    `INSERT INTO routines (user_id, title, schedule, duration_minutes, days)
     VALUES ($1, $2, jsonb_build_object('time', $3, 'type', 'daily'), 15, ARRAY['daily'])`,
    [userId, title, time]
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