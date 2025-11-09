import type { CreateSubscriptionRequest, SubscriptionCreateResponse } from "../types/Stripe";

 
export async function createSubscription(   
  payload: CreateSubscriptionRequest,
  bearerToken: string
): Promise<SubscriptionCreateResponse> {
  // Validate required parameters
  if (!payload.PriceId || payload.PriceId.trim() === '') {
    throw new Error('PriceId is required and cannot be empty');
  }
  if (!payload.CustomerId || payload.CustomerId.trim() === '') {
    throw new Error('CustomerId is required and cannot be empty');
  }
  if (!bearerToken || bearerToken.trim() === '') {
    throw new Error('Bearer token is required and cannot be empty');
  }
  
  const headers: Record<string, string> = { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${bearerToken}`
  };
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