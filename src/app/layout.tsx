import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './ClientProviders'; // Client-only wrapper for React Context

export const metadata: Metadata = {
  title: 'MochiDo – Productivity with Mochi',
  description: 'Student & lecturer companion with emotional hamster mascot',
  manifest: '/manifest.json',
  themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MochiDo',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap children in client component for SessionProvider / Toaster */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
