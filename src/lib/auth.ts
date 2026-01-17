// src/lib/auth.ts
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

// Define options with proper types
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

        const { rows: userRows } = await pool.query(
          "SELECT id, name, email, password FROM users WHERE email = $1",
          [credentials.email]
        );
        const user = userRows[0];
        if (!user) return null;

        const passwordValid = await bcrypt.compare(credentials.password, user.password);
        if (!passwordValid) return null;

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

  session: { 
    strategy: "jwt" as const,  // ← fixes the string vs SessionStrategy mismatch
  },

  callbacks: {
    async jwt({ token, user, trigger, session }: { 
      token: JWT; 
      user?: any; 
      trigger?: "signIn" | "signUp" | "update"; 
      session?: Session 
    }): Promise<JWT> {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role ?? null;
      }

      // Client calls session.update()
      if (trigger === "update" && session?.user?.role) {
        console.log("[JWT callback] trigger=update → setting role to", session.user.role);
        token.role = session.user.role;
      }

      return token;
    },

    async session({ session, token }: { 
      session: Session; 
      token: JWT 
    }): Promise<Session> {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "student" | "lecturer" | null;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

// Export the helpers
export const { 
  auth, 
  handlers, 
  signIn, 
  signOut 
} = NextAuth(authOptions);