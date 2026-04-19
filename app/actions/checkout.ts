"use server";

import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(formData: FormData) {
  const eventId = formData.get("eventId") as string;

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get Clerk user for email and name
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  const name = clerkUser?.firstName
    ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
    : undefined;

  if (!email) throw new Error("User email not found");

  // Get or create app user
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        name,
      },
    });
  }

  // Get the event
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found");

  // Check for existing booking
  let booking = await prisma.booking.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
  });

  if (booking) {
    if (booking.status === "CONFIRMED") {
      throw new Error("You already have a confirmed booking for this event");
    }
    // Pending booking exists → reuse it
  } else {
    // No booking → create a new one
    booking = await prisma.booking.create({
      data: { userId: user.id, eventId },
    });
  }

  // Create Stripe session with prefilled email
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email, // ✅ prefill email
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: event.price,
          product_data: { name: event.title },
        },
      },
    ],
    metadata: { bookingId: booking.id },
  });

  // Update booking with Stripe session
  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeSessionId: session.id },
  });

  // Redirect to Stripe checkout
  redirect(session.url!);
}
