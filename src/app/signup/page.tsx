// src/app/signup/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const name = form.get("name") as string;

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Signup failed");
      }

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 rounded-2xl
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_0_40px_rgba(99,102,241,0.35)]
        space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-gray-300">
            Join MochiDo and never miss a class reminder.
          </p>
        </div>

        <div className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full name"
            required
            className="w-full rounded-lg px-4 py-3 bg-black/40
            border border-white/20 text-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            className="w-full rounded-lg px-4 py-3 bg-black/40
            border border-white/20 text-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg px-4 py-3 bg-black/40
            border border-white/20 text-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
