// src/components/PullToRefresh.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function PullToRefresh() {
    const [pulling, setPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const touchStartY = useRef(0);
    const router = useRouter();
    const threshold = 120; // pixels to trigger refresh

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                touchStartY.current = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (window.scrollY !== 0) return;
            const touchY = e.touches[0].clientY;
            const distance = touchY - touchStartY.current;

            if (distance > 0) {
                setPulling(true);
                setPullDistance(Math.min(distance, threshold * 1.5));
            }
        };

        const handleTouchEnd = () => {
            if (pullDistance >= threshold) {
                router.refresh();
            }
            setPulling(false);
            setPullDistance(0);
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullDistance]);

    if (!pulling) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 h-16 flex items-center justify-center pointer-events-none z-50"
            style={{ transform: `translateY(${pullDistance}px)` }}
        >
            <div className="text-2xl">
                {pullDistance >= threshold ? 'Release to refresh 🐹' : 'Pull down to refresh'}
            </div>
        </div>
    );
}