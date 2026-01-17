// src/app/dashboard/student/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Menu } from 'lucide-react'; // hamburger icon
import NotificationScheduler from "@/components/NotificationScheduler";

import { getStudentData } from "@/lib/data";

export default async function StudentDashboard() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const userId = session.user.id; // ← make sure this exists (uuid/string)
  const userName = session.user.name || session.user.email?.split("@")[0] || "Student";

  // Fetch real data
  const { wakeUpTime, todayClasses, upcomingAssignments } = await getStudentData(userId);

  const studentNavItems = [
    { href: "/dashboard/student", label: "Dashboard", icon: "Home" },
    { href: "/dashboard/student/classes", label: "Classes", icon: "Calendar" },
    { href: "/dashboard/student/assignments", label: "Assignments", icon: "BookOpen" },
    { href: "/dashboard/student/routines", label: "routines", icon: "Clock" },
    { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar role="student" navItems={studentNavItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            id="menu-toggle"
            className="md:hidden text-gray-900 dark:text-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome back, {userName} 🐹
          </h1>


        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upcoming Deadlines
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {upcomingAssignments.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                tasks due soon
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Today's Classes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {todayClasses.length === 0 ? "No classes today" : `${todayClasses.length} scheduled`}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Streak
              </h3>
              <p className="text-3xl font-bold text-orange-500">7 days 🔥</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Mochi is happy to see you! 🎉
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