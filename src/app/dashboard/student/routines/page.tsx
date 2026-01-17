// src/app/dashboard/student/routines/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserRoutines, createRoutine, updateRoutine, deleteRoutine } from '@/actions/routines';
import { revalidatePath } from 'next/cache';
import { Toaster, toast } from 'react-hot-toast';
import { Trash2, Edit, Plus } from 'lucide-react'; // assuming lucide-react is installed
import { useRef } from 'react';

export default async function RoutinesPage() {
    const session = await getServerSession();
    if (!session?.user) redirect('/login');

    const routines = await getUserRoutines();
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Server Action wrapper with toast (client can call these)
    async function handleCreate(formData: FormData) {
        'use server';
        const result = await createRoutine(formData);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Routine added!');
            revalidatePath('/dashboard/student/routines');
        }
    }

    async function handleDelete(id: string) {
        'use server';
        const result = await deleteRoutine(id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Routine deleted');
            revalidatePath('/dashboard/student/routines');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

            <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">My Routines</h1>
                    <button
                        onClick={() => dialogRef.current?.showModal()} className="btn btn-primary flex items-center gap-2 text-sm sm:text-base"
                    >
                        <Plus size={20} /> Add Routine
                    </button>
                </div>

                {/* List */}
                {routines.length === 0 ? (
                    <div className="card bg-base-100 shadow-xl text-center py-12">
                        <p className="text-lg opacity-70">No routines yet...</p>
                        <p className="mt-2 opacity-60">Add your daily habits to get started</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {routines.map((routine) => (
                            <div
                                key={routine.id}
                                className="card bg-base-100 dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="card-body p-5 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h2 className="card-title text-lg sm:text-xl">{routine.title}</h2>
                                            <p className="text-sm sm:text-base opacity-70 mt-1">
                                                {routine.time}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 self-end sm:self-center">
                                            <button
                                                onClick={() => {
                                                    // We'll implement edit modal later – for now placeholder
                                                    toast('Edit coming soon!', { icon: '🛠️' });
                                                }}
                                                className="btn btn-ghost btn-sm sm:btn-md"
                                                aria-label="Edit routine"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <form action={handleDelete.bind(null, routine.id)}>
                                                <button
                                                    type="submit"
                                                    className="btn btn-ghost btn-sm sm:btn-md text-error"
                                                    aria-label="Delete routine"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Routine Modal (using <dialog> – native, no extra libs needed) */}
                <dialog ref={dialogRef} className="modal">
                    <div className="modal-box bg-base-100 dark:bg-gray-800">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg mb-4">Add New Routine</h3>

                        <form action={handleCreate} className="space-y-5">
                            <div>
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="Wake up • Study session • Gym"
                                    className="input input-bordered w-full"
                                    required
                                    maxLength={60}
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Time</span>
                                </label>
                                <input
                                    name="time"
                                    type="time"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary">
                                    Save Routine
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    );
}