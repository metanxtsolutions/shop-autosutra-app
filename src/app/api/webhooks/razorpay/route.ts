import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { markOrderPaid } from "@/lib/orders";

// Authoritative confirmation path: this must not trust the client's checkout
// callback alone, since that can be spoofed or missed if the browser closes
// mid-flow. Every event is signature-verified against the raw body before
// any state changes.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = createHmac("sha256", secret).update(body).digest("hex");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  const isValid =
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    await markOrderPaid(payment.order_id, payment.id);
  }

  return NextResponse.json({ received: true });
}
