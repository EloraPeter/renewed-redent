import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CoursesClient from './CoursesClient'; 
import { getUserCourses, createCourse, updateCourse, deleteCourse } from '@/actions/courses';
import { Toaster } from 'react-hot-toast';

export default async function ClassesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

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
      <Toaster position="top-center" />
      <CoursesClient
        courses={courses}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
}