import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getCart } from "@/actions/cart";
import { getAddresses } from "@/actions/addresses";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/checkout");
  }

  const [cart, addresses] = await Promise.all([getCart(), getAddresses()]);
  const items = cart?.items ?? [];

  if (items.length === 0) {
    redirect("/cart");
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const shippingFee = subtotal >= 999 ? 0 : 79;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-8">
        <CheckoutClient
          addresses={addresses}
          summary={{
            subtotal,
            shippingFee,
            total: subtotal + shippingFee,
            itemCount,
          }}
          userEmail={session.user.email ?? ""}
          userName={session.user.name ?? null}
        />
      </div>
    </div>
  );
}
