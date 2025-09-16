import type { CreateStripeCheckoutSessionRequest } from "../types/CreateStripeCheckoutSessionRequest";
import type { CreateStripeCheckoutSessionResponse } from "../types/CreateStripeCheckoutSessionResponse";


export async function fetchStripeClientSecret(request: CreateStripeCheckoutSessionRequest): Promise<CreateStripeCheckoutSessionResponse> {
  const response = await fetch(import.meta.env.VITE_STRIPE_CHECKOUT_SESSION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain: request.domain || window.location.origin,
      customerId: request.customerId,
      priceId: request.priceId,
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const data = await response.json();
  return data;
}
