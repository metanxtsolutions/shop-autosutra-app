"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartItemQuantity } from "@/actions/cart";

type CartLineItemData = {
  id: string;
  quantity: number;
  product: {
    slug: string;
    name: string;
    images: string[];
    price: unknown;
    stock: number;
  };
};

export function CartLineItem({ item }: { item: CartLineItemData }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isPending, startTransition] = useTransition();
  const price = Number(item.product.price);

  function changeQuantity(next: number) {
    if (next < 0) return;
    setQuantity(next);
    startTransition(async () => {
      await updateCartItemQuantity(item.id, next);
    });
  }

  return (
    <div className="flex gap-4 border-b border-border py-6 last:border-0">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {item.product.images[0] && (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/products/${item.product.slug}`}
            className="text-sm font-medium hover:underline"
          >
            {item.product.name}
          </Link>
          <button
            aria-label="Remove"
            onClick={() => changeQuantity(0)}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7"
              disabled={isPending}
              onClick={() => changeQuantity(quantity - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7"
              disabled={isPending || quantity >= item.product.stock}
              onClick={() => changeQuantity(quantity + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <p className="text-sm font-semibold">
            ₹{(price * quantity).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}
