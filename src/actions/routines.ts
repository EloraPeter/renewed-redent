'use server';

import pool from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
       duration_minutes,
       schedule_type,
       once_date,
       days,
       affects_wake_up
     FROM routines 
     WHERE user_id = $1 
     ORDER BY title ASC`,
    [userId]
  );
  return res.rows;
}

export async function createRoutine(formData: FormData) {
  const userId = await getUserId();

  const title = (formData.get('title') as string)?.trim();
  const scheduleType = formData.get('schedule_type') as 'daily' | 'weekly' | 'once';
  const durationStr = formData.get('duration_minutes') as string;
  const onceDate = formData.get('once_date') as string | null;
  const daysRaw = formData.getAll('days') as string[];
  const affectsWakeUp = formData.get('affects_wake_up') === 'on';

  // Updated validation — no 'time' anymore
  if (!title || !scheduleType) {
    return { error: 'Title and repeat type are required' };
  }

  if (scheduleType === 'once' && !onceDate) {
    return { error: 'Date is required for one-time routines' };
  }

  let finalDays: string[] = ['daily'];
  if (scheduleType === 'weekly') {
    finalDays = daysRaw.length > 0 ? daysRaw : ['monday'];
  }

  const duration = durationStr && durationStr.trim() !== '' 
    ? parseInt(durationStr, 10) 
    : 15;

  if (duration <= 0) {
    return { error: 'Duration must be a positive number' };
  }

  await pool.query(
    `INSERT INTO routines (
       user_id, title, schedule_type, once_date, duration_minutes, days, affects_wake_up
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userId,
      title,
      scheduleType,
      onceDate ? new Date(onceDate) : null,
      duration,
      finalDays,
      affectsWakeUp
    ]
  );

  revalidatePath('/dashboard/student/routines');
  return { success: true };
}

export async function updateRoutine(id: string, formData: FormData) {
  const userId = await getUserId();

  const title = (formData.get('title') as string)?.trim();
  const scheduleType = formData.get('schedule_type') as 'daily' | 'weekly' | 'once';
  const durationStr = formData.get('duration_minutes') as string;
  const onceDate = formData.get('once_date') as string | null;
  const daysRaw = formData.getAll('days') as string[];
  const affectsWakeUp = formData.get('affects_wake_up') === 'on';

  // Updated validation — no 'time'
  if (!title || !scheduleType) {
    return { error: 'Title and repeat type are required' };
  }

  if (scheduleType === 'once' && !onceDate) {
    return { error: 'Date is required for one-time routines' };
  }

  let finalDays: string[] = ['daily'];
  if (scheduleType === 'weekly') {
    finalDays = daysRaw.length > 0 ? daysRaw : ['monday'];
  }

  const duration = durationStr && durationStr.trim() !== '' 
    ? parseInt(durationStr, 10) 
    : 15;

  if (duration <= 0) {
    return { error: 'Duration must be a positive number' };
  }

  try {
    const res = await pool.query(
      `UPDATE routines
       SET 
         title = $1,
         schedule_type = $2,
         once_date = $3,
         duration_minutes = $4,
         days = $5,
         affects_wake_up = $6
       WHERE id = $7 AND user_id = $8
       RETURNING id`,
      [
        title,
        scheduleType,
        onceDate ? new Date(onceDate) : null,
        duration,
        finalDays,
        affectsWakeUp,
        id,
        userId
      ]
    );

    if (res.rowCount === 0) {
      return { error: 'Routine not found or not owned by you' };
    }

    revalidatePath('/dashboard/student/routines');
    return { success: true };
  } catch (err) {
    console.error('Update routine failed:', err);
    return { error: 'Failed to update routine' };
  }
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