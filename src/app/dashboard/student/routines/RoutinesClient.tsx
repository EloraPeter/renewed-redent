'use client';

import { useState, useRef, useEffect } from 'react';
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

  // Controlled state for add form
  const [addType, setAddType] = useState<'daily' | 'weekly' | 'once'>('daily');

  // Controlled state for edit form (more robust than just defaultValue)
  const [editType, setEditType] = useState<'daily' | 'weekly' | 'once'>('daily');
  const [editDays, setEditDays] = useState<string[]>([]);
  const [editOnceDate, setEditOnceDate] = useState<string>('');

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  // Sync edit form state when a new routine is selected for editing
  useEffect(() => {
    if (editingRoutine) {
      setEditType(editingRoutine.schedule_type);
      setEditDays(editingRoutine.days || []);
      setEditOnceDate(editingRoutine.once_date || '');
    }
  }, [editingRoutine]);

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
      setAddType('daily');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormRef.current || !editingRoutine) return;

    // Optional: you can manually append days / once_date if needed
    // (but since they are in the form already, usually not necessary)
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Routines
        </h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow-md transition w-full sm:w-auto"
        >
          <Plus size={20} /> Add Routine
        </button>
      </div>

      {/* List */}
      {routines.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
          <p className="text-lg text-gray-500 dark:text-gray-400">No routines yet...</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Add daily habits, weekly classes, or one-off appointments!
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {routines.map((r) => (
            <li
              key={r.id}
              className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">{r.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                  <span>{r.time}</span>
                  {r.duration_minutes && <span>• {r.duration_minutes} min</span>}
                  {r.schedule_type === 'weekly' && r.days && r.days.length > 0 && (
                    <span>• {r.days.map((d) => d.slice(0, 3)).join(', ')}</span>
                  )}
                  {r.schedule_type === 'once' && r.once_date && (
                    <span>• {new Date(r.once_date).toLocaleDateString('en-GB')}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingRoutine(r);
                    // useEffect will handle the rest
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500"
                  aria-label="Edit routine"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete this routine?')) {
                      await onDelete(r.id);
                      toast.success('Routine deleted');
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  aria-label="Delete routine"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Modal – remains mostly the same */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl md:text-2xl font-bold">Add Routine</h2>
              <button onClick={() => setIsAddOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <form ref={addFormRef} onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input name="title" required placeholder="Gym • Lecture • Prayer" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Time</label>
                <input name="time" type="time" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Repeats</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['daily', 'weekly', 'once'].map((value) => (
                    <label
                      key={value}
                      className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition text-center ${
                        addType === value
                          ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 font-medium'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="schedule_type"
                        value={value}
                        checked={addType === value}
                        onChange={() => setAddType(value as any)}
                        className="sr-only"
                      />
                      {value === 'daily' ? 'Every day' : value === 'weekly' ? 'Specific days' : 'One time only'}
                    </label>
                  ))}
                </div>
              </div>

              {addType === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Select days</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <label key={day} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <input type="checkbox" name="days" value={day} className="rounded" />
                        <span className="capitalize text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {addType === 'once' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date</label>
                  <input name="once_date" type="date" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Duration (minutes, optional)</label>
                <input
                  name="duration_minutes"
                  type="number"
                  min="1"
                  placeholder="30"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal – now controlled + resets properly when type changes */}
      {editingRoutine && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl md:text-2xl font-bold">Edit Routine</h2>
              <button onClick={() => setEditingRoutine(null)}>
                <X size={28} />
              </button>
            </div>

            <form ref={editFormRef} onSubmit={handleEditSubmit} className="space-y-5">
              <input name="title" defaultValue={editingRoutine.title} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />

              <input name="time" type="time" defaultValue={editingRoutine.time} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />

              <select
                name="schedule_type"
                value={editType}                    // ← controlled
                onChange={(e) => {
                  const newType = e.target.value as 'daily' | 'weekly' | 'once';
                  setEditType(newType);
                  // Reset irrelevant fields
                  if (newType !== 'weekly') setEditDays([]);
                  if (newType !== 'once') setEditOnceDate('');
                }}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="daily">Every day</option>
                <option value="weekly">Specific days</option>
                <option value="once">One time only</option>
              </select>

              {editType === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Select days</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <label key={day} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="days"
                          value={day}
                          checked={editDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditDays((prev) => [...prev, day]);
                            } else {
                              setEditDays((prev) => prev.filter((d) => d !== day));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="capitalize text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {editType === 'once' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date</label>
                  <input
                    name="once_date"
                    type="date"
                    value={editOnceDate}
                    onChange={(e) => setEditOnceDate(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              )}

              <input
                name="duration_minutes"
                type="number"
                defaultValue={editingRoutine.duration_minutes ?? ''}
                min="1"
                placeholder="Duration (minutes, optional)"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setEditingRoutine(null)} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}