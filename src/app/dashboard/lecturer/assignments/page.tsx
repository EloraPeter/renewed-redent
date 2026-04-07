// src/app/dashboard/lecturer/assignments/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import LecturerAssignmentsClient from "./LecturerAssignmentsClient";
import { Toaster } from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default async function LecturerAssignmentsPage() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'lecturer') {
        return <div>Access denied</div>;
    }

    // Fetch lecturer's courses
    const { rows: courses } = await pool.query(
        "SELECT id, name FROM courses WHERE user_id = $1 ORDER BY name",
        [session.user.id]
    );

    // Fetch assignments with submission stats
    const { rows: assignments } = await pool.query(
        `
        SELECT 
          a.id, a.title, a.due_date, a.priority, a.status, 
          a.instructions, a.file_url, a.submitted_at, a.grade, a.feedback, a.graded_at,
          c.name AS course_name,
          COUNT(s.id) as submissions_count
        FROM assignments a
        JOIN courses c ON a.course_id = c.id
        LEFT JOIN assignments s ON s.id = a.id AND s.submitted_at IS NOT NULL
        WHERE a.user_id = $1
        GROUP BY a.id, c.name
        ORDER BY a.due_date DESC
        `,
        [session.user.id]
    );

    return (
        <>
            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(0,0,0,0.9)',
                    }
                }}
            />
            <LecturerAssignmentsClient
                courses={courses}
                assignments={assignments}
            />
        </>
    );
}