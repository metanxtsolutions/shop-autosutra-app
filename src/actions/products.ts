import { prisma } from "@/lib/prisma";

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true, brand: true },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      },
      children: true,
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true, variants: true },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
      id: { not: excludeId },
    },
    take: limit,
  });
}

export async function searchProducts(query: string) {
  if (!query.trim()) return [];
  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query.toLowerCase() } },
      ],
    },
    take: 24,
    include: { category: true },
  });
}
