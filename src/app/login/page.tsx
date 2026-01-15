// src/app/login/page.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  // After successful login → check role and redirect accordingly
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role) {
        router.replace(`/dashboard/${session.user.role}`);
      } else {
        router.replace("/role-select");
      }
    }
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid credentials");
      setLoading(false);
    } else {
      toast.success("Logged in!");
      // Do NOT router.replace here — let the useEffect handle it
      // It will wait for session to update and decide where to go
    }
  }
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6 w-96">
        <h1 className="text-2xl font-bold text-center">Log In to MochiDo</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded bg-transparent"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded bg-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50 hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          No account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  );
}