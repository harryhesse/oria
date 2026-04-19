"use server";

import prisma from "@/lib/prisma";

export async function seedEvents() {
  await prisma.event.createMany({
    data: [
      {
        title: "Marathon Madrid 2026",
        price: 2000,
        date: new Date("2026-05-10"),
        location: "Madrid",
      },
      {
        title: "Triathlon Barcelona",
        price: 3000,
        date: new Date("2026-06-15"),
        location: "Barcelona",
      },
    ],
  });
}
