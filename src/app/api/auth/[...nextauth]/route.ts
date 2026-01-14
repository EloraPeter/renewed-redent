import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await pool.query(
            "SELECT id, email, password_hash, role, name FROM profiles WHERE email = $1",
            [credentials.email]
          );

          const user = res.rows[0];

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password_hash);

          if (!isValid) {
            return null;
          }

          // Return only what we want in the session/JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? null,     // can be null
            role: user.role ?? null,     // can be null until selected
          };
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days (optional – adjust as needed)
  },

  callbacks: {
    async jwt({ token, user }) {
      // user is only available on initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.email) {
        session.user.email = token.email as string | null;
      }
      if (token?.name !== undefined) {
        session.user.name = token.name as string | null;
      }
      if (token?.role !== undefined) {
        session.user.role = token.role as "student" | "lecturer" | null;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Optional: debug mode during development
  // debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };