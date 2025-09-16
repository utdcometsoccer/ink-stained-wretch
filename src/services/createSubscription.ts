import type { CreateSubscriptionRequest, SubscriptionCreateResponse } from "../types/Stripe";

 
 export async function createSubscription(   
   payload: CreateSubscriptionRequest
 ): Promise<SubscriptionCreateResponse> {
   const res = await fetch(import.meta.env.VITE_STRIPE_CREATE_SUBSCRIPTION_URL, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload),
   });
   if (!res.ok) {
     const text = await res.text();
     throw new Error(`HTTP ${res.status}: ${text}`);
   }
   return (await res.json()) as SubscriptionCreateResponse;
}