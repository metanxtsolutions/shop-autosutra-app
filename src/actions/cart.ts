"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type CartActionState = {
  success: boolean;
  message: string;
  requiresSignIn?: boolean;
};

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function addToCart(
  productId: string,
  quantity: number = 1,
  variantId?: string,
): Promise<CartActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sign in to add items to your cart.", requiresSignIn: true };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== "PUBLISHED") {
    return { success: false, message: "This product is not available." };
  }
  if (product.stock < quantity) {
    return { success: false, message: "Not enough stock available." };
  }

  const cart = await getOrCreateCart(session.user.id);

  await prisma.cartItem.upsert({
    where: {
      cartId_productId_variantId: {
        cartId: cart.id,
        productId,
        variantId: variantId ?? null,
      } as never,
    },
    update: { quantity: { increment: quantity } },
    create: {
      cartId: cart.id,
      productId,
      variantId: variantId ?? null,
      quantity,
    },
  });

  revalidatePath("/cart");
  return { success: true, message: "Added to cart." };
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<CartActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sign in required.", requiresSignIn: true };
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });
  if (!item || item.cart.userId !== session.user.id) {
    return { success: false, message: "Item not found." };
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true, message: "Cart updated." };
}

export async function removeFromCart(cartItemId: string): Promise<CartActionState> {
  return updateCartItemQuantity(cartItemId, 0);
}

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true, variant: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
