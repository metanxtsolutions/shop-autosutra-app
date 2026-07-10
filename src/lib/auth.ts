import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { hashOtpCode } from "@/lib/otp";
import { verifyOtpSchema } from "@/schemas/auth";
import { authConfig } from "@/lib/auth.config";

const MAX_OTP_ATTEMPTS = 5;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "otp",
      name: "Email code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const parsed = verifyOtpSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, code } = parsed.data;

        const record = await prisma.verificationCode.findFirst({
          where: { email },
          orderBy: { createdAt: "desc" },
        });
        if (!record) return null;

        if (record.expiresAt < new Date()) {
          await prisma.verificationCode.delete({ where: { id: record.id } });
          return null;
        }
        if (record.attempts >= MAX_OTP_ATTEMPTS) return null;

        if (record.codeHash !== hashOtpCode(code)) {
          await prisma.verificationCode.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
          });
          return null;
        }

        // Code is correct and unexpired: consume it so it cannot be reused.
        await prisma.verificationCode.delete({ where: { id: record.id } });

        const user = await prisma.user.upsert({
          where: { email },
          update: { emailVerified: new Date() },
          create: { email, emailVerified: new Date() },
        });

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "CUSTOMER";
      }
      return token;
    },
    async signIn({ user, account }) {
      // Google sign-ins land here on first login too; make sure a User row
      // exists and is marked verified, matching the OTP flow's behavior.
      if (account?.provider === "google" && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: { emailVerified: new Date() },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
          },
        });
      }
      return true;
    },
  },
});
