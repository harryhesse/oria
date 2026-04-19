"use server";

import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShootType } from "../generated/prisma/enums";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(formData: FormData) {
  const eventId = formData.get("eventId");
  const rawShootType = formData.get("shootType");

  // 🧠 Validate eventId
  if (!eventId || typeof eventId !== "string") {
    throw new Error("Invalid eventId");
  }

  // 🧠 Validate + narrow ShootType
  if (!rawShootType || typeof rawShootType !== "string") {
    throw new Error("Invalid shoot type");
  }

  const allowed: ShootType[] = ["INDIVIDUAL", "COUPLE", "GROUP", "EVENT"];

  if (!allowed.includes(rawShootType as ShootType)) {
    throw new Error("Invalid shoot type");
  }

  const shootType = rawShootType as ShootType;

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("No email");

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: {},
  });

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { pricing: true },
  });

  if (!event) throw new Error("Event not found");

  const priceRow = event.pricing.find((p) => p.shootType === shootType);

  if (!priceRow) throw new Error("No price");

  const price = priceRow.price;

  let booking = await prisma.booking.upsert({
    where: {
      userId_eventId_shootType: {
        userId: user.id,
        eventId,
        shootType,
      },
    },
    create: {
      userId: user.id,
      eventId,
      shootType,
      status: "PENDING",
    },
    update: {},
  });

  if (booking.stripeSessionId) {
    const existing = await stripe.checkout.sessions.retrieve(
      booking.stripeSessionId,
    );

    if (existing.status === "open") {
      redirect(existing.url!);
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: price,
          product_data: {
            name: `${event.title} (${shootType})`,
          },
        },
      },
    ],

    metadata: {
      bookingId: booking.id,
      shootType,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      stripeSessionId: session.id,
    },
  });

  redirect(session.url!);
}
