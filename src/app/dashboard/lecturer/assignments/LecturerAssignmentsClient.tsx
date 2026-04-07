// src/app/dashboard/lecturer/assignments/LecturerAssignmentsClient.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import LecturerAddAssignmentForm from "./LecturerAddAssignmentForm";
import LecturerAssignmentList from "./LecturerAssignmentList";
import { Menu, Plus, BookOpen } from "lucide-react";

interface Course {
    id: string;
    name: string;
}

interface Props {
    courses: Course[];
    assignments: any[];
}

export default function LecturerAssignmentsClient({ courses, assignments }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);

    const lecturerNavItems = [
        { href: "/dashboard/lecturer", label: "Dashboard", icon: "Home" },
        { href: "/dashboard/lecturer/classes", label: "My Courses", icon: "BookOpen" },
        { href: "/dashboard/lecturer/assignments", label: "Assignments", icon: "FileText" },
        { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
    ];

    return (
        <div className="flex h-screen transition-colors">
            <Sidebar role="lecturer" navItems={lecturerNavItems} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-20 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                    <button 
                        id="menu-toggle" 
                        className="md:hidden pr-4 text-gray-900 dark:text-gray-100 hover:text-blue-500 transition"
                    >
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide">
                            Assignments 📋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage assignments & grade student work
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto scrollbar-hide p-8 space-y-8">
                    {/* Add Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
                        >
                            <Plus size={24} />
                            Create New Assignment
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 rounded-2xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-700 dark:text-blue-200 mb-1">
                                {assignments.length}
                            </div>
                            <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                                Total Assignments
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 rounded-2xl p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-200 mb-1">
                                {assignments.filter(a => a.submissions_count! > 0).length}
                            </div>
                            <div className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                                With Submissions
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 rounded-2xl p-6 text-center">
                            <div className="text-3xl font-bold text-purple-700 dark:text-purple-200 mb-1">
                                {assignments.filter(a => a.status === 'graded').length}
                            </div>
                            <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                                Graded
                            </div>
                        </div>
                    </div>

                    {/* Assignments List */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <BookOpen size={32} />
                                Assignment Management
                            </h2>
                        </div>
                        <LecturerAssignmentList assignments={assignments} />
                    </section>

                    {/* Mochi */}
                    <div className="text-center pt-12 animate-bounce">
                        <p className="text-7xl">🐹</p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 font-semibold">
                            Mochi is ready to help you grade! 📝✨
                        </p>
                    </div>
                </main>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <LecturerAddAssignmentForm
                    courses={courses}
                    onClose={() => setIsAddOpen(false)}
                />
            )}
        </div>
    );
}