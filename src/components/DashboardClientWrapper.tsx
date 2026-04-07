// src/components/DashboardClientWrapper.tsx
'use client';

import PullToRefresh from '@/components/PullToRefresh';

export default function DashboardClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 antialiased">
                <PullToRefresh />

                <main className="pt-4 px-4 md:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
                    {children}
                </main>

                {/* Floating Mochi placeholder */}
                <div className="fixed bottom-6 right-6 text-5xl opacity-70 pointer-events-none z-10">
                    🐹
                </div>
            </div>
        </>

    );
}
