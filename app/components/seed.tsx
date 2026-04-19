"use client";

import { seedEvents } from "../actions/seed";

export default function SeedButton() {
  return (
    <form action={seedEvents}>
      <button type="submit">🌱 Seed Events</button>
    </form>
  );
}
