import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminOrders } from "@/actions/admin-orders";

export const metadata = { title: "Orders | Admin" };

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    #{order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>₹{Number(order.total).toLocaleString("en-IN")}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
