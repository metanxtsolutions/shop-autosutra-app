"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema, type AddressFormValues } from "@/schemas/address";

export async function getAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(values: AddressFormValues) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sign in required." };
  }

  const parsed = addressSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: "Please check the address fields." };
  }

  const existingCount = await prisma.address.count({
    where: { userId: session.user.id },
  });

  const address = await prisma.address.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
      isDefault: existingCount === 0,
    },
  });

  revalidatePath("/checkout");
  revalidatePath("/account/addresses");
  return { success: true, message: "Address saved.", address };
}
