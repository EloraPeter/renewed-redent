"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AddAssignmentForm from "./AddAssignmentForm";
import AssignmentList from "./AssignmentList";
import { Menu, Plus } from "lucide-react";

interface Course {
    id: string;   // must match AddAssignmentForm type
    name: string;
}

interface Props {
    courses: Course[];
    assignments: any[]; // or type properly if you have Assignment type
}

export default function AssignmentsClient({ courses, assignments }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);

    const studentNavItems = [
        { href: "/dashboard/student", label: "Dashboard", icon: "Home" },
        { href: "/dashboard/student/classes", label: "Classes", icon: "Calendar" },
        { href: "/dashboard/student/assignments", label: "Assignments", icon: "BookOpen" },
        { href: "/dashboard/student/routines", label: "Routines", icon: "Clock" },
        { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
    ];

    return (
        <div className="flex h-screen transition-colors">
            <Sidebar role="student" navItems={studentNavItems} />
            <div className="p-6 max-w-5xl mx-auto">
                <header className='flex items-center justify-between'>
                    <button
                        id="menu-toggle"
                        className="md:hidden pr-4 text-gray-900 dark:text-gray-100 hover:text-pink-500 transition"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-3xl font-bold mb-8">Assignments 📚</h1>
                </header>

                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow-md transition w-full sm:w-auto"
                >
                    <Plus size={20} /> Add Assignment
                </button>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6">Your Assignments</h2>
                    <AssignmentList assignments={assignments} />
                </div>

                {isAddOpen &&
                    <AddAssignmentForm
                        courses={courses.map(course => ({
                            ...course,
                            id: course.id.toString(), // convert number to string
                        }))}
                        onClose={() => setIsAddOpen(false)}

                    />
                }
            </div>
        </div>
    );
}