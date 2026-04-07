"use client";

import Sidebar from "@/components/Sidebar";
import NotificationScheduler from "@/components/NotificationScheduler";
import { Menu, BookOpen, FileText } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  userName: string;
  data: any;
};

export default function LecturerDashboardClient({ userName, data }: Props) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
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
    <div className="flex h-screen">
      
      <Sidebar role="lecturer" navItems={lecturerNavItems} />

      <div className="flex-1 overflow-y-auto p-6 space-y-10">

        <header className="flex justify-between items-center">
          <button className="md:hidden">
            <Menu size={24} />
          </button>

          <h1 className="text-3xl font-bold">
            {greeting}, {userName} 👨‍🏫
          </h1>
        </header>


        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <p className="text-sm text-gray-400">Today's Classes</p>
            <p className="text-3xl font-bold">
              {data.todayClasses.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <p className="text-sm text-gray-400">Pending Submissions</p>
            <p className="text-3xl font-bold">
              {data.pendingSubmissions}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <p className="text-sm text-gray-400">To Grade</p>
            <p className="text-3xl font-bold">
              {data.upcomingAssignmentsToGrade.length}
            </p>
          </div>

        </section>


        {/* Today's Classes */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>

          {data.todayClasses.length === 0 ? (
            <p className="text-gray-500">No classes today.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {data.todayClasses.map((cls: any, i: number) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <h3 className="font-semibold">{cls.name}</h3>
                  <p>{cls.start_time}</p>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* Assignment Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Course Assignment Stats</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {data.courseStats.map((stat: any) => (
              <div
                key={stat.course}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl"
              >
                <h3 className="font-semibold">{stat.course}</h3>

                <p className="mt-2">
                  {stat.onTimePercent}% on time
                </p>

                <p className="text-sm text-gray-500">
                  Submitted {stat.submitted} / {stat.past}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>


      <NotificationScheduler
        role="lecturer"
        todayClasses={data.todayClasses}
        pendingSubmissions={data.pendingSubmissions}
        upcomingAssignmentsToGrade={data.upcomingAssignmentsToGrade}
      />

    </div>
  );
}