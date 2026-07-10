import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import { getCategories, getFeaturedProducts } from "@/actions/products";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            India&apos;s Automotive Store
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-background/70">
            Car and bike accessories, care products, and dealer essentials,
            all in one place.
          </p>
          <Link
            href="/categories"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 gap-2 rounded-full",
            )}
          >
            Shop now
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight">
          Shop by category
        </h2>
        {categories.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
          <p className="mt-6 text-sm text-muted-foreground">
            Categories will appear here once added in the admin dashboard.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Featured products
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Products will appear here once added in the admin dashboard.
          </p>
        )}
      </section>
    </>
  );
}
