"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { OrderStatus } from "@/generated/prisma/enums";

export async function getAdminOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: { user: true, address: true, items: true, payment: true },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true, message: "Order status updated." };
}
