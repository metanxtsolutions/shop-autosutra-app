import { prisma } from "@/lib/prisma";

// Shared by both the client-side payment verification action and the
// Razorpay webhook, so a payment only ever gets fulfilled once no matter
// which path confirms it first.
export async function markOrderPaid(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature?: string,
) {
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId },
  });
  if (!payment) {
    return { success: false, message: "Order not found." };
  }
  if (payment.status === "CAPTURED") {
    return { success: true, message: "Already processed.", orderId: payment.orderId };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "CAPTURED",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    const order = await tx.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });

    const orderItems = await tx.orderItem.findMany({
      where: { orderId: payment.orderId },
    });
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  });

  return { success: true, message: "Payment confirmed.", orderId: payment.orderId };
}
