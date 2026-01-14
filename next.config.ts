import type { NextConfig } from "next";

import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,                   // auto register SW
  // skipWaiting: true,                // new SW takes over immediately
  // Optional but nice for mobile feel
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
  // Optional: custom fallbacks later
  fallbacks: {
    // document: '/offline',      // we'll add /app/offline/page.tsx later
  },
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
