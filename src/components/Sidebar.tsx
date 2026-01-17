// src/components/Sidebar.tsx — Client Component
"use client";

import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { useEffect, useRef } from "react";
import { Home, Calendar, BookOpen, FileText, Clock, Settings, X } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Calendar,
  BookOpen,
  Clock,
  FileText,
  Settings,
};

interface SidebarProps {
  navItems: NavItem[];
  role: string;
}

export default function Sidebar({ navItems, role }: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const toggleBtn = document.getElementById("menu-toggle");
    const sidebar = sidebarRef.current;
    if (!toggleBtn || !sidebar) return;

    const openSidebar = () => {
      sidebar.classList.remove("-translate-x-full");
      document.getElementById("overlay")?.classList.remove("hidden");
    };

    const closeSidebar = () => {
      sidebar.classList.add("-translate-x-full");
      document.getElementById("overlay")?.classList.add("hidden");
    };

    toggleBtn.addEventListener("click", openSidebar);

    // Close on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebar && !sidebar.contains(e.target as Node) && !toggleBtn.contains(e.target as Node)) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      toggleBtn.removeEventListener("click", openSidebar);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-2xl transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out pt-20"
      >
        {/* Close Button (Mobile) */}
        <button
          aria-label="Close menu"
          className="absolute top-4 right-4 p-2 md:hidden"
          onClick={() => {
            sidebarRef.current?.classList.add("-translate-x-full");
            document.getElementById("overlay")?.classList.add("hidden");
          }}
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <nav className="px-6 py-8 space-y-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    sidebarRef.current?.classList.add("-translate-x-full");
                    document.getElementById("overlay")?.classList.add("hidden");
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            <SignOutButton />
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      <div
        id="overlay"
        className="fixed inset-0 bg-black/50 z-30 hidden md:hidden"
        onClick={() => {
          sidebarRef.current?.classList.add("-translate-x-full");
          document.getElementById("overlay")?.classList.add("hidden");
        }}
      />
    </>
  );
}