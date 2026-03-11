'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Sidebar from "@/components/Sidebar";
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
    onUpdate: (id: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
    onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;   // ← updated
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function CoursesClient({
    courses,
    onCreate,
    onUpdate,
    onDelete,
}: CoursesClientProps) {
    const { data: session } = useSession();
    const role = session?.user?.role; // 'student' | 'lecturer'

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Controlled state for edit days
    const [editDays, setEditDays] = useState<string[]>([]);

    const addFormRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    // Sync edit days when editing course changes
    useEffect(() => {
        if (editingCourse) {
            setEditDays(editingCourse.days || []);
        }
    }, [editingCourse]);

    // Add submit
    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addFormRef.current) return;

        const formData = new FormData(addFormRef.current);
        const result = await onCreate(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Course added!');
            setIsAddOpen(false);
            addFormRef.current.reset();
        }
    };

    // Edit submit
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editFormRef.current || !editingCourse) return;

        const formData = new FormData(editFormRef.current);
        const result = await onUpdate(editingCourse.id, formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Course updated!');
            setEditingCourse(null);
        }
    };

    // Delete
    const handleDelete = async (id: string) => {
        if (!confirm('Delete this course? This cannot be undone.')) return;

        const result = await onDelete(id);
        if (result?.error) {
            toast.error(result.error || 'Failed to delete course');
        } else {
            toast.success('Course deleted!');
        }
    };

    const studentNavItems = [
        { href: "/dashboard/student", label: "Dashboard", icon: "Home" },
        { href: "/dashboard/student/classes", label: "Classes", icon: "Calendar" },
        { href: "/dashboard/student/assignments", label: "Assignments", icon: "BookOpen" },
        { href: "/dashboard/student/routines", label: "Routines", icon: "Clock" },
        { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
    ];

    return (
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                {/* Sidebar */}
                <Sidebar role="student" navItems={studentNavItems} />
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    My Courses
                </h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow-md transition w-full sm:w-auto"
                >
                    <Plus size={20} /> Add Course
                </button>
            </div>

            {/* List */}
            {courses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <p className="text-lg text-gray-500 dark:text-gray-400">No courses yet...</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Add your school timetable here!
                    </p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {courses.map((c) => (
                        <li
                            key={c.id}
                            className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                        >
                            <div className="flex-1">
                                <div className="font-semibold text-lg">
                                    {c.name} ({c.code})
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                                    <span>{c.days.map(d => d.slice(0, 3)).join(', ')}</span>
                                    <span>• {c.start_time} – {c.end_time}</span>
                                    {c.location && <span>• {c.location}</span>}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditingCourse(c)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500"
                                    aria-label="Edit course"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                                    aria-label="Delete course"
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
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl md:text-2xl font-bold">Add Course</h2>
                            <button onClick={() => setIsAddOpen(false)}>
                                <X size={28} />
                            </button>
                        </div>

                        <form ref={addFormRef} onSubmit={handleAddSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Course Name</label>
                                <input name="name" required placeholder="e.g. Introduction to Computer Science" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Course Code</label>
                                <input name="code" required placeholder="e.g. CSC 101" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Days</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {DAYS.map(day => (
                                        <label key={day} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <input type="checkbox" name="days" value={day} className="rounded" />
                                            <span className="capitalize text-sm">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Start Time</label>
                                    <input type="time" name="start_time" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">End Time</label>
                                    <input type="time" name="end_time" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Location</label>
                                <input name="location" placeholder="e.g. LT 3, Faculty of Sciences" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                            {role === 'student' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Lecturer Name</label>
                                        <input name="lecturer_name" placeholder="Dr. John Doe" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Lecturer Phone</label>
                                        <input name="lecturer_phone" placeholder="+234 800 000 0000" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                </>
                            )}

                            {role === 'lecturer' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Course Rep Name</label>
                                        <input name="course_rep_name" placeholder="Jane Smith" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Course Rep Phone</label>
                                        <input name="course_rep_phone" placeholder="+234 800 000 0000" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                                    Add Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingCourse && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl md:text-2xl font-bold">Edit Course</h2>
                            <button onClick={() => setEditingCourse(null)}>
                                <X size={28} />
                            </button>
                        </div>

                        <form ref={editFormRef} onSubmit={handleEditSubmit} className="space-y-5">
                            <input name="name" defaultValue={editingCourse.name} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />

                            <input name="code" defaultValue={editingCourse.code} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Days</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {DAYS.map(day => (
                                        <label key={day} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="days"
                                                value={day}
                                                checked={editDays.includes(day)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setEditDays(prev => [...prev, day]);
                                                    } else {
                                                        setEditDays(prev => prev.filter(d => d !== day));
                                                    }
                                                }}
                                                className="rounded"
                                            />
                                            <span className="capitalize text-sm">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Start Time</label>
                                    <input type="time" name="start_time" defaultValue={editingCourse.start_time} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">End Time</label>
                                    <input type="time" name="end_time" defaultValue={editingCourse.end_time} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Location</label>
                                <input name="location" defaultValue={editingCourse.location ?? ''} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                            {role === 'student' && (
                                <>
                                    <input name="lecturer_name" defaultValue={editingCourse.lecturer_name ?? ''} placeholder="Lecturer name" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                    <input name="lecturer_phone" defaultValue={editingCourse.lecturer_phone ?? ''} placeholder="Lecturer phone" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </>
                            )}

                            {role === 'lecturer' && (
                                <>
                                    <input name="course_rep_name" defaultValue={editingCourse.course_rep_name ?? ''} placeholder="Course rep name" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                    <input name="course_rep_phone" defaultValue={editingCourse.course_rep_phone ?? ''} placeholder="Course rep phone" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </>
                            )}

                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setEditingCourse(null)} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
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