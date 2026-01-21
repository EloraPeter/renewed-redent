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
  const { wakeUpTime, firstClass, totalPrepMinutes, message, todayClasses, upcomingAssignments } = await getStudentData(userId);
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
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button id="menu-toggle" className="md:hidden">
              <Menu />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                Hi {userName} 👋
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Let’s make today productive
              </p>
            </div>
          </div>
        </header>


        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suggested Wake-Up
            </h3>
            {message ? (
              <p className="text-xl font-bold text-gray-600 dark:text-gray-300">{message}</p>
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
              </>
            ) : (
              <p className="text-xl text-gray-600">Loading wake-up...</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="min-w-[220px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-5 shadow-lg">
              <p className="text-sm opacity-90">Deadlines</p>
              <p className="text-3xl font-bold">{upcomingAssignments.length}</p>
              <p className="text-xs opacity-80 mt-1">Due soon</p>
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