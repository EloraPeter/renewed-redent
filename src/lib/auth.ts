// src/lib/auth.ts   (or src/auth.ts, src/app/api/auth/auth.ts — anywhere importable)
import { NextAuthOptions } from "next-auth";
// import your providers, adapter, callbacks, etc.

export const authOptions: NextAuthOptions = {
    // ... your full config here
    providers: [
        // Credentials, Google, etc.
    ],
    session: { strategy: "jwt" }, // or database
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role; // important — make sure role is in token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;

                const role = token.role;
                if (role === "student" || role === "lecturer" || role === null) {
                    session.user.role = role;
                } else {
                    session.user.role = null; // fallback
                }
            }
            return session;
        },
    },
    // pages, secret, etc.
    secret: process.env.NEXTAUTH_SECRET,
    // ...
};