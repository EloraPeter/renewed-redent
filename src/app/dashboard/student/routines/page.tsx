// page.tsx (SERVER)
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserRoutines, deleteRoutine } from '@/actions/routines';
import RoutinesClient from './RoutinesClient';

export default async function RoutinesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  const routines = await getUserRoutines();

  async function handleDelete(id: string) {
    'use server';
    await deleteRoutine(id);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Routines</h1>

      <RoutinesClient
        routines={routines}
        onDelete={handleDelete}
      />
    </div>
  );
}
