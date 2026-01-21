"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import NotificationScheduler from "@/components/NotificationScheduler";
import { Menu } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
    CalendarIcon,
    AlarmClockIcon,
    BookOpenIcon,
    FlameIcon,
} from "lucide-react";

type Props = {
    userName: string;
    wakeUpTime: string | null;
    firstClass: any;
    totalPrepMinutes: number;
    message?: string;
    todayClasses: any[];
    upcomingAssignments: any[];
};

export default function StudentDashboardClient({
    userName,
    wakeUpTime,
    firstClass,
    totalPrepMinutes,
    message,
    todayClasses,
    upcomingAssignments,
}: Props) {
    const [currentTimeGreeting, setCurrentTimeGreeting] = useState("");
    const [streakProgress] = useState(70);

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
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            <Sidebar role="student" navItems={studentNavItems} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-30 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button id="menu-toggle" className="md:hidden text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
                            <Menu size={26} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {currentTimeGreeting}, {userName} 👋
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Here’s what your day looks like
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-10">

                    {/* Wake-Up Card */}
                    <section className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 p-8 shadow-md hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                                    Suggested wake-up
                                </p>
                                <div className="flex items-end gap-4 mt-2">
                                    <p className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
                                        {wakeUpTime || "--:--"}
                                    </p>
                                    {firstClass && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            for {firstClass.name} at {firstClass.start_time}
                                        </p>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-gray-400">
                                    Includes prep and commute buffer (~{totalPrepMinutes} min)
                                </p>
                            </div>
                            <Button variant="default" className="h-10 self-start mt-1">
                                Set Alarm
                            </Button>
                        </div>
                    </section>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Deadlines Card */}
                        <Card className="relative overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform shadow-md hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <BookOpenIcon className="w-5 h-5 text-green-500" />
                                    Deadlines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-bold text-green-600">{upcomingAssignments.length}</p>
                                    <Badge variant="secondary">Due soon</Badge>
                                </div>
                                <Progress value={Math.min(upcomingAssignments.length * 10, 100)} className="mt-3 h-2 rounded-full" />
                            </CardContent>
                            <div className="absolute bottom-0 right-0 w-20 h-20 bg-green-100/50 dark:bg-green-900/30 rounded-tl-full" />
                        </Card>

                        {/* Today's Classes Card */}
                        <Card className="relative overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform shadow-md hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <CalendarIcon className="w-5 h-5 text-purple-500" />
                                    Today's Classes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl font-bold">
                                    {todayClasses.length === 0 ? "No classes today" : `${todayClasses.length} scheduled`}
                                </p>
                                {todayClasses.length > 0 && (
                                    <ul className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                                        {todayClasses.slice(0, 2).map((cls, i) => (
                                            <li key={i} className="hover:text-purple-600 dark:hover:text-purple-400 transition">
                                                {cls.name} at {cls.start_time}
                                            </li>
                                        ))}
                                        {todayClasses.length > 2 && <li className="text-gray-400">...and {todayClasses.length - 2} more</li>}
                                    </ul>
                                )}
                            </CardContent>
                            <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-100/50 dark:bg-purple-900/30 rounded-tl-full" />
                        </Card>

                        {/* Streak Card */}
                        <Card className="relative overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform shadow-md hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <FlameIcon className="w-5 h-5 text-orange-500" />
                                    Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-orange-500">7 days 🔥</p>
                                <Progress value={streakProgress} className="mt-3 h-2 rounded-full bg-orange-100 dark:bg-orange-900/20" />
                                <p className="text-sm text-gray-500 mt-1">Keep it going!</p>
                            </CardContent>
                            <div className="absolute bottom-0 right-0 w-20 h-20 bg-orange-100/50 dark:bg-orange-900/30 rounded-tl-full" />
                        </Card>
                    </div>

                    {/* Mochi Motivation */}
                    <div className="mt-12 text-center animate-bounce">
                        <p className="text-5xl md:text-6xl">🐹</p>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-3">
                            Mochi is cheering for you! 🎉
                        </p>
                    </div>
                </main>
            </div>

            {/* Notification Scheduler */}
            <NotificationScheduler
                role="student"
                wakeUpTime={wakeUpTime}
                todayClasses={todayClasses}
                upcomingAssignments={upcomingAssignments}
            />
        </div>
    );
}
