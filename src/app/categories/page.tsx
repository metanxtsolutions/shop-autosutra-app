import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/actions/products";

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Browse all AutoSutra Shop categories.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Shop by category
      </h1>
      {categories.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-lg border border-border p-6 text-center transition-colors hover:border-foreground"
            >
              <p className="font-medium">{category.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {category._count.products} products
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          No categories yet. Add some from the admin dashboard.
        </p>
      )}
    </div>
  );
}
