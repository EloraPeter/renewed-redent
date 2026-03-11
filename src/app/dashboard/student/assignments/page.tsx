// // src/app/dashboard/student/assignments/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import AssignmentsClient from "./AssignmentsClient"; // client component

export default async function AssignmentsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return <div>Please sign in</div>;
    }

    // Fetch user's courses
    const { rows: courses } = await pool.query(
        "SELECT id, name FROM courses WHERE user_id = $1 ORDER BY name",
        [session.user.id]
    );

    // Fetch assignments
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
        <AssignmentsClient
    courses={courses.map(c => ({ ...c, id: c.id.toString() }))}
    assignments={assignments}
/>
    );
}




// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import pool from "@/lib/db";
// import AddAssignmentForm from "./AddAssignmentForm";
// import AssignmentList from "./AssignmentList";
// import Sidebar from "@/components/Sidebar";
// import { Menu, Plus } from "lucide-react";
// import { useState } from "react";



// export default async function AssignmentsPage() {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//         return <div>Please sign in</div>;
//     }
//         const [isAddOpen, setIsAddOpen] = useState(false);
    

//     // Fetch user's courses for the dropdown
//     const { rows: courses } = await pool.query(
//         "SELECT id, name FROM courses WHERE user_id = $1 ORDER BY name",
//         [session.user.id]
//     );

//     // Fetch assignments – you can split pending / submitted if you want
//     const { rows: assignments } = await pool.query(
//         `
//     SELECT 
//       a.id, a.title, a.due_date, a.priority, a.status, a.file_url, a.submitted_at,
//       c.name AS course_name
//     FROM assignments a
//     JOIN courses c ON a.course_id = c.id
//     WHERE a.user_id = $1
//     ORDER BY a.due_date ASC
//     `,
//         [session.user.id]
//     );

// const studentNavItems = [
//         { href: "/dashboard/student", label: "Dashboard", icon: "Home" },
//         { href: "/dashboard/student/classes", label: "Classes", icon: "Calendar" },
//         { href: "/dashboard/student/assignments", label: "Assignments", icon: "BookOpen" },
//         { href: "/dashboard/student/routines", label: "Routines", icon: "Clock" },
//         { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
//     ];

//     return (
//         <div className="flex h-screen transition-colors">
//             {/* Sidebar */}
//             <Sidebar role="student" navItems={studentNavItems} />
//             <div className="p-6 max-w-5xl mx-auto">
//                 <header className='flex items-center justify-between'>
//                     <button
//                         id="menu-toggle"
//                         className="md:hidden pr-4 text-gray-900 dark:text-gray-100 hover:text-pink-500 transition"
//                     >
//                         <Menu size={24} />
//                     </button>
//                     <h1 className="text-3xl font-bold mb-8">Assignments 📚</h1>
//                 </header>


//                  <button
//                         onClick={() => setIsAddOpen(true)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow-md transition w-full sm:w-auto"
//                     >
//                         <Plus size={20} /> Add Assignment
//                     </button>

//                 <div className="mt-12">
//                     <h2 className="text-2xl font-semibold mb-6">Your Assignments</h2>
//                     <AssignmentList assignments={assignments} />
//                 </div>

//                  {/* Add Modal */}
//                 {isAddOpen && (
//                     <AddAssignmentForm courses={courses} />
//                 )}
//             </div>
//         </div>

//     );
// }