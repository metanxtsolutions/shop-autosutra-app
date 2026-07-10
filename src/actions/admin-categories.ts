"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { categorySchema, type CategoryFormValues } from "@/schemas/product";

export async function getAdminCategories() {
  await requireAdmin();
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(values: CategoryFormValues) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid category." };
  }

  const existingSlug = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existingSlug) {
    return { success: false, message: "That slug is already in use." };
  }

  await prisma.category.create({
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || undefined,
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true, message: "Category created." };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return {
      success: false,
      message: "Move or delete products in this category first.",
    };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true, message: "Category deleted." };
}
