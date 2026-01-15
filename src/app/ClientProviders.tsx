"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import React from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
            borderRadius: "12px",
            border: "1px solid var(--toast-border)",
          },
        }}
      />    </SessionProvider>
  );
}
