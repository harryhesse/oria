"use client";

import { useState } from "react";
import { updateEvent } from "@/app/admin/_actions/events";

import { Button } from "@/components/ui/button";

export default function EditEvent({ event }: any) {
  return (
    <form
      action={async (formData) => {
        await updateEvent(event.id, formData);
      }}
      className="space-y-3"
    >
      <input name="title" defaultValue={event.title} className="input" />

      <input
        name="location"
        defaultValue={event.location ?? ""}
        className="input"
      />

      <input
        name="date"
        type="date"
        defaultValue={new Date(event.date).toISOString().split("T")[0]}
        className="input"
      />

      <input
        name="price"
        type="number"
        defaultValue={event.price}
        className="input"
      />

      <input
        name="capacity"
        type="number"
        defaultValue={event.capacity ?? ""}
        className="input"
      />

      <Button type="submit">Save</Button>
    </form>
  );
}
