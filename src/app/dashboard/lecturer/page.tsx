// src/app/dashboard/lecturer/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DarkModeToggle from "@/components/DarkModeToggle";
import NotificationScheduler from "@/components/NotificationScheduler";

import { getLecturerData } from "@/lib/data"; // ← you'll need to create/adapt this

export default async function LecturerDashboard() {
    const session = await getServerSession();
    if (!session?.user) redirect("/login");

    const userId = session.user.id; // assuming this exists (uuid/string)
    const userName =
        session.user.name || session.user.email?.split("@")[0] || "Lecturer";

    // Fetch lecturer-specific data
    const {
        todayClasses,
        upcomingAssignmentsToGrade,
        pendingSubmissions,
        recentAnnouncementsCount,
    } = await getLecturerData(userId);



    const lecturerNavItems = [
        { href: "/dashboard/lecturer", label: "Dashboard", icon: "Home" },
        { href: "/dashboard/lecturer/classes", label: "My Courses", icon: "Book" },
        { href: "/dashboard/lecturer/assignments", label: "Assignments", icon: "FileText" },
        { href: "/dashboard/lecturer/gradebook", label: "Gradebook", icon: "BarChart" },
        { href: "/dashboard/lecturer/announcements", label: "Announcements", icon: "Megaphone" },
        { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar role="lecturer" navItems={lecturerNavItems} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Welcome back, {userName} 👨‍🏫
                    </h1>
                    <div className="flex items-center gap-4">
                        <DarkModeToggle />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Today's Classes
                            </h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {todayClasses.length}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {todayClasses.length === 1 ? "class" : "classes"} today
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pending Submissions
                            </h3>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {pendingSubmissions}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                assignments to review
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                To Grade
                            </h3>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {upcomingAssignmentsToGrade.length}           {/* ← .length instead */}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                upcoming / overdue
                            </p>
                        </div>

                        <div className="mt-10 text-center">
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Ready for another productive day? 📚
                            </p>
                        </div>

                        {/* Optional quick stats / recent activity */}
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Quick Stats
                            </h2>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <li className="flex justify-between">
                                        <span>Announcements posted this week</span>
                                        <span className="font-medium">{recentAnnouncementsCount}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Average class attendance (today)</span>
                                        <span className="font-medium">—</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Assignments graded this month</span>
                                        <span className="font-medium">—</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Reuse the same client component — adapt props if needed */}
            <NotificationScheduler
                role="lecturer"
                todayClasses={todayClasses}
                pendingSubmissions={pendingSubmissions}
                upcomingAssignmentsToGrade={upcomingAssignmentsToGrade} // if you fetch this
            />
        </div>
    );
}