import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type ProductCardData = {
  slug: string;
  name: string;
  images: string[];
  price: unknown;
  mrp: unknown;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const price = Number(product.price);
  const mrp = Number(product.mrp);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              -{discount}%
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-semibold">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
