"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import NotificationScheduler from "@/components/NotificationScheduler";
import Link from "next/link";
import { Menu, BookOpenIcon, CalendarIcon, FlameIcon, CoffeeIcon } from "lucide-react";

type Props = {
    userName: string;
    wakeUpTime: string | null;
    firstClass: any | null;
    totalPrepMinutes: number;
    todayClasses: any[];
    upcomingAssignments: any[];
    message?: string; 

};

export default function StudentDashboardClient({
    userName,
    wakeUpTime,
    firstClass,
    totalPrepMinutes,
    todayClasses,
    upcomingAssignments,
}: Props) {
    const [currentTimeGreeting, setCurrentTimeGreeting] = useState("");
    const [streakProgress, setStreakProgress] = useState(7); // default 7 days

    useEffect(() => {
        const hour = new Date().getHours();
        setCurrentTimeGreeting(
            hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
        );
    }, []);

    const studentNavItems = [
        { href: "/dashboard/student", label: "Dashboard", icon: "Home" },
        { href: "/dashboard/student/classes", label: "Classes", icon: "Calendar" },
        { href: "/dashboard/student/assignments", label: "Assignments", icon: "BookOpen" },
        { href: "/dashboard/student/routines", label: "Routines", icon: "Clock" },
        { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
    ];

    return (
        <div className="flex h-screen transition-colors">
            {/* Sidebar */}
            <Sidebar role="student" navItems={studentNavItems} />

            {/* Main dashboard area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="sticky top-0 z-20  backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                    <button
                        id="menu-toggle"
                        className="md:hidden pr-4 text-gray-900 dark:text-gray-100 hover:text-pink-500 transition"
                    >
                        <Menu size={24} />
                    </button>

                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide">
                            {currentTimeGreeting}, {userName} 🐹
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Let’s make today amazing!
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto scrollbar-hide p-6  space-y-10">

                    {/* Wake-Up Suggestion */}
                    <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CoffeeIcon className="w-6 h-6 text-yellow-400" />
                                Wake-Up Suggestion
                            </h2>
                            <span className="text-sm text-gray-400 dark:text-gray-300">
                                Prep & commute: ~{totalPrepMinutes} min
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
                                {wakeUpTime || "--:--"}
                            </p>
                            {firstClass && (
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    for <span className="font-semibold">{firstClass.name}</span> at {firstClass.start_time}
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Upcoming Deadlines */}
                        <Link href="/dashboard/student/assignments" passHref>
                            <div className="bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-3xl p-6 flex flex-col gap-3 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-pink-700 dark:text-pink-200 flex items-center gap-2">
                                        <BookOpenIcon className="w-5 h-5" />
                                        Upcoming Deadlines
                                    </h3>
                                    <span className="text-white bg-pink-500 rounded-full px-3 py-1 text-sm font-semibold">
                                        {upcomingAssignments.length}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Don’t let anything slip!
                                </p>
                            </div>
                        </Link>

                        {/* Today's Classes */}
                        <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-3xl p-6 flex flex-col gap-3 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-200 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5" />
                                Today's Classes
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                {todayClasses.length === 0 ? "No classes today" : `${todayClasses.length} scheduled`}
                            </p>
                            {todayClasses.length > 0 && (
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {todayClasses.slice(0, 3).map((cls, i) => (
                                        <li key={i} className="hover:text-purple-500 dark:hover:text-purple-300 transition">
                                            {cls.name} at {cls.start_time}
                                        </li>
                                    ))}
                                    {todayClasses.length > 3 && <li className="text-gray-400">...and {todayClasses.length - 3} more</li>}
                                </ul>
                            )}
                        </div>

                        {/* Streak */}
                        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-3xl p-6 flex flex-col gap-3 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                            <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-200 flex items-center gap-2">
                                <FlameIcon className="w-5 h-5" />
                                Streak
                            </h3>
                            <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400">{streakProgress} days 🔥</p>
                            <p className="text-sm text-gray-500">Keep it going!</p>
                        </div>

                    </section>

                    {/* Mochi */}
                    <div className="mt-12 text-center animate-bounce">
                        <p className="text-6xl md:text-7xl">🐹</p>
                        <p className="text-2xl text-gray-600 dark:text-gray-300 mt-3">
                            Mochi is cheering for you! 🎉
                        </p>
                    </div>

                </main>
            </div>

            {/* Notifications */}
            <NotificationScheduler
                role="student"
                wakeUpTime={wakeUpTime}
                todayClasses={todayClasses}
                upcomingAssignments={upcomingAssignments}
            />
        </div>
    );
}
