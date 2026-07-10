"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { productSchema, type ProductFormValues } from "@/schemas/product";

export async function getAdminProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getAdminProduct(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(values: ProductFormValues) {
  await requireAdmin();
  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid product." };
  }

  const existingSlug = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existingSlug) {
    return { success: false, message: "That slug is already in use." };
  }

  const product = await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin/products");
  revalidatePath("/categories");
  return { success: true, message: "Product created.", productId: product.id };
}

export async function updateProduct(id: string, values: ProductFormValues) {
  await requireAdmin();
  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid product." };
  }

  const existingSlug = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existingSlug) {
    return { success: false, message: "That slug is already in use." };
  }

  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/products");
  revalidatePath(`/products/${parsed.data.slug}`);
  revalidatePath("/categories");
  return { success: true, message: "Product updated." };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true, message: "Product deleted." };
}
