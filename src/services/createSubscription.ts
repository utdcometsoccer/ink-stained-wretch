import type { CreateSubscriptionRequest, SubscriptionCreateResponse } from "../types/Stripe";

 
export async function createSubscription(   
  payload: CreateSubscriptionRequest,
  bearerToken?: string
): Promise<SubscriptionCreateResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (bearerToken) headers["Authorization"] = `Bearer ${bearerToken}`;
  const res = await fetch(import.meta.env.VITE_STRIPE_CREATE_SUBSCRIPTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
   if (!res.ok) {
     const text = await res.text();
     throw new Error(`HTTP ${res.status}: ${text}`);
   }
   return (await res.json()) as SubscriptionCreateResponse;
}