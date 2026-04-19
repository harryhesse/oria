"use client";

import { createCheckoutSession } from "../actions/checkout";

export default function CheckoutForm() {
  return (
    <form action={createCheckoutSession}>
      <input type="hidden" name="eventId" value="cmo6ao94p00004gio5awi6rh7" />

      <select name="shootType" defaultValue="INDIVIDUAL">
        <option value="INDIVIDUAL">Individual</option>
        <option value="COUPLE">Couple</option>
        <option value="GROUP">Group</option>
        <option value="EVENT">Event</option>
      </select>

      <button className="bg-violet-500 text-white px-4 py-1">Pay</button>
    </form>
  );
}
