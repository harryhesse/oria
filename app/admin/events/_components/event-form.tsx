"use client";

import { createEvent } from "@/app/admin/_actions/events";

import { Button } from "@/components/ui/button";

export default function EventForm() {
  return (
    <form
      action={async (formData) => {
        await createEvent(formData);
      }}
      className="space-y-3"
    >
      <input name="title" placeholder="Title" className="input" />
      <input name="location" placeholder="Location" className="input" />
      <input name="date" type="date" className="input" />
      <input name="price" type="number" placeholder="Price" className="input" />
      <input
        name="capacity"
        type="number"
        placeholder="Capacity"
        className="input"
      />

      <Button type="submit">Create</Button>
    </form>
  );
}
