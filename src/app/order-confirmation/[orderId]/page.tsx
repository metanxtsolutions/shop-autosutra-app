import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Order Confirmed",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-8">
      <CheckCircle2 className="mx-auto size-12 text-primary" />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {order.status === "PAID" ? "Order confirmed" : "Order received"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order #{order.orderNumber}
        {order.status !== "PAID" &&
          " — we're confirming your payment, this page will update shortly."}
      </p>

      <div className="mt-8 rounded-lg border border-border p-6 text-left">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b border-border py-3 text-sm last:border-0"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 text-sm font-semibold">
          <span>Total</span>
          <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/categories" className={cn(buttonVariants(), "rounded-full")}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
