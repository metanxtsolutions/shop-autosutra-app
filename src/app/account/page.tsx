import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Your Account",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {session.user.name ?? session.user.email}
          </h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button variant="outline" type="submit">
            Sign out
          </Button>
        </form>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Order history</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/categories" className="underline">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order-confirmation/${order.id}`}
              className="block rounded-lg border border-border p-4 transition-colors hover:border-foreground"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">#{order.orderNumber}</span>
                <span className="text-muted-foreground">{order.status}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {order.items.length} item{order.items.length === 1 ? "" : "s"} · ₹
                {Number(order.total).toLocaleString("en-IN")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
