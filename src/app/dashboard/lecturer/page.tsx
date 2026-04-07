// src/app/dashboard/lecturer/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import NotificationScheduler from "@/components/NotificationScheduler";
import { getLecturerData } from "@/lib/data";
import { Menu } from 'lucide-react'; // hamburger icon
import Sidebar from "@/components/Sidebar";
import LecturerDashboardClient from "./LecturerDashboardClient";


// // Simple loading component (client-side would be better with Suspense, but this is fast for now)
// function SkeletonCard() {
//     return <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>;
// }

// export default async function LecturerDashboard() {
// const session = await getServerSession(authOptions);    
// if (!session?.user) redirect("/login");

//     const userId = session.user.id as string;
//     const userName = session.user.name || session.user.email?.split("@")[0] || "Lecturer";

//     const data = await getLecturerData(userId);

//     const hasClassesToday = data.todayClasses.length > 0;
//     const hasWeekly = data.weeklyClasses.length > 0;

//     const lecturerNavItems = [
//         { href: '/dashboard/lecturer', label: 'Dashboard', icon: 'Home' },
//         { href: '/dashboard/lecturer/classes', label: 'My Courses', icon: 'BookOpen' },
//         { href: '/dashboard/lecturer/assignments', label: 'Assignments', icon: 'FileText' },
//         { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
//     ];

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
//             <Sidebar role="lecturer" navItems={lecturerNavItems} />



//             <header className="flex justify-between items-center mb-8">
//                 <button
//                     id="menu-toggle"
//                     className="md:hidden text-gray-900 dark:text-gray-100"
//                 >
//                     <Menu size={24} />
//                 </button>
//                 <h1 className="text-2xl md:text-3xl font-bold">
//                     Welcome back, {userName} 👨‍🏫
//                 </h1>
                

//             </header>

//             {/* Quick stats row */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Today's Classes</p>
//                     <p className="text-3xl font-bold">{data.todayClasses.length}</p>
//                 </div>
//                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Pending Submissions</p>
//                     <p className="text-3xl font-bold">{data.pendingSubmissions}</p>
//                 </div>
//                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">To Grade Soon</p>
//                     <p className="text-3xl font-bold">{data.upcomingAssignmentsToGrade.length}</p>
//                 </div>
//                 {/* <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Announcements (week)</p>
//                     <p className="text-3xl font-bold">{data.recentAnnouncementsCount}</p>
//                 </div> */}
//             </div>

//             {/* Today's classes */}
//             <section className="mb-10">
//                 <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
//                 {data.todayClasses.length === 0 ? (
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center text-gray-500">
//                         No classes scheduled today — enjoy the free time! ☕
//                     </div>
//                 ) : (
//                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                         {data.todayClasses.map((cls, i) => (
//                             <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
//                                 <h3 className="font-medium">{cls.name}</h3>
//                                 <p className="text-lg mt-1">{cls.start_time}</p>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Weekly overview */}
//             <section className="mb-10">
//                 <h2 className="text-xl font-semibold mb-4">This Week's Schedule</h2>
//                 {data.weeklyClasses.length === 0 ? (
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center text-gray-500">
//                         No courses scheduled this week.
//                     </div>
//                 ) : (
//                     <div className="space-y-3">
//                         {data.weeklyClasses.map((cls, i) => (
//                             <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex justify-between">
//                                 <div>
//                                     <span className="font-medium">{cls.weekday}</span>
//                                     <span className="ml-3">{cls.name}</span>
//                                 </div>
//                                 <div className="text-right">
//                                     <div>{cls.start_time} – {cls.end_time}</div>
//                                     {cls.location && <div className="text-sm text-gray-500">{cls.location}</div>}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Submission stats */}
//             <section className="mb-10">
//                 <h2 className="text-xl font-semibold mb-4">Assignment Stats</h2>
//                 {data.courseStats.length === 0 ? (
//                     <p className="text-gray-500">No past assignments yet.</p>
//                 ) : (
//                     <div className="grid gap-4 md:grid-cols-2">
//                         {data.courseStats.map((stat) => (
//                             <div key={stat.course} className="bg-white dark:bg-gray-800 p-5 rounded-lg">
//                                 <h3 className="font-medium">{stat.course}</h3>
//                                 <p className="mt-2">
//                                     {stat.onTimePercent}% on time ({stat.onTime}/{stat.past})
//                                 </p>
//                                 <p className="text-sm text-gray-500">
//                                     Submitted: {stat.submitted} / {stat.past}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Attach notifications – pass only lecturer props */}
//             <NotificationScheduler
//                 role="lecturer"
//                 todayClasses={data.todayClasses}
//                 pendingSubmissions={data.pendingSubmissions}
//                 upcomingAssignmentsToGrade={data.upcomingAssignmentsToGrade}
//             />

//             {/* Mochi placeholder – later replace with real Lottie */}
//             <div className="fixed bottom-6 right-6 text-6xl opacity-80 pointer-events-none">
//                 🐹✨
//             </div>
//         </div>
//     );
// }

export default async function LecturerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const data = await getLecturerData(session.user.id);

  return (
    <LecturerDashboardClient
      userName={session.user.name || "Lecturer"}
      data={data}
    />
  );
}