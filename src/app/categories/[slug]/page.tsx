import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { getCategoryBySlug } from "@/actions/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description:
      category.description ?? `Shop ${category.name} at AutoSutra Shop.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {category.description}
        </p>
      )}

      {category.products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}
