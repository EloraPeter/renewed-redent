// src/components/DashboardClientWrapper.tsx
'use client';

import PullToRefresh from '@/components/PullToRefresh';

export default function DashboardClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 antialiased">
            <PullToRefresh />
            
            <main className="pt-20 px-4 md:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
                {children}
            </main>

            {/* Floating Mochi - ensure dark mode visibility */}
            <div className="fixed bottom-6 right-6 text-5xl opacity-80 pointer-events-none z-10 filter dark:brightness-125">
                🐹
            </div>
        </div>
    );
}