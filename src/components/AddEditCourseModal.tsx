// src/components/AddEditCourseModal.tsx
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface AddEditCourseModalProps {
    ref?: React.Ref<HTMLFormElement>;
    course?: any;
    editDays?: string[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    title: string;
    submitLabel: string;
    isLecturer: boolean;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function AddEditCourseModal({
    ref,
    course,
    editDays = [],
    onSubmit,
    onClose,
    title,
    submitLabel,
    isLecturer,
}: AddEditCourseModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all hover:scale-110"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form ref={ref} onSubmit={onSubmit} className="space-y-6">
                    {/* Course Basics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Course Name *
                            </label>
                            <input
                                name="name"
                                defaultValue={course?.name}
                                required
                                placeholder="e.g. Advanced Algorithms"
                                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Course Code *
                            </label>
                            <input
                                name="code"
                                defaultValue={course?.code}
                                required
                                placeholder="e.g. CSC 401"
                                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Days */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Class Days * (select all that apply)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {DAYS.map((day) => (
                                <label
                                    key={day}
                                    className="flex items-center p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-all border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 group"
                                >
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value={day}
                                        defaultChecked={course?.days?.includes(day) || editDays.includes(day)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-3 capitalize font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {day}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Times & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                name="start_time"
                                defaultValue={course?.start_time}
                                required
                                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg font-mono tracking-wider"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                End Time *
                            </label>
                            <input
                                type="time"
                                name="end_time"
                                defaultValue={course?.end_time}
                                required
                                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg font-mono tracking-wider"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Location
                            </label>
                            <input
                                name="location"
                                defaultValue={course?.location}
                                placeholder="e.g. Lecture Theatre 5"
                                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Lecturer Fields */}
                    {isLecturer && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl">
                            <div>
                                <label className="block text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
                                    👥 Course Representative Name
                                </label>
                                <input
                                    name="course_rep_name"
                                    defaultValue={course?.course_rep_name}
                                    placeholder="e.g. John Doe"
                                                                       className="w-full p-4 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white/70 dark:bg-gray-700/70 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
                                    📱 Course Rep Phone
                                </label>
                                <input
                                    name="course_rep_phone"
                                    defaultValue={course?.course_rep_phone}
                                    placeholder="+234 800 000 0000"
                                    className="w-full p-4 border border-emerald-200 dark:border-emerald-700 rounded-xl bg-white/70 dark:bg-gray-700/70 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all border border-gray-200 dark:border-gray-600 hover:border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 sm:flex-none px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}