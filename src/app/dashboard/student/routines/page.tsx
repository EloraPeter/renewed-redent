// src/app/dashboard/student/routines/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserRoutines, createRoutine, updateRoutine, deleteRoutine } from '@/actions/routines';
import toast from 'react-hot-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useRef } from 'react'; // for refs on modals

export default async function RoutinesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  const routines = await getUserRoutines();

  // Server Action wrappers with toast
  async function handleCreate(formData: FormData) {
    'use server';
    const result = await createRoutine(formData);
    if (result.error) toast.error(result.error);
    else toast.success('Routine added!');
  }

  async function handleUpdate(id: string, formData: FormData) {
    'use server';
    const result = await updateRoutine(id, formData);
    if (result.error) toast.error(result.error);
    else toast.success('Routine updated!');
  }

  async function handleDelete(id: string) {
    'use server';
    const result = await deleteRoutine(id);
    if (result.error) toast.error(result.error);
    else toast.success('Routine deleted');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">My Routines</h1>

      {routines.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No routines yet. Add one!</p>
      ) : (
        <ul className="space-y-4">
          {routines.map((r) => (
            <li key={r.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <span className="font-medium">{r.title}</span> at <span>{r.time}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => (document.getElementById(`edit-modal-${r.id}`) as HTMLDialogElement)?.showModal()}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={20} />
                </button>
                <form action={handleDelete.bind(null, r.id)}>
                  <button type="submit" className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>

              {/* Edit Modal per routine (pre-filled with current values) */}
              <dialog id={`edit-modal-${r.id}`} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white dark:bg-gray-800">
                  <h3 className="font-bold text-lg mb-4">Edit Routine</h3>
                  <form action={handleUpdate.bind(null, r.id)} className="space-y-4">
                    <input
                      name="title"
                      defaultValue={r.title}
                      placeholder="Title"
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                    <input
                      name="time"
                      type="time"
                      defaultValue={r.time}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <button type="button" onClick={() => (document.getElementById(`edit-modal-${r.id}`) as HTMLDialogElement)?.close()} className="px-4 py-2 text-gray-500 dark:text-gray-400">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </li>
          ))}
        </ul>
      )}

      {/* Add Routine Modal */}
      <button
        onClick={() => (document.getElementById('add-modal') as HTMLDialogElement)?.showModal()}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg md:relative md:bottom-auto md:right-auto md:mt-6 md:px-6 md:py-3 md:rounded"
      >
        <Plus size={24} />
      </button>

      <dialog id="add-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white dark:bg-gray-800">
          <h3 className="font-bold text-lg mb-4">Add Routine</h3>
          <form action={handleCreate} className="space-y-4">
            <input
              name="title"
              placeholder="Title"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              name="time"
              type="time"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => (document.getElementById('add-modal') as HTMLDialogElement)?.close()} className="px-4 py-2 text-gray-500 dark:text-gray-400">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}