// src/app/dashboard/lecturer/assignments/LecturerAssignmentList.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateAssignmentGrade, deleteAssignment } from "./actions";
import { format } from "date-fns";
import { Edit, Trash2, Download, Eye, Award, Clock, CheckCircle } from 'lucide-react';

type Assignment = {
    id: string;
    title: string;
    due_date: string;
    priority: string;
    status: string;
    instructions?: string;
    file_url: string | null;
    submitted_at: string | null;
    grade?: string | null;
    feedback?: string | null;
    graded_at: string | null;
    course_name: string;
    student_count?: number;
    submissions_count?: number;
};

export default function LecturerAssignmentList({ assignments }: { assignments: Assignment[] }) {
    const [editingGrade, setEditingGrade] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    async function handleGradeSubmit(id: string, formData: FormData) {
        try {
            await updateAssignmentGrade(id, formData);
            toast.success("Grade updated!");
            setEditingGrade(null);
        } catch (err: any) {
            toast.error("Failed to update grade");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this assignment? This cannot be undone.")) return;
        try {
            await deleteAssignment(id);
            toast.success("Assignment deleted");
        } catch (err: any) {
            toast.error("Failed to delete");
        }
    }

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };

    return (
        <div className="space-y-4">
            {assignments.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <Award className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        No assignments yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Create your first assignment to get started!
                    </p>
                </div>
            ) : (
                assignments.map((assignment) => (
                    <div
                        key={assignment.id}
                        className={`group rounded-2xl border transition-all overflow-hidden ${assignment.status === 'graded'
                                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                                : assignment.submissions_count! > 0
                                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                                            {assignment.title}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${assignment.priority === 'high'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                                : assignment.priority === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                                            }`}>
                                            {assignment.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span>{assignment.course_name}</span>
                                        <span>• Due {format(new Date(assignment.due_date), "PPP p")}</span>
                                        {assignment.file_url && (
                                            <a href={assignment.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400">
                                                <Download size={14} /> View file
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {assignment.submissions_count || 0}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                            {assignment.submissions_count === 1 ? 'submission' : 'submissions'}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleExpanded(assignment.id)}
                                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(assignment.id)}
                                            className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 hover:text-red-700 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expandable Details */}
                        {expanded.has(assignment.id) && (
                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                                {assignment.instructions && (
                                    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-blue-500">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {assignment.instructions}
                                        </p>
                                    </div>
                                )}

                                {/* Grading Section */}
                                {assignment.submissions_count! > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                            <Award className="w-5 h-5 text-emerald-600" />
                                            Grading ({assignment.submissions_count} submission{assignment.submissions_count! > 1 ? 's' : ''})
                                        </h4>

                                        {editingGrade === assignment.id ? (
                                            <form
                                                action={(formData) => handleGradeSubmit(assignment.id, formData)}
                                                className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Grade</label>
                                                    <input
                                                        name="grade"
                                                        type="text"
                                                        placeholder="e.g. A, 85%, 4.2/5"
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                        defaultValue={assignment.grade || ''}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Feedback</label>
                                                    <textarea
                                                        name="feedback"
                                                        rows={3}
                                                        placeholder="Detailed feedback for students..."
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 resize-vertical"
                                                        defaultValue={assignment.feedback || ''}
                                                    />
                                                </div>
                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        type="submit"
                                                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all"
                                                    >
                                                        Save Grade
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingGrade(null)}
                                                        className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            assignment.grade ? (
                                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-emerald-800 dark:text-emerald-200 text-lg">
                                                            {assignment.grade}
                                                        </span>
                                                        {assignment.graded_at && (
                                                            <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                                                Graded {format(new Date(assignment.graded_at), "MMM dd")}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {assignment.feedback && (
                                                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                                                            {assignment.feedback}
                                                        </p>
                                                    )}
                                                    <button
                                                        onClick={() => setEditingGrade(assignment.id)}
                                                        className="mt-3 text-xs text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
                                                    >
                                                        <Edit size={12} /> Edit grade
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingGrade(assignment.id)}
                                                    className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm font-medium"
                                                >
                                                    <Award className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                    Click to grade ({assignment.submissions_count} submission{assignment.submissions_count! > 1 ? 's' : ''})
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}