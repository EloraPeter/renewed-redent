// src/app/dashboard/student/assignments/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import AddAssignmentForm from "./AddAssignmentForm";
import AssignmentList from "./AssignmentList";

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return <div>Please sign in</div>;
  }

  // Fetch user's courses for the dropdown
  const { rows: courses } = await pool.query(
    "SELECT id, name FROM courses WHERE user_id = $1 ORDER BY name",
    [session.user.id]
  );

  // Fetch assignments – you can split pending / submitted if you want
  const { rows: assignments } = await pool.query(
    `
    SELECT 
      a.id, a.title, a.due_date, a.priority, a.status, a.file_url, a.submitted_at,
      c.name AS course_name
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    WHERE a.user_id = $1
    ORDER BY a.due_date ASC
    `,
    [session.user.id]
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Assignments 📚</h1>

      <AddAssignmentForm courses={courses} />

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Your Assignments</h2>
        <AssignmentList assignments={assignments} />
      </div>
    </div>
  );
}