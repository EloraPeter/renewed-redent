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
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 to-gray-900">
            <Sidebar role="student" navItems={studentNavItems} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <button id="menu-toggle" className="md:hidden text-gray-700 dark:text-gray-300">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                {currentTimeGreeting}, {userName} 👋
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Let’s crush today’s goals
                            </p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {/* Wake-Up Card */}
                    <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <AlarmClockIcon className="w-5 h-5 text-blue-500" />
                                Suggested Wake-Up
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {message ? (
                                <p className="text-xl font-bold text-gray-600 dark:text-gray-300 animate-pulse">{message}</p>
                            ) : wakeUpTime ? (
                                <>
                                    <p className="text-3xl font-bold text-blue-600">{wakeUpTime}</p>
                                    {firstClass && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            For {firstClass.name} at {firstClass.start_time}
                                            {firstClass.location && ` (${firstClass.location})`}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-2">
                                        Total prep: ~{totalPrepMinutes} min (including commute & buffers)
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-3">Set Alarm</Button>
                                </>
                            ) : (
                                <p className="text-xl text-gray-600">Loading wake-up...</p>
                            )}
                        </CardContent>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/50 dark:bg-blue-900/30 rounded-bl-full" />
                    </Card>

                    {/* Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Deadlines Card */}
                        <Card className="relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <BookOpenIcon className="w-5 h-5 text-green-500" />
                                    Deadlines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-bold text-green-600">{upcomingAssignments.length}</p>
                                    <Badge variant="secondary" className="ml-2">Due soon</Badge>
                                </div>
                                <Progress value={Math.min(upcomingAssignments.length * 10, 100)} className="mt-2 h-2" />
                            </CardContent>
                            <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-100/50 dark:bg-green-900/30 rounded-tl-full" />
                        </Card>

                        {/* Today's Classes Card */}
                        <Card className="relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-purple-500" />
                                    Today's Classes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl font-bold">
                                    {todayClasses.length === 0 ? "No classes today" : `${todayClasses.length} scheduled`}
                                </p>
                                {todayClasses.length > 0 && (
                                    <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                                        {todayClasses.slice(0, 2).map((cls, i) => (
                                            <li key={i}>{cls.name} at {cls.start_time}</li>
                                        ))}
                                        {todayClasses.length > 2 && <li>...and {todayClasses.length - 2} more</li>}
                                    </ul>
                                )}
                            </CardContent>
                            <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-100/50 dark:bg-purple-900/30 rounded-tl-full" />
                        </Card>

                        {/* Streak Card */}
                        <Card className="relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <FlameIcon className="w-5 h-5 text-orange-500" />
                                    Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-orange-500">7 days 🔥</p>
                                <Progress value={streakProgress} className="mt-2 h-2 bg-orange-100" />
                                <p className="text-sm text-gray-500 mt-1">Keep it going!</p>
                            </CardContent>
                            <div className="absolute bottom-0 right-0 w-16 h-16 bg-orange-100/50 dark:bg-orange-900/30 rounded-tl-full" />
                        </Card>
                    </div>

                    {/* Mochi Motivation */}
                    <div className="mt-10 text-center animate-bounce">
                        <p className="text-4xl">🐹</p>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                            Mochi is cheering for you! 🎉
                        </p>
                    </div>
                </main>
            </div>

            {/* Client component gets real props */}
            <NotificationScheduler
                role="student"
                wakeUpTime={wakeUpTime}
                todayClasses={todayClasses}
                upcomingAssignments={upcomingAssignments}
            />
        </div>
    );
}