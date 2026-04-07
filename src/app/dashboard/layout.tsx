// src/app/dashboard/layout.tsx

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


  return (
    <DashboardClientWrapper>
      <DarkModeToggle />

      {children}
    </DashboardClientWrapper>
    
  );
}