import Stripe from "stripe";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // ✅ ONLY HANDLE FINAL BUSINESS EVENT
  if (event.type !== "checkout.session.completed") {
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    return new Response("Missing bookingId", { status: 200 });
  }

  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  // ✅ Update booking (safe, idempotent in your flow)
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
      paymentStatus: "PAID",
      stripePaymentIntentId: paymentIntent ?? undefined,
      paidAt: new Date(),
    },
  });

  // ✅ Create gallery (safe due to @unique bookingId)
  await prisma.gallery.upsert({
    where: { bookingId },
    create: { bookingId },
    update: {},
  });

  return new Response("ok", { status: 200 });
}
