"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashOtpCode } from "@/lib/otp";
import { resend, FROM_EMAIL } from "@/services/resend";
import { otpCodeEmailHtml } from "@/emails/otp-code";
import { requestOtpSchema } from "@/schemas/auth";

const OTP_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 45;

export type RequestOtpState = {
  success: boolean;
  message: string;
};

export async function requestOtp(email: string): Promise<RequestOtpState> {
  const parsed = requestOtpSchema.safeParse({ email });
  if (!parsed.success) {
    return { success: false, message: "Enter a valid email address." };
  }
  const normalizedEmail = parsed.data.email;

  const recent = await prisma.verificationCode.findFirst({
    where: {
      email: normalizedEmail,
      createdAt: { gt: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    return {
      success: false,
      message: "Please wait a moment before requesting another code.",
    };
  }

  const code = randomInt(100000, 1000000).toString();

  await prisma.verificationCode.deleteMany({
    where: { email: normalizedEmail },
  });
  await prisma.verificationCode.create({
    data: {
      email: normalizedEmail,
      codeHash: hashOtpCode(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
    },
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: normalizedEmail,
      subject: "Your AutoSutra Shop sign-in code",
      html: otpCodeEmailHtml(code),
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return {
      success: false,
      message: "Could not send the code. Please try again.",
    };
  }

  return { success: true, message: "Code sent. Check your email." };
}
