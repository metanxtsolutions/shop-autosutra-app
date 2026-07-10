import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [productCount, orderCount, paidOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ where: { status: "PAID" }, select: { total: true } }),
  ]);
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Orders", value: orderCount },
    { label: "Revenue (paid orders)", value: `₹${revenue.toLocaleString("en-IN")}` },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
