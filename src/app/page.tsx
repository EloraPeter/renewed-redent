import Image from "next/image";

// src/app/page.tsx

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome to MochiDo 🐹</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
        Your smart productivity companion for students and lecturers. Manage courses, assignments, routines, and more with an emotional hamster mascot to keep you motivated!
      </p>
      <div className="flex gap-4">
        <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </a>
        <a href="/signup" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
          Sign Up
        </a>
      </div>
    </div>
  );
}
