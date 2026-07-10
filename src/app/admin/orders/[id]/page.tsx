import { notFound } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { getAdminOrder } from "@/actions/admin-orders";

export const metadata = { title: "Order Detail | Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Order #{order.orderNumber}
        </h1>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold">Customer</h2>
          <p className="mt-1 text-sm text-muted-foreground">{order.user.email}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Shipping address</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.address.fullName}
            <br />
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}
            <br />
            {order.address.city}, {order.address.state} {order.address.postalCode}
            <br />
            {order.address.phone}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold">Items</h2>
      <div className="mt-2 rounded-lg border border-border">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b border-border p-4 text-sm last:border-0"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>₹{Number(order.shippingFee).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
        </div>
      </div>

      {order.payment && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold">Payment</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.payment.status} · Razorpay order {order.payment.razorpayOrderId}
          </p>
        </div>
      )}
    </div>
  );
}
