import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { ProductCard } from "@/components/storefront/product-card";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description.slice(0, 155),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "PUBLISHED") notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const price = Number(product.price);
  const mrp = Number(product.mrp);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div>
          {product.brand && (
            <p className="text-sm text-muted-foreground">{product.brand.name}</p>
          )}
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <>
                <span className="text-muted-foreground line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-medium text-primary">
                  {discount}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Inclusive of {Number(product.gstPercent)}% GST
          </p>

          <p className="mt-6 whitespace-pre-wrap text-sm text-foreground/80">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              disabled={product.stock <= 0}
            />
            {product.stock > 0 && product.stock <= 5 && (
              <p className="mt-2 text-xs text-primary">
                Only {product.stock} left in stock
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-semibold tracking-tight">
            You may also like
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
