"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(data: FormData) {
  await prisma.event.create({
    data: {
      title: data.get("title") as string,
      description: data.get("description") as string,
      location: data.get("location") as string,
      date: new Date(data.get("date") as string),
      price: Number(data.get("price")),
      capacity: Number(data.get("capacity")) || null,
    },
  });

  revalidatePath("/admin/events");
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/admin/events");
}

export async function updateEvent(id: string, data: FormData) {
  await prisma.event.update({
    where: { id },
    data: {
      title: data.get("title") as string,
      description: data.get("description") as string,
      location: data.get("location") as string,
      date: new Date(data.get("date") as string),
      price: Number(data.get("price")),
      capacity: data.get("capacity") ? Number(data.get("capacity")) : null,
    },
  });

  revalidatePath("/admin/events");
}
