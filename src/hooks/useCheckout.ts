import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutProps } from "../components/Checkout/CheckoutProps";



export function useCheckoutLogic(state: CheckoutProps["state"]) {
  const [loading, setLoading] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const plan = state.selectedSubscriptionPlan;

  const handleCheckout = async () => {
    if (!plan?.stripePriceId) return;
    setLoading(true);
    const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_API_URL || "/api/CreateCheckoutSession";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: plan.stripePriceId }),
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  return {
    loading,
    plan,
    handleCheckout,
    stripePromise
  };
}
