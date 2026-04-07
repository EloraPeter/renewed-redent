// src/app/dashboard/lecturer/classes/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import LecturerCoursesClient from './LecturerCoursesClient';
import { getUserCourses, createCourse, updateCourse, deleteCourse } from '@/actions/courses';
import { authOptions } from '@/lib/auth';
import { Toaster } from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default async function LecturerClassesPage() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'lecturer') {
        redirect('/login');
    }

    const courses = await getUserCourses();

    async function handleCreate(formData: FormData) {
        'use server';
        return await createCourse(formData);
    }

    async function handleUpdate(id: string, formData: FormData) {
        'use server';
        return await updateCourse(id, formData);
    }

    async function handleDelete(id: string) {
        'use server';
        return await deleteCourse(id);
    }

    return (
        <>
            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(0,0,0,0.9)',
                    }
                }}
            />
            <LecturerCoursesClient
                courses={courses}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </>
    );
}