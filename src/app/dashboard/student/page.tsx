// src/app/dashboard/student/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getStudentData } from "@/lib/data";
import StudentDashboardClient from "./StudentDashboardClient";
import { authOptions } from "@/lib/auth";   // ← ADD THIS IMPORT

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);   // ← FIXED: pass authOptions

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const {
    wakeUpTime,
    firstClass,
    totalPrepMinutes,
    message,
    todayClasses,
    upcomingAssignments,
    streak,          
  } = await getStudentData(userId);

  return (
    <StudentDashboardClient
      userName={session.user.name || session.user.email?.split("@")[0] || "Student"}
      wakeUpTime={wakeUpTime}
      firstClass={firstClass}
      totalPrepMinutes={totalPrepMinutes}
      message={message}
      todayClasses={todayClasses}
      upcomingAssignments={upcomingAssignments}
      streak={streak}         
    />
  );
}