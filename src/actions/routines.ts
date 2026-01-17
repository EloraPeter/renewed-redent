'use server';

import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

async function getUserId() {
  const session = await getServerSession();
  if (!session?.user?.id) throw new Error('Not authenticated');
  return session.user.id as string;
}

export async function getUserRoutines() {
  const userId = await getUserId();
  const res = await pool.query(
    'SELECT id, title, time FROM routines WHERE user_id = $1 ORDER BY time ASC',
    [userId]
  );
  return res.rows;
}

export async function createRoutine(formData: FormData) {
  const userId = await getUserId();
  const title = (formData.get('title') as string)?.trim();
  const time = formData.get('time') as string;

  if (!title || title.length < 1 || !time) {
    return { error: 'Title and time are required' };
  }

  await pool.query(
    'INSERT INTO routines (user_id, title, time) VALUES ($1, $2, $3)',
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
  'use server';
  // Placeholder — implement later
  console.log('Update called for id:', id);
  return { success: true, message: 'Edit not implemented yet' };
}