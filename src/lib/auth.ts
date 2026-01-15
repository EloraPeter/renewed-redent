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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (token.id) {
        try {
          const { rows } = await pool.query(
            "SELECT role FROM profiles WHERE id = $1",
            [token.id]
          );
          token.role = rows[0]?.role ?? null;
        } catch (err) {
          console.error("Failed to refresh role in jwt callback:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      session.user.role = token.role ?? null;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};
