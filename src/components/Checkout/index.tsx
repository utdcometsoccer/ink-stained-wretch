import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutProps } from "./CheckoutProps";
import "./index.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Checkout: React.FC<CheckoutProps> = ({ state }) => {
  const [loading, setLoading] = useState(false);
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

  if (!plan) {
    return <div>Please select a subscription plan to continue.</div>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="plan-details">
        <h2>{plan.name}</h2>
        <p>{plan.description}</p>
        <p>
          <strong>Price:</strong> ${plan.price} {plan.currency}
        </p>
      </div>
      <button
        className="checkout-btn app-btn"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Subscribe & Pay"}
      </button>
      <div className="checkout-trust">
  <img src={import.meta.env.VITE_STRIPE_LOGO_URL || "https://stripe.com/img/v3/home/social.png"} alt="Stripe" className="checkout-stripe-logo" />
        <span className="checkout-stripe-text">Payments secured by Stripe</span>
      </div>
    </div>
  );
};
