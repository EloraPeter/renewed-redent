'use server';

import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function getUserIdAndRole() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Not authenticated');
    return {
        userId: session.user.id,
        role: session.user.role || 'student',  // fallback
    };
}

export async function getUserCourses() {
    const { userId } = await getUserIdAndRole();
    const res = await pool.query(
        `SELECT 
       id, name, code, days, start_time, end_time, location,
       lecturer_name, lecturer_phone, course_rep_name, course_rep_phone
     FROM courses 
     WHERE user_id = $1 
     ORDER BY start_time ASC`,
        [userId]
    );
    return res.rows;
}

export async function createCourse(formData: FormData) {
    const { userId, role } = await getUserIdAndRole();

    const name = (formData.get('name') as string)?.trim();
    const code = (formData.get('code') as string)?.trim().toUpperCase();
    const start_time = formData.get('start_time') as string;
    const end_time = formData.get('end_time') as string;
    const location = (formData.get('location') as string)?.trim();
    const days = formData.getAll('days') as string[];

    let lecturer_name = null, lecturer_phone = null;
    let course_rep_name = null, course_rep_phone = null;

    if (role === 'student') {
        lecturer_name = (formData.get('lecturer_name') as string)?.trim() || null;
        lecturer_phone = (formData.get('lecturer_phone') as string)?.trim() || null;
    } else if (role === 'lecturer') {
        course_rep_name = (formData.get('course_rep_name') as string)?.trim() || null;
        course_rep_phone = (formData.get('course_rep_phone') as string)?.trim() || null;
    }

    if (!name || !code || days.length === 0 || !start_time || !end_time) {
        return { error: 'Name, code, days, start time, and end time are required' };
    }

    try {
        await pool.query(
            `INSERT INTO courses (
         user_id, name, code, days, start_time, end_time, location,
         lecturer_name, lecturer_phone, course_rep_name, course_rep_phone
       ) VALUES ($1, $2, $3, $4, $5::time, $6::time, $7, $8, $9, $10, $11)`,
            [userId, name, code, days, start_time, end_time, location || null,
                lecturer_name, lecturer_phone, course_rep_name, course_rep_phone]
        );

        revalidatePath('/dashboard/student');
        revalidatePath('/dashboard/student/classes');
        return { success: true };
    } catch (err: any) {
        console.error(err);
        return { error: err.message.includes('unique') ? 'Course code already exists' : 'Failed to create course' };
    }
}

export async function updateCourse(id: string, formData: FormData) {
    const { userId, role } = await getUserIdAndRole();

    const name = (formData.get('name') as string)?.trim();
    const code = (formData.get('code') as string)?.trim().toUpperCase();
    const start_time = formData.get('start_time') as string;
    const end_time = formData.get('end_time') as string;
    const location = (formData.get('location') as string)?.trim() || null;
    const days = formData.getAll('days') as string[];

    let lecturer_name: string | null = null;
    let lecturer_phone: string | null = null;
    let course_rep_name: string | null = null;
    let course_rep_phone: string | null = null;

    if (role === 'student') {
        lecturer_name = (formData.get('lecturer_name') as string)?.trim() || null;
        lecturer_phone = (formData.get('lecturer_phone') as string)?.trim() || null;
    } else if (role === 'lecturer') {
        course_rep_name = (formData.get('course_rep_name') as string)?.trim() || null;
        course_rep_phone = (formData.get('course_rep_phone') as string)?.trim() || null;
    }

    if (!name || !code || days.length === 0 || !start_time || !end_time) {
        return { error: 'Name, code, days, start time, and end time are required' };
    }

    try {
        const res = await pool.query(
            `UPDATE courses
       SET 
         name = $1,
         code = $2,
         days = $3,
         start_time = $4::time,
         end_time = $5::time,
         location = $6,
         lecturer_name = $7,
         lecturer_phone = $8,
         course_rep_name = $9,
         course_rep_phone = $10
       WHERE id = $11 AND user_id = $12
       RETURNING id`,
            [name, code, days, start_time, end_time, location,
                lecturer_name, lecturer_phone, course_rep_name, course_rep_phone, id, userId]
        );

        if (res.rowCount === 0) {
            return { error: 'Course not found or not owned by you' };
        }

                revalidatePath('/dashboard/student');
        revalidatePath('/dashboard/student/classes');
        return { success: true };
    } catch (err: any) {
        console.error('Update course failed:', err);
        return { error: 'Failed to update course' };
    }
}

export async function deleteCourse(id: string) {
    const { userId } = await getUserIdAndRole();
    const res = await pool.query(
        'DELETE FROM courses WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    if (res.rowCount === 0) return { error: 'Not found or not yours' };
            revalidatePath('/dashboard/student');
revalidatePath('/dashboard/student/classes');
    return { success: true };
}