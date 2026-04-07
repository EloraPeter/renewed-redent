// src/components/DarkModeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const theme = localStorage.getItem("theme");
    const isDark = theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  if (darkMode === null) return null; // Prevent hydration mismatch

  const toggle = () => {
    const next = !darkMode;
    setDarkMode(next);

    // Toggle class on html element
    document.documentElement.classList.toggle("dark", next);

    // Save to localStorage
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:scale-110 transition-all duration-200 z-50 ring-1 ring-orange-400/40 hover:ring-orange-400/60"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      )}
    </button>
  );
}