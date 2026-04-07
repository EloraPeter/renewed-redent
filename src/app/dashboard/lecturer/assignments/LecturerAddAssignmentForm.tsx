// src/app/dashboard/lecturer/assignments/LecturerAddAssignmentForm.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createAssignment } from "./actions";
import { X } from 'lucide-react';

type Course = { id: string; name: string };

export default function LecturerAddAssignmentForm({
    courses,
    onClose
}: {
    courses: Course[];
    onClose: () => void;
}) {
    const [pending, setPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setPending(true);
        try {
            const result = await createAssignment(formData);
            if (result.success) {
                toast.success("Assignment created successfully!");
                onClose();
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to create assignment");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        📋 New Assignment
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                            Assignment Title *
                        </label>
                        <input
                            name="title"
                            required
                            placeholder="e.g. Midterm Project - Data Structures"
                            className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                            Course *
                        </label>
                        <select
                            name="courseId"
                            required
                            className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select course</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                                Due Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                name="dueDate"
                                required
                                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                                Priority
                            </label>
                            <select
                                name="priority"
                                defaultValue="medium" 
                                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>  
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                            Instructions (optional)
                        </label>
                        <textarea
                            name="instructions"
                            rows={4}
                            placeholder="Detailed instructions for students..."
                            className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                            📎 Attachment (PDF, DOC, etc.)
                        </label>
                        <input
                            type="file"
                            name="file"
                            accept=".pdf,.doc,.docx,.zip"
                            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Optional reference material for students
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            className="flex-1 px-6 py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {pending ? "Creating..." : "Create Assignment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}