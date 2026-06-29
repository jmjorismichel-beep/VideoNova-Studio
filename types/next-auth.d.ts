// types/next-auth.d.ts
// Extension des types NextAuth pour inclure role et plan dans la session

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      plan: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    plan: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    plan: string;
  }
}
