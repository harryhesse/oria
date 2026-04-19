"use server";

import prisma from "@/lib/prisma";

export async function seedEvents() {
  const existing = await prisma.event.count();
  if (existing > 0) return;

  await prisma.event.createMany({
    data: [
      {
        title: "Marathon Madrid 2026",
        date: new Date("2026-05-10"),
        location: "Madrid",
        basePrice: 2000,
      },
      {
        title: "Triathlon Barcelona",
        date: new Date("2026-06-15"),
        location: "Barcelona",
        basePrice: 3000,
      },
    ],
  });

  const events = await prisma.event.findMany();

  for (const event of events) {
    await prisma.eventPrice.createMany({
      data: [
        { eventId: event.id, shootType: "INDIVIDUAL", price: 2000 },
        { eventId: event.id, shootType: "COUPLE", price: 3000 },
        { eventId: event.id, shootType: "GROUP", price: 5000 },
        { eventId: event.id, shootType: "EVENT", price: 8000 },
      ],
    });
  }
}
