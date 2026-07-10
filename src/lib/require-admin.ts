import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new Error("Forbidden: admin access required.");
  }
  return session!;
}
