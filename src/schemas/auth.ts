import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  code: z
    .string()
    .trim()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type RequestOtpValues = z.infer<typeof requestOtpSchema>;
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
