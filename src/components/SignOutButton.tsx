// src/components/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react"; // or your icon

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
    >
      <LogOut size={20} />
      <span>Sign Out</span>
    </button>
  );
}