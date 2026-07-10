"use server";

import { createHmac } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/services/razorpay";
import { markOrderPaid } from "@/lib/orders";

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AS${timestamp}${random}`;
}

export async function createCheckoutOrder(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: "Sign in required." };
  }

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    return { success: false as const, message: "Invalid address." };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });
  if (!cart || cart.items.length === 0) {
    return { success: false as const, message: "Your cart is empty." };
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return {
        success: false as const,
        message: `${item.product.name} doesn't have enough stock.`,
      };
    }
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const shippingFee = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shippingFee;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      addressId,
      subtotal,
      shippingFee,
      tax: 0,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: order.orderNumber,
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
    },
  });

  return {
    success: true as const,
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: Math.round(total * 100),
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID ?? "",
  };
}

export async function verifyCheckoutPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const expectedSignature = createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return { success: false, message: "Payment verification failed." };
  }

  return markOrderPaid(razorpayOrderId, razorpayPaymentId, razorpaySignature);
}
