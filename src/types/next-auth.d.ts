import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: "student" | "lecturer" | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "student" | "lecturer" | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "student" | "lecturer" | null;
  }
}