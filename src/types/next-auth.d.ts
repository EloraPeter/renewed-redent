import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: "student" | "lecturer" | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    role?: "student" | "lecturer" | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: "student" | "lecturer" | null;
  }
}