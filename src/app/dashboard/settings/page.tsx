// src/app/dashboard/settings/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BackButton from "@/components/BackButton";
import pool from "@/lib/db";
import SettingsClient from "./SettingsClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await getServerSession();
    if (!session?.user) redirect("/login");


    const userId = session.user.id;

    const { rows } = await pool.query(
        `
    SELECT 
      email, 
      role,
      COALESCE(name, email) as display_name
    FROM profiles 
    WHERE id = $1
    `,
        [userId]
    );

    const userEmail = session.user.email ?? "unknown@example.com";

    const user = rows[0] || {
        email: userEmail,
        role: session.user.role ?? "student",
        display_name: userEmail.split("@")[0],
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">

            <div className="max-w-3xl mx-auto">
                <header className='flex items-center justify-start gap-4 mb-4'>
                    <BackButton />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                        Settings
                    </h1>
                </header>
                <p className="text-gray-600 dark:text-gray-400">
                    Customize MochiDo the way you like it 🐹
                </p>

                <SettingsClient
                    initialUser={user}
                    role={user.role}
                />
            </div>
        </div>
    );
}