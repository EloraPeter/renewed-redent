import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserRoutines, createRoutine, updateRoutine, deleteRoutine } from '@/actions/routines';
import RoutinesClient from './RoutinesClient';
import { Toaster } from 'react-hot-toast';

export default async function RoutinesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  const routines = await getUserRoutines();

  // Server Actions (can be called from client via form/action)
  async function handleCreate(formData: FormData) {
    'use server';
    const result = await createRoutine(formData);
    if (result?.error) {
      // We'll handle error in client via toast
      return { error: result.error };
    }
    return { success: true };
  }

  async function handleUpdate(id: string, formData: FormData) {
    'use server';
    const result = await updateRoutine(id, formData);
    if (result?.error) {
      return { error: result.error };
    }
    return { success: true };
  }

  async function handleDelete(id: string) {
    'use server';
    await deleteRoutine(id);
  }

  return (
    <>
      <Toaster position="top-center" />
      <RoutinesClient
        routines={routines}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
}