import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  console.log("[Webhook] Received body:", body);

  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    console.log("[Webhook] Stripe event constructed:", event.type);
  } catch (err) {
    console.error("[Webhook] Invalid signature:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    console.log("[Webhook] Checkout session completed, bookingId:", bookingId);

    if (!bookingId) {
      console.warn("[Webhook] No bookingId in session metadata");
      return new Response("No bookingId", { status: 200 });
    }

    let booking;
    try {
      booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
          stripePaymentIntentId: session.payment_intent as string,
        },
      });
      console.log("[Webhook] Booking updated:", booking);
    } catch (err) {
      console.error("[Webhook] Error updating booking:", err);
      return new Response("Error updating booking", { status: 500 });
    }

    try {
      const gallery = await prisma.gallery.create({
        data: { bookingId: booking.id },
      });
      console.log("[Webhook] Gallery created:", gallery);
    } catch (err) {
      console.error("[Webhook] Error creating gallery:", err);
    }
  }

  return new Response("ok", { status: 200 });
}
