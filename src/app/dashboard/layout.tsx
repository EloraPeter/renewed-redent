// src/app/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PullToRefresh from '@/components/PullToRefresh';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getServerSession();
      if (!session?.user) {
        redirect('/login');
      }
      // Optional: add role check here later if needed
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 antialiased">
      <PullToRefresh />

      <main className="pt-4 px-4 md:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Optional floating hamster – remove or replace with real Mochi later */}
      <div className="fixed bottom-6 right-6 text-5xl opacity-70 pointer-events-none z-10">
        🐹
      </div>
    </div>
  );
}