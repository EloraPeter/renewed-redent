'use client';

import { useState, useRef } from 'react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Course {
    id: string;
    name: string;
    code: string;
    days: string[];
    start_time: string;
    end_time: string;
    location: string;
    lecturer_name?: string;
    lecturer_phone?: string;
    course_rep_name?: string;
    course_rep_phone?: string;
}

interface CoursesClientProps {
    courses: Course[];
    onCreate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
    onUpdate?: (id: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
    onDelete?: (id: string) => Promise<{ success?: boolean; error?: string }>;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function CoursesClient({ courses, onCreate, onUpdate, onDelete }: CoursesClientProps) {
    const { data: session } = useSession();
    const role = session?.user?.role;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const addFormRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    // --- Add Course ---
    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addFormRef.current) return;

        const formData = new FormData(addFormRef.current);
        const result = await onCreate(formData);

        if (result.error) toast.error(result.error);
        else {
            toast.success('Course added!');
            setIsAddOpen(false);
            addFormRef.current.reset();
        }
    };

    // --- Edit Course ---
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editFormRef.current || !editingCourse || !onUpdate) return;

        const formData = new FormData(editFormRef.current);
        const result = await onUpdate(editingCourse.id, formData);

        if (result.error) toast.error(result.error);
        else {
            toast.success('Course updated!');
            setEditingCourse(null);
        }
    };

    // --- Delete Course ---
    const handleDelete = async (id: string) => {
        if (!onDelete) return;
        if (!confirm('Delete this course?')) return;

        const result = await onDelete(id);
        if (result?.error) toast.error(result.error);
        else toast.success('Course deleted!');
    };

    return (
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    My Courses
                </h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow"
                >
                    <Plus size={20} />
                    Add Course
                </button>
            </div>

            {/* List */}
            {courses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <p className="text-gray-500 dark:text-gray-400">No courses added yet</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {courses.map((c) => (
                        <li
                            key={c.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center"
                        >
                            <div>
                                <div className="font-semibold text-lg">{c.name} ({c.code})</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {c.days.map((d) => d.slice(0,3)).join(', ')} • {c.start_time} – {c.end_time} • {c.location}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {onUpdate && (
                                    <button onClick={() => setEditingCourse(c)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500">
                                        <Edit size={18} />
                                    </button>
                                )}
                                {onDelete && (
                                    <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold">Add Course</h2>
                            <button onClick={() => setIsAddOpen(false)}><X size={26} /></button>
                        </div>

                        <form ref={addFormRef} onSubmit={handleAddSubmit} className="space-y-4">
                            <input name="name" placeholder="Course name" required className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                            <input name="code" placeholder="Course code" required className="w-full p-3 border rounded-lg dark:bg-gray-700" />

                            {/* Days */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Days</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {DAYS.map(day => (
                                        <label key={day} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" name="days" value={day} />
                                            <span className="capitalize">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input type="time" name="start_time" required className="p-3 border rounded-lg dark:bg-gray-700" />
                                <input type="time" name="end_time" required className="p-3 border rounded-lg dark:bg-gray-700" />
                            </div>

                            <input name="location" placeholder="Location / Hall" required className="w-full p-3 border rounded-lg dark:bg-gray-700" />

                            {/* Conditional fields */}
                            {role === 'student' && (
                                <>
                                    <input name="lecturer_name" placeholder="Lecturer name" className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                    <input name="lecturer_phone" placeholder="Lecturer phone" className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                </>
                            )}
                            {role === 'lecturer' && (
                                <>
                                    <input name="course_rep_name" placeholder="Course rep name" className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                    <input name="course_rep_phone" placeholder="Course rep phone" className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingCourse && onUpdate && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold">Edit Course</h2>
                            <button onClick={() => setEditingCourse(null)}><X size={26} /></button>
                        </div>

                        <form ref={editFormRef} onSubmit={handleEditSubmit} className="space-y-4">
                            <input name="name" defaultValue={editingCourse.name} className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                            <input name="code" defaultValue={editingCourse.code} className="w-full p-3 border rounded-lg dark:bg-gray-700" />

                            <div>
                                <label className="block text-sm font-medium mb-1">Days</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {DAYS.map(day => (
                                        <label key={day} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                name="days"
                                                value={day}
                                                defaultChecked={editingCourse.days.includes(day)}
                                            />
                                            <span className="capitalize">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input type="time" name="start_time" defaultValue={editingCourse.start_time} className="p-3 border rounded-lg dark:bg-gray-700" />
                                <input type="time" name="end_time" defaultValue={editingCourse.end_time} className="p-3 border rounded-lg dark:bg-gray-700" />
                            </div>

                            <input name="location" defaultValue={editingCourse.location} className="w-full p-3 border rounded-lg dark:bg-gray-700" />

                            {role === 'student' && (
                                <>
                                    <input name="lecturer_name" defaultValue={editingCourse.lecturer_name} className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                    <input name="lecturer_phone" defaultValue={editingCourse.lecturer_phone} className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                </>
                            )}
                            {role === 'lecturer' && (
                                <>
                                    <input name="course_rep_name" defaultValue={editingCourse.course_rep_name} className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                    <input name="course_rep_phone" defaultValue={editingCourse.course_rep_phone} className="w-full p-3 border rounded-lg dark:bg-gray-700" />
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setEditingCourse(null)} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
