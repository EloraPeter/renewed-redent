// src/app/role-select/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RoleSelect() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect if already has role (safety net)
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      router.replace(`/dashboard/${session.user.role}`);
    }
  }, [status, session?.user?.role, router]);

  const handleSelectRole = async (role: "student" | "lecturer") => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to set role");
      }

      // Update session so we get the new role immediately
      await update({ user: { role } });

      toast.success(`Role set to ${role}! Welcome to MochiDo 🐹`);
      router.replace(`/dashboard/${role}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to MochiDo
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Choose your role to get started. This cannot be changed later.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelectRole("student")}
            disabled={loading}
            className={`
              group relative flex flex-col items-center justify-center p-8 rounded-xl 
              bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30
              border-2 border-green-200 dark:border-green-700/50
              hover:border-green-500 dark:hover:border-green-500
              transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200">
              Student
            </h2>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300 text-center">
              Manage assignments, routines, deadlines
            </p>
          </button>

          <button
            onClick={() => handleSelectRole("lecturer")}
            disabled={loading}
            className={`
              group relative flex flex-col items-center justify-center p-8 rounded-xl 
              bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30
              border-2 border-purple-200 dark:border-purple-700/50
              hover:border-purple-500 dark:hover:border-purple-500
              transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-200">
              Lecturer
            </h2>
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300 text-center">
              Manage classes, reminders, stats
            </p>
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Setting up your account...
          </div>
        )}
      </div>
    </div>
  );
}