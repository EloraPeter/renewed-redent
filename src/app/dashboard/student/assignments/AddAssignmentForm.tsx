// src/app/dashboard/student/assignments/AddAssignmentForm.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createAssignment } from "./actions";
import { Plus, X, Edit, Trash2 } from 'lucide-react';

type Course = { id: string; name: string };

export default function AddAssignmentForm({ courses, onClose, }: {
    courses: Course[];
    onClose: () => void;
}) {
    const [pending, setPending] = useState(false);
    // const [isAddOpen, setIsAddOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        setPending(true);
        try {
            const result = await createAssignment(formData);
            if (result.success) {
                toast.success("Assignment added!");
                onClose();
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to add assignment");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl md:text-2xl font-bold">Add Course</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X size={28} />
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border">
                    <div>
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                            name="title"
                            required
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Course</label>
                        <select name="courseId" required className="w-full p-2.5 rounded-lg border dark:bg-gray-700">
                            <option value="">Select course</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Due Date</label>
                        <input
                            type="datetime-local"
                            name="dueDate"
                            required
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Priority</label>
                        <select name="priority" className="w-full p-2.5 rounded-lg border dark:bg-gray-700">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Attachment (optional)</label>
                        <input type="file" name="file" className="w-full" />
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50"
                    >
                        {pending ? "Adding..." : "Add Assignment"}
                    </button>
                </form>
            </div>
        </div>
    );
}