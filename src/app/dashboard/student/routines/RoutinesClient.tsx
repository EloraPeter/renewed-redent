'use client';

import { useState, useRef } from 'react';
import { Routine } from '@/types/routine';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface RoutinesClientProps {
  routines: Routine[];
  onCreate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  onUpdate: (id: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  onDelete: (id: string) => Promise<void>;
}

export default function RoutinesClient({
  routines,
  onCreate,
  onUpdate,
  onDelete,
}: RoutinesClientProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormRef.current) return;

    const formData = new FormData(addFormRef.current);
    const result = await onCreate(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Routine added!');
      setIsAddOpen(false);
      addFormRef.current.reset();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormRef.current || !editingRoutine) return;

    const formData = new FormData(editFormRef.current);
    const result = await onUpdate(editingRoutine.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Routine updated!');
      setEditingRoutine(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Routines</h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Add Routine
        </button>
      </div>

      {/* List */}
      {routines.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No routines yet. Add your first one!
        </div>
      ) : (
        <ul className="space-y-4">
          {routines.map((r) => (
            <li
              key={r.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div>
                <div className="font-medium text-lg">{r.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {r.time} {r.duration_minutes && `• ${r.duration_minutes} min`}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingRoutine(r)}
                  className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Edit"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete this routine?')) {
                      await onDelete(r.id);
                      toast.success('Deleted');
                    }
                  }}
                  className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Routine</h2>
              <button onClick={() => setIsAddOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form ref={addFormRef} onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  name="title"
                  required
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Wake up • Study • Gym"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Time</label>
                <input
                  name="time"
                  type="time"
                  required
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRoutine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Routine</h2>
              <button onClick={() => setEditingRoutine(null)}>
                <X size={24} />
              </button>
            </div>

            <form ref={editFormRef} onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  name="title"
                  defaultValue={editingRoutine.title}
                  required
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Time</label>
                <input
                  name="time"
                  type="time"
                  defaultValue={editingRoutine.time}
                  required
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingRoutine(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}