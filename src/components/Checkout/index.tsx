import type { FC } from 'react';
import { useCheckoutLogic } from '../../hooks/useCheckout';
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import "./Checkout.css";
import type { CheckoutProps } from './CheckoutProps';

export const Checkout: FC<CheckoutProps> = ({ state }) => {
  useTrackComponent('Checkout', { state });
  const { loading, plan, handleCheckout } = useCheckoutLogic(state);
  const culture = state.cultureInfo?.Culture || 'en-us';
  const localized = useGetLocalizedText(culture)?.Checkout || {
    title: 'Checkout',
    price: 'Price:', 
    subscribePay: 'Subscribe & Pay',
    redirecting: 'Redirecting...',
    trustText: 'Payments secured by Stripe',
    selectPlan: 'Please select a subscription plan to continue.'
  };
  
  return plan ? (
    <div className="checkout-page">
      <h1>{localized?.title}</h1>
      <div className="plan-details">
        <h2>{plan.name}</h2>
        <p>{plan.description}</p>
        <p>
          <strong>{localized?.price}</strong> ${plan.price} {plan.currency}
        </p>
      </div>
      <div className="checkout-btn-container">
        <div className="checkout-btn-wrapper">
          <button
            className="checkout-btn app-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (localized?.redirecting) : (localized?.subscribePay)}
          </button>
        </div>
      </div>
      <div className="checkout-trust">
        <img src={import.meta.env.VITE_STRIPE_LOGO_URL || "https://stripe.com/img/v3/home/social.png"} alt="Stripe" className="checkout-stripe-logo" />
        <span className="checkout-stripe-text">{localized?.trustText}</span>
      </div>
    </div>
  ) : <div>{localized?.selectPlan}</div>;
};
