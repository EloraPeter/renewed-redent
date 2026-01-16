// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Get user from users table
        const { rows: userRows } = await pool.query(
          "SELECT id, name, email, password FROM users WHERE email = $1",
          [credentials.email]
        );
        const user = userRows[0];
        if (!user) return null;

        const passwordValid = await bcrypt.compare(credentials.password, user.password);
        if (!passwordValid) return null;

        // Get role from profiles
        const { rows: profileRows } = await pool.query(
          "SELECT role FROM profiles WHERE id = $1",
          [user.id]
        );
        const role = profileRows[0]?.role ?? null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in (user object is present)
      if (user) {
        token.id = user.id;
        token.role = user.role;           // may be null at first sign-in
      }

      // ───────────────────────────────────────────────
      // Client calls update() → this block runs
      // ───────────────────────────────────────────────
      if (trigger === "update" && session?.user?.role) {
        console.log("[JWT callback] trigger=update → setting role to", session.user.role);
        token.role = session.user.role;   // take whatever client sent
        // Optional: you could also re-check DB here if you want extra safety
        // but usually unnecessary since /api/set-role already validated + updated
      }

      // Always try to refresh role from DB (your existing logic - good!)
      // This acts as a safety net on every session access
      if (token.id) {
        try {
          const { rows } = await pool.query("SELECT role FROM profiles WHERE id = $1", [token.id]);
          const dbRole = rows[0]?.role ?? null;
          console.log("[JWT callback] DB role fetch:", dbRole);
          token.role = dbRole;  // if you want DB to always win, keep this last
        } catch (err) {
          console.error("Failed to refresh role:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.role) session.user.role = token.role as "student" | "lecturer" | null;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};
