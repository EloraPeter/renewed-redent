// src/app/dashboard/lecturer/classes/LecturerCoursesClient.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X, Edit, Trash2, Users, Phone, MapPin, BookOpen as BookOpenIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Sidebar from "@/components/Sidebar";
import toast from 'react-hot-toast';
import { Menu } from "lucide-react";
import { useRouter } from 'next/navigation';
import AddEditCourseModal from '@/components/AddEditCourseModal';

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

interface LecturerCoursesClientProps {
    courses: Course[];
    onCreate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
    onUpdate: (id: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
    onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function LecturerCoursesClient({
    courses,
    onCreate,
    onUpdate,
    onDelete,
}: LecturerCoursesClientProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [editDays, setEditDays] = useState<string[]>([]);

    const addFormRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    // Sync edit days
    useEffect(() => {
        if (editingCourse) {
            setEditDays(editingCourse.days || []);
        }
    }, [editingCourse]);

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addFormRef.current) return;

        const formData = new FormData(addFormRef.current);
        const result = await onCreate(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Course added successfully!');
            setIsAddOpen(false);
            addFormRef.current.reset();
            router.refresh();
        }
    };

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
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this course? This cannot be undone.')) return;

        const result = await onDelete(id);
        if (result?.error) {
            toast.error(result.error || 'Failed to delete course');
        } else {
            toast.success('Course deleted!');
            router.refresh();
        }
    };

    const lecturerNavItems = [
        { href: "/dashboard/lecturer", label: "Dashboard", icon: "Home" },
        { href: "/dashboard/lecturer/classes", label: "My Courses", icon: "BookOpen" },
        { href: "/dashboard/lecturer/assignments", label: "Assignments", icon: "FileText" },
        { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
    ];

    return (
        <div className="flex h-screen transition-colors">
            {/* Sidebar */}
            <Sidebar role="lecturer" navItems={lecturerNavItems} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="sticky top-0 z-20 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                    <button id="menu-toggle" className="md:hidden pr-4 text-gray-900 dark:text-gray-100 hover:text-blue-500 transition">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide">
                        My Courses 📚
                    </h1>
                </header>

                <main className="flex-1 overflow-y-auto scrollbar-hide p-8 space-y-8">
                    {/* Header with Add Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Course Schedule
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Manage your teaching timetable
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                        >
                            <Plus size={20} />
                            Add New Course
                        </button>
                    </div>

                    {/* Courses Grid */}
                    {courses.length === 0 ? (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <BookOpenIcon className="w-20 h-20 text-gray-400 mx-auto mb-6 opacity-60" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No courses yet
                            </h3>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                Add your courses to get started with class scheduling, assignments, and student management.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group"
                                >
                                    {/* Course Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {course.name}
                                            </h3>
                                            <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 px-3 py-1 rounded-full mt-2 inline-block">
                                                <span className="font-mono text-sm font-semibold text-blue-800 dark:text-blue-200">
                                                    {course.code}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-3 flex-shrink-0">
                                            <button
                                                onClick={() => setEditingCourse(course)}
                                                className="p-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 hover:text-blue-700 transition-all group-hover:scale-110"
                                                title="Edit course"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="p-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 hover:text-red-700 transition-all group-hover:scale-110"
                                                title="Delete course"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Schedule Info */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin size={16} className="text-blue-500 flex-shrink-0" />
                                            <span className="font-medium">{course.location || 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                                {course.start_time}
                                            </span>
                                            <span className="text-gray-400 mx-1">–</span>
                                            <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                                {course.end_time}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {course.days.map((day, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/50 text-xs font-medium text-purple-800 dark:text-purple-200 rounded-full capitalize"
                                                >
                                                    {day.slice(0, 3)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Course Rep */}
                                    {course.course_rep_name && (
                                        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                                            <div className="flex items-center gap-2 text-sm bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl">
                                                <Users size={16} className="text-emerald-600 flex-shrink-0" />
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {course.course_rep_name}
                                                </span>
                                                {course.course_rep_phone && (
                                                    <a
                                                        href={`tel:${course.course_rep_phone}`}
                                                        className="ml-auto p-1.5 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 rounded-lg transition-colors"
                                                    >
                                                        <Phone size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add/Edit Modals */}
                    {isAddOpen && (
                        <AddEditCourseModal
                            ref={addFormRef}
                            onSubmit={handleAddSubmit}
                            onClose={() => setIsAddOpen(false)}
                            title="Add New Course"
                            submitLabel="Add Course"
                            isLecturer={true}
                        />
                    )}

                    {editingCourse && (
                        <AddEditCourseModal
                            ref={editFormRef}
                            course={editingCourse}
                            editDays={editDays}
                            onSubmit={handleEditSubmit}
                            onClose={() => setEditingCourse(null)}
                            title="Edit Course"
                            submitLabel="Save Changes"
                            isLecturer={true}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}