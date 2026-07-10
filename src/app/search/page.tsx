import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/storefront/product-card";
import { searchProducts } from "@/actions/products";

export const metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <form action="/search" className="relative max-w-lg">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products..."
          className="pl-9"
        />
      </form>

      {q && (
        <p className="mt-6 text-sm text-muted-foreground">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
