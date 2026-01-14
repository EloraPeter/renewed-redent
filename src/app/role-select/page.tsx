// src/app/role-select/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RoleSelect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      router.push(`/dashboard/${session.user.role}`);
    }
  }, [status, session, router]);

  async function selectRole(role: "student" | "lecturer") {
    setLoading(true);
    try {
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success(`Role set to ${role}!`);
      router.push(`/dashboard/${role}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to set role");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-8 p-6">
      <h1 className="text-3xl font-bold">Choose Your Role</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-md">
        Are you a student or lecturer? This choice is permanent.
      </p>
      <div className="flex gap-6">
        <button
          onClick={() => selectRole("student")}
          disabled={loading}
          className="px-8 py-4 bg-green-600 text-white rounded-xl text-xl disabled:opacity-50 hover:bg-green-700"
        >
          Student
        </button>
        <button
          onClick={() => selectRole("lecturer")}
          disabled={loading}
          className="px-8 py-4 bg-purple-600 text-white rounded-xl text-xl disabled:opacity-50 hover:bg-purple-700"
        >
          Lecturer
        </button>
      </div>
    </div>
  );
}