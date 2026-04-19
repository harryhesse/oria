"use client";

import { createCheckoutSession } from "../actions/checkout";

export default function CheckoutForm() {
  return (
    <form action={createCheckoutSession}>
      <input type="hidden" name="eventId" value={"cmo5ylli200004wio796pcicm"} />
      <button className=" bg-violet-500 text-white px-4 py-1" type="submit">
        Pay
      </button>
    </form>
  );
}
