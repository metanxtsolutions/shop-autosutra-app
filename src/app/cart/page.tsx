import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { getCart } from "@/actions/cart";

export const metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <ShoppingCart className="size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse our categories to find something you like.
        </p>
        <Link
          href="/categories"
          className={cn(buttonVariants(), "mt-6 gap-2 rounded-full")}
        >
          Start shopping
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </div>

        <div className="h-fit rounded-lg border border-border p-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Shipping and taxes calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
