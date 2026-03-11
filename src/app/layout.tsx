import type { Metadata } from 'next';
import './globals.css';
import DarkModeToggle from "@/components/DarkModeToggle";
import { Toaster } from "react-hot-toast";
import ClientProviders from './ClientProviders'; // Client-only wrapper for React Context

export const metadata: Metadata = {
  title: 'MochiDo – Productivity with Mochi',
  description: 'Student & lecturer companion with emotional hamster mascot',
  manifest: '/manifest.json',
  // themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MochiDo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🔥 PREVENT DARK MODE FLASH */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem("theme");
                  if (
                    theme === "dark" ||
                    (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
                  ) {
                    document.documentElement.classList.add("dark");
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>

      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ClientProviders>
          <DarkModeToggle />
          {children}
          <Toaster position="top-right" />
        </ClientProviders>
      </body>
    </html>
  );
}