"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/checkout/address-form";
import { createCheckoutOrder, verifyCheckoutPayment } from "@/actions/checkout";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

type Address = {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

type CartSummary = {
  subtotal: number;
  shippingFee: number;
  total: number;
  itemCount: number;
};

export function CheckoutClient({
  addresses,
  summary,
  userEmail,
  userName,
}: {
  addresses: Address[];
  summary: CartSummary;
  userEmail: string;
  userName: string | null;
}) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses[0]?.id ?? "",
  );
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  async function handlePay() {
    if (!selectedAddressId) {
      toast.error("Select or add a delivery address.");
      return;
    }
    if (!scriptLoaded) {
      toast.error("Payment is still loading, try again in a moment.");
      return;
    }

    setIsProcessing(true);
    const result = await createCheckoutOrder(selectedAddressId);

    if (!result.success) {
      setIsProcessing(false);
      toast.error(result.message);
      return;
    }

    const razorpay = new window.Razorpay({
      key: result.keyId,
      amount: result.amount,
      currency: result.currency,
      order_id: result.razorpayOrderId,
      name: "AutoSutra Shop",
      prefill: { email: userEmail, name: userName ?? undefined },
      theme: { color: "#c92a2a" },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        const verification = await verifyCheckoutPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
        );
        if (verification.success && "orderId" in verification) {
          router.push(`/order-confirmation/${verification.orderId}`);
        } else {
          toast.error("Payment could not be verified. Contact support.");
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => setIsProcessing(false),
      },
    });

    razorpay.open();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="lg:col-span-2">
        <h2 className="text-lg font-semibold">Delivery address</h2>

        {addresses.length > 0 && !showNewAddress && (
          <div className="mt-4 space-y-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 has-[:checked]:border-foreground"
              >
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-muted-foreground">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                    {address.state} {address.postalCode}
                  </p>
                  <p className="text-muted-foreground">{address.phone}</p>
                </div>
              </label>
            ))}
            <button
              type="button"
              className="text-sm font-medium underline"
              onClick={() => setShowNewAddress(true)}
            >
              Add a new address
            </button>
          </div>
        )}

        {showNewAddress && (
          <div className="mt-4">
            <AddressForm
              onSaved={(id) => {
                setSelectedAddressId(id);
                setShowNewAddress(false);
                router.refresh();
              }}
            />
          </div>
        )}
      </div>

      <div className="h-fit rounded-lg border border-border p-6">
        <h2 className="text-sm font-semibold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({summary.itemCount} items)
            </span>
            <span>₹{summary.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {summary.shippingFee === 0
                ? "Free"
                : `₹${summary.shippingFee.toLocaleString("en-IN")}`}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total</span>
            <span>₹{summary.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <Button
          size="lg"
          className="mt-6 w-full gap-2"
          disabled={isProcessing || !selectedAddressId}
          onClick={handlePay}
        >
          {isProcessing && <Loader2 className="size-4 animate-spin" />}
          Pay ₹{summary.total.toLocaleString("en-IN")}
        </Button>
      </div>
    </div>
  );
}
