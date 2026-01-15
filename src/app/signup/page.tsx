// src/app/signup/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-16 text-gray-900 dark:text-gray-100 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-7 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Create your MochiDo account 🐹
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Let Mochi help you stay calm and consistent
          </p>
        </div>

        {/* Name */}
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="John Doe"
        />

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />

        {/* Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-3 font-semibold text-white rounded-xl bg-green-600 hover:bg-green-700 transition shadow-lg disabled:opacity-60"
        >
          <span className="absolute inset-0 blur-xl bg-green-500/40 dark:bg-green-500/20 rounded-xl" />
          <span className="relative">
            {loading ? "Creating account…" : "Sign up"}
          </span>
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ───────── INPUT COMPONENT ───────── */

function Input({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="
          w-full px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          border border-gray-300/70 dark:border-white/10
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-orange-400/50
          transition
        "
      />
    </div>
  );
}
