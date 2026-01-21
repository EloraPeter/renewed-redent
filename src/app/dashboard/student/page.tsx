import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getStudentData } from "@/lib/data";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function StudentDashboardPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const {
    wakeUpTime,
    firstClass,
    totalPrepMinutes,
    message,
    todayClasses,
    upcomingAssignments,
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
    />
  );
}
