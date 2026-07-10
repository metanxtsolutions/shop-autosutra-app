import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(15, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Enter your address"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
