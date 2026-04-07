// src/app/dashboard/lecturer/LecturerDashboardClient.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import NotificationScheduler from "@/components/NotificationScheduler";
import Link from "next/link";
import {
    Menu,
    Home,
    BookOpen,
    FileText,
    Calendar,
    Clock,
    Users,
    Award,
    TrendingUp,
    CheckCircle,
} from "lucide-react";

type ClassItem = {
    name: string;
    start_time: string;
    end_time?: string;
    location?: string;
    code?: string;
    weekday?: string;

};

type CourseStat = {
    course: string;
    past: number;
    submitted: number;
    onTime: number;
    onTimePercent: number;
};

type Props = {
    userName: string;
    todayClasses: ClassItem[];
    weeklyClasses: ClassItem[];
    pendingSubmissions: number;
    upcomingAssignmentsToGrade: any[];
    courseStats: CourseStat[];
};

export default function LecturerDashboardClient({
    userName,
    todayClasses,
    weeklyClasses,
    pendingSubmissions,
    upcomingAssignmentsToGrade,
    courseStats,
}: Props) {
    const [currentTimeGreeting, setCurrentTimeGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        setCurrentTimeGreeting(
            hour < 12
                ? "Good morning"
                : hour < 18
                    ? "Good afternoon"
                    : "Good evening"
        );
    }, []);

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

            {/* Main dashboard area */}
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
                            {currentTimeGreeting}, {userName} 👨‍🏫
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Ready to inspire today's scholars!
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-10">
                    {/* Today's Quick Stats */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Today's Classes */}
                        <Link href="/dashboard/lecturer/classes" className="block">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-3xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border border-blue-200/50 dark:border-blue-800/50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-blue-500/20 rounded-xl">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <span className="text-2xl font-bold bg-blue-500 text-white px-3 py-1 rounded-full">
                                        {todayClasses.length}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-blue-800 dark:text-blue-200 mb-1">
                                    Today's Classes
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {todayClasses.length === 0 ? "Free day ahead" : "Sessions scheduled"}
                                </p>
                            </div>
                        </Link>

                        {/* Pending Submissions */}
                        <Link href="/dashboard/lecturer/assignments" className="block">
                            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border border-orange-200/50 dark:border-orange-800/50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-orange-500/20 rounded-xl">
                                        <FileText className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <span className="text-2xl font-bold bg-orange-500 text-white px-3 py-1 rounded-full">
                                        {pendingSubmissions}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-orange-800 dark:text-orange-200 mb-1">
                                    Pending Reviews
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Student submissions
                                </p>
                            </div>
                        </Link>

                        {/* To Grade Soon */}
                        <Link href="/dashboard/lecturer/assignments" className="block">
                            <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-3xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border border-purple-200/50 dark:border-purple-800/50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-purple-500/20 rounded-xl">
                                        <Clock className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <span className="text-2xl font-bold bg-purple-500 text-white px-3 py-1 rounded-full">
                                        {upcomingAssignmentsToGrade.length}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-purple-800 dark:text-purple-200 mb-1">
                                    Grade Soon
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Due this week
                                </p>
                            </div>
                        </Link>

                        {/* Course Performance */}
                        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-3xl p-6 hover:scale-105 transition-all duration-300 shadow-lg border border-emerald-200/50 dark:border-emerald-800/50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-emerald-500/20 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-2xl font-bold bg-emerald-500 text-white px-3 py-1 rounded-full">
                                    {courseStats.length}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-200 mb-1">
                                Active Courses
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                With assignments
                            </p>
                        </div>
                    </section>

                    {/* Today's Classes Detailed */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <Home className="w-7 h-7" />
                            Today's Schedule
                        </h2>
                        {todayClasses.length === 0 ? (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No classes today
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Perfect time for research, grading, or coffee ☕
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {todayClasses.map((cls, i) => (
                                    <Link
                                        key={i}
                                        href="/dashboard/lecturer/classes"
                                        className="group"
                                    >
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group-hover:border-blue-300">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2">
                                                    {cls.name}
                                                </h3>
                                                <div className="bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                    <span className="font-mono text-sm font-bold">
                                                        {cls.start_time}
                                                    </span>
                                                </div>
                                            </div>
                                            {cls.location && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                                    <span className="w-4 h-4 bg-gray-300 rounded-full" />
                                                    {cls.location}
                                                </p>
                                            )}
                                            {cls.end_time && (
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                                    Ends {cls.end_time}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Weekly Overview + Course Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Weekly Schedule */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Clock className="w-7 h-7" />
                                This Week
                            </h2>
                            <div className="space-y-3">
                                {weeklyClasses.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No courses this week
                                        </p>
                                    </div>
                                ) : (
                                    weeklyClasses.slice(0, 8).map((cls, i) => (
                                        <div
                                            key={i}
                                            className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-5 rounded-xl border-l-4 border-indigo-500 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                                                        {cls.weekday}
                                                    </span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {cls.name}
                                                    </span>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                        {cls.start_time}
                                                        <span className="text-indigo-500 mx-1">–</span>
                                                        {cls.end_time}
                                                    </div>
                                                    {cls.location && (
                                                        <div className="text-xs text-gray-500 mt-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                                            {cls.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Course Performance Stats */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Award className="w-7 h-7" />
                                Course Stats
                            </h2>
                            {courseStats.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No assignment data yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {courseStats.map((stat, i) => (
                                        <div
                                            key={i}
                                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border hover:shadow-md transition-all group cursor-pointer hover:border-emerald-300"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {stat.course}
                                                </h4>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-emerald-600">
                                                        {stat.onTimePercent}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        on time
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${stat.onTimePercent}%` }}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {stat.onTime}/{stat.past} on time •{" "}
                                                {stat.submitted}/{stat.past} submitted
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Mochi cheering */}
                    <div className="text-center pt-12 animate-bounce">
                        <p className="text-7xl md:text-8xl">🐹✨</p>
                        <p className="text-2xl text-gray-600 dark:text-gray-300 mt-4 font-semibold">
                            Mochi says: "You're an amazing educator!" 🎓
                        </p>
                    </div>
                </main>
            </div>

            {/* Notifications */}
            <NotificationScheduler
                role="lecturer"
                todayClasses={todayClasses}
                pendingSubmissions={pendingSubmissions}
                upcomingAssignmentsToGrade={upcomingAssignmentsToGrade}
            />
        </div>
    );
}