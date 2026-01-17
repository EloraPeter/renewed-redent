// src/app/dashboard/layout.tsx
// NO 'use client' → this is now a Server Component

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DashboardClientWrapper from '@/components/DashboardClientWrapper'; // ← create this file
import DarkModeToggle from "@/components/DarkModeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  // Optional: role check (if you store role in session.user.role)
  // const role = session.user.role as string | undefined;
  // Example: if (role !== 'lecturer' && /* path is lecturer */) redirect(...);

  return (
    <DashboardClientWrapper>
                  <DarkModeToggle />
      
      {children}
    </DashboardClientWrapper>
  );
}