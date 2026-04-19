"use server";

import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(formData: FormData) {
  const eventId = formData.get("eventId") as string;

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // get or create user
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId },
    });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) throw new Error("Event not found");

  // prevent duplicate booking
  const existing = await prisma.booking.findUnique({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId,
      },
    },
  });

  if (existing) {
    throw new Error("Already booked");
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      eventId,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: event.price,
          product_data: {
            name: event.title,
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeSessionId: session.id },
  });

  // redirect directly (server action magic)
  redirect(session.url!);
}
