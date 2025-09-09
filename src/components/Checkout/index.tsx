import type { FC } from 'react';
import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";
import { useCheckoutLogic } from '../../hooks/useCheckout';
import type { CheckoutProps } from './CheckoutProps';
import "./Checkout.css";

export const Checkout: FC<CheckoutProps> = ({ state }) => {
  useEffect(() => {
    trackComponent('Checkout', { state });
  }, [state]);
  const { loading, plan, handleCheckout } = useCheckoutLogic(state);

  return plan ? (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="plan-details">
        <h2>{plan.name}</h2>
        <p>{plan.description}</p>
        <p>
          <strong>Price:</strong> ${plan.price} {plan.currency}
        </p>
      </div>
      <div className="checkout-btn-container">
        <div className="checkout-btn-wrapper">
          <button
            className="checkout-btn app-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Subscribe & Pay"}
          </button>
        </div>
      </div>
      <div className="checkout-trust">
        <img src={import.meta.env.VITE_STRIPE_LOGO_URL || "https://stripe.com/img/v3/home/social.png"} alt="Stripe" className="checkout-stripe-logo" />
        <span className="checkout-stripe-text">Payments secured by Stripe</span>
      </div>
    </div>
  ) : <div>Please select a subscription plan to continue.</div>;
};
