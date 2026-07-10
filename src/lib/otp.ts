import { createHash } from "crypto";

export function hashOtpCode(code: string) {
  const pepper = process.env.AUTH_SECRET ?? "";
  return createHash("sha256").update(`${code}:${pepper}`).digest("hex");
}
