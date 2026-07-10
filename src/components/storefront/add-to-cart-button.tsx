"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/actions/cart";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    const result = await addToCart(productId, 1);
    setIsPending(false);

    if (result.requiresSignIn) {
      toast.error(result.message);
      router.push("/sign-in");
      return;
    }
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  }

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      disabled={disabled || isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <ShoppingCart className="size-4" />
      )}
      {disabled ? "Out of stock" : "Add to cart"}
    </Button>
  );
}
