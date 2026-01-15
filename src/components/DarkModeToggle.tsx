"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // On mount, read the preferred theme
    const isDark = localStorage.theme === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  const toggle = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition z-50"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-700" />}
    </button>
  );
}