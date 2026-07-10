import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe subset of the auth config: no Prisma, no Node "crypto", so this
// can be used directly in middleware (which runs on the Edge runtime).
// Role and other DB-derived claims are embedded into the JWT once at sign-in
// time by the full config in auth.ts, so middleware only ever reads them
// back off the token rather than querying the database itself.
export const authConfig = {
  session: { strategy: "jwt" },
  providers: [Google],
  pages: { signIn: "/sign-in" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? "";
        session.user.role = (token.role as string) ?? "CUSTOMER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
