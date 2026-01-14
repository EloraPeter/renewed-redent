import type { NextConfig } from "next";

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',                   // where sw.js + workbox files go
  disable: process.env.NODE_ENV === 'development',  // usually disable SW in dev to avoid cache headaches
  register: true,                   // auto register SW
  skipWaiting: true,                // new SW takes over immediately
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

export default nextConfig;
