import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "New Product | Admin" };

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">New product</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
