import { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";   // optional, but clearer

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * as well as the `user` object returned by `getSession()`, `useSession()`, ...
   */
  interface User extends DefaultUser {
    id: string;                           // always string in your case
    role?: "student" | "lecturer" | null;
  }

  /**
   * The shape of the session object returned by `useSession()`, `getSession()`
   * and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role?: "student" | "lecturer" | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** The shape of the JWT payload after signIn / update */
  interface JWT {
    id: string;
    role?: "student" | "lecturer" | null;
    // You can leave email & name optional here if you don't always set them
    email?: string | null;
    name?: string | null;
  }
}