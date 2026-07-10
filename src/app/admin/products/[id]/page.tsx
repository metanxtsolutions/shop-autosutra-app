import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Edit Product | Admin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Edit product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          productId={product.id}
          defaultValues={{
            ...product,
            price: Number(product.price),
            mrp: Number(product.mrp),
            gstPercent: Number(product.gstPercent),
            brandId: product.brandId ?? undefined,
            seoTitle: product.seoTitle ?? undefined,
            seoDescription: product.seoDescription ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
